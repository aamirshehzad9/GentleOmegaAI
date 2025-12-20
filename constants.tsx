import React from 'react';
import { NavItem, Service, Deal, SuccessStory, GallerySlide, StatItem } from './types';

// SVG Icon Components
const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
);

const GentleOmegaLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 2L2 5.5V11.2C2 16.2 6.3 21.5 12 22.9C17.7 21.5 22 16.2 22 11.2V5.5L12 2ZM12 4.1L19.9 6.8V11.2C19.9 15.1 16.5 19.4 12 20.7C7.5 19.4 4.1 15.1 4.1 11.2V6.8L12 4.1ZM12 6L8 10H10.5V13.5C9 13.5 8 15 8 16.5C8 18 9.5 19 11 19H13C14.5 19 16 18 16 16.5C16 15 15 13.5 13.5 13.5V10H16L12 6Z" />
    </svg>
);
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></Icon>;
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></Icon>;
const SunIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m8.66-15.66l-.707.707M4.04 19.96l-.707.707M21 12h-1M4 12H3m15.66 4.34l-.707-.707M4.04 4.04l-.707-.707m12.727 12.727a5 5 0 110-7.071 5 5 0 010 7.071z" /></Icon>;
const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></Icon>;
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></Icon>;

// Icons for Deals Section
const DealIcon1 = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></Icon>
const DealIcon2 = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M12 8V4H8"></path><rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M12 12h4"></path><path d="M12 16h4"></path><path d="M8 12h.01"></path><path d="M8 16h.01"></path></Icon>
const DealIcon3 = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></Icon>
const DealIcon4 = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></Icon>
const BonusIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M12 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path><path d="M12 12v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2"></path><path d="M20 12V6a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2z"></path><path d="M18 8h2"></path><path d="M18 12h-2"></path></Icon>

// Social Media Icons
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></Icon>;
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></Icon>;
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M16 4.35V16.5a4.5 4.5 0 1 1-9 0V4.35h3.6a4.5 4.5 0 1 0 4.5 4.5V4.35H16z" /></Icon>;
const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></Icon>;
const XIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></Icon>;
const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></Icon>;
const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></Icon>;
const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10c0-5.52-4.48-10-10-10zm5 10.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-5 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-2.5 4c-1.38 0-2.5-1.12-2.5-2.5h5c0 1.38-1.12 2.5-2.5 2.5z"></path></Icon>;
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.76,4.73 16.04,5.87 17.01,6.72L19.27,4.59C17.22,2.67 15,2 12.19,2C7,2 3,6.58 3,12C3,17.42 7,22 12.19,22C17.6,22 21.7,18.35 21.7,12.33C21.7,11.75 21.6,11.41 21.35,11.1Z" /></Icon>;

// Contact Card Icons
const MailIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></Icon>;
const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></Icon>;
const LocationIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></Icon>;
const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></Icon>;


export const ICONS = { logo: GentleOmegaLogo, chevronDown: ChevronDownIcon, search: SearchIcon, sun: SunIcon, moon: MoonIcon, menu: MenuIcon, bonus: BonusIcon };
export const WHATSAPP_COMMUNITY_LINK = "https://chat.whatsapp.com/HtgZw6ZrPyVGV2wIXGx6G7";
export const WHATSAPP_BUSINESS_LINK = "https://wa.me/923468066680";
export const WHATSAPP_LINK = WHATSAPP_BUSINESS_LINK; // Backward compatibility

export const SOCIAL_URLS = {
    Facebook: "https://www.facebook.com/gentleomegaai",
    Instagram: "https://www.instagram.com/gentleomegaai/",
    LinkedIn: "https://www.linkedin.com/company/gentleomegaholdings",
    X: "https://x.com/GentleOmegaAI",
    YouTube: "https://www.youtube.com/@GentleOmegaAI",
    GitHub: "https://github.com/aamirshehzad9/GentleOmegaAI",
    WhatsApp: WHATSAPP_BUSINESS_LINK,
    TikTok: "#",
    Reddit: "#",
    Google: "#"
};

export const SOCIAL_LINKS = {
    Facebook: FacebookIcon,
    Instagram: InstagramIcon,
    TikTok: TikTokIcon,
    LinkedIn: LinkedInIcon,
    X: XIcon,
    YouTube: YouTubeIcon,
    GitHub: GitHubIcon,
    Reddit: RedditIcon,
    Google: GoogleIcon,
};

