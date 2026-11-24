import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { ProblemStatement } from './data/hackathonConfig'
import { hackathonConfig } from './data/hackathonConfig'

const navItems = [
  ['home', 'Home'],
  ['about', 'About'],
  ['tracks', 'Tracks'],
  ['problem-statements', 'Challenges'],
  ['timeline', 'Timeline'],
  ['prizes', 'Prizes'],
  ['faq', 'FAQ'],
] as const

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  if (name === 'arrow') return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7" /></svg>
  if (name === 'arrowUp') return <svg {...common}><path d="M12 19V5m-7 7 7-7 7 7" /></svg>
  if (name === 'close') return <svg {...common}><path d="m18 6-12 12M6 6l12 12" /></svg>
  if (name === 'menu') return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
  if (name === 'spark') return <svg {...common}><path d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></svg>
  if (name === 'plus') return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>
  if (name === 'external') return <svg {...common}><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></svg>
  return <svg {...common}><circle cx="12" cy="12" r="8.5" /></svg>
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <a className={`brand${compact ? ' brand-compact' : ''}`} href="#home" aria-label="Agnithon home">
    <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
    <span className="brand-word">agnithon<span className="brand-period">.</span><small>BUILD WHAT BURNS BRIGHT</small></span>
  </a>
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`eyebrow${light ? ' eyebrow-light' : ''}`}><span className="eyebrow-line" />{children}</div>
}

function SectionTitle({ label, title, copy, centered = false }: { label: string; title: ReactNode; copy?: string; centered?: boolean }) {
  return <div className={`section-title${centered ? ' centered' : ''}`} data-reveal>
    <Eyebrow>{label}</Eyebrow>
    <h2>{title}</h2>
    {copy && <p>{copy}</p>}
  </div>
}

function getCountdown(target: number, now: number) {
  const distance = Math.max(0, target - now)
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  }
}

