import { Linkedin, Mail } from "lucide-react";

const Team = () => {
  const team = [
    {
      name: "Sarah Martin",
      role: "Présidente",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=80",
      linkedin: "#",
      email: "sarah@junior-entreprise.com",
    },
    {
      name: "Thomas Dubois",
      role: "Vice-Président",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&q=80",
      linkedin: "#",
      email: "thomas@junior-entreprise.com",
    },
    {
      name: "Julie Chen",
      role: "Trésorière",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&auto=format&fit=crop&q=80",
      linkedin: "#",
      email: "julie@junior-entreprise.com",
    },
    {
      name: "Lucas Bernard",
      role: "Responsable Communication",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=80",
      linkedin: "#",
      email: "lucas@junior-entreprise.com",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notre Équipe
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des étudiants passionnés et engagés pour votre réussite
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center space-x-4">
                    <a
                      href={member.linkedin}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      <Mail className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;