import { Briefcase, Code, PenTool, LineChart } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Briefcase className="h-12 w-12 text-blue-600" />,
      title: "Conseil en Stratégie",
      description: "Accompagnement personnalisé pour développer votre activité et optimiser vos processus.",
    },
    {
      icon: <Code className="h-12 w-12 text-blue-600" />,
      title: "Développement Web",
      description: "Création de sites web et d'applications sur mesure avec les dernières technologies.",
    },
    {
      icon: <PenTool className="h-12 w-12 text-blue-600" />,
      title: "Design & Communication",
      description: "Conception graphique et stratégie de communication adaptée à votre image.",
    },
    {
      icon: <LineChart className="h-12 w-12 text-blue-600" />,
      title: "Études de Marché",
      description: "Analyse approfondie de votre marché et de vos opportunités de croissance.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une expertise diversifiée pour répondre à tous vos besoins professionnels
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center text-center">
                {service.icon}
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;