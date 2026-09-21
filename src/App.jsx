import { lazy, Suspense, useEffect, useRef, useState } from 'react'
const Notebook = lazy(() => import('@jupyter-kit/react').then((module) => ({ default: module.Notebook })))
import './App.css'
import '@jupyter-kit/theme-default/default.css'

const scenes = [
  { id: 'system', number: '01', label: 'System' },
  { id: 'projects', number: '02', label: 'Build index' },
  { id: 'ai', number: '03', label: 'AI lab' },
  { id: 'architecture', number: '04', label: 'Architecture' },
  { id: 'evidence', number: '05', label: 'Verification' },
  { id: 'human', number: '06', label: 'Human note' },
  { id: 'contact', number: '07', label: 'Contact' },
]

const projects = [
  {
    name: 'RAG Research Agent', status: 'DOCUMENTED', description: 'An agent that decides whether to search, query stored knowledge, or stop and answer.', live_url: null, github_url: 'https://github.com/marlikkodes/rag-research-agent', documentation_url: 'local:/rag-research-agent/README.md', technologies: ['Python', 'ChromaDB', 'RAG', 'Agents'], category: 'AI systems', year: '2026', role: 'Builder', problem: 'A retrieval agent needs to choose its next step without searching forever.', system: 'Search, vector memory, bounded orchestration, and a streaming UI.', architecture: 'Model → tool choice → source or memory → bounded loop → answer', key_decisions: ['Hard step ceiling', 'Explicit stop rule', 'Typed streaming updates'], current_status: 'Local repository and public GitHub source available.', evidence: ['README', 'app.py', 'src/', 'tests/'], flow: ['MODEL', 'CONTEXT', 'TOOL', 'MEMORY', 'ANSWER'],
  },
  {
    name: 'HasteHealth Platform', status: 'DOCUMENTED', description: 'A headless EHR platform for serving FHIR R4 clinical data to apps, analytics, and AI agents.', live_url: null, github_url: 'https://github.com/marlikkodes/hastehealth-platform', documentation_url: 'local:/hastehealth-platform/README.md', technologies: ['FHIR R4', 'Rust', 'PostgreSQL', 'Elasticsearch', 'Docker'], category: 'Healthcare infrastructure', year: '2026', role: 'Contributor', problem: 'Clinical data needs a structured backend that can serve many product surfaces.', system: 'Server, worker, admin app, PostgreSQL, Elasticsearch, and containerized services.', architecture: 'FHIR data → server → worker/indexing → search and admin surfaces', key_decisions: ['Headless data layer', 'Background indexing', 'Local compose workflow'], current_status: 'Local repository and public GitHub source available.', evidence: ['README', 'docker-compose.yml', 'backend/', 'frontend/'], flow: ['FHIR', 'SERVER', 'WORKER', 'SEARCH', 'APPS'],
  },
  {
    name: 'Blockchain Wallet App', status: 'ARCHIVED', description: 'A wallet project record containing account and Bitcoin/Ethereum transaction artifacts.', live_url: null, github_url: 'https://github.com/marlikkodes/blockchain-wallet-app', documentation_url: 'local:/blockchain-wallet-app/README.md', technologies: ['Python', 'Bitcoin', 'Ethereum', 'Wallets'], category: 'Blockchain', year: '2026', role: 'Builder', problem: 'Make account and transaction concepts inspectable through a concrete wallet workflow.', system: 'Wallet implementation, account screenshots, and transaction records.', architecture: 'Account → wallet logic → network transaction → visual record', key_decisions: ['Separate transaction artifacts', 'Keep the wallet inspectable'], current_status: 'Historical local project. Public GitHub source available; no active deployment claimed.', evidence: ['README', 'wallet/', 'assignment.md', 'transaction images'], flow: ['ACCOUNT', 'WALLET', 'SIGN', 'NETWORK', 'RECORD'],
  },
  {
    name: 'Galactic TrailBlaze', status: 'DOCUMENTED', description: 'An immersive solar-system and exoplanet exploration portal with 3D views and orbital simulation.', live_url: null, github_url: 'https://github.com/marlikkodes/nasa-space-apps-portal', documentation_url: 'local:/nasa-space-apps-portal/README.md', technologies: ['HTML', 'CSS', 'JavaScript', 'WebGL', '3D'], category: 'Interactive web', year: '2026', role: 'Builder', problem: 'Make planetary and exoplanetary data explorable rather than flat.', system: 'Web pages, 3D models, media, catalogue views, and interactive controls.', architecture: 'Catalogue data → interface → 3D scene → orbital interaction', key_decisions: ['Browser-first experience', 'Use spatial exploration', 'Separate catalogue surfaces'], current_status: 'Local repository and public GitHub source available.', evidence: ['README', '3D Models/', 'ExoPlanets HTML/', 'SolarPlanets HTML/'], flow: ['DATA', 'CATALOGUE', 'SCENE', 'ORBIT', 'DISCOVERY'],
  },
  {
    name: 'E-Commerce Performance Analysis', status: 'DOCUMENTED', description: 'A business performance analysis covering customer growth, product quality, and payment methods.', live_url: null, github_url: 'https://github.com/marlikkodes/ecommerce-performance-dashboard', documentation_url: 'local:/ecommerce-performance-dashboard/README.md', technologies: ['PostgreSQL', 'SQL', 'Data analysis', 'Reporting'], category: 'Data systems', year: '2026', role: 'Analyst / builder', problem: 'Turn operational commerce data into decisions around customers, products, and payments.', system: 'Datasets, SQL queries, ERD, reports, and interpreted business metrics.', architecture: 'Tables → queries → analysis → report → decision support', key_decisions: ['Model relationships first', 'Separate exploration from reporting'], current_status: 'Local repository and public GitHub source available.', evidence: ['README', 'Data/', 'Query/', 'Reports/'], flow: ['TABLES', 'SQL', 'METRICS', 'REPORT', 'DECISIONS'],
  },
]

