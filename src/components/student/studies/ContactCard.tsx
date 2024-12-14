import { Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Contact {
  name: string;
  email: string;
  phone: string;
}

interface ContactCardProps {
  projectManager: Contact;
  qualityManager: Contact;
}

const ContactCard = ({ projectManager, qualityManager }: ContactCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Chargé de mission</h3>
          <div className="space-y-1">
            <p className="text-sm">{projectManager.name}</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  {projectManager.email}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  {projectManager.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Responsable qualité</h3>
          <div className="space-y-1">
            <p className="text-sm">{qualityManager.name}</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  {qualityManager.email}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  {qualityManager.phone}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;