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

  const handleRename = async (oldPath: string, newName: string) => {
    try {
      // Get the list of all files in the folder if it's a folder
      const { data: files } = await supabase.storage
        .from("documents")
        .list(oldPath)

      const isFolder = files && files.length > 0
      const pathParts = oldPath.split("/")
      const parentPath = pathParts.slice(0, -1).join("/")
      const newPath = parentPath ? `${parentPath}/${newName}` : newName

      if (isFolder) {
        // For folders, we need to move all contained files
        for (const file of files) {
          const oldFilePath = `${oldPath}/${file.name}`
          const newFilePath = `${newPath}/${file.name}`
          
          const { error: moveError } = await supabase.storage
            .from("documents")
            .move(oldFilePath, newFilePath)

          if (moveError) {
            throw moveError
          }
        }

        // Move the .folder file that marks this as a folder
        const { error: folderMoveError } = await supabase.storage
          .from("documents")
          .move(`${oldPath}/.folder`, `${newPath}/.folder`)

        if (folderMoveError) {
          throw folderMoveError
        }
      } else {
        // For single files, just move the file
        const { error: moveError } = await supabase.storage
          .from("documents")
          .move(oldPath, newPath)

        if (moveError) {
          throw moveError
        }
      }

      toast({
        title: "Success",
        description: "Renamed successfully",
      })

      // Clear selection after renaming
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
    // Implementation will depend on whether we're downloading a single file or multiple files
    toast({
      title: "Coming soon",
      description: "This feature will be implemented soon",
    })
  }

  const handleDeleteSelected = async () => {
    const paths = Array.from(selectedItems)
    for (const path of paths) {
      // First check if it's a folder by trying to list its contents
      const { data: files } = await supabase.storage
        .from("documents")
        .list(path)

      if (files && files.length > 0) {
        // It's a folder, delete all contents first
        for (const file of files) {
          const filePath = `${path}/${file.name}`
          const { error } = await supabase.storage
            .from("documents")
            .remove([filePath])
          
          if (error) {
            toast({
              title: "Error",
              description: `Failed to delete ${filePath}: ${error.message}`,
              variant: "destructive",
            })
            return
          }
        }
        // Delete the .folder file
        const { error } = await supabase.storage
          .from("documents")
          .remove([`${path}/.folder`])
        
        if (error) {
          toast({
            title: "Error",
            description: `Failed to delete folder: ${error.message}`,
            variant: "destructive",
          })
          return
        }
      } else {
        // It's a single file
        const { error } = await supabase.storage
          .from("documents")
          .remove([path])
        
        if (error) {
          toast({
            title: "Error",
            description: `Failed to delete ${path}: ${error.message}`,
            variant: "destructive",
          })
          return
        }
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
        handleRename,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  )
}