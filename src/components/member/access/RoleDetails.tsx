import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { roleDescriptions } from "./roleConfigurations";

interface RoleDetailsProps {
  role: string;
}

export const RoleDetails = ({ role }: RoleDetailsProps) => {
  // Convert role to lowercase to match the keys in roleDescriptions
  const normalizedRole = role.toLowerCase();
  
  // Map user types to their corresponding role keys
  const roleMapping: Record<string, string> = {
    'étudiant': 'student',
    'alumni': 'alumni',
    'client': 'client',
    'membre': 'member'
  };

  // Get the correct role key
  const mappedRole = roleMapping[normalizedRole] || normalizedRole;
  const roleInfo = roleDescriptions[mappedRole];

  if (!roleInfo) {
    console.log('No role info found for:', role, 'mapped to:', mappedRole);
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{roleInfo.title}</CardTitle>
        <CardDescription>{roleInfo.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="font-medium">Permissions :</h3>
          <ul className="list-disc list-inside space-y-1">
            {roleInfo.permissions.map((permission, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {permission}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};