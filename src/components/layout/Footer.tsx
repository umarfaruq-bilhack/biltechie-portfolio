import type { AboutContent } from '@/types'

export default function Footer({ about }: { about?: AboutContent }) {
  const ab = about as unknown as Record<string, string> | undefined

  const links = [
    { label: 'X / Twitter', href: ab?.twitter_url || 'https://x.com/biltechie' },
    { label: 'GitHub', href: ab?.github_url || 'https://github.com/umarfaruq-bilhack' },
    { label: 'TikTok', href: ab?.tiktok_url || '#' },
  ].filter(l => l.href && l.href !== '#' || l.label === 'TikTok')

  return (
    <footer className="border-t border-dark-300 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-mono text-xs text-white/20">© 2026 Biltechie. Built by me.</p>
        <div className="flex gap-6">
          {links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs text-white/25 hover:text-neon transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