const projectLanguages = {
  'RAG Research Agent': ['Python'],
  'HasteHealth Platform': ['Rust', 'TypeScript', 'SQL'],
  'Blockchain Wallet App': ['Python'],
  'Galactic TrailBlaze': ['JavaScript', 'HTML', 'CSS'],
  'E-Commerce Performance Analysis': ['SQL'],
}

function languagesFor(project) {
  return projectLanguages[project.name] || project.technologies
}

const fallbackRepositories = [
  ['titanstream', 'TypeScript', 'Financial / messaging infrastructure', 'https://github.com/marlikkodes/titanstream', 'FEATURED PROJECT'],
  ['hastehealth-platform', 'Rust', 'Headless healthcare infrastructure', 'https://github.com/marlikkodes/hastehealth-platform', 'FEATURED PROJECT'],
  ['reel-agentic-engineering', 'TypeScript', 'Agentic engineering workspace', 'https://github.com/marlikkodes/reel-agentic-engineering', 'FEATURED PROJECT'],
  ['rag-research-agent', 'Python', 'Bounded retrieval and agent loops', 'https://github.com/marlikkodes/rag-research-agent', 'FEATURED PROJECT'],
  ['react-storefront', 'JavaScript', 'Commerce interface and product flows', 'https://github.com/marlikkodes/react-storefront', 'SUPPORTING PROJECT'],
  ['sportssphere', 'JavaScript', 'Sports product experience', 'https://github.com/marlikkodes/sportssphere', 'SUPPORTING PROJECT'],
  ['portfolio-3d-showcase', 'JavaScript', 'Interactive 3D presentation', 'https://github.com/marlikkodes/portfolio-3d-showcase', 'SUPPORTING PROJECT'],
  ['blockchain-wallet-app', 'Python', 'Wallet and transaction records', 'https://github.com/marlikkodes/blockchain-wallet-app', 'ARCHIVED'],
  ['nasa-space-apps-portal', 'JavaScript', 'Solar system and exoplanet exploration', 'https://github.com/marlikkodes/nasa-space-apps-portal', 'SUPPORTING PROJECT'],
  ['ecommerce-performance-dashboard', 'SQL', 'Commerce performance analysis', 'https://github.com/marlikkodes/ecommerce-performance-dashboard', 'SUPPORTING PROJECT'],
  ['signledger', 'JavaScript', 'Signing and ledger experiment', 'https://github.com/marlikkodes/signledger', 'EXPERIMENT'],
  ['revamp-ai', 'JavaScript', 'AI product experiment', 'https://github.com/marlikkodes/revamp-ai', 'EXPERIMENT'],
  ['seller-store', 'JavaScript', 'Seller commerce workflow', 'https://github.com/marlikkodes/seller-store', 'DEMO / PRACTICE'],
  ['shop-storefront', 'JavaScript', 'Storefront experiment', 'https://github.com/marlikkodes/shop-storefront', 'DEMO / PRACTICE'],
  ['nft-card-game', 'JavaScript', 'Web3 game experiment', 'https://github.com/marlikkodes/nft-card-game', 'EXPERIMENT'],
  ['agentcore-harness', 'Python', 'Agent runtime harness', 'https://github.com/marlikkodes/agentcore-harness', 'EXPERIMENT'],
]

const capacityGroups = [
  { title: 'ENGINEERING', capacities: ['Systems Engineer', 'Full-Stack Developer', 'Technical Architect'] },
  { title: 'AI', capacities: ['AI Systems Engineer', 'Agent / Workflow Builder'] },
  { title: 'INFRASTRUCTURE', capacities: ['Infrastructure Engineer', 'Deployment / Systems Builder'] },
  { title: 'WEB3', capacities: ['Blockchain Developer', 'Web3 Systems Builder'] },
  { title: 'PRODUCT', capacities: ['Technical Product Builder', 'Founder'] },
  { title: 'LEADERSHIP', capacities: ['Technical Lead', 'Technology Strategist'] },
  { title: 'ENABLEMENT', capacities: ['Technical Educator', 'AI / Technology Trainer'] },
  { title: 'SECURITY', capacities: ['Security Research / Testing'] },
]

const capabilityAtlas = [
  { title: 'LANGUAGES', items: ['Python', 'JavaScript', 'TypeScript', 'Rust', 'SQL', 'HTML / CSS', 'Bash'], evidence: 'RAG agent, HasteHealth, storefronts, analysis, web portals' },
  { title: 'SOFTWARE ARCHITECTURE', items: ['APIs', 'Service-oriented systems', 'Async jobs', 'Stateful systems', 'Authentication', 'External integrations'], evidence: 'RAG orchestration, HasteHealth services, commerce systems' },
  { title: 'AI SYSTEMS', items: ['LLMs', 'SLMs', 'RAG', 'Agents', 'Memory / state', 'Tool use', 'Orchestration', 'AI-assisted development'], evidence: 'RAG Research Agent, agentic engineering workspace' },
  { title: 'INFRASTRUCTURE', items: ['Linux', 'Containers', 'Cloud deployment', 'Networking', 'Process management', 'Service debugging', 'Git / GitHub'], evidence: 'Dockerized platform work, repositories, local systems practice' },
  { title: 'DATA SYSTEMS', items: ['Relational databases', 'SQL', 'Schema design', 'Data integrity', 'Operational data', 'Business intelligence'], evidence: 'E-Commerce Performance Analysis, HasteHealth data layer' },
  { title: 'BLOCKCHAIN SYSTEMS', items: ['Wallet architecture', 'Transaction flows', 'Bitcoin / Ethereum', 'On-chain / off-chain thinking', 'Web3 integrations'], evidence: 'Blockchain Wallet App and transaction records' },
  { title: 'AUTOMATION', items: ['Business workflows', 'API orchestration', 'Messaging workflows', 'AI automation', 'Scheduled processes'], evidence: 'Agent loops, automation projects, system integrations' },
  { title: 'SECURITY', items: ['Access control', 'Authentication / authorization', 'Input validation', 'Secrets handling', 'Security testing', 'System investigation'], evidence: 'Wallet, platform, Linux and application-system practice' },
]

