import { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Experience = Database['public']['Tables']['experiences']['Row'];
type Education = Database['public']['Tables']['education']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];

type Skill = {
  id?: string | null;
  name: string;
  summary?: string | null;
  category?: string | null;
  proficiency?: string | null;
};

type SkillsPayload = {
  title?: string | null;
  description?: string | null;
  items?: Skill[] | null;
};

type MissionStat = {
  id?: string | null;
  label: string;
  value: string;
  description?: string | null;
};

type SpaceHighlight = {
  id?: string | null;
  title: string;
  description?: string | null;
  badge?: string | null;
};

type PortfolioResponse = {
  profile?: Profile | null;
  skills?: SkillsPayload | null;
  experiences?: Experience[] | null;
  education?: Education[] | null;
  projects?: Project[] | null;
  mission_stats?: MissionStat[] | null;
  space_highlights?: SpaceHighlight[] | null;
};

const STATIC_PROFILE: Profile = {
  id: '1',
  name: 'Nova Carter',
  title: 'Mission Systems Architect',
  bio: 'I choreograph starship-grade interfaces, guiding crews through realtime telemetry and cinematic combat simulations.',
  email: 'comms@novacarter.io',
  location: 'New Avalon Station',
  avatar_url: null,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  nav_label: 'Nova Carter',
  headline_words: ['Interstellar', 'Mission-ready', 'Combat-simulated', 'Adaptive'],
  about_background_url: null,
};

