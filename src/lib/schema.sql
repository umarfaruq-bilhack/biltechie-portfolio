-- ============================================
-- BILTECHIE PORTFOLIO - SUPABASE SCHEMA
-- Run this in your Supabase SQL editor
-- ============================================

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  tags TEXT[] DEFAULT '{}',
  stack TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Stats table
CREATE TABLE stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- About table (single row)
CREATE TABLE about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bio TEXT NOT NULL,
  availability_status TEXT DEFAULT 'Available for Web3 projects',
  available BOOLEAN DEFAULT true,
  twitter_url TEXT,
  github_url TEXT,
  tiktok_url TEXT,
  email TEXT
);

-- Admin sessions table
CREATE TABLE admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- RLS Policies (public read, no public write)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Public can read visible content
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (visible = true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (visible = true);
CREATE POLICY "Public read stats" ON stats FOR SELECT USING (visible = true);
CREATE POLICY "Public read about" ON about FOR SELECT USING (true);

-- Service role can do everything (admin panel uses service role)
CREATE POLICY "Service role all projects" ON projects USING (auth.role() = 'service_role');
CREATE POLICY "Service role all services" ON services USING (auth.role() = 'service_role');
CREATE POLICY "Service role all stats" ON stats USING (auth.role() = 'service_role');
CREATE POLICY "Service role all about" ON about USING (auth.role() = 'service_role');
CREATE POLICY "Service role all sessions" ON admin_sessions USING (auth.role() = 'service_role');

-- ============================================
-- SEED DATA - Initial content
-- ============================================

INSERT INTO projects (title, description, long_description, tags, stack, live_url, featured, sort_order) VALUES
(
  'Mathematical Visions',
  'Fully on-chain 10,000-piece generative NFT collection on Ethereum mainnet featuring 9 mathematical algorithm families.',
  'Built a complete on-chain generative art system with 9 distinct mathematical algorithm families. Includes a Patron Dividend system, Holder Tier system, and live Next.js mint site. Deployed and verified on Ethereum mainnet.',
  ARRAY['On-chain', 'Generative Art', 'Mainnet'],
  ARRAY['Solidity', 'Foundry', 'Next.js', 'Alchemy', 'RainbowKit'],
  'https://mathvisions.vercel.app',
  true,
  1
),
(
  'Chill Bugs NFT',
  '4,000-piece Ethereum NFT collection with a gamified "Buglist" whitelist system and full mint infrastructure.',
  'Designed and built the complete Web3 stack — ERC721A smart contract, gamified whitelist system, Next.js frontend, Supabase backend, and RainbowKit wallet integration. Site is live and deployed.',
  ARRAY['NFT', 'Whitelist System', 'Live'],
  ARRAY['ERC721A', 'Next.js', 'Supabase', 'RainbowKit', 'Vercel'],
  'https://chillbugs.xyz',
  true,
  2
),
(
  'TheBuenMomento',
  'Web3 community engagement platform with 5-task X engagement flow, Firebase backend, and admin panel.',
  'Built a hacker/terminal-aesthetic Web3 community site with a multi-step X (Twitter) engagement verification system. Firebase backend, Vercel deployment, and a full admin panel for managing participants.',
  ARRAY['Web3', 'Community', 'Full-Stack'],
  ARRAY['Next.js', 'Firebase', 'Vercel', 'TypeScript'],
  null,
  false,
  3
),
(
  'OldPunks',
  '10,000-piece CryptoPunks derivative featuring elderly pixel art characters. Currently in development.',
  'Building a complete NFT collection from scratch — custom trait system, art generation engine, ERC721A contract, and mint page with Rive animations.',
  ARRAY['NFT', 'Pixel Art', 'In Progress'],
  ARRAY['ERC721A', 'Python', 'Next.js', 'Rive'],
  'https://oldpunks.xyz',
  true,
  4
);

INSERT INTO services (name, description, icon, sort_order) VALUES
('Smart Contracts', 'ERC721A, ERC20, custom mechanics, bonding curves. Audited and gas-optimized with Foundry.', 'code', 1),
('NFT Systems', 'End-to-end NFT pipelines — trait engines, metadata generation, IPFS, rarity systems.', 'image', 2),
('Mint Pages', 'Full-stack mint experiences with wallet connection, RainbowKit, and Rive animations.', 'layout', 3),
('Full-Stack dApps', 'Next.js frontends with Supabase/Firebase backends, REST APIs, and admin panels.', 'server', 4),
('Generative Art', 'Algorithmic and on-chain generative art — Python/Pillow pipelines, 10k+ piece collections.', 'sparkles', 5),
('Web Animation', 'Interactive Rive animations for Web3 UIs — mint reveals, hover states, loading sequences.', 'wand', 6);

INSERT INTO stats (label, value, sort_order) VALUES
('Contracts on mainnet', '3+', 1),
('NFTs generated', '24k+', 2),
('Live projects', '5+', 3),
('Years building', '3+', 4);

INSERT INTO about (bio, availability_status, available, twitter_url, github_url, tiktok_url, email) VALUES
(
  'I''m a Web3 developer and builder based in Nigeria. I write smart contracts, build generative art systems, and create full-stack dApps that actually ship. I care about the craft — from the contract logic to the mint page animation. Every project I touch, I build like it''s my own.',
  'Available for Web3 projects',
  true,
  'https://x.com/biltechie',
  'https://github.com/umarfaruq-bilhack',
  null,
  null
);