const engineeringReasoning = [
  ['RELIABILITY', 'What happens when a dependency fails, a request repeats, or a service returns an unexpected response?'],
  ['STATE', 'Where does truth live, how does it persist, and what must survive the next agent step or user action?'],
  ['SECURITY', 'Who is allowed to act, what can they access, and where should the boundary be enforced?'],
  ['DATA INTEGRITY', 'How do transactions, identities, payments, and concurrent writes remain consistent?'],
  ['TRADE-OFFS', 'What is the simplest architecture that meets the real constraint without hiding future cost?'],
]

const roleAudit = [
  { organization: 'Kled Technologies Ltd', role: 'Founder & CEO', status: 'Needs dates / scope verification' },
  { organization: 'myKaZi', role: 'Founder / Developer', status: 'Needs dates / project record verification' },
  { organization: 'Sick & Sickle Foundation', role: 'Founder & CEO', status: 'Needs dates / scope verification' },
  { organization: 'Green Guild Foundation', role: 'Director', status: 'Needs dates / scope verification' },
]

const professionalRoles = [
  'Systems Engineer',
  'Technical Architect',
  'Full-Stack Developer',
  'AI Systems Engineer',
  'Technical Product Builder',
]

function App() {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [booting, setBooting] = useState(() => sessionStorage.getItem('marlik-booted') !== 'true')
  const [experienceMode, setExperienceMode] = useState(() => sessionStorage.getItem('marlik-experience') === 'notebook' ? 'notebook' : 'cv')
  const [selectedProject, setSelectedProject] = useState(null)
  const [dragStart, setDragStart] = useState(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [transitioning, setTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState('next')
  const stageRef = useRef(null)
  const currentScene = scenes[sceneIndex]

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedProject) {
        if (event.key === 'Escape') setSelectedProject(null)
        return
      }
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault()
        setSceneIndex((index) => Math.min(index + 1, scenes.length - 1))
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setSceneIndex((index) => Math.max(index - 1, 0))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedProject, sceneIndex, transitioning])

  const goToScene = (nextIndex) => {
    const boundedIndex = Math.max(0, Math.min(nextIndex, scenes.length - 1))
    if (boundedIndex === sceneIndex || transitioning) return
    setTransitionDirection(boundedIndex > sceneIndex ? 'next' : 'previous')
    setTransitioning(true)
    window.setTimeout(() => {
      setSceneIndex(boundedIndex)
      setTransitioning(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 420)
  }
  const moveScene = (direction) => goToScene(sceneIndex + direction)
  const finishBoot = (mode) => { sessionStorage.setItem('marlik-booted', 'true'); sessionStorage.setItem('marlik-experience', mode); setExperienceMode(mode); setBooting(false) }
  const handlePointerDown = (event) => setDragStart({ x: event.clientX, y: event.clientY })
  const handlePointerUp = (event) => {
    if (!dragStart) return
    const distance = event.clientX - dragStart.x
    const atTop = window.scrollY <= 4
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
    if (Math.abs(distance) > 55 && ((distance < 0 && atBottom) || (distance > 0 && atTop))) moveScene(distance < 0 ? 1 : -1)
    setDragStart(null)
  }
  const handlePointerMove = (event) => {
    if (!stageRef.current || dragStart) return
    const bounds = stageRef.current.getBoundingClientRect()
    setParallax({ x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 10, y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 8 })
  }
  const handleWheel = (event) => {
    if (Math.abs(event.deltaY) < 16 || selectedProject) return
    const atTop = window.scrollY <= 4
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
    if ((event.deltaY > 0 && atBottom) || (event.deltaY < 0 && atTop)) moveScene(event.deltaY > 0 ? 1 : -1)
  }

  return <div className="sketchbook-app">
    <div className="paper-grid" aria-hidden="true" /><div className="grain" aria-hidden="true" />
    {booting && <BootSequence onFinish={finishBoot} />}
    {experienceMode === 'cv' ? <CvExperience projects={projects} onExplore={() => { sessionStorage.setItem('marlik-experience', 'notebook'); setExperienceMode('notebook') }} onOpenProject={setSelectedProject} /> : <>
    {transitioning && <div className={`page-turn page-turn-${transitionDirection}`} aria-hidden="true"><span className="page-edge" /><span className="graphite-smudge" /></div>}
    <header className="sketch-header"><button type="button" className="wordmark" onClick={() => goToScene(0)} aria-label="Return to Kyemba Marvin Systems"><span className="wordmark-small">KYEMBA MARVIN</span><strong>SYSTEMS</strong></button><div className="header-status"><span className="status-dot" /> notebook / {currentScene.number}</div><div className="notebook-header-actions"><button type="button" className="index-toggle" onClick={() => goToScene(sceneIndex === 1 ? 0 : 1)}>INDEX <span>☷</span></button><button type="button" className="exit-notebook" onClick={() => { sessionStorage.setItem('marlik-experience', 'cv'); setExperienceMode('cv') }}>EXIT NOTEBOOK <span>↗</span></button></div></header>
    <main ref={stageRef} className={`scene-stage scene-${currentScene.id}`} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} onWheel={handleWheel}><div className="scene-drawing" style={{ '--parallax-x': `${parallax.x}px`, '--parallax-y': `${parallax.y}px` }}>{currentScene.id === 'system' && <SystemScene onNext={() => moveScene(1)} />}{currentScene.id === 'projects' && <ProjectWall projects={projects} onOpen={setSelectedProject} />}{currentScene.id === 'ai' && <AiLab />}{currentScene.id === 'architecture' && <ArchitectureScene />}{currentScene.id === 'evidence' && <EvidenceScene projects={projects} onOpen={setSelectedProject} />}{currentScene.id === 'human' && <HumanScene />}{currentScene.id === 'contact' && <ContactScene />}</div><div className="scene-caption"><span>{currentScene.number}</span> / {currentScene.label}</div><div className="scene-controls" aria-label="Scene navigation"><button type="button" onClick={() => moveScene(-1)} disabled={sceneIndex === 0} aria-label="Previous scene">←</button><div className="scene-progress" aria-label={`${sceneIndex + 1} of ${scenes.length} scenes`}>{scenes.map((scene, index) => <button type="button" key={scene.id} className={index === sceneIndex ? 'active' : ''} onClick={() => goToScene(index)} aria-label={`Go to ${scene.label}`} />)}</div><button type="button" onClick={() => moveScene(1)} disabled={sceneIndex === scenes.length - 1} aria-label="Next scene">→</button></div></main>
    <nav className="notebook-index" aria-label="Notebook index"><div className="index-title">FIELD NOTES <span>drag / keys / touch</span></div>{scenes.map((scene, index) => <button type="button" key={scene.id} className={index === sceneIndex ? 'selected' : ''} onClick={() => goToScene(index)}><span>{scene.number}</span>{scene.label}</button>)}</nav>
    {selectedProject && <ProjectInspector project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </>}
  </div>
}

function CvExperience({ projects, onExplore, onOpenProject }) {
  const [repositories, setRepositories] = useState(fallbackRepositories.map(([name, language, description, url, classification]) => ({ name, language, description, html_url: url, classification })))

  useEffect(() => {
    fetch('https://api.github.com/users/marlikkodes/repos?per_page=100&sort=updated')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('GitHub unavailable')))
      .then((repos) => setRepositories(repos.map((repo) => ({ ...repo, classification: classifyRepository(repo.name) }))))
      .catch(() => {})
  }, [])

  const skillGroups = [
    ['SOFTWARE ENGINEERING', 'Full-stack development', 'APIs and backend systems', 'Databases', 'Authentication and authorization', 'Integrations', 'Automation', 'Debugging', 'Deployment'],
    ['AI SYSTEMS', 'LLM applications', 'SLMs and local experimentation', 'Custom GPTs', 'Agents and agent loops', 'Memory and state', 'Tool orchestration', 'AI-assisted development', 'AI automation'],
    ['INFRASTRUCTURE', 'Linux', 'Cloud deployment', 'Networking', 'Service debugging', 'Git and GitHub', 'Cloudflare', 'Databases and APIs', 'CI/CD'],
    ['BLOCKCHAIN', 'Smart contract concepts', 'Web3 applications', 'Wallet and payment systems', 'Blockchain integrations', 'Stablecoin infrastructure'],
  ]

  return <div className="cv-experience">
    <header className="cv-header"><div className="cv-identity"><span className="cv-name">KYEMBA MARVIN</span><span className="cv-location">Kampala, Uganda</span><span className="cv-address">Kisaasi, Bahai Road</span></div><div className="cv-title"><strong>Systems Engineer</strong><span>Technical Builder · AI Systems</span><div className="cv-role-line">{professionalRoles.join(' · ')}</div></div><div className="cv-links"><a href="mailto:marlikkodes@gmail.com">Email</a><a href="https://wa.me/256752762181" target="_blank" rel="noreferrer">WhatsApp ↗</a><a href="https://github.com/marlikkodes" target="_blank" rel="noreferrer">GitHub ↗</a><button type="button" onClick={() => window.print()}>Download CV PDF</button><button type="button" onClick={onExplore}>Explore notebook ↗</button></div></header>

    <main className="cv-main">
      <section id="cv-about" className="cv-section cv-intro"><div className="cv-section-label">PROFILE</div><div><h1>I build software systems, AI workflows, automation infrastructure, and blockchain applications.</h1><p>My work spans system architecture, full-stack development, AI integration, APIs, databases, cloud infrastructure, and technical problem solving. I care about making complex systems legible, testable, and useful.</p><div className="cv-focus-line">Software <span>·</span> AI <span>·</span> Infrastructure <span>·</span> Blockchain <span>·</span> Automation</div></div><span className="cv-note">read first<br />→ investigate second</span></section>
      <section id="cv-capacities" className="cv-section cv-capacities"><div className="cv-section-label">ROLES &amp; CAPACITIES</div><div><p className="section-lead">Professional capacities: the technical functions I have operated in across projects and organizations. These are not presented as simultaneous job titles.</p><div className="capacity-grid">{capacityGroups.map((group) => <article className="capacity-group" key={group.title}><h2>{group.title}</h2>{group.capacities.map((capacity) => <span key={capacity}>{capacity}</span>)}</article>)}</div></div></section>
      <section id="cv-work" className="cv-section cv-work"><div className="cv-section-label">WHAT I DO</div><div className="cv-do-grid"><DoCard title="BUILD SYSTEMS" text="Design and implement software from requirements through architecture, integration, debugging, and deployment." /><DoCard title="BUILD AI SYSTEMS" text="Work with models, agents, memory, tools, automation, and AI-assisted development to build practical systems." /><DoCard title="CONNECT SYSTEMS" text="Join APIs, databases, messaging, payment systems, external services, and internal workflows." /><DoCard title="SOLVE TECHNICAL PROBLEMS" text="Work across application, infrastructure, and system layers when something breaks." /><DoCard title="TURN IDEAS INTO SOFTWARE" text="Move from concept to architecture, implementation, deployment, and iteration." /></div></section>
      <section className="cv-section cv-snapshot"><div className="cv-section-label">TECHNICAL SNAPSHOT</div><div className="snapshot-grid"><div><strong>SOFTWARE</strong><p>Full-stack development · APIs · Databases · Integrations</p></div><div><strong>AI</strong><p>Agents · LLMs · SLMs · Custom GPTs · AI workflows</p></div><div><strong>INFRASTRUCTURE</strong><p>Linux · Cloud · Deployment · Networking · Debugging</p></div><div><strong>BLOCKCHAIN</strong><p>Smart contracts · Web3 · Stablecoins · Wallet systems</p></div><div><strong>AUTOMATION</strong><p>Business workflows · Messaging · Data · System automation</p></div><div><strong>SECURITY</strong><p>Access control · Application security · Security research</p></div></div></section>
      <section id="cv-skills" className="cv-section"><div className="cv-section-label">CORE TECHNICAL AREAS</div><div className="cv-skills-grid">{skillGroups.map(([title, ...items]) => <article className="cv-skill-group" key={title}><h2>{title}</h2>{items.map((item) => <button type="button" key={item} className="skill-item">{item}<span>↗</span></button>)}</article>)}</div></section>
      <section id="cv-atlas" className="cv-section cv-atlas"><div className="cv-section-label">TECHNICAL CAPABILITY ATLAS</div><div><p className="section-lead">Range is useful only when it is connected to work. Each domain below points back to the kind of systems where it has been applied.</p><div className="atlas-grid">{capabilityAtlas.map((domain) => <article className="atlas-domain" key={domain.title}><h2>{domain.title}</h2><div>{domain.items.map((item) => <span key={item}>{item}</span>)}</div><p><strong>Verification:</strong> {domain.evidence}</p></article>)}</div></div></section>
      <section id="cv-projects" className="cv-section"><div className="cv-section-label">SELECTED WORK</div><div className="cv-project-list">{projects.map((project, index) => <CvProject project={project} index={index} onOpen={() => onOpenProject(project)} key={project.name} />)}</div></section>
      <section id="cv-ai" className="cv-section cv-ai"><div className="cv-section-label">AI SYSTEMS</div><div><h2>Verification over labels.</h2><div className="ai-evidence-map"><span>Agents</span><span>Memory / state</span><span>Tools</span><span>Automation</span><span>Local models</span><span>AI-assisted development</span></div><a className="cv-inline-link" href="#cv-evidence">See technical verification ↓</a></div></section>
      <section id="cv-approach" className="cv-section cv-approach"><div className="cv-section-label">HOW I WORK</div><div><h2>Technical work is a full lifecycle.</h2><div className="approach-flow">{['Requirement', 'Constraints', 'Architecture', 'Implementation', 'Integration', 'Testing', 'Deployment', 'Monitoring / Debugging'].map((step, index) => <span key={step}><b>{String(index + 1).padStart(2, '0')}</b>{step}{index < 7 && <i>↓</i>}</span>)}</div></div><p className="cv-approach-note">I move from the problem to the system boundary, then stay close enough to the implementation to debug the real failure mode.</p></section>
      <section id="cv-reasoning" className="cv-section cv-reasoning"><div className="cv-section-label">ENGINEERING REASONING</div><div><p className="section-lead">The technology is usually the easy part. Understanding the constraint is the work.</p><div className="reasoning-list">{engineeringReasoning.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{text}</p></article>)}</div></div></section>
      <section id="cv-career" className="cv-section cv-career"><div className="cv-section-label">EXPERIENCE / ROLE AUDIT</div><div><p className="section-lead">Role records are kept separate from technical capacities. Dates and scope are intentionally marked for verification before publication.</p><div className="role-list">{roleAudit.map((role) => <article key={role.organization}><strong>{role.organization}</strong><span>{role.role}</span><small>{role.status}</small></article>)}</div></div></section>
      <section id="cv-evidence" className="cv-section cv-evidence"><div className="cv-section-label">VERIFICATION</div><div className="evidence-strip"><span>LOCAL PROJECT RECORDS <b>● INDEXED</b></span><span>ARCHITECTURE NOTES <b>● AVAILABLE</b></span><span>HISTORICAL WORK <b>○ ARCHIVED</b></span><span>PUBLIC LINKS <b>○ VERIFY BEFORE PUBLISHING</b></span></div><p>Verification is attached to the project records above. Public GitHub, live product, and documentation URLs remain unlinked until verified.</p></section>
      <section id="cv-github" className="cv-section cv-github"><div className="cv-section-label">OPEN SOURCE / CODE</div><div><div className="github-heading"><h2>{repositories.length} public repositories</h2><a href="https://github.com/marlikkodes" target="_blank" rel="noreferrer">View full GitHub ↗</a></div><div className="repo-list">{repositories.slice(0, 8).map((repo) => <a className="repo-row" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.name}><span><strong>{repo.name}</strong><small>{repo.description || 'Repository verification from the public profile.'}</small></span><span><b>{repo.language || 'Code'}</b><em>{repo.classification}</em></span><span>↗</span></a>)}</div><a className="cv-inline-link" href="https://github.com/marlikkodes?tab=repositories" target="_blank" rel="noreferrer">View all repositories ↗</a></div></section>
      <section id="cv-education" className="cv-section"><div className="cv-section-label">EDUCATION</div><div><h2>Continuous technical practice.</h2><p className="cv-muted">This CV emphasizes demonstrated systems, repository verification, and ongoing project work. Formal education details can be added when verified.</p></div></section>
    </main>
    <footer id="cv-contact" className="cv-footer"><div><span className="cv-section-label">CONTACT</span><h2>Available for technical product, AI systems, and infrastructure work.</h2></div><a href="mailto:marlikkodes@gmail.com">marlikkodes@gmail.com ↗</a></footer>
  </div>
}

