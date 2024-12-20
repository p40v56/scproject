import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface EditPhaseDialogProps {
  phase: any
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

const EditPhaseDialog = ({ phase, isOpen, onClose, onSubmit }: EditPhaseDialogProps) => {
  if (!phase) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la phase</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={phase?.name} 
              required 
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              name="description" 
              defaultValue={phase?.description} 
            />
          </div>
          <div>
            <Label htmlFor="progress">Progression (%)</Label>
            <Input 
              id="progress" 
              name="progress" 
              type="number" 
              min="0" 
              max="100" 
              defaultValue={phase?.progress} 
            />
          </div>
          <div>
            <Label htmlFor="start_date">Date de début</Label>
            <Input 
              id="start_date" 
              name="start_date" 
              type="date" 
              defaultValue={phase?.start_date ? new Date(phase.start_date).toISOString().split('T')[0] : ''} 
            />
          </div>
          <div>
            <Label htmlFor="end_date">Date de fin</Label>
            <Input 
              id="end_date" 
              name="end_date" 
              type="date" 
              defaultValue={phase?.end_date ? new Date(phase.end_date).toISOString().split('T')[0] : ''} 
            />
          </div>
          <Button type="submit" className="w-full">
            Mettre à jour
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditPhaseDialog