export interface PortfolioProfile {
  id?: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  avatar_url?: string | null;
  nav_label?: string | null;
  headline_words?: string[] | null;
  about_background_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioSkillItem {
  id?: string | null;
  name: string;
}

export interface PortfolioSkills {
  title: string;
  description: string;
  items: PortfolioSkillItem[];
}

export interface PortfolioExperience {
  id?: string | null;
  role: string;
  company: string;
  duration: string;
  description: string;
  technologies: string[];
  order_index?: number | null;
  logo_url?: string | null;
}

export interface PortfolioEducation {
  id?: string | null;
  school_name: string;
  degree: string;
  duration: string;
  description: string;
  type: 'education' | 'certification';
  order_index?: number | null;
  logo_url?: string | null;
}

export interface PortfolioProject {
  id?: string | null;
  title: string;
  description: string;
  technologies: string[];
  live_url?: string | null;
  github_url?: string | null;
  image_url?: string | null;
  featured: boolean;
  order_index?: number | null;
}

export interface PortfolioMissionStat {
  id?: string | null;
  label: string;
  value: string;
  description?: string | null;
}

export interface PortfolioSpaceHighlight {
  id?: string | null;
  title: string;
  description?: string | null;
  badge?: string | null;
}

export interface PortfolioData {
  profile: PortfolioProfile;
  skills: PortfolioSkills;
  experiences: PortfolioExperience[];
  education: PortfolioEducation[];
  projects: PortfolioProject[];
  mission_stats?: PortfolioMissionStat[];
  space_highlights?: PortfolioSpaceHighlight[];
}
