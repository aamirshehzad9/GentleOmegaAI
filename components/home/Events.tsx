import React from 'react';

const events = [
  {
    date: "OCT 28",
    year: "2024",
    title: "AI in Finance: The New Frontier",
    location: "Online Webinar",
    description: "Join industry experts as they discuss the impact of AI on the financial sector and future trends.",
    image: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2070&auto=format&fit=crop",
  },
  {
    date: "NOV 15",
    year: "2024",
    title: "Workshop: Building Your First Neural Network",
    location: "New York, NY",
    description: "A hands-on workshop for beginners to learn the fundamentals of neural networks with Python and TensorFlow.",
    image: "https://images.unsplash.com/photo-1599658880436-c61792e70672?q=80&w=2070&auto=format&fit=crop",
  },
  {
    date: "DEC 05",
    year: "2024",
    title: "Annual AI Career Fair",
    location: "Virtual Event",
    description: "Connect with top tech companies hiring for AI and machine learning roles. A great opportunity to network.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop",
  },
];

const Events: React.FC = () => {
  return (
    <section className="bg-[#0D0D0D] py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Upcoming <span className="text-accent-yellow">Events</span>
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Stay engaged with our community through workshops, webinars, and networking events.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div key={index} className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative h-48">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-4 left-4 bg-accent-yellow text-black text-center font-bold p-2 rounded-md">
                  <p className="text-xs">{event.year}</p>
                  <p className="text-xl leading-none">{event.date}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{event.location}</p>
                <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                <button className="text-accent-yellow font-semibold text-sm hover:underline">
                  Register Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
