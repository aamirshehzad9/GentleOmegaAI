import React from 'react';
import Hero from './home/Hero';
import WhyChooseUs from './home/WhyChooseUs';
import MenuPreview from './home/MenuPreview';
import Deals from './home/Deals';
import AIPicks from './home/AIPicks';
import Gallery from './home/Gallery';
import Testimonials from './home/Testimonials';
import Events from './home/Events';
import MapContact from './home/MapContact';
import Newsletter from './home/Newsletter';
import { Page } from '../types';

interface HomePageProps {
  navigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  return (
    <div className="overflow-x-hidden">
      <Hero navigate={navigate} />
      <WhyChooseUs />
      <MenuPreview navigate={navigate} />
      <Deals />
      <AIPicks navigate={navigate} />
      <Gallery />
      <Testimonials />
      <Events />
      <MapContact />
      <Newsletter />
    </div>
  );
};

export default HomePage;
