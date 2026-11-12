// Public portfolio content. Everything in this file is published.
// NDA work is anonymised on purpose: no product, client or repo names.
window.PORTFOLIO = {
  person: {
    name: "Denver Shenal",
    roles: ["Software Engineer", "React & Next.js Developer", "Flutter Specialist", "UI/UX Enthusiast"],
    location: "Kandy, Sri Lanka",
    pitch:
      "I build scalable, secure and fast web and mobile apps. I started in Flutter and native mobile, and now architect React and Next.js platforms in monorepos for healthcare, construction, events and retail.",
    about: [
      "I'm a software engineer with five years of shipping products for clients in Sri Lanka, the UK, Australia and the UAE. I started out in mobile with Flutter, Kotlin and Java, and these days most of my work is React and Next.js inside monorepos, built from shared, modular components (Atomic Design).",
      "Beyond features, I care about architecture, frontend performance, CI/CD and AI-driven workflows that take real work off people's plates. I hold a high bar for code quality, documentation and information security, and I like teams where long-term maintainability matters as much as the next release.",
    ],
    // Assembled at runtime to keep it away from simple scrapers.
    emailParts: ["denvershenal2405", "gmail.com"],
    links: [
      { label: "GitHub", url: "https://github.com/Paradox2405", icon: "github" },
      { label: "LinkedIn", url: "https://linkedin.com/in/denver-shenal", icon: "linkedin" },
      { label: "Stack Overflow", url: "https://stackoverflow.com/users/13601462/denver-shenal", icon: "stack" },
      { label: "X / Twitter", url: "https://twitter.com/Paradox2405", icon: "x" },
    ],
  },

  stats: [
    { value: 5, suffix: "+", label: "years shipping software" },
    { value: 40, suffix: "+", label: "projects built" },
    { value: 4, suffix: "", label: "companies" },
    { value: 4, suffix: "", label: "countries served" },
  ],

  careerGlance: {
    path: ["Intern", "Software Engineer", "Flutter Engineer", "Senior Engineer", "Software Engineer (web platforms)"],
    industries: ["Healthcare", "Construction", "Events", "Property", "Automotive & logistics", "ERP", "IoT"],
  },

  // start/end are "YYYY-MM" (end null = present). Durations are calculated on the page.
  experience: [
    {
      company: "Wire Apps Ltd.",
      role: "Software Engineer",
      start: "2025-06",
      end: null,
      focus: "Web platforms · React & Next.js",
      summary:
        "I build enterprise web platforms in a shared React and Next.js monorepo for clients in healthcare, construction and events. I own features from the UI architecture down to the API, add AI-driven automation, and meet ISO, information security and GDPR requirements.",
      industries: ["Healthcare", "Construction", "Events"],
      facts: [
        { value: "3", label: "client products" },
        { value: "115+", label: "pull requests" },
        { value: "1", label: "shared monorepo" },
      ],
      groups: [
        {
          title: "Product engineering",
          points: [
            "Build scalable web apps with React and Next.js inside a Turborepo monorepo, using Atomic Design so components are shared and modular across products.",
            "Contributed across a multi-tenant medical device compliance platform with role-based workspaces, a rich-text documentation editor, document import, PDF generation and signed approval workflows.",
            "Built the review flow of an AI quantity-surveying platform for construction: bulk file upload, column mapping with validation, step-by-step bill of quantities approval, and real-time updates over WebSockets.",
            "Work on an event planning marketplace with a Next.js 15 / React 19 frontend on a Laravel API.",
          ],
        },
        {
          title: "AI & automation",
          points: [
            "Architect and implement AI-driven features and workflow automation that cut manual steps out of business processes.",
          ],
        },
        {
          title: "Architecture & quality",
          points: [
            "Contribute to architectural decisions in the monorepo: consistent coding standards, shared UI packages (with Storybook) and streamlined deployments.",
            "Optimise frontend performance, accessibility and scalability to enterprise security and governance requirements.",
            "Work to ISO standards, information security best practice and GDPR on every implementation.",
          ],
        },
        {
          title: "Collaboration",
          points: ["Work closely with designers and backend engineers to turn complex business requirements into secure, high-performance software."],
        },
      ],
      projects: ["nda-medical", "nda-qs", "nda-marketplace"],
      tags: ["Next.js", "React", "TypeScript", "NestJS", "Turborepo", "TanStack Query", "Tailwind", "shadcn/ui", "Storybook", "WebSockets", "Laravel"],
    },
    {
      company: "Mexxar Ltd.",
      role: "Senior Software Engineer",
      start: "2024-01",
      end: "2025-06",
      focus: "Frontend lead · Healthcare recruitment",
      summary:
        "Senior engineer and frontend lead. I streamlined the company's processes end to end to match modern engineering workflows, led the ground-up rebuild of the MEXXAR Candidate app, was one of the main engineers on the MEXXAR healthcare recruitment CRM, raised the bar for the frontend team with reviews, mentoring and CI/CD, and brought in modern React architecture for web projects.",
      industries: ["Healthcare"],
      facts: [
        { value: "530+", label: "commits on the CRM" },
        { value: "Company-wide", label: "processes modernised" },
        { value: "CI/CD", label: "pipelines set up" },
      ],
      groups: [
        {
          title: "Process transformation (company-wide)",
          points: [
            "Streamlined the company's processes end to end to match modern software workflows, from how work is planned and tracked to how it's reviewed, tested and released.",
            "Standardised Jira across teams with consistent boards, ticket structure and workflows aligned with industry practice, improving visibility and collaboration between teams.",
            "Made code reviews, enforceable code-quality standards and structured documentation the default way of working.",
            "Set up and ran GitHub Actions CI/CD pipelines, making delivery faster and cutting deployment errors.",
            "In practice: a team-wide commit message template (issue key, version, description), versioned release builds packaged automatically by the pipeline and deployed to S3, and secrets moved out of the code into environment config.",
          ],
        },
        {
          title: "Product engineering",
          points: [
            "Led the ground-up V2 rebuild of the MEXXAR Candidate app (Flutter), with an MVC-style module structure built for scalability, maintainability and performance.",
            "One of the main engineers on the MEXXAR recruitment CRM (React), used by UK healthcare agencies such as Candy Healthcare, with 530+ commits across compliance, bookings, payroll and admin.",
            "Set up the mobile architecture for a new chauffeur booking product, which the team then built on.",
            "Architected modern React solutions and delivered new features for web and mobile projects as business needs changed.",
            "Improved UI/UX across web and mobile apps for usability, accessibility and visual quality.",
          ],
        },
        {
          title: "Leadership",
          points: [
            "Led the frontend team: introduced modern best practices, ran code reviews, and refactored legacy codebases for robustness and scale.",
            "Mentored and coached engineers on coding standards, design patterns and best practices.",
          ],
        },
      ],
      projects: ["mexxar-crm", "mexxar-mobile", "chauffeur"],
      tags: ["React", "Redux", "Flutter", "GetX", "MVC", "GitHub Actions", "AWS S3", "Jira", "Code review", "Mentoring", "Process design"],
    },
    {
      company: "Flexiata PTY Ltd.",
      role: "Software Engineer – Flutter",
      start: "2022-07",
      end: "2023-12",
      focus: "Mobile · Australian clients",
      summary:
        "Flutter engineer on client apps for the Australian market, shipped to the App Store and Play Store. I led the mobile app for Proppel, a property management platform, and pioneered a warehouse app for a major truck distributor.",
      industries: ["Property", "Automotive & logistics"],
      facts: [
        { value: "iOS + Android", label: "store releases" },
        { value: "Lead", label: "on the Proppel app" },
        { value: "Voice + camera", label: "warehouse workflows" },
      ],
      groups: [
        {
          title: "Proppel: property management app (lead)",
          points: [
            "Led development of the Proppel mobile app, which tracks rent, expenses, mortgages, depreciation, insurance, documents and tasks for each property.",
            "Structured it with BLoC + RxDart, with separate development and production flavours, secure token storage, biometric unlock, and push and local reminders.",
          ],
        },
        {
          title: "Warehouse dimension scanner",
          points: [
            "Pioneered a mobile solution for a major Australian truck distributor: scan a part's barcode, enter package dimensions by voice (speech-to-text) or keyboard, and attach photos.",
            "Streamlined data handling and made warehouse operations more efficient, with a scan history for every part.",
          ],
        },
        {
          title: "Engineering practice",
          points: [
            "Managed complex app state with GetX, Provider and BLoC, choosing the right tool for each project.",
            "Built cross-platform apps that stay scalable and maintainable, and distributed them through the App Store, Play Store and app bundles.",
            "Worked closely with backend teams and clients in Agile sprints to deliver features on time.",
          ],
        },
      ],
      projects: ["proppel", "nda-warehouse"],
      tags: ["Flutter", "Dart", "BLoC", "RxDart", "Provider", "GetX", "Firebase", "REST APIs", "App Store", "Play Store"],
    },
    {
      company: "CeylonLab Solutions (Pvt) Ltd.",
      role: "Software Engineer",
      start: "2021-08",
      end: "2022-06",
      focus: "Intern → Engineer · Mobile",
      summary:
        "Where I started. I joined as an intern and was promoted to software engineer, building mobile apps for ERP, IoT and commercial systems with Flutter, Kotlin and Java under close senior mentorship.",
      industries: ["ERP", "IoT"],
      facts: [
        { value: "Intern → SE", label: "promotion" },
        { value: "3", label: "languages: Flutter, Kotlin, Java" },
      ],
      groups: [
        {
          title: "Product engineering",
          points: [
            "Delivered mobile apps for ERP, IoT and commercial systems with Flutter, Kotlin and Java.",
            "Integrated apps with backend services and wrote technical documentation that kept them scalable and maintainable.",
          ],
        },
        {
          title: "Process & delivery",
          points: [
            "Worked in cross-functional Agile and Waterfall teams on Jira-based projects and delivered features on time.",
            "Managed releases and version control across GitHub, GitLab and Bitbucket.",
            "Worked through the full mobile development lifecycle, following industry best practices.",
          ],
        },
      ],
      projects: [],
      tags: ["Flutter", "Kotlin", "Java", "IoT", "GitHub", "GitLab", "Bitbucket", "Jira"],
    },
  ],

  // projects live in projects.js

  skills: [
    { group: "Web", items: ["React", "Next.js", "TypeScript", "Tailwind", "shadcn/ui", "TanStack Query", "Redux", "Vite"] },
    { group: "Mobile", items: ["Flutter", "Dart", "Kotlin", "Java", "BLoC", "GetX", "Provider"] },
    { group: "Backend & data", items: ["Node.js", "NestJS", "Fastify", "Express", "PostgreSQL", "Prisma", "Firebase", "Laravel"] },
    { group: "Cloud & DevOps", items: ["AWS", "GCP", "Azure", "Vercel", "GitHub Actions", "Docker", "Terraform", "Turborepo"] },
    { group: "Also", items: ["Bluetooth LE", "IoT", "Playwright", "AI features", "Atomic Design", "Agile", "Jira"] },
  ],

  community: [
    {
      title: "Founder, Duothan 1.0",
      text: "Founded the flagship inter-university hackathon of the IEEE Student Branch at NSBM Green University. It became an annual island-wide coding contest.",
    },
    {
      title: "Flutter Unleashed workshop",
      text: "Ran a hands-on Flutter and Firebase workshop on building real cross-platform apps.",
    },
    {
      title: "IEEE SL Inspire",
      text: "Organising committee for a national IEEE Sri Lanka Section outreach programme that gives students career and higher-education guidance across every province.",
    },
  ],

  education: [
    { school: "University of Plymouth, UK", detail: "BSc (Hons) Software Engineering, Second Upper Division", period: "2018 – 2021" },
    { school: "Trinity College, Kandy", detail: "GCE Advanced Level (2017) · Ordinary Level (2014)", period: "2004 – 2017" },
  ],
};
