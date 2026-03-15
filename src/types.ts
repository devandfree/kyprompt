export interface Page {
  id: string;
  name: string;
  description: string;
}

export interface FormState {
  // Section 1: Résumé
  projectName: string;
  projectType: string;
  shortDescription: string;
  longDescription: string;
  targetAudience: string;
  mainGoal: string;

  // Section 2: Pages
  pages: Page[];

  // Section 3: Design
  ambiances: string[];
  referenceSites: string;

  // Section 4: Charte
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fonts: string;

  // Section 5: Fonctionnalités
  features: string;
  techStack: string;
  languages: string;

  // Section 6: Contraintes
  responsiveExigences: string;
  seoExigences: string;
  specificConstraints: string;

  // New Sections
  competitors: string;
  userPersonas: string;
  integrations: string;
  dataModel: string;
  toneOfVoice: string;
  roadmap: string;
}

export const INITIAL_STATE: FormState = {
  projectName: '',
  projectType: '',
  shortDescription: '',
  longDescription: '',
  targetAudience: '',
  mainGoal: '',
  pages: [{ id: '1', name: 'Accueil', description: 'Page principale présentant le service.' }],
  ambiances: [],
  referenceSites: '',
  primaryColor: '#3b82f6',
  secondaryColor: '#1e293b',
  accentColor: '#10b981',
  fonts: 'Inter, sans-serif',
  features: '',
  techStack: 'React, Tailwind CSS, Lucide Icons',
  languages: 'Français',
  responsiveExigences: 'Mobile-first, entièrement responsive.',
  seoExigences: 'Optimisation des balises meta, structure Hn propre.',
  specificConstraints: '',
  competitors: '',
  userPersonas: '',
  integrations: '',
  dataModel: '',
  toneOfVoice: '',
  roadmap: '',
};

export const AMBIANCE_OPTIONS = [
  'Moderne',
  'Minimaliste',
  'Brutaliste',
  'Corporate',
  'Ludique',
  'Sombre',
  'Clair',
  'Technique',
  'Élégant',
  'Futuriste'
];