const STATIC_EXPERIENCES: Experience[] = [
  {
    id: '1',
    role: 'Chief Interaction Officer',
    company: 'Lumen Fleet',
    duration: '2023 - Present',
    description:
      'Command the design of multi-ship dashboards synchronising drones, pilots, and command decks across deep-space sorties.',
    technologies: ['React', 'Three.js', 'GSAP', 'Supabase', 'Node.js', 'TailwindCSS'],
    logo_url: null,
    order_index: 1,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    role: 'Mission Control Lead',
    company: 'Orbital IX',
    duration: '2021 - 2023',
    description: 'Built adaptive HUDs for combat pilots, weaving sensor fusion, predictive guidance, and holographic comms.',
    technologies: ['TypeScript', 'WebGL', 'GraphQL', 'Docker', 'AWS'],
    logo_url: null,
    order_index: 2,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '3',
    role: 'Principal UX Engineer',
    company: 'Synapse Forge',
    duration: '2019 - 2021',
    description:
      'Engineered collaborative fabrication tools that streamed telemetry from orbital yards to ground crews in realtime.',
    technologies: ['React', 'Next.js', 'D3.js', 'PostgreSQL'],
    logo_url: null,
    order_index: 3,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
];

const STATIC_EDUCATION: Education[] = [
  {
    id: '1',
    school_name: 'Academy of Stellar Navigation',
    degree: 'M.S. Mission Systems Engineering',
    duration: '2017 - 2019',
    description: 'Focused on adaptive guidance, telemetry orchestration, and pilot experience research.',
    type: 'education',
    logo_url: null,
    order_index: 1,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    school_name: 'Nova Core Institute',
    degree: 'B.S. Human-Computer Symbiosis',
    duration: '2013 - 2017',
    description: 'Explored immersive visualization, spatial interaction, and systems choreography.',
    type: 'education',
    logo_url: null,
    order_index: 2,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '3',
    school_name: 'EDCiOT',
    degree: 'EDCiOT Tactical Interface Certification',
    duration: '2024',
    description: 'Certified in building resilient, crew-first experiences for orbital deployments.',
    type: 'certification',
    logo_url: null,
    order_index: 3,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
];

const STATIC_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Aegis Command',
    description:
      'Fleet operations console blending combat dashboards, AI briefings, and live nebula reconnaissance feeds.',
    technologies: ['React', 'Three.js', 'Supabase', 'TailwindCSS'],
    live_url: 'https://aegis-command.example.com',
    github_url: 'https://github.com/nova/aegis-command',
    image_url: null,
    featured: true,
    order_index: 1,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Stellar Cartographer',
    description:
      'Procedural galaxy mapper that streams stellar data and renders hyperspace corridors in realtime.',
    technologies: ['React', 'd3.js', 'Mapbox', 'Node.js'],
    live_url: 'https://stellar-cartographer.example.com',
    github_url: 'https://github.com/nova/stellar-cartographer',
    image_url: null,
    featured: false,
    order_index: 2,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
];

const STATIC_SKILLS: SkillsPayload = {
  title: 'Systems mastery',
  description: 'Each capability fuels the mission dashboards, combat sims, and telemetry loops I deliver.',
  items: [
    { id: 'skill-1', name: 'Three.js combat simulations' },
    { id: 'skill-2', name: 'Framer Motion choreography' },
    { id: 'skill-3', name: 'Supabase ops mesh' },
    { id: 'skill-4', name: 'React orchestration' },
    { id: 'skill-5', name: 'TailwindCSS systems' },
    { id: 'skill-6', name: 'TypeScript' },
  ],
};

const STATIC_SPACE_HIGHLIGHTS: SpaceHighlight[] = [
  {
    id: 'highlight-telemetry',
    title: 'Telemetry sync',
    description: 'GSAP-synced thrusters and HUD cues reacting to pointer flight paths.',
  },
  {
    id: 'highlight-combat-sim',
    title: 'Three.js combat sim',
    description: 'Procedural starfighters, nebulae, and plasma trails flying in formation.',
  },
];

const STATIC_MISSION_STATS: MissionStat[] = [
  {
    id: 'stat-missions',
    label: 'Deep-space missions shipped',
    value: '32',
    description: 'Command modules and immersive ops rooms launched with cinematic UX.',
  },
  {
    id: 'stat-uptime',
    label: 'Live telemetry uptime',
    value: '99.99%',
    description: 'Redundant pipelines keep mission dashboards glowing around the clock.',
  },
  {
    id: 'stat-streams',
    label: 'Realtime data streams',
    value: '74',
    description: 'Sensor, satellite, and crew feeds braided into one control surface.',
  },
  {
    id: 'stat-systems',
    label: 'Systems in active rotation',
    value: '12',
    description: 'React, Three.js, GSAP, Supabase, Tailwind, and more interlinked.',
  },
];



const FALLBACK_DATA = {
  profile: STATIC_PROFILE,
  skills: STATIC_SKILLS,
  experiences: STATIC_EXPERIENCES,
  education: STATIC_EDUCATION,
  projects: STATIC_PROJECTS,
  mission_stats: STATIC_MISSION_STATS,
  space_highlights: STATIC_SPACE_HIGHLIGHTS,
};

const hydrateWithFallback = (payload?: PortfolioResponse | null) => ({
  profile: payload?.profile ?? FALLBACK_DATA.profile,
  skills:
    payload?.skills && payload.skills.items && payload.skills.items.length
      ? {
          title: payload.skills.title ?? FALLBACK_DATA.skills.title,
          description: payload.skills.description ?? FALLBACK_DATA.skills.description,
          items: payload.skills.items,
        }
      : FALLBACK_DATA.skills,
  experiences:
    Array.isArray(payload?.experiences) && payload?.experiences.length
      ? payload.experiences
      : FALLBACK_DATA.experiences,
  education:
    Array.isArray(payload?.education) && payload?.education.length
      ? payload.education
      : FALLBACK_DATA.education,
  projects:
    Array.isArray(payload?.projects) && payload?.projects.length
      ? payload.projects
      : FALLBACK_DATA.projects,
  mission_stats:
    Array.isArray(payload?.mission_stats) && payload?.mission_stats.length
      ? payload.mission_stats
      : FALLBACK_DATA.mission_stats,
  space_highlights:
    Array.isArray(payload?.space_highlights) && payload?.space_highlights.length
      ? payload.space_highlights
      : FALLBACK_DATA.space_highlights,
});

let portfolioRequest: Promise<ReturnType<typeof hydrateWithFallback>> | null = null;

const fetchPortfolioData = async () => {
  if (!portfolioRequest) {
    portfolioRequest = axios
      .get<PortfolioResponse>('/data/portfolio.json', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      .then((response) => hydrateWithFallback(response.data))
      .catch(() => hydrateWithFallback(null));
  }

  return portfolioRequest;
};

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile>(FALLBACK_DATA.profile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchPortfolioData()
      .then((data) => {
        if (!mounted) return;
        setProfile(data.profile);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setProfile(FALLBACK_DATA.profile);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { profile, loading, error, setProfile };
};

export const useSkills = () => {
  const [skillsSection, setSkillsSection] = useState<SkillsPayload>(FALLBACK_DATA.skills);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchPortfolioData()
      .then((data) => {
        if (!mounted) return;
        setSkillsSection(data.skills);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setSkillsSection(FALLBACK_DATA.skills);
        setError(err instanceof Error ? err.message : 'Failed to load skills');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { skillsSection, loading, error, setSkillsSection };
};

export const useExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>(FALLBACK_DATA.experiences);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchPortfolioData()
      .then((data) => {
        if (!mounted) return;
        setExperiences(data.experiences);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setExperiences(FALLBACK_DATA.experiences);
        setError(err instanceof Error ? err.message : 'Failed to load experiences');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { experiences, loading, error, setExperiences };
};

export const useEducation = () => {
  const [education, setEducation] = useState<Education[]>(FALLBACK_DATA.education);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchPortfolioData()
      .then((data) => {
        if (!mounted) return;
        setEducation(data.education);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setEducation(FALLBACK_DATA.education);
        setError(err instanceof Error ? err.message : 'Failed to load education');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { education, loading, error, setEducation };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_DATA.projects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchPortfolioData()
      .then((data) => {
        if (!mounted) return;
        setProjects(data.projects);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setProjects(FALLBACK_DATA.projects);
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { projects, loading, error, setProjects };
};

export const useMissionStats = () => {
  const [missionStats, setMissionStats] = useState<MissionStat[]>(FALLBACK_DATA.mission_stats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchPortfolioData()
      .then((data) => {
        if (!mounted) return;
        setMissionStats(data.mission_stats);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setMissionStats(FALLBACK_DATA.mission_stats);
        setError(err instanceof Error ? err.message : 'Failed to load mission stats');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { missionStats, loading, error, setMissionStats };
};

export const useSpaceHighlights = () => {
  const [spaceHighlights, setSpaceHighlights] = useState<SpaceHighlight[]>(FALLBACK_DATA.space_highlights);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchPortfolioData()
      .then((data) => {
        if (!mounted) return;
        setSpaceHighlights(data.space_highlights);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setSpaceHighlights(FALLBACK_DATA.space_highlights);
        setError(err instanceof Error ? err.message : 'Failed to load space highlights');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { spaceHighlights, loading, error, setSpaceHighlights };
};

export const useContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setMessages(data || []);
      setError(null);
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
      const { error: supabaseError } = await supabase.from('contact_messages').insert([messageData]);

      if (supabaseError) throw supabaseError;
      await fetchMessages();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return { messages, loading, error, sendMessage, fetchMessages };
};
