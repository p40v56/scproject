export type FileOrFolder = {
  id: string
  name: string
  type: "file" | "folder"
  category?: string
  lastModified: string
  size?: string
  path: string[]
  url?: string
}

export type FileManagerContextType = {
  currentPath: string[]
  selectedItems: Set<string>
  setCurrentPath: (path: string[]) => void
  setSelectedItems: (items: Set<string>) => void
  handleNavigate: (item: FileOrFolder) => void
  handleBack: () => void
  handleSelect: (id: string) => void
  handleUpload: () => void
  handleNewFolder: () => void
  handleDownloadSelected: () => void
  handleCreateFolder: (name: string) => void
  handleDeleteSelected: () => void
  handleRename: (oldPath: string, newName: string) => void
}