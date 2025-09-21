import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Experience = Database['public']['Tables']['experiences']['Row'];
type Education = Database['public']['Tables']['education']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];

// Static fallback data
const STATIC_PROFILE: Profile = {
  id: '1',
  name: 'Alex Johnson',
  title: 'Full Stack Developer & UI/UX Designer',
  bio: 'Passionate full-stack developer with 5+ years of experience creating beautiful, functional web applications. I specialize in React, Node.js, and modern web technologies. I love turning complex problems into simple, elegant solutions that users enjoy.',
  email: 'alex.johnson@example.com',
  location: 'San Francisco, CA',
  avatar_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const STATIC_EXPERIENCES: Experience[] = [
  {
    id: '1',
    role: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    duration: '2022 - Present',
    description: 'Lead development of enterprise web applications serving 100K+ users. Architected microservices infrastructure, implemented CI/CD pipelines, and mentored junior developers. Reduced application load times by 60% through optimization.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL'],
    order_index: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    role: 'Frontend Developer',
    company: 'Digital Innovations Inc',
    duration: '2020 - 2022',
    description: 'Developed responsive web applications using React and Vue.js. Collaborated with design team to implement pixel-perfect UI components. Built reusable component library used across 15+ projects.',
    technologies: ['React', 'Vue.js', 'JavaScript', 'SCSS', 'Webpack', 'Jest', 'Figma'],
    order_index: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    role: 'Web Developer',
    company: 'StartupXYZ',
    duration: '2019 - 2020',
    description: 'Built and maintained company website and internal tools. Implemented responsive designs and optimized for mobile devices. Integrated third-party APIs and payment systems.',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'PHP', 'MySQL', 'Bootstrap'],
    order_index: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const STATIC_EDUCATION: Education[] = [
  {
    id: '1',
    school_name: 'Stanford University',
    degree: 'Master of Science in Computer Science',
    duration: '2017 - 2019',
    description: 'Specialized in Human-Computer Interaction and Software Engineering. Thesis on "Modern Web Application Performance Optimization". GPA: 3.8/4.0',
    type: 'education',
    order_index: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    school_name: 'University of California, Berkeley',
    degree: 'Bachelor of Science in Computer Science',
    duration: '2013 - 2017',
    description: 'Graduated Magna Cum Laude with focus on Software Engineering and Web Development. Active member of Computer Science Society and Hackathon organizer.',
    type: 'education',
    order_index: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    school_name: 'AWS',
    degree: 'AWS Certified Solutions Architect',
    duration: '2023',
    description: 'Professional certification demonstrating expertise in designing distributed systems on AWS platform.',
    type: 'certification',
    order_index: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    school_name: 'Google',
    degree: 'Google Cloud Professional Developer',
    duration: '2022',
    description: 'Certification in developing scalable and reliable applications using Google Cloud Platform services.',
    type: 'certification',
    order_index: 4,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const STATIC_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-featured online shopping platform with advanced search, real-time inventory management, secure payment processing, and comprehensive admin dashboard. Built with modern technologies for scalability and performance.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'AWS S3', 'Docker'],
    live_url: 'https://demo-ecommerce.vercel.app',
    github_url: 'https://github.com/alexjohnson/ecommerce-platform',
    image_url: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    order_index: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Task Management Dashboard',
    description: 'Collaborative project management tool with real-time updates, drag-and-drop kanban boards, team collaboration features, time tracking, and detailed analytics. Perfect for agile teams.',
    technologies: ['Vue.js', 'Firebase', 'Vuex', 'Socket.io', 'Chart.js', 'Tailwind CSS'],
    live_url: 'https://taskflow-demo.netlify.app',
    github_url: 'https://github.com/alexjohnson/task-dashboard',
    image_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    order_index: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Weather Analytics App',
    description: 'Beautiful weather application with location-based forecasts, interactive maps, historical data analysis, and detailed weather analytics. Features include severe weather alerts and customizable dashboards.',
    technologies: ['React', 'TypeScript', 'OpenWeather API', 'Mapbox', 'Chart.js', 'PWA'],
    live_url: 'https://weather-analytics.vercel.app',
    github_url: 'https://github.com/alexjohnson/weather-app',
    image_url: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    order_index: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'Social Media Dashboard',
    description: 'Comprehensive social media management platform with post scheduling, analytics tracking, engagement monitoring, and multi-platform integration. Helps businesses manage their social presence effectively.',
    technologies: ['Next.js', 'MongoDB', 'Express.js', 'OAuth', 'Recharts', 'Framer Motion'],
    live_url: 'https://social-dashboard-demo.vercel.app',
    github_url: 'https://github.com/alexjohnson/social-dashboard',
    image_url: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    order_index: 4,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    title: 'Fitness Tracking App',
    description: 'Mobile-first fitness application with workout tracking, progress visualization, social features, and personalized recommendations. Includes integration with wearable devices and nutrition tracking.',
    technologies: ['React Native', 'Firebase', 'Redux', 'HealthKit', 'Google Fit', 'Expo'],
    live_url: 'https://fitness-tracker-demo.expo.dev',
    github_url: 'https://github.com/alexjohnson/fitness-app',
    image_url: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    order_index: 5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    title: 'Real Estate Platform',
    description: 'Modern real estate platform with advanced property search, virtual tours, mortgage calculator, and agent management system. Features include map integration and detailed property analytics.',
    technologies: ['Angular', 'NestJS', 'PostgreSQL', 'Stripe', 'Google Maps', 'AWS'],
    live_url: 'https://realestate-demo.herokuapp.com',
    github_url: 'https://github.com/alexjohnson/realestate-platform',
    image_url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    order_index: 6,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];
export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .single();

        if (error || !data) {
          // Use static data as fallback
          setProfile(STATIC_PROFILE);
        } else {
          setProfile(data);
        }
      } catch (err) {
        // Use static data on error
        setProfile(STATIC_PROFILE);
        setError(null); // Don't show error, just use static data
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};

export const useExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('order_index', { ascending: true });

        if (error || !data || data.length === 0) {
          // Use static data as fallback
          setExperiences(STATIC_EXPERIENCES);
        } else {
          setExperiences(data);
        }
      } catch (err) {
        setExperiences(STATIC_EXPERIENCES);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return { experiences, loading, error, setExperiences };
};

export const useEducation = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const { data, error } = await supabase
          .from('education')
          .select('*')
          .order('order_index', { ascending: true });

        if (error || !data || data.length === 0) {
          // Use static data as fallback
          setEducation(STATIC_EDUCATION);
        } else {
          setEducation(data);
        }
      } catch (err) {
        setEducation(STATIC_EDUCATION);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  return { education, loading, error, setEducation };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('order_index', { ascending: true });

        if (error || !data || data.length === 0) {
          // Use static data as fallback
          setProjects(STATIC_PROJECTS);
        } else {
          setProjects(data);
        }
      } catch (err) {
        setProjects(STATIC_PROJECTS);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error, setProjects };
};

export const useContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = async (messageData: Database['public']['Tables']['contact_messages']['Insert']) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([messageData]);

      if (error) throw error;
      await fetchMessages();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return { messages, loading, error, sendMessage, fetchMessages };
};