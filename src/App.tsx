import { Fragment, useState } from 'react'
import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import {
  ArrowUpRight,
  ChevronRight,
  CircleDot,
  Check,
  Clock,
  Copy,
  FileText,
  GitPullRequest,
  LayoutGrid,
  Mail,
  Rows3,
} from 'lucide-react'
import { about, blogs, connect, experience, exploring, newTab, openSource, profile, projects, quote, skills } from './content'
import GitHubActivity from './GitHubActivity'
import { LinkedInIcon, TechIcon } from './icons'
import LiquidCanvas from './LiquidCanvas'
import { magnet, tilt, useActiveSection, useLiquidGlass, useNavIndicator, useReveal } from './motion'
import ThemeToggle from './ThemeToggle'

const sections = [
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ...(openSource.length > 0 ? [['open-source', 'Open Source']] : []),
  ...(blogs.length > 0 ? [['blogs', 'Blogs']] : []),
  ['about', 'About'],
  ['contact', 'Contact'],
]

function Glass({ className = '', ...props }: ComponentProps<'div'>) {
  const ref = useLiquidGlass()
  return <div className={`glass ${className}`} ref={ref} {...props} />
}

function Chip({ name, icon = true }: { name: string; icon?: boolean }) {
  return (
    <span className="chip">
      {icon && <TechIcon name={name} />}
      {name}
    </span>
  )
}

