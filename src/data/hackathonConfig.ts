export type Track = {
  id: string
  number: string
  icon: string
  title: string
  description: string
  focus: string
}

export type ProblemStatement = {
  id: string
  title: string
  trackId: string
  difficulty: string
  description: string
  solution: string
  requirements: string[]
  technologies: string[]
}

export const hackathonConfig = {
  name: 'Agnithon',
  tagline: 'Ignite your ideas. Build the future.',
  // TODO: UPDATE BEFORE LAUNCH — use the direct Agnithon event page on Unstop.
  registrationUrl: 'https://unstop.com/hackathons',
  // TODO: UPDATE BEFORE LAUNCH — set the official countdown target with timezone.
  countdownDate: '2027-03-10T09:00:00+05:30',
  organizers: [
    {
      name: 'Rilora Digital Solutions',
      description: 'Technology, digital innovation, and solution development.',
      mark: 'R',
    },
    {
      name: 'Curetrics HealthCare Services',
      description: 'Healthcare-focused innovation and services.',
      mark: 'C',
    },
  ],
  tracks: [
    {
      id: 'healthcare',
      number: '01',
      icon: '✳',
      title: 'Healthcare Innovation',
      description: 'Reimagine care with technology that makes health services more accessible, human, and effective.',
      focus: 'Care, access & wellbeing',
    },
    {
      id: 'digital',
      number: '02',
      icon: '⌘',
      title: 'Digital Solutions',
      description: 'Build smart digital products, AI tools, and platforms that make everyday processes better.',
      focus: 'AI, products & platforms',
    },
    {
      id: 'open',
      number: '03',
      icon: '↗',
      title: 'Open Innovation',
      description: 'Follow a bold idea wherever it leads and create a solution that challenges convention.',
      focus: 'Ideas without boundaries',
    },
  ] satisfies Track[],
  // TODO: UPDATE BEFORE LAUNCH — replace every bracketed field with the official brief.
  problemStatements: [
    {
      id: 'AGN-01',
      title: '[PROBLEM STATEMENT TITLE]',
      trackId: 'healthcare',
      difficulty: 'Open brief',
      description: '[ADD PROBLEM DESCRIPTION HERE]',
      solution: '[ADD EXPECTED SOLUTION HERE]',
      requirements: ['[ADD REQUIREMENTS HERE]', '[ADD ANOTHER REQUIREMENT HERE]'],
      technologies: ['[SKILLS / TECHNOLOGIES]'],
    },
    {
      id: 'AGN-02',
      title: '[PROBLEM STATEMENT TITLE]',
      trackId: 'digital',
      difficulty: 'Open brief',
      description: '[ADD PROBLEM DESCRIPTION HERE]',
      solution: '[ADD EXPECTED SOLUTION HERE]',
      requirements: ['[ADD REQUIREMENTS HERE]', '[ADD ANOTHER REQUIREMENT HERE]'],
      technologies: ['[SKILLS / TECHNOLOGIES]'],
    },
    {
      id: 'AGN-03',
      title: '[PROBLEM STATEMENT TITLE]',
      trackId: 'open',
      difficulty: 'Open brief',
      description: '[ADD PROBLEM DESCRIPTION HERE]',
      solution: '[ADD EXPECTED SOLUTION HERE]',
      requirements: ['[ADD REQUIREMENTS HERE]', '[ADD ANOTHER REQUIREMENT HERE]'],
      technologies: ['[SKILLS / TECHNOLOGIES]'],
    },
    {
      id: 'AGN-04',
      title: '[PROBLEM STATEMENT TITLE]',
      trackId: 'healthcare',
      difficulty: 'Open brief',
      description: '[ADD PROBLEM DESCRIPTION HERE]',
      solution: '[ADD EXPECTED SOLUTION HERE]',
      requirements: ['[ADD REQUIREMENTS HERE]', '[ADD ANOTHER REQUIREMENT HERE]'],
      technologies: ['[SKILLS / TECHNOLOGIES]'],
    },
  ] satisfies ProblemStatement[],
  // TODO: UPDATE BEFORE LAUNCH — replace the placeholder dates and copy.
  timeline: [
    { title: 'Registration opens', date: '[DATE]', detail: 'Find your people and claim a place.' },
    { title: 'Registration deadline', date: '[DATE]', detail: 'Last call to join the lineup.' },
    { title: 'Hackathon begins', date: '[DATE]', detail: 'The build window starts.' },
    { title: 'Submission deadline', date: '[DATE]', detail: 'Send your finished project.' },
    { title: 'Evaluation', date: '[DATE]', detail: 'Ideas meet the jury.' },
    { title: 'Results announced', date: '[DATE]', detail: 'Meet this edition’s standout teams.' },
  ],
  // TODO: UPDATE BEFORE LAUNCH — add approved prize values and recognition.
  prizes: [
    { rank: '01', medal: '✳', title: 'First prize', value: '[PRIZE DETAILS]', accent: 'gold' },
    { rank: '02', medal: '✳', title: 'Second prize', value: '[PRIZE DETAILS]', accent: 'silver' },
    { rank: '03', medal: '✳', title: 'Third prize', value: '[PRIZE DETAILS]', accent: 'bronze' },
  ],
  specialAwards: '[SPECIAL AWARDS]',
  benefits: ['Certificates', 'Mentorship', 'Recognition', 'Networking'],
  // TODO: UPDATE BEFORE LAUNCH — confirm team size and eligibility rules.
  eligibility: {
    audiences: ['Students', 'Developers', 'Designers', 'Innovators', 'Curious beginners'],
    teamSize: '[TEAM SIZE]',
    criteria: '[ELIGIBILITY]',
    skills: '[SKILLS, IF ANY]',
  },
  // TODO: UPDATE BEFORE LAUNCH — confirm official answers as details are finalized.
  faqs: [
    { question: 'Who can participate in Agnithon?', answer: '[ADD OFFICIAL ELIGIBILITY DETAILS HERE]' },
    { question: 'Is Agnithon conducted online?', answer: 'Yes. Agnithon is planned as an online competition hosted on Unstop.' },
    { question: 'Can I participate individually or as a team?', answer: '[ADD TEAM SIZE AND PARTICIPATION RULES HERE]' },
    { question: 'How do I register?', answer: 'Use the Register on Unstop button to visit the event page. The direct event link will be added here before launch.' },
    { question: 'Are there any registration fees?', answer: '[ADD REGISTRATION FEE DETAILS HERE]' },
    { question: 'What are the submission requirements?', answer: '[ADD PROJECT SUBMISSION FORMAT AND REQUIREMENTS HERE]' },
    { question: 'How will projects be evaluated?', answer: '[ADD JUDGING CRITERIA HERE]' },
    { question: 'Will participants receive certificates?', answer: '[ADD CERTIFICATE DETAILS HERE]' },
    { question: 'Where can I find the problem statements?', answer: 'The official problem statements will appear in the Challenges section once they are announced.' },
  ],
  // TODO: UPDATE BEFORE LAUNCH — add official contact and social links.
  contact: {
    website: '[OFFICIAL WEBSITE]',
    email: '[CONTACT EMAIL]',
    social: '[SOCIAL MEDIA LINK]',
    person: '[CONTACT PERSON]',
    support: '[SUPPORT INFORMATION]',
  },
} as const
