import { ReactNode, useState } from "react"
import { FileManagerContext } from "./FileManagerContext"
import { FileOrFolder } from "./types"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { moveFile, moveFolder, deleteFile, deleteFolder, checkIsFolder } from "./utils/fileOperations"

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

  const handleSelect = (path: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
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
        const filePath = `${currentPath.join("/")}/${file.name}`.replace(/^\/+/, "")
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
    try {
      const folderPath = [...currentPath, name].join("/").replace(/^\/+/, "")
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create folder: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const handleRename = async (oldPath: string, newName: string) => {
    try {
      const isFolder = await checkIsFolder(oldPath)
      const pathParts = oldPath.split("/")
      const parentPath = pathParts.slice(0, -1).join("/")
      const newPath = parentPath ? `${parentPath}/${newName}` : newName

      if (isFolder) {
        await moveFolder(oldPath, newPath)
      } else {
        await moveFile(oldPath, newPath)
      }

      toast({
        title: "Success",
        description: "Renamed successfully",
      })
      setSelectedItems(new Set())
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to rename: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const handleDownloadSelected = async () => {
    const paths = Array.from(selectedItems)
    for (const path of paths) {
      try {
        const { data, error } = await supabase.storage
          .from("documents")
          .download(path)

        if (error) throw error

        // Create a download link
        const url = window.URL.createObjectURL(data)
        const link = document.createElement('a')
        link.href = url
        link.download = path.split('/').pop() || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to download ${path}: ${error.message}`,
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteSelected = async () => {
    const paths = Array.from(selectedItems)
    for (const path of paths) {
      try {
        const isFolder = await checkIsFolder(path)
        if (isFolder) {
          await deleteFolder(path)
        } else {
          await deleteFile(path)
        }
        toast({
          title: "Success",
          description: `${path.split('/').pop()} deleted successfully`,
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to delete ${path}: ${error.message}`,
          variant: "destructive",
        })
        return
      }
    }
    setSelectedItems(new Set())
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
        handleRename,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  )
}