import { Code, Database } from 'lucide-react'
import {
  siBootstrap,
  siCss,
  siDocker,
  siGit,
  siGithub,
  siHibernate,
  siHtml5,
  siJavascript,
  siLaravel,
  siMysql,
  siOpenjdk,
  siPhp,
  siReact,
  siRedis,
  siSpringboot,
  siTypescript,
} from 'simple-icons'

const brands: Record<string, { path: string; hex: string }> = {
  PHP: siPhp,
  Laravel: siLaravel,
  'Laravel Sail': siLaravel,
  Java: siOpenjdk,
  'Spring Boot': siSpringboot,
  Hibernate: siHibernate,
  React: siReact,
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  HTML5: siHtml5,
  CSS3: siCss,
  Bootstrap: siBootstrap,
  MySQL: siMysql,
  Redis: siRedis,
  Docker: siDocker,
  Git: siGit,
  GitHub: siGithub,
}

// These brand colours disappear on a dark background, so they follow the text colour.
const neutralHex = new Set(['000000', '181717', '59666C', '4479A1'])

export function TechIcon({ name, size = 16 }: { name: string; size?: number }) {
  const brand = brands[name]
  if (name === 'Oracle SQL') return <Database size={size} aria-hidden="true" />
  if (!brand) return <Code size={size} aria-hidden="true" />
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={brand.path} fill={neutralHex.has(brand.hex) ? 'currentColor' : `#${brand.hex}`} />
    </svg>
  )
}

export function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#3b82c4" />
      <rect x="6" y="10" width="2.6" height="8" fill="#fff" />
      <circle cx="7.3" cy="7.2" r="1.5" fill="#fff" />
      <path
        d="M11 10h2.5v1.2c.5-.8 1.4-1.4 2.6-1.4 2.2 0 3 1.4 3 3.6V18h-2.6v-4.1c0-1-.3-1.8-1.3-1.8s-1.6.8-1.6 1.8V18H11z"
        fill="#fff"
      />
    </svg>
  )
}
