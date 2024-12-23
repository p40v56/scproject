export type FileOrFolder = {
  id: string
  name: string
  type: "file" | "folder"
  category?: string
  lastModified: string
  size?: string
  path: string[]
}