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
  const roleInfo = roleDescriptions[role];

  if (!roleInfo) return null;

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