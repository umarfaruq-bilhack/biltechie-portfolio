-- ============================================
-- TEMPLATES SCHEMA - Run in Supabase SQL editor
-- ============================================

CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  category TEXT NOT NULL DEFAULT 'Landing Page',
  price NUMERIC(10,2) NOT NULL DEFAULT 49,
  preview_url TEXT,
  stack TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  badge TEXT,
  visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE purchase_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  template_name TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read templates" ON templates FOR SELECT USING (visible = true);
CREATE POLICY "Public insert purchase" ON purchase_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role all templates" ON templates USING (auth.role() = 'service_role');
CREATE POLICY "Service role all purchases" ON purchase_requests USING (auth.role() = 'service_role');

-- Seed templates
INSERT INTO templates (name, description, long_description, category, price, preview_url, stack, features, badge, sort_order) VALUES
(
  'NFT Mint Page Pro',
  'Full mint experience with wallet connect, live counter, and Rive animations.',
  'A production-ready NFT mint page built with Next.js and RainbowKit. Includes animated countdown, live mint counter, whitelist checking, and smooth Rive micro-animations throughout.',
  'Mint Page',
  49,
  null,
  ARRAY['Next.js', 'RainbowKit', 'Rive', 'Tailwind', 'wagmi'],
  ARRAY['Wallet connection', 'Live mint counter', 'Whitelist support', 'Rive animations', 'Mobile responsive', 'Dark theme'],
  'Popular',
  1
),
(
  'Buglist Whitelist System',
  'Gamified whitelist system with task verification, leaderboard, and admin panel.',
  'A complete whitelist management system featuring X (Twitter) task verification, a real-time leaderboard, Supabase backend, and a full admin panel to manage entries.',
  'Community',
  79,
  null,
  ARRAY['Next.js', 'Supabase', 'Firebase', 'Vercel', 'Tailwind'],
  ARRAY['X task verification', 'Real-time leaderboard', 'Admin panel', 'Email notifications', 'CSV export', 'Mobile responsive'],
  'New',
  2
),
(
  'NFT Collection Launch',
  'High-converting NFT launch page with animated hero, roadmap, and team section.',
  'Everything you need to launch an NFT collection — animated hero section, roadmap, team, FAQ, and a newsletter signup. Optimized for conversions.',
  'Landing Page',
  39,
  null,
  ARRAY['Next.js', 'Framer Motion', 'Tailwind'],
  ARRAY['Animated hero', 'Roadmap section', 'Team section', 'FAQ accordion', 'Newsletter signup', 'Mobile responsive'],
  null,
  3
),
(
  'Web3 Community Hub',
  'Community engagement site with X task flow, Firebase backend and admin panel.',
  'A full Web3 community engagement platform. Users complete X (Twitter) tasks to earn points. Includes Firebase backend, admin dashboard, and beautiful hacker aesthetic.',
  'Community',
  59,
  null,
  ARRAY['Next.js', 'Firebase', 'Vercel', 'Tailwind'],
  ARRAY['X task system', 'Point tracking', 'Admin dashboard', 'User management', 'Hacker aesthetic', 'Mobile responsive'],
  null,
  4
),
(
  'dApp Dashboard UI',
  'Clean dApp interface with wallet stats, activity feed, and dark theme.',
  'A polished dApp dashboard UI with wallet connection, token balance display, transaction activity feed, and a clean dark design. Drop in your contract calls and ship.',
  'dApp UI',
  69,
  null,
  ARRAY['Next.js', 'RainbowKit', 'wagmi', 'Tailwind'],
  ARRAY['Wallet integration', 'Balance display', 'Activity feed', 'Dark theme', 'Multi-chain ready', 'Mobile responsive'],
  'New',
  5
),
(
  'Web3 Dev Portfolio',
  'Dark neon portfolio with node network animation, Supabase CMS, and admin panel.',
  'The exact portfolio you are looking at right now — fully open and available as a template. Includes the node network background animation, full Supabase CMS, admin panel, and templates store.',
  'Landing Page',
  89,
  null,
  ARRAY['Next.js', 'Supabase', 'Rive', 'Tailwind', 'TypeScript'],
  ARRAY['Node network animation', 'Supabase CMS', 'Admin panel', 'Templates store', 'Dark neon theme', 'Mobile responsive'],
  null,
  6
);
