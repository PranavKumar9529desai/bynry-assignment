import { Profile } from '../types/profile';

export const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    description: 'Full-stack developer with 5 years of experience building web applications using React, Node.js, and MongoDB.',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'USA',
      latitude: 37.7749,
      longitude: -122.4194
    },
    contactInfo: {
      email: 'alex.j@example.com',
      phone: '555-1234',
      website: 'https://alexj.dev'
    },
    interests: ['React', 'Node.js', 'MongoDB', 'Hiking'],
    createdAt: new Date('2023-01-15T10:00:00Z'),
    updatedAt: new Date('2023-06-22T15:30:00Z')
  },
  {
    id: '2',
    name: 'Sarah Williams',
    photo: 'https://randomuser.me/api/portraits/women/2.jpg',
    description: 'UX/UI designer specializing in creating intuitive and accessible user interfaces for web and mobile applications.',
    address: {
      street: '456 Market St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      latitude: 40.7128,
      longitude: -74.0060
    },
    contactInfo: {
      email: 'sarah.w@example.com',
      website: 'https://sarahwilliams.design'
    },
    interests: ['UX Design', 'UI Design', 'Accessibility', 'Photography'],
    createdAt: new Date('2023-02-10T11:00:00Z'),
    updatedAt: new Date('2023-07-05T09:00:00Z')
  },
  {
    id: '3',
    name: 'Michael Chen',
    photo: 'https://randomuser.me/api/portraits/men/3.jpg',
    description: 'DevOps engineer with expertise in AWS, Docker, and Kubernetes. Passionate about building scalable and reliable infrastructure.',
    address: {
      street: '789 Pine St',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
      latitude: 47.6062,
      longitude: -122.3321
    },
    contactInfo: {
      email: 'michael.c@example.com',
      phone: '555-5678'
    },
    interests: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Gaming'],
    createdAt: new Date('2023-03-22T14:15:00Z'),
    updatedAt: new Date('2023-05-18T11:45:00Z')
  },
  {
    id: '4',
    name: 'Priya Patel',
    photo: 'https://randomuser.me/api/portraits/women/4.jpg',
    description: 'Data scientist with a background in machine learning and statistical analysis. Experienced in Python, R, and TensorFlow.',
    address: {
      street: '101 Oak Ave',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
      latitude: 30.2672,
      longitude: -97.7431
    },
    contactInfo: {
      email: 'priya.p@example.com'
    },
    interests: ['Data Science', 'Machine Learning', 'Python', 'R', 'Yoga'],
    createdAt: new Date('2023-04-05T09:30:00Z'),
    updatedAt: new Date('2023-08-12T16:00:00Z')
  },
  {
    id: '5',
    name: 'David Rodriguez',
    photo: 'https://randomuser.me/api/portraits/men/5.jpg',
    description: 'Product manager with a focus on agile methodologies and user-centered design. Skilled in leading cross-functional teams.',
    address: {
      street: '210 Maple Dr',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60606',
      country: 'USA',
      latitude: 41.8781,
      longitude: -87.6298
    },
    contactInfo: {
      email: 'david.r@example.com',
      phone: '555-9012',
      website: 'https://davidrodriguez.pm'
    },
    interests: ['Product Management', 'Agile', 'User Research', 'Cooking'],
    createdAt: new Date('2023-05-18T13:00:00Z'),
    updatedAt: new Date('2023-09-01T10:20:00Z')
  }
]; 