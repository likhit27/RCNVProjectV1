export const externalLinks = {
  district: 'https://rid3030.rotaryindia.org/',
  ri: 'https://www.rotary.org/',
  myRotary: 'https://my.rotary.org/',
  existing: 'https://rcnv.in/',
};

export type Project = {
  id: string; title: string; date: string; year: string; avenue: string;
  summary: string; impact: { value: string; label: string }[]; source: string;
};

export const projects: Project[] = [
  {
    id: 'trees', title: 'Tree Plantation at Palsad Village', date: 'July 2025', year: '2025-26',
    avenue: 'Community Service',
    summary: 'Members and local partners planted saplings at Palsad village. The Parwani Group sponsored the drive.',
    impact: [],
    source: 'https://timesofindia.indiatimes.com/city/nagpur/rcnv-organises-tree-plantation-and-blood-donation-drive-with-enthusiastic-participation/articleshow/122372737.cms',
  },
  {
    id: 'blood', title: 'Blood Donation Camp', date: '4 July 2025', year: '2025-26',
    avenue: 'Community Service',
    summary: 'A camp at Hotel Centre Point with CIIHO Blood Bank, supported by members and the 2025-26 board.',
    impact: [{ value: '20', label: 'units of blood collected' }],
    source: 'https://timesofindia.indiatimes.com/city/nagpur/rcnv-organises-tree-plantation-and-blood-donation-drive-with-enthusiastic-participation/articleshow/122372737.cms',
  },
  {
    id: 'health', title: 'Health Check-up Camp for Students', date: '12 November 2025', year: '2025-26',
    avenue: 'Community Service',
    summary: 'With Shalinitai Meghe Hospital, paediatric and dental screenings at Tilak Vidyalaya, Dhantoli, plus a hygiene session for girls. A clothes donation drive ran alongside.',
    impact: [{ value: '~300', label: 'students screened' }, { value: '~60', label: 'girls at hygiene session' }],
    source: 'https://timesofindia.indiatimes.com/city/nagpur/rotary-club-of-nagpur-vision-conducts-clothes-donation-drive-health-camp-and-hygiene-session/articleshow/125370088.cms',
  },
];

export const avenues = [
  { name: 'Club Service', text: 'Running the club well: fellowship, meetings, communication and membership.' },
  { name: 'Vocational Service', text: "Using members' professions to serve others and to uphold high ethical standards at work." },
  { name: 'Community Service', text: 'Projects that meet needs in Nagpur — health camps, blood donation and tree plantation.' },
  { name: 'International Service', text: 'Partnering with clubs and The Rotary Foundation on work beyond our city.' },
  { name: 'Youth Service', text: 'Programmes that develop young people, including a Model United Nations Assembly in District 3030.' },
];

export const causes = [
  'Promoting peace', 'Fighting disease', 'Providing clean water', 'Saving mothers and children',
  'Supporting education', 'Growing local economies', 'Protecting the environment',
];

export const boardRoles = [
  'President', 'Immediate Past President', 'President Elect', 'Secretary', 'Joint Secretary', 'Treasurer',
  'Sergeant at Arms', 'Club Service Director', 'Vocational Service Director', 'Community Service Director',
  'International Service Director', 'Youth Service Director', 'Rotary Foundation Director', 'Membership Director',
];

export const months = [
  'July', 'August', 'September', 'October', 'November', 'December',
  'January', 'February', 'March', 'April', 'May', 'June',
];

export const currentYear = '2025-26';
