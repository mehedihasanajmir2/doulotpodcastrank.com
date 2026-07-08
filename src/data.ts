export interface TeamMember {
  name: string;
  role: string;
  image: string;
  socials: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface PodcastEpisode {
  id: string;
  title: string;
  host: string;
  episodes: number;
  category: string;
  image: string;
  audioUrl: string;
}

export interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: string[];
  isHighlighted?: boolean;
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  image: string;
  layout: 'image-left' | 'image-right';
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  stars: number;
  avatar: string;
  reply?: string;
}

export const PLATFORMS = [
  { name: 'Youtube', color: '#FF0000', icon: 'youtube' },
  { name: 'Spotify', color: '#1DB954', icon: 'spotify' },
  { name: 'Google Podcast', color: '#EA4335', icon: 'google-podcast' },
  { name: 'Soundcloud', color: '#FF5500', icon: 'soundcloud' },
  { name: 'Apple Podcast', color: '#872EC4', icon: 'apple-podcast' },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Azad Khan',
    role: 'Operations Manager',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500',
    socials: {
      facebook: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    name: 'Md. Al Amin Linkon',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500',
    socials: {
      facebook: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    name: 'Mrs. Rubaiyya',
    role: 'Creative Designer',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500',
    socials: {
      facebook: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
];

export const EPISODES: PodcastEpisode[] = [
  {
    id: 'ep-1',
    title: 'How to Build a Startup That Survives the First Year',
    host: 'Frank W.',
    episodes: 22,
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'ep-2',
    title: 'From Dentist to DJ: Reinventing Your Life at 35 Y/o',
    host: 'Linda S.',
    episodes: 14,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1484876065684-b683cf17d276?auto=format&fit=crop&q=80&w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'ep-3',
    title: 'Is Short-Form Killing the Story? TikTok vs. Traditional Media',
    host: 'Johnny C.',
    episodes: 18,
    category: 'Comedy',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export const CATEGORIES = [
  {
    name: 'Technology',
    tagline: 'Stay Ahead of the Digital Curve',
    description: 'Explore the latest in tech, development, AI, and digital lifestyle with top-tier optimization strategies to ensure your tech voice is heard clearly.'
  },
  {
    name: 'Entertainment',
    tagline: 'Engage and Entertain the Masses',
    description: 'From pop culture to movie reviews, we refine your audio show-notes and metadata to grab attention from entertainment lovers worldwide.'
  },
  {
    name: 'Comedy',
    tagline: 'Make Them Laugh, Keep Them Listening',
    description: 'Humor is a powerful connection. We optimize your punchy titles and visual thumbnails so your hilarious episodes trend on comedy boards.'
  },
  {
    name: 'Lifestyles',
    tagline: 'Inspire Daily Lives and Habits',
    description: 'Share stories on wellness, travel, and personal growth. Our platform-specific keyword funnels map your content directly to active lifestyle search queries.'
  },
  {
    name: 'Business',
    tagline: 'Establish Authority and Professional Trust',
    description: 'Position your brand, startup advice, or market insights to the right corporate listeners with executive-level SEO strategies.'
  },
  {
    name: 'Politics',
    tagline: 'Drive Meaningful and Urgent Debates',
    description: 'Deliver news and critical commentary. We align your political coverage with current trends and search indexing for high relevancy.'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Starter Package',
    price: 499,
    description: 'Get your show off the ground with 50,000+ downloads, growing subscribers, and higher chart visibility. The ideal fast-growth package for new podcasters ready to make an impact.',
    features: [
      '50,000+ downloads',
      'More subscribers',
      'Higher chart rankings',
      'Perfect for new podcasters'
    ]
  },
  {
    name: 'Standard Package',
    price: 999,
    description: 'Achieve 100,000+ downloads, stronger listener engagement, and the potential to reach the Top 20 charts. Ideal for creators focused on steady, long-term growth.',
    features: [
      '100,000+ downloads',
      'Boosted subscribers and engagement',
      'Potential Top 20 ranking',
      'Opportunities for sponsorships',
      'Perfect for creators seeking steady growth'
    ],
    isHighlighted: true
  },
  {
    name: 'Premium Package',
    price: 1899,
    description: 'Achieve 500,000+ downloads, massive subscriber growth, and premium sponsorship opportunities—designed for creators aiming for maximum reach and visibility.',
    features: [
      '500,000+ downloads',
      'Rapid subscriber growth',
      'Potential Top 10 ranking',
      'Premium sponsorship opportunities',
      'Designed for visibility'
    ]
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 1,
    title: 'Podcast SEO',
    description: 'Optimize your episode titles, descriptions, and show notes to rank higher on Spotify, Apple Podcasts, and Google Podcasts.',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&q=80&w=500',
    layout: 'image-left'
  },
  {
    id: 2,
    title: 'Email Marketing',
    description: 'Grow and engage your listener base with targeted campaigns that convert casual listeners into loyal subscribers.',
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=500',
    layout: 'image-left'
  },
  {
    id: 3,
    title: 'Content Collaboration',
    description: 'Expand your reach by connecting with other creators and sharing content that engages new audiences.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500',
    layout: 'image-right'
  },
  {
    id: 4,
    title: 'Paid Promotion Tools',
    description: 'Amplify your podcast\'s visibility with smart paid strategies that drive downloads and listener growth.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500',
    layout: 'image-right'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Host',
    quote: 'Doulot Ali Podcast Ranking Media transformed my show\'s reach in just a few months. Our downloads and listener engagement skyrocketed!',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 2,
    name: 'Michael Lee',
    role: 'Founder',
    quote: 'Their SEO strategies are next-level. My episodes now consistently rank in the top charts, and the subscriber growth is incredible.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 3,
    name: 'Aisha Rahman',
    role: 'Producer',
    quote: 'The consultation alone gave us absolute clarity. Their team executes with incredible precision, driving authentic growth.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 4,
    name: 'David Carter',
    role: 'Tech Podcaster',
    quote: 'I was skeptical at first, but reaching 100k downloads happened sooner than we scheduled in our standard growth tier!',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  }
];