export const NAV_LINKS: NavItem[] = [
    {
        label: 'Home',
        children: [
            { label: 'Welcome', description: 'AI Career Center Hub' },
            { label: 'Getting Started', description: 'Begin your AI journey' },
        ]
    },
    {
        label: 'AI Hub',
        children: [
            { label: 'AI Career', description: 'Explore AI opportunities' },
            { label: 'Career Paths', description: 'AI career development' },
            { label: 'Skill Assessment', description: 'Evaluate your AI skills' },
            { label: 'Certifications', description: 'AI professional certificates' },
            { label: 'Model Registry', description: 'Browse AI models', isDashboard: true },
            { label: 'Deployment', description: 'Deploy AI solutions', isDashboard: true },
            { label: 'Monitoring', description: 'Track AI performance', isDashboard: true },
        ]
    },
    {
        label: 'AI Products',
        children: [
            {
                label: 'AI Blogs Studio',
                description: 'Luxury AI-powered blogging platform',
                href: 'aiblogsstudio'
            },
            {
                label: 'MISoft',
                description: 'AI Financial & Accounting Solutions',
                href: 'https://misoft.gentleomegaai.space/',
                external: true
            },
            {
                label: 'Bot & SaaS',
                description: 'Intelligent automation platform',
                href: 'dashboard'
            },
            { label: 'AI Bots', description: 'Intelligent automation' },
            { label: 'SaaS Solutions', description: 'AI-powered services' },
            { label: 'Integration', description: 'Connect your systems' },
            { label: 'AI Tools', description: 'Professional AI toolkit' },
            { label: 'Enterprise', description: 'Business AI solutions' },
            { label: 'Developer APIs', description: 'Build with our APIs' },
        ]
    },
    {
        label: 'AI Services',
        children: [
            { label: 'Consulting', description: 'AI strategy guidance' },
            { label: 'Training', description: 'AI skill development' },
            { label: 'Support', description: '24/7 technical support' },
        ]
    },
    {
        label: 'Respect us',
        children: [
            { label: 'GO - AIBOB', description: 'SEO & Backlink Management', href: 'go-aibob' as any },
            { label: 'Latest Posts', description: 'Recent AI insights' },
            { label: 'Tutorials', description: 'Learn AI techniques' },
            { label: 'Case Studies', description: 'Real-world AI success' },
            { label: 'News', description: 'Latest developments' },
            { label: 'Industry News', description: 'Latest AI developments' },
            { label: 'Company Updates', description: 'GentleOmega announcements' },
            { label: 'Events', description: 'Upcoming AI events' },
            { label: 'About Us', description: 'GentleOmega journey' },
            { label: 'Our Story', description: 'Company history' },
        ]
    },
];