function classifyRepository(name) {
  const featured = ['titanstream', 'hastehealth-platform', 'reel-agentic-engineering', 'rag-research-agent']
  const archived = ['blockchain-wallet-app']
  const experiments = ['signledger', 'revamp-ai', 'nft-card-game', 'agentcore-harness']
  const demos = ['seller-store', 'shop-storefront']
  if (featured.includes(name)) return 'FEATURED PROJECT'
  if (archived.includes(name)) return 'ARCHIVED'
  if (experiments.includes(name)) return 'EXPERIMENT'
  if (demos.includes(name)) return 'DEMO / PRACTICE'
  return 'SUPPORTING PROJECT'
}

function DoCard({ title, text }) { return <article className="do-card"><h2>{title}</h2><p>{text}</p><a href="#cv-evidence">View technical verification →</a></article> }

function CvProject({ project, index, onOpen }) {
  const depth = project.status === 'ARCHIVED' ? 'Documented record · Historical work' : 'Full implementation · Systems integration'
  return <article className="cv-project"><div className="cv-project-number">PROJECT {String(index + 1).padStart(2, '0')}</div><div className="cv-project-main"><div className="cv-project-heading"><div><h2>{project.name}</h2><p>{project.category} · {project.year}</p></div><span className={project.status === 'ARCHIVED' ? 'cv-status archived' : 'cv-status'}>{project.status === 'ARCHIVED' ? '○ ARCHIVED' : '● ' + project.status}</span></div><div className="cv-project-columns"><div><strong>ROLE</strong><p>{project.role}</p><strong>WHAT I BUILT</strong><p>{project.description}</p></div><div><strong>TECHNOLOGY</strong><p>{project.technologies.join(' · ')}</p><strong>SYSTEM</strong><p>{project.flow.join(' → ')}</p></div></div><div className="cv-project-depth"><span><strong>DEPTH</strong>{depth}</span><span><strong>VERIFICATION</strong>{project.github_url ? 'A — PUBLIC SOURCE' : 'B — LOCAL RECORD'}</span></div><div className="cv-project-actions">{project.live_url ? <a href={project.live_url} target="_blank" rel="noreferrer">LIVE PRODUCT ↗</a> : <span>LIVE URL NOT VERIFIED</span>}{project.github_url ? <a href={project.github_url} target="_blank" rel="noreferrer">ARCHITECTURE / VERIFICATION ↗</a> : <span>SOURCE URL NOT VERIFIED</span>}<button type="button" onClick={onOpen}>INSPECT RECORD ↗</button></div></div></article>
}

