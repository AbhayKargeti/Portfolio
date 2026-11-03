import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowUpRight,
  ChevronRight,
  CircleDot,
  Clock,
  FileText,
  GitPullRequest,
  LayoutGrid,
  Mail,
  MapPin,
  Rows3,
} from 'lucide-react'
import { about, blogs, connect, experience, exploring, openSource, profile, projects, quote, skills, uses } from './content'
import GitHubActivity from './GitHubActivity'
import { LinkedInIcon, TechIcon } from './icons'
import ThemeToggle from './ThemeToggle'

const sections = [
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ...(openSource.length > 0 ? [['open-source', 'Open Source']] : []),
  ...(blogs.length > 0 ? [['blogs', 'Blogs']] : []),
  ['uses', 'Uses'],
  ['about', 'About'],
  ['contact', 'Contact'],
]

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

function ChipGroup({ label, note, items, icon }: { label: string; note?: string; items: string[]; icon: boolean }) {
  return (
    <div className="chip-group">
      <h3>
        {label}
        {note && <span>{note}</span>}
      </h3>
      <ul className="chips">
        {items.map((item) => (
          <li key={item}>
            <Chip name={item} icon={icon} />
          </li>
        ))}
      </ul>
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
        <ChipGroup key={skill.group} label={skill.group} note={skill.note} items={skill.items} icon={false} />
      ))}
    </Section>
  )
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="topbar">
        <div className="topbar-inner">
          <a className="handle" href="#top">
            {profile.handle}
          </a>
          <nav aria-label="Sections">
            {sections.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="main">
        <div className="hero" id="top">
          <div className="identity">
            <img className="avatar" src={profile.avatar} alt={`Portrait of ${profile.name}`} width="136" height="136" />
            <div>
              <h1>{profile.name}</h1>
              <p className="other-titles">{profile.otherTitles.join(' · ')}</p>
              <ul className="socials">
                <li>
                  <a href={profile.github} aria-label="GitHub" title="GitHub">
                    <TechIcon name="GitHub" size={20} />
                  </a>
                </li>
                <li>
                  <a href={profile.linkedin} aria-label="LinkedIn" title="LinkedIn">
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
          </div>

          <p className="headline">
            <strong>{profile.title}</strong> – {profile.intro}
          </p>

          <p className="stack-line">
            My experience spans
            {profile.stack.map((item) => (
              <Chip key={item} name={item} />
            ))}
            and database-driven applications.
          </p>

          <p className="focus">{profile.focus}</p>

          <p className="location">
            <MapPin size={15} aria-hidden="true" />
            {profile.location}
          </p>

          <div className="actions">
            <a className="button primary" href="#contact">
              Get in Touch
              <ChevronRight size={16} aria-hidden="true" />
            </a>
            {profile.resume && (
              <a className="button" href={profile.resume}>
                Resume
                <FileText size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        <Technologies />

        <Section id="projects" title="Projects">
          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.name}>
                <div className={`project-visual ${project.tone}`} aria-hidden="true">
                  <div className="project-window">
                    <strong>{project.short}</strong>
                    <span>{project.tagline}</span>
                  </div>
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
                    <a href={project.link}>
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
                      <a href={item.link}>
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
                <a className="blog-card" href={post.link} key={post.title}>
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

        <Section id="uses" title="Uses" action={<span className="section-note">Gear &amp; Setup</span>}>
          <ul className="uses">
            {uses.map((item) => (
              <li key={item.name}>
                <div className="uses-head">
                  <h3>
                    {item.name}
                    <span>· {item.category}</span>
                  </h3>
                  {item.link && (
                    <a href={item.link} aria-label={`Visit ${item.name}`}>
                      Visit
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="activity" title="GitHub Activity">
          <GitHubActivity />
        </Section>

        <Section id="about" title="About">
          <div className="prose">
            {about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ChipGroup label="Currently exploring" items={exploring} icon={false} />
        </Section>

        <Section id="contact" title="Let's Connect">
          <div className="prose">
            <p>{connect}</p>
          </div>
          <div className="actions">
            <a className="button primary" href={`mailto:${profile.email}`}>
              <Mail size={16} aria-hidden="true" />
              {profile.email}
            </a>
            <a className="button" href={profile.linkedin}>
              <LinkedInIcon size={16} />
              LinkedIn
            </a>
            <a className="button" href={profile.github}>
              <TechIcon name="GitHub" />
              GitHub
            </a>
            {profile.resume && (
              <a className="button" href={profile.resume}>
                <FileText size={16} aria-hidden="true" />
                Resume
              </a>
            )}
          </div>
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