function formatCountdown(value: number) {
  return String(value).padStart(2, '0')
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [selectedTrack, setSelectedTrack] = useState('all')
  const [activeProblem, setActiveProblem] = useState<ProblemStatement | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [now, setNow] = useState(Date.now())
  const [showTop, setShowTop] = useState(false)
  const modalCloseRef = useRef<HTMLButtonElement>(null)
  const problemTriggerRef = useRef<HTMLButtonElement | null>(null)

  const target = new Date(hackathonConfig.countdownDate).getTime()
  const countdown = useMemo(() => getCountdown(target, now), [target, now])
  const problems = useMemo(() => selectedTrack === 'all'
    ? hackathonConfig.problemStatements
    : hackathonConfig.problemStatements.filter((problem) => problem.trackId === selectedTrack), [selectedTrack])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element))

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id) })
    }, { rootMargin: '-35% 0px -55% 0px' })
    document.querySelectorAll('main section[id]').forEach((element) => sectionObserver.observe(element))

    const onScroll = () => setShowTop(window.scrollY > 650)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      revealObserver.disconnect()
      sectionObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!activeProblem) return
    modalCloseRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveProblem(null)
      if (event.key === 'Tab') {
        const focusable = document.querySelectorAll<HTMLElement>('.problem-modal button, .problem-modal a[href], .problem-modal [tabindex]:not([tabindex="-1"])')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first || !last) return
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', onKeyDown)
      window.setTimeout(() => problemTriggerRef.current?.focus(), 0)
    }
  }, [activeProblem])

  const goToProblems = (trackId = 'all') => {
    setSelectedTrack(trackId)
    document.getElementById('problem-statements')?.scrollIntoView({ behavior: 'smooth' })
  }

  return <>
    <div className="page-noise" aria-hidden="true" />
    <header className="site-header">
      <div className="nav-shell">
        <Logo />
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
          <Icon name={menuOpen ? 'close' : 'menu'} size={21} />
        </button>
        <nav className={`main-nav${menuOpen ? ' nav-open' : ''}`} aria-label="Main navigation">
          {navItems.map(([id, label]) => <a key={id} href={`#${id}`} className={activeSection === id ? 'nav-active' : ''} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="nav-register" href={hackathonConfig.registrationUrl} target="_blank" rel="noreferrer">Register <Icon name="arrow" size={15} /></a>
        </nav>
      </div>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-copy">
            <div className="event-pill"><span className="live-dot" /> AGNITHON 🔥 <span className="pill-divider" /> ONLINE HACKATHON <span className="pill-divider" /> OPEN CALL</div>
            <h1>IGNITE YOUR<br /><em>IDEAS.</em> BUILD<br />THE FUTURE.</h1>
            <p className="hero-intro">Where innovation meets execution. Bring your ideas to life, solve real-world challenges, and compete with the brightest minds.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={hackathonConfig.registrationUrl} target="_blank" rel="noreferrer">Register on Unstop <Icon name="arrow" /></a>
              <a className="button button-quiet" href="#tracks">Explore the tracks <span className="down-arrow">↓</span></a>
            </div>
            <div className="hero-hosts"><span className="host-label">BROUGHT TO YOU BY</span><span>Rilora Digital Solutions</span><b>×</b><span>Curetrics HealthCare Services</span></div>
          </div>
          <div className="hero-art" aria-label="Abstract glowing, rotating Agnithon energy core">
            <div className="art-label art-label-top"><span>AG / 01</span><span>IDEAS IN MOTION</span></div>
            <div className="orb-scene">
              <div className="orb-halo halo-one" />
              <div className="orb-halo halo-two" />
              <div className="orb-ring ring-one" />
              <div className="orb-ring ring-two" />
              <div className="orb-ring ring-three" />
              <div className="orb-core"><div className="orb-core-glow" /><span className="orb-core-mark">A</span></div>
              <span className="orbit-node node-one" /><span className="orbit-node node-two" /><span className="orbit-node node-three" />
              <span className="orb-spark spark-one">✦</span><span className="orb-spark spark-two">✧</span><span className="orb-spark spark-three">✦</span>
            </div>
            <div className="art-label art-label-bottom"><span>IDEA → IMPACT</span><span>2027 / ONLINE</span></div>
            <div className="art-coordinate">19° 04' N<br />72° 52' E</div>
          </div>
        </div>
        <div className="hero-bottomline"><span>BUILD FOR WHAT’S NEXT</span><span className="bottom-center"><i /> INDIA · ONLINE · OPEN TO ALL</span><a href="#about">SCROLL TO EXPLORE <b>↓</b></a></div>
      </section>

      <section className="countdown-band" aria-label="Countdown to the hackathon">
        <div className="countdown-copy"><span className="countdown-kicker">THE NEXT BIG THING STARTS IN</span><span className="countdown-note">The build window is getting closer.</span></div>
        <div className="countdown-units">
          {([['days', countdown.days], ['hrs', countdown.hours], ['min', countdown.minutes], ['sec', countdown.seconds]] as const).map(([label, value]) => <div className="countdown-unit" key={label}><strong>{label === 'days' ? value : formatCountdown(value)}</strong><span>{label}</span></div>)}
        </div>
        <span className="countdown-decoration" aria-hidden="true">A</span>
      </section>

      <section className="about-section section-pad" id="about">
        <div className="about-layout">
          <div className="about-heading" data-reveal><Eyebrow>THE SPARK</Eyebrow><h2>Big ideas don’t<br />wait for <em>permission.</em></h2><span className="heading-stamp">01 <i /> ABOUT AGNITHON</span></div>
          <div className="about-copy" data-reveal>
            <p className="about-lead">Agnithon brings together the curious, the creative, and the relentlessly resourceful to turn ideas into something real.</p>
            <p>Over one online competition, developers, designers, problem-solvers, and first-time builders will come together to explore meaningful challenges and make technology count.</p>
            <a className="text-link" href="#how-it-works">See how it works <Icon name="arrow" size={16} /></a>
          </div>
        </div>
        <div className="value-grid" data-reveal>
          {[
            { number: '01', title: 'Think boldly', detail: 'Question the expected. Look for a better question.' },
            { number: '02', title: 'Build together', detail: 'Different minds make stronger ideas.' },
            { number: '03', title: 'Make it matter', detail: 'Put useful, human impact at the heart of your work.' },
            { number: '04', title: 'Stay curious', detail: 'Try new tools, learn fast, and keep exploring.' },
          ].map((item) => <article className="value-card" key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div><Icon name="spark" size={17} /></article>)}
        </div>
      </section>

      <section className="tracks-section section-pad" id="tracks">
        <div className="tracks-top"><SectionTitle label="THREE WAYS IN" title={<>Choose your<br /><em>kind of spark.</em></>} copy="Pick a direction that excites you. Then find a challenge worth staying up for." /><span className="track-aside">YOUR IDEA CAN START<br />ANYWHERE. <b>↘</b></span></div>
        <div className="track-grid">
          {hackathonConfig.tracks.map((track, index) => <article className={`track-card track-card-${index + 1}`} key={track.id} data-reveal>
            <div className="track-card-top"><span className="track-icon">{track.icon}</span><span className="track-number">TRACK / {track.number}</span></div>
            <h3>{track.title}</h3><p>{track.description}</p>
            <div className="track-card-bottom"><span>{track.focus}</span><button type="button" aria-label={`Explore ${track.title} challenges`} onClick={() => goToProblems(track.id)}><Icon name="arrow" size={17} /></button></div>
          </article>)}
        </div>
        <div className="tracks-footnote"><span className="tiny-spark">✳</span> One competition. Infinite ways to make a difference.</div>
      </section>

      <section className="challenge-section section-pad" id="problem-statements">
        <div className="challenge-heading"><SectionTitle label="THE CHALLENGES" title={<>A problem worth<br /><em>your best thinking.</em></>} copy="The official briefs are on their way. Get a feel for the challenge board, then come back when it’s live." /><span className="coming-soon"><span className="live-dot" /> BRIEFS COMING SOON</span></div>
        <div className="challenge-filters" role="group" aria-label="Filter challenges by track">
          <button type="button" className={selectedTrack === 'all' ? 'filter-active' : ''} onClick={() => setSelectedTrack('all')}>All challenges <span>{hackathonConfig.problemStatements.length}</span></button>
          {hackathonConfig.tracks.map((track) => <button key={track.id} type="button" className={selectedTrack === track.id ? 'filter-active' : ''} onClick={() => setSelectedTrack(track.id)}>{track.title}</button>)}
        </div>
        <div className="problem-grid">
          {problems.map((problem, index) => {
            const track = hackathonConfig.tracks.find((item) => item.id === problem.trackId)
            return <article className="problem-card" key={problem.id} data-reveal>
              <div className="problem-card-head"><span>{problem.id}</span><span>{track?.title}</span></div>
              <div className="problem-orbit" aria-hidden="true"><i /><i /><i /></div>
              <div className="problem-card-content"><span className="problem-difficulty">{problem.difficulty}</span><h3>{problem.title}</h3><p>{problem.description}</p><button type="button" className="problem-open" onClick={(event) => { problemTriggerRef.current = event.currentTarget; setActiveProblem(problem) }}>Explore brief <Icon name="arrow" size={16} /></button></div>
              <span className="problem-index">0{index + 1}</span>
            </article>
          })}
        </div>
        <p className="placeholder-note"><span>✳</span> The briefs above are placeholders. Official challenge details will be shared before the event.</p>
      </section>

      <section className="steps-section section-pad" id="how-it-works">
        <div className="steps-heading"><SectionTitle label="FROM IDEA TO IMPACT" title={<>Make something<br /><em>that moves us.</em></>} copy="Five simple steps between your first thought and a finished project." /><a className="button button-outline" href={hackathonConfig.registrationUrl} target="_blank" rel="noreferrer">Join the lineup <Icon name="arrow" size={16} /></a></div>
        <div className="steps-track">
          {[
            ['01', 'Register', 'Join Agnithon through the official Unstop event page.'],
            ['02', 'Explore', 'Choose a track and find a problem that feels personal.'],
            ['03', 'Innovate', 'Bring your people together. Make, test, and make it better.'],
            ['04', 'Submit', 'Share your project through the official platform.'],
            ['05', 'Compete', 'Meet the jury, share your thinking, and celebrate what you built.'],
          ].map(([number, title, copy], index) => <article className="step-card" key={number} data-reveal><span className="step-number">{number}</span><span className="step-line"><i /></span><h3>{title}</h3><p>{copy}</p><span className="step-milestone">0{index + 1} / 05</span></article>)}
        </div>
      </section>

      <section className="timeline-section section-pad" id="timeline">
        <div className="timeline-top"><SectionTitle label="SAVE THE MOMENT" title={<>The moments that<br /><em>move us forward.</em></>} copy="Add the dates to your calendar. We’ll share the complete schedule soon." /><span className="timeline-tag">EVENT TIMELINE <b>↗</b></span></div>
        <div className="timeline-list">
          {hackathonConfig.timeline.map((item, index) => <article className={`timeline-item${index === 2 ? ' timeline-highlight' : ''}`} key={item.title} data-reveal><span className="timeline-index">0{index + 1}</span><span className="timeline-node" /><div className="timeline-event"><h3>{item.title}</h3><p>{item.detail}</p></div><span className="timeline-date">{item.date}</span></article>)}
        </div>
        <div className="timeline-footer"><span>ALL TIMES WILL BE SHARED IN IST</span><span>DATES TO BE ANNOUNCED <i>✳</i></span></div>
      </section>

      <section className="prizes-section section-pad" id="prizes">
        <div className="prizes-top"><SectionTitle label="MORE THAN A FINISH LINE" title={<>Your work deserves<br /><em>to be seen.</em></>} copy="Great work should travel. Standout projects earn recognition, support, and room to grow." /><span className="prize-stamp"><span>IDEAS<br />INTO<br /><b>IMPACT</b></span><i>✳</i></span></div>
        <div className="prize-grid">
          {hackathonConfig.prizes.map((prize) => <article className={`prize-card prize-${prize.accent}`} key={prize.rank} data-reveal><span className="prize-rank">{prize.rank} <i>{prize.medal}</i></span><div className="prize-graphic"><span>{prize.rank}</span><i /><i /><i /></div><h3>{prize.title}</h3><p>{prize.value}</p><span className="prize-card-bottom">AGNITHON / RECOGNITION</span></article>)}
        </div>
        <div className="special-awards"><div><span className="special-icon">✳</span><span><b>Special recognition</b><small>Extra love for ideas that stand apart</small></span></div><strong>{hackathonConfig.specialAwards}</strong></div>
        <div className="benefit-row"><span>THE EXPERIENCE, TOO</span>{hackathonConfig.benefits.map((benefit) => <span className="benefit-chip" key={benefit}><i />{benefit}</span>)}</div>
      </section>

      <section className="eligibility-section section-pad" id="eligibility">
        <div className="eligibility-copy"><SectionTitle label="YOUR SEAT IS WAITING" title={<>Curious counts<br />as a <em>qualification.</em></>} copy="If you care about making useful things, you belong in the room." /><div className="audience-cloud">{hackathonConfig.eligibility.audiences.map((audience, index) => <span className={`audience-pill audience-${index + 1}`} key={audience}>{audience}</span>)}</div></div>
        <div className="eligibility-details" data-reveal>
          <div className="eligibility-detail"><span>01 / TEAM SIZE</span><strong>{hackathonConfig.eligibility.teamSize}</strong></div>
          <div className="eligibility-detail"><span>02 / WHO CAN JOIN</span><strong>{hackathonConfig.eligibility.criteria}</strong></div>
          <div className="eligibility-detail"><span>03 / SKILLS</span><strong>{hackathonConfig.eligibility.skills}</strong></div>
          <p className="eligibility-note"><Icon name="spark" size={16} /> Official participation details will be announced shortly.</p>
        </div>
      </section>

      <section className="faq-section section-pad" id="faq">
        <div className="faq-intro"><SectionTitle label="GOOD QUESTIONS" title={<>A few things<br /><em>you might wonder.</em></>} copy="We’re getting the details ready. Here’s what we can tell you for now." /><a className="text-link" href={hackathonConfig.contact.email.includes('@') ? `mailto:${hackathonConfig.contact.email}` : '#contact'}>Still curious? Get in touch <Icon name="arrow" size={16} /></a></div>
        <div className="faq-list">
          {hackathonConfig.faqs.map((item, index) => <article className={`faq-item${openFaq === index ? ' faq-open' : ''}`} key={item.question}>
            <button type="button" aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span className="faq-number">0{index + 1}</span><span className="faq-question">{item.question}</span><span className="faq-icon"><Icon name={openFaq === index ? 'close' : 'plus'} size={17} /></span></button>
            <div className="faq-answer" id={`faq-answer-${index}`} hidden={openFaq !== index}><p>{item.answer}</p></div>
          </article>)}
        </div>
      </section>

      <section className="organizers-section section-pad" id="organizers">
        <div className="organizers-top"><SectionTitle label="THE PEOPLE BEHIND THE SPARK" title={<>Built with <em>purpose.</em></>} copy="Agnithon is brought to life by two teams committed to turning good ideas into real progress." /><span className="collab-symbol">R <i>×</i> C</span></div>
        <div className="organizer-grid">
          {hackathonConfig.organizers.map((organizer, index) => <article className="organizer-card" key={organizer.name} data-reveal><div className={`organizer-mark organizer-mark-${index + 1}`}>{organizer.mark}<i /></div><div className="organizer-copy"><span>ORGANIZER / 0{index + 1}</span><h3>{organizer.name}</h3><p>{organizer.description}</p></div><a className="organizer-link" href={hackathonConfig.contact.website.startsWith('http') ? hackathonConfig.contact.website : '#contact'} aria-label={`Visit ${organizer.name}`}><Icon name="arrow" size={17} /></a></article>)}
        </div>
        <div className="shared-brand"><span className="shared-line" /><span>ONE SHARED BELIEF</span><p>Technology should make life better.</p><span className="shared-line" /></div>
      </section>

      <section className="final-cta" id="register">
        <div className="cta-glow" aria-hidden="true" /><div className="cta-content" data-reveal><Eyebrow>THE NEXT MOVE IS YOURS</Eyebrow><h2>Got a spark?<br /><em>Make it matter.</em></h2><p>Find your people. Pick your challenge. Build something that means something.</p><a className="button button-primary" href={hackathonConfig.registrationUrl} target="_blank" rel="noreferrer">Find Agnithon on Unstop <Icon name="arrow" /></a><span className="cta-footnote">ONLINE HACKATHON <i /> OPEN TO ALL <i /> BUILT FOR WHAT’S NEXT</span></div>
      </section>
    </main>

    <footer className="site-footer" id="contact">
      <div className="footer-main"><div className="footer-brand-col"><Logo compact /><p>A place for bold ideas, bright minds, and technology with a little more heart.</p><a className="footer-register" href={hackathonConfig.registrationUrl} target="_blank" rel="noreferrer">Register on Unstop <Icon name="external" size={15} /></a></div>
        <div className="footer-column"><span>EXPLORE</span><a href="#about">About Agnithon</a><a href="#tracks">Tracks</a><a href="#problem-statements">Challenges</a><a href="#timeline">Timeline</a></div>
        <div className="footer-column"><span>THE DETAILS</span><a href="#prizes">Prizes & recognition</a><a href="#eligibility">Who can participate</a><a href="#faq">Frequently asked</a><a href="#organizers">Organizers</a></div>
        <div className="footer-column"><span>REACH OUT</span><a href={hackathonConfig.contact.email.includes('@') ? `mailto:${hackathonConfig.contact.email}` : '#contact'}>{hackathonConfig.contact.email}</a><a href={hackathonConfig.contact.social.startsWith('http') ? hackathonConfig.contact.social : '#contact'}>{hackathonConfig.contact.social}</a><span className="footer-contact-note">{hackathonConfig.contact.support}</span></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} AGNITHON. MADE FOR THE MAKERS.</span><span>RILORA DIGITAL SOLUTIONS <b>×</b> CURETRICS HEALTHCARE SERVICES</span><a href="#home">BACK TO TOP ↑</a></div>
    </footer>

    <button className={`back-to-top${showTop ? ' back-visible' : ''}`} type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Icon name="arrowUp" /></button>

    {activeProblem && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveProblem(null) }}>
      <section className="problem-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button ref={modalCloseRef} className="modal-close" type="button" aria-label="Close problem details" onClick={() => setActiveProblem(null)}><Icon name="close" /></button>
        <Eyebrow>CHALLENGE / {activeProblem.id}</Eyebrow>
        <div className="modal-meta"><span>{hackathonConfig.tracks.find((track) => track.id === activeProblem.trackId)?.title}</span><span>{activeProblem.difficulty}</span></div>
        <h2 id="modal-title">{activeProblem.title}</h2>
        <div className="modal-detail"><h3>The challenge</h3><p>{activeProblem.description}</p></div>
        <div className="modal-detail"><h3>What to build</h3><p>{activeProblem.solution}</p></div>
        <div className="modal-detail"><h3>Key requirements</h3><ul>{activeProblem.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></div>
        <div className="modal-tech"><span>SKILLS / TECHNOLOGIES</span>{activeProblem.technologies.map((technology) => <b key={technology}>{technology}</b>)}</div>
        <p className="modal-note">Official challenge details will be announced before the event.</p>
      </section>
    </div>}
  </>
}

export default App
