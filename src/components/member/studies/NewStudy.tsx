import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const NewStudy = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const budget = formData.get('budget') as string

    try {
      const { error } = await supabase
        .from('studies')
        .insert({
          title,
          description,
          budget: budget ? parseFloat(budget) : null,
          status: 'pending'
        })

      if (error) throw error

      toast({
        title: "Étude créée avec succès",
        description: "Vous allez être redirigé vers la liste des études"
      })
      
      navigate('/member/current-studies')
    } catch (error) {
      console.error('Error creating study:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'étude",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle étude</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Titre de l'étude</Label>
              <Input id="title" name="title" required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" />
            </div>
            <div>
              <Label htmlFor="budget">Budget (€)</Label>
              <Input id="budget" name="budget" type="number" min="0" step="1000" />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer l'étude"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewStudy