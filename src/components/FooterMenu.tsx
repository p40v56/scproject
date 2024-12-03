import { Link } from "react-router-dom";
import { User, Users, UserCheck, UserPlus } from "lucide-react";

const FooterMenu = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-around items-center py-2">
          <Link
            to="/client"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Client</span>
          </Link>
          <Link
            to="/student"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
          >
            <UserPlus className="h-6 w-6" />
            <span className="text-xs mt-1">Étudiant</span>
          </Link>
          <Link
            to="/alumni"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
          >
            <UserCheck className="h-6 w-6" />
            <span className="text-xs mt-1">Alumni</span>
          </Link>
          <Link
            to="/member"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
          >
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Membre</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterMenu;