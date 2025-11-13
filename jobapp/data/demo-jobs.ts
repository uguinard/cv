import { Job, JobStatus, Update } from '../types';

const getFutureDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const DEMO_JOBS: Job[] = [
  {
    id: 'demo-1',
    title: 'High School Spanish Teacher',
    company: 'American School of Paris',
    location: 'Paris, France',
    deadline: getFutureDate(3),
    url: 'https://www.asparis.org/employment',
    status: JobStatus.WISHLIST,
    starting: '2024-08-15',
    source: 'TES',
    description: 'Seeking an experienced and dynamic Spanish teacher for our high school program (Grades 9-12). The ideal candidate will have experience with the IB Diploma Programme and a passion for fostering language acquisition in a diverse, international student body. Responsibilities include curriculum development, student assessment, and contributing to the school\'s extracurricular activities.',
    updates: [],
  },
  {
    id: 'demo-2',
    title: 'MYP Spanish Teacher',
    company: 'International School of Geneva',
    location: 'Geneva, Switzerland',
    deadline: getFutureDate(10),
    url: 'https://www.ecolint.ch/careers',
    status: JobStatus.WISHLIST,
    starting: '2024-08-20',
    source: 'Schrole',
    description: 'We are looking for a qualified teacher of Spanish to join our Middle Years Programme (MYP) team. Candidates should be familiar with the IBO philosophy and framework. A commitment to collaborative planning and inquiry-based learning is essential. Fluency in English is required; French is a strong asset.',
    updates: [],
  },
  {
    id: 'demo-3',
    title: 'Spanish Language Acquisition Teacher',
    company: 'United World College of South East Asia',
    location: 'Singapore, Singapore',
    deadline: getFutureDate(25),
    url: 'https://www.uwcsea.edu.sg/careers',
    status: JobStatus.APPLYING,
    starting: '2025-01-10',
    source: 'UWCSEA Website',
    description: 'UWCSEA has an opening for a creative and dedicated Spanish teacher on its Dover Campus. The position involves teaching across a range of ages and abilities. We are seeking a teacher who can inspire students and contribute positively to our vibrant learning community.',
    updates: [
      {
        id: 'update-1',
        text: 'Follow up with HR about the application status by the end of the week.',
        isReminder: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'update-2',
        text: 'Submitted initial application through the school portal.',
        isReminder: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      }
    ],
  },
  {
    id: 'demo-4',
    title: 'Whole School Spanish Teacher',
    company: 'The British School of Beijing',
    location: 'Beijing, China',
    deadline: getFutureDate(-15), // Past deadline
    url: 'https://www.nordangliaeducation.com/our-schools/beijing/shunyi/working-at-our-school',
    status: JobStatus.INTERVIEWING,
    starting: '2024-08-01',
    source: 'Nord Anglia',
    description: 'An exciting opportunity to teach Spanish across our Primary and Secondary schools. The successful candidate will be adaptable, a native-level Spanish speaker, and hold internationally recognized teaching qualifications. Experience in the English National Curriculum is desirable.',
    updates: [],
  },
  {
    id: 'demo-5',
    title: 'Teacher of Spanish',
    company: 'King\'s College, The British School of Madrid',
    location: 'Madrid, Spain',
    deadline: getFutureDate(6),
    url: 'https://www.kingscollegeschools.org/madrid/soto-de-vinuelas/vacancies/',
    status: JobStatus.WISHLIST,
    starting: '2024-09-01',
    source: 'TodoELE',
    description: 'King\'s College Madrid is seeking to appoint a well-qualified and enthusiastic Teacher of Spanish. This is an opportunity to join a highly successful and prestigious school. The ability to teach up to A-Level is required.',
    updates: [],
  },
];