function BootSequence({ onFinish }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 2550)
    return () => window.clearTimeout(timer)
  }, [])

  return <div className="boot-screen" role="dialog" aria-label="Kyemba Marvin Systems boot sequence">
    <div className="boot-window">
      <div className="window-bar"><span>KYEMBA MARVIN SYSTEMS / TERMINAL</span><span>tty1 • 2026</span></div>
      <div className="boot-copy">
        <p className="terminal-caret">KYEMBA MARVIN SYSTEMS <span className="boot-cursor">█</span></p>
        <p className="boot-command">$ ./initialize-profile --interactive</p>
        <div className="boot-log" aria-live="polite">
          <p className="boot-line boot-line-1">[  OK  ] checking software systems</p>
          <p className="boot-line boot-line-2">[  OK  ] loading AI systems</p>
          <p className="boot-line boot-line-3">[  OK  ] mounting infrastructure</p>
          <p className="boot-line boot-line-4">[  OK  ] indexing blockchain work</p>
          <p className="boot-line boot-line-5">[  OK  ] starting automation layer</p>
          <p className="boot-line boot-line-6">[  OK  ] loading verification records</p>
        </div>
        <div className="boot-progress" aria-label="Boot progress"><span /><b>100%</b></div>
        <p className="boot-mount">mounting /marlik-notebook ... done</p>
        <p className={ready ? 'boot-ready boot-ready-visible' : 'boot-ready'}>technical profile loaded. READY.</p>
        <div className="boot-actions"><button type="button" className={ready ? 'boot-button boot-button-visible' : 'boot-button'} onClick={() => onFinish('cv')} disabled={!ready}>$ view technical CV <span>↵</span></button><button type="button" className={ready ? 'boot-button boot-button-visible boot-button-secondary' : 'boot-button boot-button-secondary'} onClick={() => onFinish('notebook')} disabled={!ready}>$ explore notebook <span>↵</span></button></div>
      </div>
    </div>
  </div>
}

  function SystemScene({ onNext }) { return <section className="scene-composition system-composition" aria-labelledby="system-title"><div className="annotation annotation-top">entry point / technical sketchbook</div><div className="system-copy"><p className="scene-kicker">01 / orientation</p><h1 id="system-title">Someone who<br /><em>understands</em><br />how things work.</h1><p className="scene-lede">AI systems, product infrastructure, and the useful space between an idea and a working system.</p><button type="button" className="drawn-button" onClick={onNext}>OPEN BUILD INDEX <span>→</span></button></div><div className="terminal-paper"><div className="terminal-heading">TERMINAL / KYEMBA MARVIN</div><p>&gt; whoami</p><p className="terminal-answer">Kyemba Marvin</p><p>&gt; status</p><p className="terminal-answer">BUILDING</p><p>&gt; principle</p><p className="terminal-answer">make it legible</p><span className="blink">_</span></div><StickyNote className="system-note-one" label="FIELD NOTE 01" text="Start with the constraint. The technology comes after." /><StickyNote className="system-note-two" label="MARGIN" text="read first → investigate second" /><div className="circle-note">start here<br />→</div><div className="cross-note">not a resume<br />△ a working notebook</div></section> }

  function ProjectWall({ projects, onOpen }) { return <section className="scene-composition project-composition project-wall-notebook" aria-labelledby="project-title"><div className="wall-heading"><p className="scene-kicker">02 / build index</p><h2 id="project-title">Systems built, studied,<br /><em>and made operational.</em></h2><p className="wall-subtitle">A working index of products, experiments, and technical practice.</p></div><div className="project-sheets">{projects.map((project, index) => <ProjectSheet key={project.name} project={project} index={index} onOpen={() => onOpen(project)} />)}</div><div className="margin-note">five records<br />one working notebook</div></section> }

