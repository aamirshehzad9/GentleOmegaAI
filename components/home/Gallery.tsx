import React, { useState, useEffect } from 'react';
import { GALLERY_SLIDES, GALLERY_STATS } from '../../constants';

const Gallery: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % GALLERY_SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const nextSlide = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % GALLERY_SLIDES.length);
    const prevSlide = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + GALLERY_SLIDES.length) % GALLERY_SLIDES.length);

  return (
    <section className="bg-gray-50 text-gray-800 py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">AI Moderating <span className="text-cyan-500">Human Excellence</span></h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Explore our interactive gallery showcasing the harmonious relationship between artificial intelligence and human potential.</p>
        </div>
        <div className="relative w-full max-w-5xl mx-auto">
            <div className="rounded-2xl shadow-2xl overflow-hidden aspect-video relative">
                {GALLERY_SLIDES.map((slide, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img 
                            src={slide.image} 
                            alt={slide.title} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <h3 className="text-3xl font-bold">{slide.title}</h3>
                            <p className="mt-2 max-w-2xl">{slide.description}</p>
                        </div>
                    </div>
                ))}
            <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 text-gray-900 p-3 rounded-full hover:bg-white transition-colors z-10 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 text-gray-900 p-3 rounded-full hover:bg-white transition-colors z-10 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {GALLERY_SLIDES.map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => goToSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
                    />
                ))}
            </div>
        </div>
        <div className="max-w-5xl mx-auto mt-4 grid grid-cols-5 gap-2">
            {GALLERY_SLIDES.map((slide, index) => (
                <button key={index} onClick={() => goToSlide(index)} className={`aspect-video rounded-lg overflow-hidden transition-all duration-300 ${index === currentIndex ? 'ring-4 ring-cyan-500' : 'opacity-60 hover:opacity-100'}`}>
                    <img src={slide.thumbnail} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                </button>
            ))}
        </div>
        </div>
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
            {GALLERY_STATS.map((stat, index) => (
                <div key={index}>
                    <p className="text-4xl font-bold text-cyan-500">{stat.value}</p>
                    <p className="mt-2 text-gray-600">{stat.label}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;