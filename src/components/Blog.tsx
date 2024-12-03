import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  const posts = [
    {
      title: "Comment réussir son projet digital ?",
      excerpt: "Découvrez nos conseils pour mener à bien votre transformation numérique...",
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=60",
      date: "12 Mars 2024",
      category: "Conseil",
    },
    {
      title: "Les tendances web de 2024",
      excerpt: "Les dernières innovations en matière de développement web et design...",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
      date: "5 Mars 2024",
      category: "Technologie",
    },
    {
      title: "L'importance des études de marché",
      excerpt: "Pourquoi et comment réaliser une étude de marché efficace...",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
      date: "28 Février 2024",
      category: "Business",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notre Blog
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Restez informé des dernières actualités et tendances
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-blue-600">{post.category}</span>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link
                  to="/blog"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  Lire la suite
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;