function ProjectSheet({ project, index, onOpen }) {
  const [expanded, setExpanded] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragOrigin = useRef(null)
  const movedDuringDrag = useRef(false)
  const toggleExpanded = () => setExpanded((value) => !value)
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleExpanded()
    }
  }

  const handlePointerDown = (event) => {
    if (event.button !== 0) return
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragOrigin.current = { x: event.clientX - offset.x, y: event.clientY - offset.y }
    movedDuringDrag.current = false
    setDragging(true)
  }

  const handlePointerMove = (event) => {
    if (!dragOrigin.current) return
    event.stopPropagation()
    const nextOffset = { x: event.clientX - dragOrigin.current.x, y: event.clientY - dragOrigin.current.y }
    if (Math.abs(nextOffset.x - offset.x) > 3 || Math.abs(nextOffset.y - offset.y) > 3) movedDuringDrag.current = true
    setOffset(nextOffset)
  }

  const handlePointerUp = (event) => {
    event.stopPropagation()
    dragOrigin.current = null
    setDragging(false)
  }

  const handleClick = () => {
    if (movedDuringDrag.current) {
      movedDuringDrag.current = false
      return
    }
    toggleExpanded()
  }

  return <article className={`project-sheet field-card sheet-${index}${expanded ? ' expanded' : ''}${dragging ? ' dragging' : ''}`} style={{ '--drag-x': `${offset.x}px`, '--drag-y': `${offset.y}px` }} tabIndex="0" role="button" aria-expanded={expanded} onClick={handleClick} onKeyDown={handleKeyDown} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
    <span className="pin" aria-hidden="true" />{index === 0 && <span className="pen-test" aria-hidden="true">written in pen</span>}<div className="sheet-meta"><span>{project.category}</span><span>{project.status}</span></div><h3>{project.name}</h3><p>{project.description}</p><div className="mini-flow">{project.flow.slice(0, 4).map((step, stepIndex) => <span key={step}>{step}{stepIndex < 3 && <b>↓</b>}</span>)}</div>
    <div className="sheet-prospect"><strong>PROJECT PROSPECT</strong><p><b>Problem:</b> {project.problem}</p><p><b>System:</b> {project.system}</p><p><b>Architecture:</b> {project.architecture}</p><span className="prospect-hint">tap INSPECT for the full record</span></div>
    <div className="sheet-footer"><span className={project.live_url ? 'live' : 'record'}>{project.live_url ? '● LIVE' : '○ RECORD'}</span><button type="button" onClick={(event) => { event.stopPropagation(); onOpen() }}>INSPECT ↗</button></div>
  </article>
}

