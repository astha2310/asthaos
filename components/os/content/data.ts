export const ROLES_LINE = 'Security Analyst, SOC and GRC roles'

export const ABOUT_LINES = [
  "Hi, I'm Astha Patel.",
  '',
  "I'm a security analyst with an M.S. in Information Technology (Security) from Arizona State University (May 2026, GPA 3.93) and a B.Tech in Information and Communication Technology from Pandit Deendayal Energy University (2024).",
  '',
  'I have about three years of hands-on security and IT experience: triaging alerts in Splunk, Microsoft Sentinel and QRadar, investigating phishing, supporting SOC 2 and ISO 27001 audits, and supporting Microsoft 365 for students, faculty and staff at ASU.',
  '',
  'Outside work, I build labs. A honeypot that logged 277,167 failed logins. A SOC platform fed by live threat intel. A tool that hides patient data before it reaches an AI.',
  '',
  'I like explaining security in plain language, because people who understand security are the best defense.',
  '',
  'Currently: studying for CompTIA Security+ (expected January 2027).',
  `Looking for: ${ROLES_LINE}. Also open to IT support.`,
]

export type LogLevel = 'INFO' | 'ALERT-HANDLED'

export type Job = {
  id: string
  start: string
  end: string
  level: LogLevel
  title: string
  org: string
  details: string[]
}

export const JOBS: Job[] = [
  {
    id: 'glacier',
    start: '2026-01',
    end: '2026-05',
    level: 'INFO',
    title: 'Cloud Security Engineer Intern',
    org: 'Glacier Infotech Inc.',
    details: [
      'Reviewed AWS and Azure settings against CIS Benchmark controls and tracked each finding until it was fixed.',
      'Wrote Python scripts to automate routine security checks.',
    ],
  },
  {
    id: 'asu',
    start: '2025-09',
    end: '2026-05',
    level: 'INFO',
    title: 'Messaging Platform Support Assistant',
    org: 'Arizona State University, Enterprise Technology',
    details: [
      'Supported Microsoft 365, Exchange and Outlook for students, faculty and staff.',
      'Investigated user-reported phishing by checking headers, links and SPF, DKIM and DMARC results, and helped lock down compromised accounts.',
      'Managed shared mailbox and group permissions and wrote knowledge base articles.',
    ],
  },
  {
    id: 'elegant',
    start: '2022-02',
    end: '2024-07',
    level: 'ALERT-HANDLED',
    title: 'Security Analyst',
    org: 'Elegant Microweb Technologies, India',
    details: [
      'Monitored and triaged alerts in Splunk, Microsoft Sentinel and QRadar, and escalated confirmed incidents.',
      'Collected evidence and wrote up incidents during incident response.',
      'Followed up on vulnerability fixes until closed, helping cut high-risk findings by about 25%.',
      'Supported SOC 2 and ISO 27001 audits by collecting evidence and tracking fixes.',
      'Handled Active Directory access requests through ServiceNow and Jira.',
    ],
  },
]

export type LinkKind = 'github' | 'report' | 'demo' | 'prototype'

export type ProjectLink = { label: string; href: string; kind: LinkKind }

export type FolderId =
  | 'soc_and_detection'
  | 'phishing'
  | 'vulnerability_and_network'
  | 'grc'
  | 'fraud_and_data'
  | 'just_for_fun'

export type Project = {
  id: string
  name: string
  folder?: FolderId
  pinned?: boolean
  summary: string
  description: string[]
  stats: string[]
  tools: string[]
  links: ProjectLink[]
}

const gh = (repo: string): ProjectLink => ({
  label: 'View on GitHub',
  href: `https://github.com/astha2310/${repo}`,
  kind: 'github',
})

export const FOLDERS: { id: FolderId; label: string }[] = [
  { id: 'soc_and_detection', label: 'soc_and_detection/' },
  { id: 'phishing', label: 'phishing/' },
  { id: 'vulnerability_and_network', label: 'vulnerability_and_network/' },
  { id: 'grc', label: 'grc/' },
  { id: 'fraud_and_data', label: 'fraud_and_data/' },
  { id: 'just_for_fun', label: 'just_for_fun/' },
]

