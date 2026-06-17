-- ============================================
-- Run this in Supabase SQL editor to add broader,
-- non-Web3 services alongside your existing ones
-- ============================================

INSERT INTO services (name, description, icon, sort_order) VALUES
('E-commerce Platforms', 'Full online stores with payments, inventory, and admin management.', 'globe', 7),
('Admin Dashboards', 'Custom dashboards with analytics, data tables, and role-based access.', 'layout', 8),
('Business Websites', 'Real estate sites, blogs, agency sites, and modern marketing pages.', 'sparkles', 9);

-- Optionally update your bio to reflect the broader identity:
UPDATE about SET bio = 'I''m a full-stack developer and builder based in Nigeria. I build everything from Web3 smart contracts and NFT systems to e-commerce platforms, admin dashboards, and modern business websites. I care about the craft — from the backend logic to the smallest animation. Every project I touch, I build like it''s my own.';
