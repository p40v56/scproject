import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/auth/AuthProvider"
import { toast } from "sonner"

const Documents = () => {
  const { session } = useAuth()

  // First, fetch the study for the current client
  const { data: study } = useQuery({
    queryKey: ['client-study'],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('studies')
        .select('id')
        .eq('client_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching study:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!session?.user?.id
  });

  // Then fetch documents for that study
  const { data: documents, isLoading } = useQuery({
    queryKey: ['study-documents', study?.id],
    queryFn: async () => {
      if (!study?.id) return [];

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('study_id', study.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }
      
      console.log('Fetched documents:', data);
      return data;
    },
    enabled: !!study?.id
  });

  const handleDownload = async (document: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.name;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Document téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Erreur lors du téléchargement du document');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Chargement des documents...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!study) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Aucune étude trouvée
          </p>
        </CardContent>
      </Card>
    );
  }

  const documentsByCategory = {
    administratif: documents?.filter(doc => doc.category === 'administratif') || [],
    facturation: documents?.filter(doc => doc.category === 'facturation') || [],
    etude: documents?.filter(doc => doc.category === 'etude') || [],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="administratif" className="space-y-4">
          <TabsList>
            <TabsTrigger value="administratif">Administratif</TabsTrigger>
            <TabsTrigger value="facturation">Facturation</TabsTrigger>
            <TabsTrigger value="etude">Étude</TabsTrigger>
          </TabsList>

          {Object.entries(documentsByCategory).map(([category, docs]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {docs.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Aucun document dans cette catégorie
                </p>
              ) : (
                docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Documents;