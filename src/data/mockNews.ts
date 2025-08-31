import { NewsArticle } from '@/types/news';
import { extendedMockNews } from './extendedMockNews';

export const mockNewsData: NewsArticle[] = [
  ...extendedMockNews,
  {
    id: '1',
    title: 'Breaking: Major Technology Breakthrough in AI Research Announced',
    summary: 'Scientists have developed a new artificial intelligence system that can process and understand human emotions with unprecedented accuracy. This breakthrough could revolutionize healthcare, education, and customer service industries. The research, conducted over three years, involved teams from leading universities worldwide.',
    content: `A team of international researchers has achieved a groundbreaking milestone in artificial intelligence development, creating an advanced AI system capable of processing and understanding human emotions with unprecedented accuracy levels reaching 94.5%. This revolutionary breakthrough, announced at the World AI Conference in Singapore, represents three years of collaborative research involving teams from leading universities across the United States, Europe, and Asia.

The new AI system, dubbed "EmotiQ," utilizes advanced deep learning algorithms combined with multimodal analysis techniques to interpret human emotions through facial expressions, voice patterns, body language, and even physiological indicators such as heart rate variability and skin conductance. Unlike previous emotion recognition systems that relied primarily on visual cues, EmotiQ integrates multiple data streams to create a comprehensive emotional profile.

Dr. Sarah Chen, the lead researcher from MIT who spearheaded the project, explained that the system goes beyond simple emotion classification. "EmotiQ doesn't just identify whether someone is happy or sad," Dr. Chen noted. "It understands the nuances of human emotional states, recognizing complex emotions like nostalgic happiness, anxious excitement, or conflicted satisfaction. This level of emotional granularity has never been achieved before in AI systems."

The breakthrough has immediate applications across multiple industries. In healthcare, EmotiQ could revolutionize mental health diagnosis and treatment by providing objective measurements of patient emotional states, helping clinicians identify depression, anxiety, and other mental health conditions more accurately. Early trials at Massachusetts General Hospital showed the system could detect early signs of depression with 91% accuracy, often identifying symptoms before patients themselves recognized them.

Educational applications are equally promising. The system can monitor student engagement and emotional responses during learning, allowing educators to adapt their teaching methods in real-time. Pilot programs in schools have shown 23% improvement in student comprehension when teachers used EmotiQ feedback to adjust their instruction styles.

Customer service industries are already expressing significant interest in the technology. Major corporations see potential for creating more empathetic AI assistants that can respond appropriately to customer emotions, potentially reducing customer service complaints by up to 40% according to preliminary studies.`,
    category: 'tech',
    source: 'TechDaily',
    author: 'Dr. Sarah Chen',
    publishedAt: '2024-01-15T10:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    readTime: 5,
    isBookmarked: false,
  },
  {
    id: '2',
    title: 'Cricket World Cup: India Secures Victory in Thrilling Final Match',
    summary: 'In a nail-biting finish that went into overtime, Team India claimed victory against Australia with a score of 285-280. The match, watched by over 1 billion viewers worldwide, showcased exceptional performances from both teams. Captain Virat Kohli played a crucial role in the winning strategy.',
    content: 'Full article content here...',
    category: 'sports',
    source: 'Sports Tribune',
    author: 'Rajesh Kumar',
    publishedAt: '2024-01-15T08:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    readTime: 3,
    isBookmarked: true,
  },
  {
    id: '3',
    title: 'New Economic Policy Aims to Boost Small Business Growth Across India',
    summary: 'The government has unveiled a comprehensive economic package worth ₹50,000 crores to support small and medium enterprises. The policy includes tax incentives, easier loan access, and digital infrastructure improvements. Finance Minister expects this to create 2 million new jobs in the next two years.',
    content: 'Full article content here...',
    category: 'business',
    source: 'Economic Times',
    author: 'Priya Sharma',
    publishedAt: '2024-01-15T06:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    readTime: 4,
    isBookmarked: false,
  },
  {
    id: '4',
    title: 'Healthcare Revolution: New Medical Center Opens in Mumbai',
    summary: 'A state-of-the-art medical facility equipped with the latest technology has opened its doors to patients. The center features robotic surgery capabilities, AI-powered diagnostics, and telemedicine services. This facility is expected to serve over 100,000 patients annually and reduce treatment waiting times significantly.',
    content: 'Full article content here...',
    category: 'health',
    source: 'Health Today',
    author: 'Dr. Amit Patel',
    publishedAt: '2024-01-14T16:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    readTime: 6,
    isBookmarked: false,
  },
  {
    id: '5',
    title: 'Bollywood Star Announces Major Environmental Initiative',
    summary: 'Leading actor Aamir Khan has launched a nationwide campaign to plant 10 million trees across India. The initiative, backed by several celebrities and corporate sponsors, aims to combat climate change and promote environmental awareness. The campaign will span across 15 states and involve local communities.',
    content: 'Full article content here...',
    category: 'entertainment',
    source: 'Entertainment Weekly',
    author: 'Kavya Nair',
    publishedAt: '2024-01-14T14:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80',
    readTime: 4,
    isBookmarked: true,
  },
  {
    id: '6',
    title: 'Parliament Passes Historic Education Reform Bill',
    summary: 'The new education bill promises to revolutionize the Indian education system with emphasis on practical learning, multilingual education, and technology integration. The reform includes provisions for online learning platforms, teacher training programs, and infrastructure development in rural areas.',
    content: 'Full article content here...',
    category: 'politics',
    source: 'National Herald',
    author: 'Suresh Menon',
    publishedAt: '2024-01-14T12:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1541538688-8ad1b13c75bf?w=800&q=80',
    readTime: 7,
    isBookmarked: false,
  },
];