export const SERVICES: Service[] = [
    { name: 'Basic Prompt Scheduler', description: 'AI task management via natural language prompts with intelligent scheduling capabilities.', price: '$29/month', image: 'https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5 },
    { name: 'Resource Usage Predictor', description: 'Predict CPU and memory usage patterns from 10-minute historical data analysis.', price: '$39/month', image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5 },
    { name: 'Intent Classifier', description: 'Intelligent categorization of shell commands with machine learning classification.', price: '$25/month', image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5 },
    { name: 'Smart DND Mode', description: 'Automatic Do Not Disturb toggle based on calendar events and AI-powered scheduling.', price: '$19/month', image: 'https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5 },
    { name: 'Memory Leak Detector', description: 'Advanced anomaly detection for memory usage patterns and leak identification.', price: '$45/month', image: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5 },
    { name: 'Config File Parser', description: 'Validate and parse YAML/JSON configuration files with intelligent error detection.', price: '$22/month', image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5 },
    { name: 'Containerize Small LLM', description: 'Deploy lightweight language models via Docker and Podman containerization.', price: '$59/month', image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5 },
    { name: 'Log Summarizer', description: 'Transform 24-hour system logs into concise 3-line intelligent summaries.', price: '$35/month', image: 'https://images.pexels.com/photos/2450218/pexels-photo-2450218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', rating: 5 },
];

export const DEALS_DATA: Deal[] = [
    { icon: DealIcon1, tag: "Beginner", tagColor: "blue", title: "AI Starter Pack", description: "Complete your first AI project setup and get 3 free consultations", points: "+500 AI Points", time: "6h 23m", participants: "1,247 participants" },
    { icon: DealIcon2, tag: "Intermediate", tagColor: "yellow", title: "Model Training Challenge", description: "Train a small language model and deploy it successfully", points: "+1200 AI Points", time: "4h 15m", participants: "892 participants" },
    { icon: DealIcon3, tag: "Advanced", tagColor: "red", title: "API Integration Sprint", description: "Integrate 3 different AI APIs into your existing workflow", points: "+800 AI Points", time: "8h 45m", participants: "634 participants" },
    { icon: DealIcon4, tag: "Easy", tagColor: "green", title: "Community Helper", description: "Answer 5 questions in the AI community forum", points: "+300 AI Points", time: "12h 30m", participants: "2,156 participants" },
];

export const SUCCESS_STORIES: SuccessStory[] = [
    {
        image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Deep Learning',
        rating: 4.9,
        title: 'Neural Network Architect',
        tags: ['Advanced', 'Career Boost', 'High Demand'],
        story: "Sarah, a data scientist from Silicon Valley, transformed her career by mastering our advanced neural network design tools. In just 3 months, she landed a senior AI role at a Fortune 500 company.",
        reviews: 1247,
        price: '$89/month'
    },
    {
        image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'AI Ethics',
        rating: 4.8,
        title: 'AI Ethics Consultant',
        tags: ['Emerging Field', 'Social Impact', 'Leadership'],
        story: "Marcus discovered his passion for responsible AI development through our ethics framework. Now he leads AI governance initiatives across multiple tech startups, ensuring ethical AI deployment.",
        reviews: 892,
        price: '$65/month'
    },
    {
        image: 'https://images.pexels.com/photos/4148385/pexels-photo-4148385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'NLP & Chatbots',
        rating: 4.7,
        title: 'Conversational AI Designer',
        tags: ['Practical', 'Business Impact', 'User-Friendly'],
        story: "Emma built her first chatbot using our platform and it revolutionized customer service for her startup. The bot now handles 80% of customer inquiries, saving thousands in operational costs.",
        reviews: 1534,
        price: '$45/month'
    },
];

export const GALLERY_SLIDES: GallerySlide[] = [
    { image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop', title: 'AI Enhancing Human Creativity', description: 'Witness how artificial intelligence amplifies human potential in creative problem-solving and innovation.' },
    { image: 'https://images.pexels.com/photos/7567936/pexels-photo-7567936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', thumbnail: 'https://images.pexels.com/photos/7567936/pexels-photo-7567936.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop', title: 'Humans Teaching AI', description: 'Explore the symbiotic relationship where human expertise guides AI development and learning.' },
    { image: 'https://images.pexels.com/photos/256517/pexels-photo-256517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', thumbnail: 'https://images.pexels.com/photos/256517/pexels-photo-256517.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop', title: 'Collaborative Intelligence', description: 'Experience the power of human intuition combined with AI analytical capabilities.' },
    { image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', thumbnail: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop', title: 'AI Moderating Human Teams', description: 'See how AI facilitates better human collaboration and decision-making in professional environments.' },
    { image: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', thumbnail: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop', title: 'AI Supporting Human Care', description: 'Discover how AI enhances human compassion and care in critical service industries.' },
];

export const GALLERY_STATS: StatItem[] = [
    { value: '10,000+', label: 'Successful Placements' },
    { value: '500+', label: 'Industry Partners' },
    { value: '1M+', label: 'Community Members' },
    { value: '4.9/5', label: 'Average Rating' },
];

export const CONTACT_CARDS = [
    {
        icon: MailIcon,
        title: "Email Us",
        lines: ["contact@gentleomegaai.space", "support@gentleomega.dev"],
        link: "mailto:contact@gentleomegaai.space",
        linkLabel: "Send an email"
    },
    {
        icon: PhoneIcon,
        title: "Call Us",
        lines: ["+923468066680", "Mon-Sun, 12PM - 12AM"],
        link: "tel:+923468066680",
        linkLabel: "Call now"
    },
    {
        icon: LocationIcon,
        title: "Our Locations",
        lines: ["Wyoming, USA", "Karachi, Pakistan"],
    },
    {
        icon: ChatIcon,
        title: "Live Chat",
        lines: ["Connect on WhatsApp", "for instant support."],
        link: WHATSAPP_LINK,
        linkLabel: "Chat on WhatsApp"
    }
];