function AiLab() { return <section className="scene-composition ai-composition" aria-labelledby="ai-title"><div className="lab-heading"><p className="scene-kicker">03 / ai lab</p><h2 id="ai-title">The loop is the<br /><em>interesting part.</em></h2><p>Not brands. Not magic. Context, tools, memory, evaluation, and the next useful action.</p></div><div className="agent-loop" aria-label="Agent loop diagram"><div className="loop-node node-model">MODEL</div><div className="loop-arrow">↓</div><div className="loop-node node-context">CONTEXT + MEMORY</div><div className="loop-arrow">↓</div><div className="loop-node node-reason">REASON</div><div className="loop-arrow">↓</div><div className="loop-node node-act">TOOLS / ACTION</div><div className="loop-arrow arrow-loop">↺</div><div className="loop-note">observe → evaluate<br />→ state → next action</div></div><StickyNote className="ai-note-one" label="LAB NOTE" text="AI is an engineering medium, not a product badge." /><StickyNote className="ai-note-two" label="TEST QUESTION" text="What must persist when the next step begins?" /><div className="lab-notes"><span>custom GPTs</span><span>agents</span><span>local models</span><span>automation</span><span>tool use</span><span>SLMs</span></div></section> }

function ArchitectureScene() { return <section className="scene-composition architecture-composition" aria-labelledby="architecture-title"><div className="architecture-heading"><p className="scene-kicker">04 / architecture</p><h2 id="architecture-title">Draw the boundary.<br /><em>Then make it useful.</em></h2></div><div className="architecture-map"><ArchBox label="PRODUCT" note="intent / interface" className="arch-product" /><ArchBox label="SERVICES" note="logic / APIs" className="arch-services" /><ArchBox label="DATA" note="state / memory" className="arch-data" /><ArchBox label="AI TOOLS" note="reason / act" className="arch-ai" /><ArchBox label="INFRA" note="ship / observe" className="arch-infra" /><div className="arch-line line-product" /><div className="arch-line line-data" /><div className="arch-line line-ai" /><div className="arch-line line-infra" /></div><StickyNote className="architecture-note-one" label="DESIGN CHECK" text="Where does state live? Who owns failure?" /><StickyNote className="architecture-note-two" label="ANNOTATION" text="Keep boundaries visible. Hide accidental complexity." /><div className="architecture-note">good systems leave<br />room for the next idea</div></section> }
function ArchBox({ label, note, className }) { return <div className={`arch-box ${className}`}><strong>{label}</strong><span>{note}</span></div> }