function Section({ id, title, action, children }: { id: string; title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-heading`}>
      <div className="section-head">
        <h2 id={`${id}-heading`}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function Marquee({ items, reverse }: { items: string[]; reverse: boolean }) {
  return (
    <div className="marquee">
      <div className={reverse ? 'marquee-track reverse' : 'marquee-track'}>
        {[0, 1, 2, 3].map((copy) => (
          <ul className="marquee-copy" key={copy} aria-hidden={copy > 0}>
            {items.map((item) => (
              <li key={item}>
                <Chip name={item} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

function Nav() {
  const active = useActiveSection()
  const nav = useNavIndicator(active)
  return (
    <nav aria-label="Sections" ref={nav}>
      {sections.map(([id, label]) => (
        <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
          {label}
        </a>
      ))}
    </nav>
  )
}

function AnimatedName({ name }: { name: string }) {
  let index = 0
  return (
    <h1 aria-label={name}>
      {name.split(' ').map((word) => (
        <Fragment key={word}>
          <span className="word" aria-hidden="true">
            {[...word].map((letter, position) => (
              <span className="letter" key={position} style={{ '--i': index++ } as CSSProperties}>
                {letter}
              </span>
            ))}
          </span>{' '}
        </Fragment>
      ))}
    </h1>
  )
}

function Headline() {
  let index = 0
  const words = (text: string) =>
    text.split(/(\s+)/).map((token, position) =>
      token.trim() ? (
        <span className="word-rise" key={position} style={{ '--i': index++ } as CSSProperties}>
          {token}
        </span>
      ) : (
        token
      ),
    )
  const parts = profile.intro.split(new RegExp(`(${profile.highlights.join('|')})`))

  return (
    <p className="headline">
      <strong>{words(profile.title)}</strong>
      <span className="sr-only intro-full">{profile.intro}</span>
      <span className="intro-roll" aria-hidden="true">
        {words(parts[0])}
        <span className="roll-slot word-rise" style={{ '--i': index++ } as CSSProperties}>
          <span className="roll-track">
            {[...profile.highlights, profile.highlights[0]].map((phrase, position) => (
              <span key={position}>{phrase}</span>
            ))}
          </span>
        </span>
        <br />
        {words(parts[parts.length - 1].trim())}
      </span>
    </p>
  )
}

function CopyEmail() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const copy = () =>
    navigator.clipboard
      .writeText(profile.email)
      .then(() => setStatus('copied'))
      .catch(() => setStatus('failed'))
      .finally(() => setTimeout(() => setStatus('idle'), 2000))
  const labels = { idle: 'Copy Email', copied: 'Copied', failed: 'Couldn’t Copy' }

  return (
    <button className="button" type="button" onClick={copy}>
      {status === 'copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      <span aria-live="polite">{labels[status]}</span>
    </button>
  )
}

function ChipGroup({
  label,
  note,
  items,
  icon,
  plain,
}: {
  label: string
  note?: string
  items: string[]
  icon?: boolean
  plain?: boolean
}) {
  return (
    <div className="chip-group">
      <h3>
        {label}
        {note && <span>{note}</span>}
      </h3>
      {plain ? (
        <p>{items.join(' · ')}</p>
      ) : (
        <ul className="chips">
          {items.map((item) => (
            <li key={item}>
              <Chip name={item} icon={icon} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Technologies() {
  const [grouped, setGrouped] = useState(false)
  const tools = skills.filter((skill) => skill.scrolling)
  const concepts = skills.filter((skill) => !skill.scrolling)
  const label = grouped ? 'Show scrolling view' : 'Show grouped view'
  const Icon = grouped ? Rows3 : LayoutGrid

  return (
    <Section
      id="technologies"
      title="Technologies"
      action={
        <button className="icon-button" type="button" aria-label={label} title={label} onClick={() => setGrouped(!grouped)}>
          <Icon size={16} aria-hidden="true" />
        </button>
      }
    >
      {grouped ? (
        tools.map((skill) => <ChipGroup key={skill.group} label={skill.group} items={skill.items} icon />)
      ) : (
        <div className="marquees">
          {tools.map((skill, index) => (
            <Marquee key={skill.group} items={skill.items} reverse={index % 2 === 1} />
          ))}
        </div>
      )}
      {concepts.map((skill) => (
        <ChipGroup key={skill.group} label={skill.group} note={skill.note} items={skill.items} icon={false} plain={skill.plain} />
      ))}
    </Section>
  )
}

export default function App() {
  useReveal()

  return (
    <>
      <LiquidCanvas className="page-liquid" follow />
      <div className="progress" aria-hidden="true" />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="topbar">
        <Glass className="topbar-inner">
          <a className="handle" href="#top">
            {profile.handle}
          </a>
          <Nav />
          <ThemeToggle />
        </Glass>
      </header>

      <main id="main">
        <div className="hero" id="top">
          <div className="hero-title">
            <AnimatedName name={profile.name} />
            <div className="avatar-wrap">
              <img className="avatar" src={profile.avatar} alt={`Portrait of ${profile.name}`} width="136" height="136" fetchPriority="high" />
              <svg className="avatar-ring" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="49.5" pathLength="100" />
              </svg>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hero-story">
              <Headline />
              <div className="actions" {...magnet}>
                <a className="button primary" href="#contact">
                  Get in Touch
                  <ChevronRight size={16} aria-hidden="true" />
                </a>
                {profile.resume && (
                  <a className="button" href={profile.resume} {...newTab}>
                    Resume
                    <FileText size={16} aria-hidden="true" />
                  </a>
                )}
              </div>
              <ul className="socials">
                <li>
                  <a href={profile.github} aria-label="GitHub" title="GitHub" {...newTab}>
                    <TechIcon name="GitHub" size={20} />
                  </a>
                </li>
                <li>
                  <a href={profile.linkedin} aria-label="LinkedIn" title="LinkedIn" {...newTab}>
                    <LinkedInIcon />
                  </a>
                </li>
                <li>
                  <a href={`mailto:${profile.email}`} aria-label="Email" title="Email">
                    <Mail size={20} aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>

            <Glass className="hero-panel">
              <p className="stack-line">
                My experience spans{' '}
                {profile.stack.map((item, index) => (
                  <Fragment key={item}>
                    <span className="stack-chip" style={{ '--i': index } as CSSProperties}>
                      <Chip name={item} />
                    </span>{' '}
                  </Fragment>
                ))}
                and database-driven applications.
              </p>
              <p className="focus">{profile.focus}</p>
            </Glass>
          </div>
        </div>

        <Technologies />

        <Section id="projects" title="Projects">
          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.name} {...tilt}>
                <div className={`project-visual ${project.tone}`} aria-hidden="true">
                  <LiquidCanvas className="panel-liquid" />
                  <strong>{project.short}</strong>
                  <span>{project.tagline}</span>
                </div>
                <div className="project-body">
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                  {project.areas.length > 0 && (
                    <ul className="areas">
                      {project.areas.map((area) => (
                        <li key={area}>{area}</li>
                      ))}
                    </ul>
                  )}
                  <ul className="tech-icons" aria-label="Technologies used">
                    {project.tech.map((tech) => (
                      <li key={tech} title={tech}>
                        <TechIcon name={tech} size={22} />
                        <span className="sr-only">{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="project-foot">
                  <span>{project.kind}</span>
                  {project.link && (
                    <a href={project.link} {...newTab}>
                      <TechIcon name="GitHub" />
                      GitHub
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience">
          <ol className="timeline">
            {experience.map((job) => (
              <li key={job.company}>
                <div className="timeline-head">
                  <h3>{job.company}</h3>
                  <span>{job.period}</span>
                </div>
                <p className="role">{job.role}</p>
                <ul className="points">
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Section>

        {openSource.length > 0 && (
          <Section id="open-source" title="Open Source">
            <ol className="open-source">
              {openSource.map((item) => (
                <li key={item.name}>
                  <span className="repo-tile" aria-hidden="true">
                    {item.name.charAt(0)}
                  </span>
                  <div>
                    <h3>
                      <a href={item.link} {...newTab}>
                        {item.name}
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    </h3>
                    <p>{item.description}</p>
                    <p className="repo-stats">
                      <span>
                        <GitPullRequest size={14} aria-hidden="true" />
                        {item.prs} {item.prs === 1 ? 'PR' : 'PRs'}
                      </span>
                      <span>
                        <CircleDot size={14} aria-hidden="true" />
                        {item.issues} {item.issues === 1 ? 'Issue' : 'Issues'}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {blogs.length > 0 && (
          <Section id="blogs" title="Blogs">
            <div className="blog-list">
              {blogs.map((post) => (
                <a className="blog-card" href={post.link} key={post.title} {...newTab}>
                  <div className="blog-meta">
                    <span>{post.date}</span>
                    <span>
                      <Clock size={14} aria-hidden="true" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3>
                    {post.title}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </h3>
                  <p>{post.excerpt}</p>
                  <ul className="blog-tags">
                    {post.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </a>
              ))}
            </div>
          </Section>
        )}

        <Section id="activity" title="GitHub Activity">
          <Glass className="activity-glass">
            <GitHubActivity />
          </Glass>
        </Section>

        <Section id="about" title="About">
          <div className="prose">
            {about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="explore">
            <h3>Currently Exploring</h3>
            <Glass className="explore-lens">
              <ul className="explore-list">
                {exploring.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </Glass>
          </div>
        </Section>

        <Section id="contact" title="Let’s Connect">
          <div className="prose">
            <p>{connect}</p>
          </div>
          <Glass className="actions contact-actions" {...magnet}>
            <a className="button primary" href={`mailto:${profile.email}`}>
              <Mail size={16} aria-hidden="true" />
              {profile.email}
            </a>
            <CopyEmail />
            <a className="button" href={profile.linkedin} {...newTab}>
              <LinkedInIcon size={16} />
              LinkedIn
            </a>
            <a className="button" href={profile.github} {...newTab}>
              <TechIcon name="GitHub" />
              GitHub
            </a>
            {profile.resume && (
              <a className="button" href={profile.resume} {...newTab}>
                <FileText size={16} aria-hidden="true" />
                Resume
              </a>
            )}
          </Glass>
        </Section>

        {quote && (
          <figure className="quote">
            <blockquote>“{quote.text}”</blockquote>
            <figcaption>— {quote.author}</figcaption>
          </figure>
        )}
      </main>

      <footer className="footer">
        <span>
          Designed &amp; Developed by <strong>{profile.name}</strong>
        </span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </>
  )
}