export const PROJECTS: Project[] = [
  {
    id: 'honeypot',
    name: 'Azure Sentinel Honeypot SOC Lab',
    pinned: true,
    summary: 'A Windows Server VM left open to the internet on purpose, with every attack hunted in Sentinel.',
    description: [
      'I put a Windows Server VM on the internet with RDP open on purpose, sent its logs to Microsoft Sentinel, and used KQL to hunt the attacks.',
      'Built a detection rule mapped to MITRE ATT&CK T1110 and tuned it.',
    ],
    stats: ['277,167 failed logins', '50 IPs', '20 countries', '0 break-ins'],
    tools: ['Microsoft Sentinel', 'KQL', 'Azure', 'Windows Server 2022', 'AbuseIPDB', 'VirusTotal'],
    links: [
      gh('azure-sentinel-honeypot-soc-lab'),
      {
        label: 'Interactive Report',
        href: 'https://astha2310.github.io/azure-sentinel-honeypot-soc-lab/',
        kind: 'report',
      },
    ],
  },
  {
    id: 'cybershield',
    name: 'CyberShield, Automated SOC Platform',
    pinned: true,
    summary: 'Live threat intel in, automatic incidents and PDF reports out.',
    description: [
      'Pulls live threat intel from URLhaus, AlienVault OTX and Feodo Tracker, checks IPs and domains against 150,000+ indicators, creates incidents automatically, and shows them on a live dashboard with PDF reports.',
    ],
    stats: ['150,000+ indicators', '3 threat feeds'],
    tools: ['Python', 'Flask', 'SQLite', 'ReportLab'],
    links: [gh('cybershield')],
  },
  {
    id: 'phi',
    name: 'PHI Leak Guard',
    pinned: true,
    summary: 'Masks patient information in clinical notes before the text reaches an AI.',
    description: [
      'A local app that finds and masks patient information in clinical notes before the text reaches an AI, and keeps a privacy-safe audit log.',
    ],
    stats: ['Runs fully local', 'Privacy-safe audit log'],
    tools: ['Python', 'Microsoft Presidio', 'spaCy', 'Streamlit', 'Ollama'],
    links: [gh('phi-leak-guard')],
  },
  {
    id: 'elk',
    name: 'Home Lab SIEM (ELK Stack)',
    folder: 'soc_and_detection',
    summary: 'Attacks from Kali Linux, caught and charted on a Kibana SOC dashboard.',
    description: ['Two VMs, attacks from Kali Linux, 26,000+ security events, Kibana SOC dashboard.'],
    stats: ['2 VMs', '26,000+ security events'],
    tools: ['Elasticsearch', 'Logstash', 'Kibana', 'Filebeat', 'Nmap', 'Hydra'],
    links: [gh('home-lab-siem')],
  },
  {
    id: 'phishguard',
    name: 'PhishGuard',
    folder: 'phishing',
    summary: 'Machine learning phishing URL detector with a Flask web app.',
    description: [
      'Machine learning phishing URL detector trained on 6,500+ real URLs with 24 engineered features, with a Flask web app.',
    ],
    stats: ['6,500+ real URLs', '24 engineered features'],
    tools: ['Python', 'scikit-learn', 'XGBoost', 'Flask'],
    links: [gh('phishguard')],
  },
  {
    id: 'email-analyzer',
    name: 'Phishing Email Analyzer',
    folder: 'phishing',
    summary: 'Classifies email text as phishing or legitimate.',
    description: ['Classifies email text as phishing or legitimate, trained on 82,486 real emails, 98% accuracy.'],
    stats: ['82,486 real emails', '98% accuracy'],
    tools: ['Python', 'scikit-learn', 'TF-IDF'],
    links: [gh('phishing-email-analyzer')],
  },
  {
    id: 'vuln-scanner',
    name: 'Vulnerability Scanner',
    folder: 'vulnerability_and_network',
    summary: 'Nmap scan to CVE matches to a CVSS-rated PDF report.',
    description: [
      'Scans with Nmap, matches services to CVEs from the NIST NVD, rates risk by CVSS, and creates a PDF report.',
    ],
    stats: ['CVEs from NIST NVD', 'CVSS risk ratings'],
    tools: ['Python', 'Nmap', 'NVD API', 'ReportLab'],
    links: [gh('vulnerability-scanner')],
  },
  {
    id: 'segmentation',
    name: 'Secure Network Segmentation',
    folder: 'vulnerability_and_network',
    summary: 'An enterprise network with VLANs, a DMZ and ACLs that really block traffic.',
    description: [
      'A Cisco Packet Tracer enterprise network with HR, IT and Guest VLANs, a DMZ, and ACLs, with proof that blocked traffic is really blocked.',
    ],
    stats: ['3 VLANs', '1 DMZ'],
    tools: ['Cisco Packet Tracer'],
    links: [gh('secure-network-segmentation-packet-tracer')],
  },
  {
    id: 'vendor-risk',
    name: 'Vendor Risk Compliance',
    folder: 'grc',
    summary: 'A Power Platform app that scores vendors and routes high-risk approvals.',
    description: [
      'A Power Platform app that assesses vendors against a 15-question checklist based on NIST CSF and ISO 27001, routes high-risk approvals through Power Automate and Teams, and tracks remediation.',
    ],
    stats: ['15-question checklist', 'NIST CSF + ISO 27001'],
    tools: ['Power Platform', 'Power Automate', 'Microsoft Teams'],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/astha2310/vendor_risk_compliance', kind: 'github' },
      { label: 'Watch Demo', href: 'https://youtu.be/Ib378S8ZbV4', kind: 'demo' },
    ],
  },
  {
    id: 'fraud',
    name: 'Credit Card Fraud Detection',
    folder: 'fraud_and_data',
    summary: 'Finding the rare fraud case in a very imbalanced dataset.',
    description: ['Random Forest on 284,807 transactions with only 0.17% fraud, 97.66% AUC-ROC.'],
    stats: ['284,807 transactions', '0.17% fraud', '97.66% AUC-ROC'],
    tools: ['Random Forest'],
    links: [gh('fraud-detection')],
  },
  {
    id: 'bank-risk',
    name: 'Bank Transaction Risk Scoring',
    folder: 'fraud_and_data',
    summary: 'Rule-based risk scoring, including what I got wrong and how I fixed it.',
    description: [
      'A rule-based risk scoring system for 2,512 unlabeled transactions, including what I got wrong and how I fixed it.',
    ],
    stats: ['2,512 unlabeled transactions'],
    tools: ['Rule-based scoring'],
    links: [gh('bank-fraud-risk-scoring')],
  },
  {
    id: 'kdrama',
    name: 'My K-Drama Job Hunt',
    folder: 'just_for_fun',
    summary: 'A job tracker prototype that turns a job search into a K-drama.',
    description: ['A job tracker prototype that turns a job search into a K-drama.'],
    stats: [],
    tools: ['Figma'],
    links: [{ label: 'View Prototype', href: 'https://trade-dandy-59478299.figma.site/', kind: 'prototype' }],
  },
]

