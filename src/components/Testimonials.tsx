import { MessageSquare } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      content: "Une équipe jeune et dynamique qui a su parfaitement comprendre nos besoins et y répondre avec professionnalisme.",
      author: "Marie Dupont",
      position: "CEO, TechStart",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&auto=format&fit=crop&q=80",
    },
    {
      content: "Excellent rapport qualité-prix et une réactivité exemplaire. Je recommande vivement leurs services !",
      author: "Pierre Lambert",
      position: "Directeur Marketing, InnovCorp",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=80",
    },
    {
      content: "Un accompagnement de qualité tout au long du projet. Les résultats ont dépassé nos attentes.",
      author: "Sophie Chen",
      position: "Fondatrice, GreenTech",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les retours de nos clients sur leur expérience avec notre Junior-Entreprise
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col h-full">
                <p className="text-gray-600 italic mb-6 flex-grow">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;