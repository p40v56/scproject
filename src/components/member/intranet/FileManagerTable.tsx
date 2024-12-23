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
import { Download, FileText, FolderOpen } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileOrFolder } from "./types"

interface FileManagerTableProps {
  items: FileOrFolder[]
  selectedItems: Set<string>
  onSelect: (id: string) => void
  onNavigate: (item: FileOrFolder) => void
}

export default function FileManagerTable({
  items,
  selectedItems,
  onSelect,
  onNavigate,
}: FileManagerTableProps) {
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
                  checked={selectedItems.has(item.id)}
                  onCheckedChange={() => onSelect(item.id)}
                />
              </TableCell>
              <TableCell
                className="font-medium"
                onClick={() => onNavigate(item)}
              >
                <div className="flex items-center gap-2">
                  {item.type === "folder" ? (
                    <FolderOpen className="h-4 w-4 text-blue-500" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {item.name}
                </div>
              </TableCell>
              <TableCell>{item.lastModified}</TableCell>
              <TableCell>{item.size || "-"}</TableCell>
              <TableCell className="text-right">
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