function EvidenceScene({ projects, onOpen }) {
  const evidence = projects.map((project) => ({
    project,
    kind: project.status === 'ARCHIVED' ? 'HISTORICAL RECORD' : 'SOURCE REPOSITORY',
    proof: project.status === 'ARCHIVED' ? 'Historical source and transaction artifacts preserved.' : `${project.evidence.slice(0, 2).join(' + ')} indexed in the repository.`,
  }))
  return <section className="scene-composition evidence-composition" aria-labelledby="evidence-title"><div className="evidence-heading"><p className="scene-kicker">05 / verification board</p><h2 id="evidence-title">What can be<br /><em>checked.</em></h2><p className="evidence-intro">A source trail for the work: repositories, technical records, historical status, and the boundary between what is public and what still needs confirmation.</p></div><div className="evidence-board">{evidence.map((item, index) => <article className={`evidence-pin pin-${index}`} key={item.project.name} tabIndex="0"><span className="tape" aria-hidden="true" /><div className="evidence-pin-top"><span>RECORD {String(index + 1).padStart(2, '0')}</span><b>{item.project.status === 'ARCHIVED' ? 'ARCHIVED' : 'VERIFIED SOURCE'}</b></div><h3>{item.project.name}</h3><p className="evidence-kind">{item.kind}</p><p className="evidence-proof">{item.proof}</p><div className="evidence-pin-footer"><span>{item.project.technologies.slice(0, 2).join(' · ')}</span><button type="button" onClick={() => onOpen(item.project)}>OPEN RECORD ↗</button></div></article>)}</div><div className="evidence-footer">PUBLIC SOURCE means a verified repository link. LIVE PRODUCT is only shown when an actual live URL has been supplied.</div></section>
}

function HumanScene() { return <section className="scene-composition human-composition" aria-labelledby="human-title"><div className="human-paper"><p className="scene-kicker">06 / margin note</p><h2 id="human-title">I like understanding<br /><em>how things work.</em></h2><div className="hand-line" /><h3>And then building them.</h3><p className="human-copy">The technical work matters because it changes what people can do. The notebook is just a way to keep the system honest.</p><span className="signature">— Kyemba Marvin</span></div><StickyNote className="human-note-one" label="PERSONAL NOTE" text="Stay curious. Make the complicated useful." /><div className="human-doodle">less theater<br /><span>more signal</span></div></section> }

function ContactScene() { return <section className="scene-composition contact-composition" aria-labelledby="contact-title"><div className="contact-card"><p className="scene-kicker">07 / desk terminal</p><h2 id="contact-title">Have a system<br /><em>worth making?</em></h2><p>For technical product, AI systems, and infrastructure work:</p><a className="drawn-button contact-button" href="mailto:marlikkodes@gmail.com">marlikkodes@gmail.com <span>↗</span></a><div className="contact-line">[ channel open ]</div></div><StickyNote className="contact-note-one" label="NEXT ACTION" text="Send a brief. Start with the constraint." /><div className="desk-terminal"><div>&gt; close_notebook</div><div>&gt; keep_building</div><div className="terminal-answer">done.</div></div></section> }

function StickyNote({ className, label, text }) { return <aside className={`notebook-sticky ${className}`}><span className="sticky-tape" aria-hidden="true" /><strong>{label}</strong><p>{text}</p></aside> }

function ProjectInspector({ project, onClose }) { return <div className="inspector-backdrop" role="dialog" aria-modal="true" aria-labelledby="inspector-title" onClick={onClose}><article className="project-inspector" onClick={(event) => event.stopPropagation()}><div className="inspector-top"><span>PROJECT INSPECTION / {project.category}</span><button type="button" onClick={onClose} aria-label="Close project inspection">ESC ×</button></div><div className="inspector-grid"><div><p className="scene-kicker">{project.status} / {project.year}</p><h2 id="inspector-title">{project.name}</h2><p className="inspector-description">{project.description}</p><div className="inspector-flow">{project.flow.map((step, index) => <span key={step}>{step}{index < project.flow.length - 1 && <b>→</b>}</span>)}</div></div><div className="inspector-details"><Detail label="PROBLEM" text={project.problem} /><Detail label="SYSTEM" text={project.system} /><Detail label="ARCHITECTURE" text={project.architecture} /><Detail label="CURRENT STATUS" text={project.current_status} /></div></div><div className="inspector-bottom"><div className="inspector-stack">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div><div className="inspector-actions">{project.live_url ? <a className="drawn-button" href={project.live_url} target="_blank" rel="noreferrer">ENTER LIVE PRODUCT ↗</a> : <span className="unavailable">LIVE URL NOT VERIFIED</span>}{project.github_url ? <a className="text-link" href={project.github_url} target="_blank" rel="noreferrer">VIEW SOURCE ↗</a> : <span className="unavailable">SOURCE URL NOT VERIFIED</span>}</div></div><div className="inspector-evidence"><strong>TECHNICAL RECORD</strong>{project.evidence.map((item) => <span key={item}>{item}</span>)}</div><ProjectNotebook project={project} /></article></div> }

function ProjectNotebook({ project }) {
  const notebook = { cells: [
    { cell_type: 'markdown', metadata: { language: 'markdown' }, source: [`# ${project.name}`, '', `**Status:** ${project.status}`, '', project.description] },
    { cell_type: 'markdown', metadata: { language: 'markdown' }, source: ['## Problem', '', project.problem, '', '## System', '', project.system] },
    { cell_type: 'code', execution_count: null, metadata: { language: 'text' }, outputs: [], source: [project.flow.join(' -> ')] },
    { cell_type: 'markdown', metadata: { language: 'markdown' }, source: ['## Architecture', '', project.architecture, '', `**Languages:** ${languagesFor(project).join(' · ')}`, '', `**Technologies:** ${project.technologies.join(' · ')}`] },
  ] }

  return <section className="project-notebook" aria-label={`${project.name} technical notebook`}><div className="project-notebook-header"><span>TECHNICAL RECORD / JUPYTER VIEW</span><span>read-only</span></div><Suspense fallback={<div className="notebook-loading">loading technical record...</div>}><Notebook ipynb={notebook} language="text" /></Suspense></section>
}
function Detail({ label, text }) { return <div className="detail-block"><strong>{label}</strong><p>{text}</p></div> }

export default App