import { ReactNode, useState } from "react"
import { FileManagerContext } from "./FileManagerContext"
import { FileOrFolder } from "./types"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export const FileManagerProvider = ({ children }: { children: ReactNode }) => {
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const handleNavigate = (item: FileOrFolder) => {
    if (item.type === "folder") {
      setCurrentPath(item.path)
    }
  }

  const handleBack = () => {
    setCurrentPath((prev) => prev.slice(0, -1))
  }

  const handleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleUpload = async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files
      if (!files) return

      for (const file of Array.from(files)) {
        const filePath = `${currentPath.join("/")}/${file.name}`
        const { error } = await supabase.storage
          .from("documents")
          .upload(filePath, file)

        if (error) {
          toast({
            title: "Error",
            description: `Failed to upload ${file.name}: ${error.message}`,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: `${file.name} uploaded successfully`,
          })
        }
      }
    }
    input.click()
  }

  const handleNewFolder = () => {
    // This will be handled by the CommonIntranet component's dialog
  }

  const handleCreateFolder = async (name: string) => {
    const folderPath = [...currentPath, name].join("/")
    const { error } = await supabase.storage
      .from("documents")
      .upload(`${folderPath}/.folder`, new Blob([]))

    if (error) {
      toast({
        title: "Error",
        description: `Failed to create folder: ${error.message}`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Folder created successfully",
      })
    }
  }

  const handleDownloadSelected = async () => {
    // Implementation will depend on whether we're downloading a single file or multiple files
    toast({
      title: "Coming soon",
      description: "This feature will be implemented soon",
    })
  }

  const handleDeleteSelected = async () => {
    const paths = Array.from(selectedItems)
    for (const path of paths) {
      const { error } = await supabase.storage.from("documents").remove([path])
      if (error) {
        toast({
          title: "Error",
          description: `Failed to delete ${path}: ${error.message}`,
          variant: "destructive",
        })
      }
    }
    setSelectedItems(new Set())
    toast({
      title: "Success",
      description: "Selected items deleted successfully",
    })
  }

  return (
    <FileManagerContext.Provider
      value={{
        currentPath,
        selectedItems,
        setCurrentPath,
        setSelectedItems,
        handleNavigate,
        handleBack,
        handleSelect,
        handleUpload,
        handleNewFolder,
        handleDownloadSelected,
        handleCreateFolder,
        handleDeleteSelected,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  )
}