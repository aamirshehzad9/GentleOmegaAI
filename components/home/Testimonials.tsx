import React from 'react';

const testimonials = [
  {
    quote: "Gentle Omega AI revolutionized my career path. The AI-powered tools gave me the confidence and skills to land my dream job in machine learning.",
    name: "Alex Johnson",
    title: "ML Engineer @ TechCorp",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop",
  },
  {
    quote: "The personalized career guidance is unmatched. I went from being a novice to a competent data scientist in just a few months. Highly recommended!",
    name: "Samantha Lee",
    title: "Data Scientist @ Innovate Inc.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop",
  },
  {
    quote: "An incredible platform for anyone serious about a career in AI. The projects are practical and the community is incredibly supportive.",
    name: "Michael Chen",
    title: "AI Researcher @ FutureAI",
    image: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-[#0D0D0D] py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            What Our <span className="text-accent-cyan">Community</span> Says
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Real stories from professionals who have transformed their careers with our AI ecosystem.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
              <img src={testimonial.image} alt={testimonial.name} className="w-24 h-24 rounded-full mb-6 border-4 border-accent-cyan object-cover" />
              <p className="text-gray-300 italic mb-6 flex-grow">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold text-white text-lg">{testimonial.name}</p>
                <p className="text-accent-cyan text-sm">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
