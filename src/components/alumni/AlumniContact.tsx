import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AlumniContact = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contact</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Contactez-nous</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="votre@email.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message">Message</label>
              <Textarea id="message" placeholder="Votre message..." />
            </div>
            <Button type="submit" className="w-full">
              Envoyer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniContact;