import { Users, Briefcase, Award } from "lucide-react";

const Stats = () => {
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      value: "50+",
      label: "Étudiants consultants",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-blue-600" />,
      value: "100+",
      label: "Projets réalisés",
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      value: "95%",
      label: "Clients satisfaits",
    },
  ];

  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              {stat.icon}
              <div className="mt-4 text-4xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="mt-2 text-lg text-gray-500 text-center">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;