import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"

export const moveFile = async (oldPath: string, newPath: string) => {
  const { error } = await supabase.storage
    .from("documents")
    .move(oldPath.replace(/^\/+/, ""), newPath.replace(/^\/+/, ""))
  
  if (error) throw error
}

export const moveFolder = async (oldPath: string, newPath: string) => {
  // First, list all files in the folder
  const { data: files, error: listError } = await supabase.storage
    .from("documents")
    .list(oldPath.replace(/^\/+/, ""))
  
  if (listError) throw listError
  
  // Move each file in the folder
  for (const file of files || []) {
    const oldFilePath = `${oldPath}/${file.name}`.replace(/^\/+/, "")
    const newFilePath = `${newPath}/${file.name}`.replace(/^\/+/, "")
    
    const { error } = await supabase.storage
      .from("documents")
      .move(oldFilePath, newFilePath)
    
    if (error) throw error
  }
  
  // Move the .folder marker
  const { error: folderError } = await supabase.storage
    .from("documents")
    .move(
      `${oldPath}/.folder`.replace(/^\/+/, ""),
      `${newPath}/.folder`.replace(/^\/+/, "")
    )
  
  if (folderError) throw folderError
}

export const deleteFile = async (path: string) => {
  const { error } = await supabase.storage
    .from("documents")
    .remove([path.replace(/^\/+/, "")])
  
  if (error) throw error
}

export const deleteFolder = async (path: string) => {
  // List all files in the folder
  const { data: files, error: listError } = await supabase.storage
    .from("documents")
    .list(path.replace(/^\/+/, ""))
  
  if (listError) throw listError
  
  // Delete each file in the folder
  for (const file of files || []) {
    const filePath = `${path}/${file.name}`.replace(/^\/+/, "")
    const { error } = await supabase.storage
      .from("documents")
      .remove([filePath])
    
    if (error) throw error
  }
  
  // Delete the .folder marker
  const { error } = await supabase.storage
    .from("documents")
    .remove([`${path}/.folder`.replace(/^\/+/, "")])
  
  if (error) throw error
}

export const checkIsFolder = async (path: string) => {
  const { data: files } = await supabase.storage
    .from("documents")
    .list(path.replace(/^\/+/, ""))
  
  return files && files.length > 0
}