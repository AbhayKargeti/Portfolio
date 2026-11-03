import type { ReactNode } from 'react'
import { about, connect, experience, exploring, profile, projects, skills } from './content'

const sections = [
  ['about', 'About'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
]

function Section({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-heading`}>
      <h2 className="section-label" id={`${id}-heading`}>
        {label}
      </h2>
      <div className="section-body">{children}</div>
    </section>
  )
}

export default function App() {
  const links = [
    { label: 'LinkedIn', href: profile.linkedin },
    { label: 'GitHub', href: profile.github },
    ...(profile.resume ? [{ label: 'Resume', href: profile.resume }] : []),
  ]

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="topbar">
        <a className="mark" href="#top" aria-label={`${profile.name}, back to top`}>
          AK
        </a>
        <nav aria-label="Sections">
          {sections.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main id="main">
        <div className="hero" id="top">
          <h1>{profile.name}</h1>
          <ul className="titles">
            {profile.titles.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
          <p className="intro">{profile.intro}</p>
          <p>{profile.focus}</p>
          <p className="location">{profile.location}</p>
        </div>

        <Section id="about" label="About">
          {about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Section>

        <Section id="experience" label="Experience">
          {experience.map((job) => (
            <article className="entry" key={job.company}>
              <div className="entry-head">
                <h3>{job.company}</h3>
                <span className="meta">{job.period}</span>
              </div>
              <p className="role">{job.role}</p>
              <ul className="points">
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </Section>

        <Section id="projects" label="Projects">
          {projects.map((project) => (
            <article className="entry" key={project.name}>
              <h3>{project.name}</h3>
              <p className="meta">{project.kind}</p>
              <p>{project.summary}</p>
              {project.areas.length > 0 && (
                <ul className="areas">
                  {project.areas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              )}
              <p className="tech">{project.tech.join(' / ')}</p>
              {project.link && (
                <a className="arrow-link" href={project.link}>
                  View repository
                </a>
              )}
            </article>
          ))}
        </Section>

        <Section id="skills" label="Skills">
          <dl className="skills">
            {skills.map((skill) => (
              <div key={skill.group}>
                <dt>
                  {skill.group}
                  {skill.note && <span className="meta">{skill.note}</span>}
                </dt>
                <dd>{skill.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
          <h3 className="subhead">Currently exploring</h3>
          <ul className="points">
            {exploring.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </Section>

        <Section id="contact" label="Contact">
          <p>{connect}</p>
          <a className="email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <ul className="contact-links">
            {links.map((link) => (
              <li key={link.label}>
                <a className="arrow-link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </>
  )
}
