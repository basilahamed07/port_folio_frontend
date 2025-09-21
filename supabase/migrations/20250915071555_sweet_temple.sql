/*
  # Portfolio Website Database Schema

  1. New Tables
    - `profiles` - Basic profile information
      - `id` (uuid, primary key)
      - `name` (text)
      - `title` (text)
      - `bio` (text)
      - `email` (text)
      - `location` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
    - `experiences` - Work experience entries
      - `id` (uuid, primary key)
      - `role` (text)
      - `company` (text)
      - `duration` (text)
      - `description` (text)
      - `technologies` (text array)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
    - `education` - Education and certifications
      - `id` (uuid, primary key)
      - `school_name` (text)
      - `degree` (text)
      - `duration` (text)
      - `description` (text)
      - `type` (text) - 'education' or 'certification'
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
    - `projects` - Portfolio projects
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `technologies` (text array)
      - `live_url` (text)
      - `github_url` (text)
      - `image_url` (text)
      - `featured` (boolean)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
    - `contact_messages` - Contact form submissions
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin access
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  company text NOT NULL,
  duration text NOT NULL,
  description text NOT NULL DEFAULT '',
  technologies text[] DEFAULT '{}',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text NOT NULL,
  degree text NOT NULL,
  duration text NOT NULL,
  description text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'education',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  technologies text[] DEFAULT '{}',
  live_url text DEFAULT '',
  github_url text DEFAULT '',
  image_url text DEFAULT '',
  featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Anyone can read profiles"
  ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read experiences"
  ON experiences
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read education"
  ON education
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read projects"
  ON projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policies for authenticated users (admin access)
CREATE POLICY "Authenticated users can manage profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage experiences"
  ON experiences
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage education"
  ON education
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data
INSERT INTO profiles (name, title, bio, email, location) VALUES 
('John Doe', 'Full Stack Developer', 'Passionate developer with expertise in modern web technologies. I love creating beautiful and functional applications that solve real-world problems.', 'john@example.com', 'San Francisco, CA');

INSERT INTO experiences (role, company, duration, description, technologies, order_index) VALUES 
('Senior Frontend Developer', 'Tech Corp', '2022 - Present', 'Lead development of user-facing applications using React, TypeScript, and modern CSS. Collaborated with design team to implement pixel-perfect interfaces.', '{"React","TypeScript","Tailwind CSS","Node.js"}', 1),
('Frontend Developer', 'StartupXYZ', '2020 - 2022', 'Developed responsive web applications and contributed to the design system. Improved page load times by 40% through optimization techniques.', '{"JavaScript","Vue.js","SCSS","Webpack"}', 2),
('Junior Developer', 'Web Agency', '2019 - 2020', 'Built client websites using HTML, CSS, and JavaScript. Learned modern development practices and version control with Git.', '{"HTML","CSS","JavaScript","jQuery"}', 3);

INSERT INTO education (school_name, degree, duration, description, type, order_index) VALUES 
('University of Technology', 'Bachelor of Computer Science', '2015 - 2019', 'Focused on software engineering and web development. Graduated with honors.', 'education', 1),
('FreeCodeCamp', 'Full Stack Web Development', '2018', 'Comprehensive course covering frontend and backend development.', 'certification', 2),
('Google', 'UX Design Professional Certificate', '2019', 'User experience design principles and best practices.', 'certification', 3);

INSERT INTO projects (title, description, technologies, live_url, github_url, image_url, featured, order_index) VALUES 
('E-commerce Platform', 'Full-featured online shopping platform with payment integration, admin dashboard, and user management.', '{"React","Node.js","MongoDB","Stripe"}', 'https://example-shop.com', 'https://github.com/johndoe/ecommerce', 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg', true, 1),
('Task Management App', 'Collaborative task management tool with real-time updates, drag-and-drop functionality, and team collaboration features.', '{"Vue.js","Firebase","Vuex","CSS3"}', 'https://example-tasks.com', 'https://github.com/johndoe/taskapp', 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg', true, 2),
('Weather Dashboard', 'Beautiful weather application with location-based forecasts, interactive maps, and detailed weather analytics.', '{"JavaScript","OpenWeather API","Chart.js","SCSS"}', 'https://example-weather.com', 'https://github.com/johndoe/weather', 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg', false, 3);