export const SKILL_MODULES: { name: string; file: string; skills: string[] }[] = [
  {
    name: 'Security Operations',
    file: 'secops.mod',
    skills: ['Alert Triage', 'Incident Response', 'Phishing Investigation', 'Threat Hunting', 'Log Analysis', 'MITRE ATT&CK'],
  },
  {
    name: 'SIEM & Tools',
    file: 'siem_tools.mod',
    skills: [
      'Microsoft Sentinel (KQL)',
      'Splunk',
      'IBM QRadar',
      'ELK Stack',
      'AbuseIPDB',
      'VirusTotal',
      'Wireshark',
      'Nmap',
    ],
  },
  { name: 'Cloud', file: 'cloud.mod', skills: ['Azure', 'AWS', 'IAM', 'CIS Benchmarks'] },
  {
    name: 'Systems & Identity',
    file: 'systems_identity.mod',
    skills: [
      'Windows',
      'Windows Server',
      'Linux',
      'Active Directory',
      'Microsoft Entra ID',
      'Microsoft 365',
      'Exchange',
    ],
  },
  {
    name: 'Networking',
    file: 'networking.mod',
    skills: ['TCP/IP', 'DNS', 'HTTP/S', 'Firewalls', 'VLANs', 'ACLs', 'SPF', 'DKIM', 'DMARC'],
  },
  {
    name: 'Scripting & Ticketing',
    file: 'scripting.mod',
    skills: ['Python', 'KQL', 'SQL', 'PowerShell', 'Bash', 'ServiceNow', 'Jira'],
  },
  {
    name: 'GRC & Frameworks',
    file: 'grc.mod',
    skills: ['NIST CSF', 'CIS Controls', 'ISO 27001', 'SOC 2', 'HIPAA'],
  },
]

export type Cert = {
  id: string
  name: string
  issuer: string
  status: 'in-progress' | 'verified'
  note?: string
  fingerprint: string
}

export const CERTS: Cert[] = [
  {
    id: 'secplus',
    name: 'CompTIA Security+',
    issuer: 'CompTIA',
    status: 'in-progress',
    note: 'Expected January 2027',
    fingerprint: 'SY0-701 · key pending',
  },
  {
    id: 'aws-csf',
    name: 'AWS Cloud Security Foundations',
    issuer: 'Amazon Web Services',
    status: 'verified',
    fingerprint: 'AWS · key verified',
  },
]
