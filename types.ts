import React from 'react';

export type Page = 'home' | 'menu' | 'dashboard' | 'checkout' | 'login' | 'signup' | 'profile';

export interface NavItemChild {
  label: string;
  description: string;
  href?: Page;
  isDashboard?: boolean;
}

export interface NavItem {
  label: string;
  href?: Page;
  children?: NavItemChild[];
}

export interface Service {
  name: string;
  description: string;
  price: string;
  image: string;
  rating: number;
}

export interface Deal {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  points: string;
  time: string;
  participants: string;
}

export interface SuccessStory {
  image: string;
  category: string;
  rating: number;
  title: string;
  tags: string[];
  story: string;
  reviews: number;
  price: string;
}

export interface GallerySlide {
    image: string;
    thumbnail: string;
    title: string;
    description: string;
}

export interface StatItem {
    value: string;
    label: string;
}
