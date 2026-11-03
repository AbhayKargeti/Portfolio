export const newTab = { target: '_blank', rel: 'noopener noreferrer' }

export const profile = {
  name: 'Abhay Kargeti',
  handle: '@abhaykargeti',
  avatar: '/avatar.jpg',
  title: 'Fullstack AI Engineer',
  intro:
    'I build scalable web applications, enterprise software, and backend systems with a focus on solving real-world problems.',
  highlights: ['scalable web applications', 'enterprise software', 'backend systems'],
  stack: ['Laravel', 'PHP', 'Java', 'Spring Boot', 'React', 'TypeScript'],
  focus:
    "I’m passionate about software engineering, system design, emerging AI technologies, and building products that combine functionality with thoughtful user experiences.",
  email: 'abhaykargeti1947@gmail.com',
  linkedin: 'https://in.linkedin.com/in/abhaykargeti',
  github: 'https://github.com/AbhayKargeti',
  githubUser: 'AbhayKargeti',
  topRepos: ['community-reporter', 'Portfolio'],
  // The resume link is shown on the site as soon as this is filled in.
  resume: 'https://drive.google.com/file/d/1LBR-zxJJaF0j99mNMHlvBzhl05sFCNwJ/view?usp=drivesdk',
}

export const about = [
  "I’m a software developer who enjoys working across the stack, from designing backend architecture and REST APIs to building interactive frontend experiences.",
  "I’ve worked on enterprise-level applications involving asset lifecycle management, inventory, procurement, financial workflows, and third-party integrations.",
  "Beyond traditional software development, I’ve learned how LLMs, RAG, AI agents, and intelligent automation work, and I keep going deeper to understand how the next generation of software will be built.",
  'I believe in continuous learning, practical problem-solving, and building software that makes a meaningful difference.',
]

export const experience = [
  {
    company: 'Hisync Pvt. Ltd.',
    role: 'Software Developer',
    period: '2025 – Present',
    points: [
      'Contributing to the development of an Enterprise Asset Management (EAM) platform.',
      'Developing full-stack features using Laravel, React, TypeScript, and MySQL.',
      'Working across asset management, inventory, procurement, maintenance, and financial workflows.',
      'Developing REST APIs and integrations with external enterprise services.',
      'Contributing to system architecture, business logic, and database operations.',
    ],
  },
  {
    company: 'SYR Consultancy – IRCTC Project',
    role: 'Java Developer',
    period: '8 months',
    points: [
      'Worked with Java-based enterprise applications.',
      'Utilized Java, Servlets, JSP, Spring Boot, and Oracle SQL.',
      'Contributed to backend development and application functionality.',
    ],
  },
  {
    company: 'Drupal Builder Pvt. Ltd.',
    role: 'PHP / Laravel Developer',
    period: '1 year',
    points: [
      'Worked on backend web application development using PHP and Laravel.',
      'Developed application features and database-driven functionality.',
      'Worked with MySQL and web technologies.',
    ],
  },
]

export const projects = [
  {
    name: 'HISYNC – Enterprise Asset Management Platform',
    short: 'HISYNC',
    tagline: 'Enterprise Asset Management',
    tone: 'blue',
    kind: 'Professional project',
    summary:
      'A comprehensive enterprise platform designed to manage the complete lifecycle of organizational assets.',
    areas: [
      'Asset Lifecycle Management',
      'Inventory & Stock Management',
      'Fixed Asset Register & Capitalization',
      'Preventive & Corrective Maintenance',
      'Procurement & Vendor Management',
      'Financial Accounting Integrations',
      'E-Invoice & E-Way Bill Integrations',
    ],
    tech: ['Laravel', 'PHP', 'React', 'TypeScript', 'MySQL', 'Redis', 'Docker'],
    link: '',
  },
  {
    name: 'Community Reporter',
    short: 'Community Reporter',
    tagline: 'Report local issues',
    tone: 'green',
    kind: 'Personal project · In progress',
    summary:
      'A community-driven platform focused on helping citizens report local issues and enabling better communication between communities and responsible authorities.',
    areas: [],
    tech: ['Laravel', 'React', 'MySQL'],
    link: 'https://github.com/AbhayKargeti/community-reporter',
  },
]

export const skills = [
  {
    group: 'Backend',
    scrolling: true,
    items: ['PHP', 'Laravel', 'Java', 'Spring Boot', 'Hibernate', 'Servlets', 'JSP', 'REST API Development'],
  },
  {
    group: 'Frontend',
    scrolling: true,
    items: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap'],
  },
  {
    group: 'Databases & Infrastructure',
    scrolling: true,
    items: ['MySQL', 'Oracle SQL', 'Redis', 'Docker', 'Laravel Sail', 'Git', 'GitHub'],
  },
  {
    group: 'Core Concepts',
    plain: true,
    items: [
      'Object-Oriented Programming',
      'Data Structures & Algorithms',
      'Database Design',
      'Software Architecture',
      'Enterprise Application Development',
    ],
  },
  {
    group: 'AI & LLM Technologies',
    note: "Technologies I’ve learned",
    items: [
      'Generative AI and LLMs',
      'Retrieval-Augmented Generation (RAG)',
      'LLM API Integration',
      'AI Agents and Agentic Workflows',
      'AI Automation',
    ],
  },
]

export const exploring = [
  'LLM-powered applications',
  'System Design and Scalable Architecture',
  'Advanced Data Structures & Algorithms',
]

// The Open Source, Blogs, and quote sections appear as soon as these have content.
export const openSource: {
  name: string
  description: string
  link: string
  prs: number
  issues: number
}[] = []

export const blogs: {
  title: string
  date: string
  readTime: string
  excerpt: string
  tags: string[]
  link: string
}[] = []

export const quote: { text: string; author: string } | null = null

export const connect =
  "I’m always interested in discussing software engineering, interesting projects, emerging technologies, and opportunities to build something meaningful."
