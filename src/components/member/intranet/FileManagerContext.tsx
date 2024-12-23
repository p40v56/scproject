import { createContext, useContext } from "react"
import { FileManagerContextType } from "./types"

export const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined)

export const useFileManager = () => {
  const context = useContext(FileManagerContext)
  if (!context) {
    throw new Error("useFileManager must be used within a FileManagerProvider")
  }
  return context
}