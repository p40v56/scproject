import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download, FileText, FolderOpen, Pencil } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFileManager } from "./FileManagerContext"
import { FileOrFolder } from "./types"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Input } from "@/components/ui/input"

export default function FileManagerTable() {
  const { currentPath, selectedItems, handleSelect, handleNavigate, handleRename } = useFileManager()
  const [items, setItems] = useState<FileOrFolder[]>([])
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newName, setNewName] = useState("")

  useEffect(() => {
    const fetchItems = async () => {
      const path = currentPath.join("/")
      const { data, error } = await supabase.storage.from("documents").list(path)
      
      if (data) {
        const items: FileOrFolder[] = data.map((item) => ({
          id: `${currentPath.join("/")}/${item.name}`,
          name: item.name,
          type: item.metadata?.mimetype ? "file" : "folder",
          lastModified: new Date(item.created_at).toLocaleString(),
          size: item.metadata?.size ? `${Math.round(item.metadata.size / 1024)} KB` : undefined,
          path: [...currentPath, item.name],
        }))
        setItems(items)
      }
    }

    fetchItems()
  }, [currentPath])

  const handleStartEdit = (item: FileOrFolder) => {
    setEditingItem(item.id)
    setNewName(item.name)
  }

  const handleFinishEdit = async (item: FileOrFolder) => {
    if (newName && newName !== item.name) {
      await handleRename(item.path.join("/"), newName)
    }
    setEditingItem(null)
    setNewName("")
  }

  return (
    <ScrollArea className="h-[calc(100vh-20rem)] border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Dernière modification</TableHead>
            <TableHead>Taille</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                <Checkbox
                  checked={selectedItems.has(item.path.join("/"))}
                  onCheckedChange={() => handleSelect(item.path.join("/"))}
                />
              </TableCell>
              <TableCell
                className="font-medium"
                onClick={() => handleNavigate(item)}
              >
                <div className="flex items-center gap-2">
                  {item.type === "folder" ? (
                    <FolderOpen className="h-4 w-4 text-blue-500" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {editingItem === item.id ? (
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={() => handleFinishEdit(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleFinishEdit(item)
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  ) : (
                    item.name
                  )}
                </div>
              </TableCell>
              <TableCell>{item.lastModified}</TableCell>
              <TableCell>{item.size || "-"}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStartEdit(item)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                {item.type === "file" && (
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}