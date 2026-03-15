import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Layout, 
  Palette, 
  Settings, 
  FileText, 
  Target, 
  Monitor, 
  Zap,
  ChevronRight,
  Sparkles,
  Users,
  Database,
  Link,
  MessageSquare,
  Milestone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FormState, INITIAL_STATE, AMBIANCE_OPTIONS, Page } from './types';

type MarkdownStyle = 'standard' | 'compact' | 'bold';

interface PromptOptions {
  showSummary: boolean;
  showPages: boolean;
  showStrategy: boolean;
  showDesign: boolean;
  showColors: boolean;
  showFeatures: boolean;
  showTechnical: boolean;
  showConstraints: boolean;
  showRoadmap: boolean;
  style: MarkdownStyle;
}

const SECTIONS = [
  { id: 'section1', label: 'Résumé', icon: <FileText className="w-4 h-4" />, color: 'blue' },
  { id: 'section2', label: 'Structure', icon: <Layout className="w-4 h-4" />, color: 'indigo' },
  { id: 'section3', label: 'Design', icon: <Zap className="w-4 h-4" />, color: 'amber' },
  { id: 'section4', label: 'Charte', icon: <Palette className="w-4 h-4" />, color: 'emerald' },
  { id: 'section5', label: 'Fonctions', icon: <Settings className="w-4 h-4" />, color: 'purple' },
  { id: 'section8', label: 'Données', icon: <Database className="w-4 h-4" />, color: 'cyan' },
  { id: 'section6', label: 'Contexte', icon: <Monitor className="w-4 h-4" />, color: 'rose' },
  { id: 'section7', label: 'Stratégie', icon: <Users className="w-4 h-4" />, color: 'orange' },
  { id: 'section9', label: 'Futur', icon: <Milestone className="w-4 h-4" />, color: 'amber' },
];

export default function App() {
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [isGenerated, setIsGenerated] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('section1');
  const isScrollingRef = useRef(false);
  const [view, setView] = useState<'landing' | 'form' | 'preview'>('landing');
  const [editablePrompt, setEditablePrompt] = useState('');
  const [promptOptions, setPromptOptions] = useState<PromptOptions>({
    showSummary: true,
    showPages: true,
    showStrategy: true,
    showDesign: true,
    showColors: true,
    showFeatures: true,
    showTechnical: true,
    showConstraints: true,
    showRoadmap: true,
    style: 'standard'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAmbiance = (ambiance: string) => {
    setFormData(prev => ({
      ...prev,
      ambiances: prev.ambiances.includes(ambiance)
        ? prev.ambiances.filter(a => a !== ambiance)
        : [...prev.ambiances, ambiance]
    }));
  };

  const addPage = () => {
    const newPage: Page = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: ''
    };
    setFormData(prev => ({ ...prev, pages: [...prev.pages, newPage] }));
  };

  const removePage = (id: string) => {
    setFormData(prev => ({ ...prev, pages: prev.pages.filter(p => p.id !== id) }));
  };

  const updatePage = (id: string, field: keyof Page, value: string) => {
    setFormData(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  useEffect(() => {
    if (view !== 'form') return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) return;
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTIONS.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [view]);

  const generatePromptText = (options: PromptOptions = promptOptions) => {
    const h1 = options.style === 'bold' ? '# ' : '# ';
    const h2 = options.style === 'bold' ? '### ' : '## ';
    const bullet = options.style === 'compact' ? '• ' : '- ';
    const bold = (text: string) => options.style === 'bold' ? `**${text.toUpperCase()}**` : `**${text}**`;

    let sections: string[] = [];

    sections.push(`${h1}PROJET : ${formData.projectName || 'Sans nom'}`);

    if (options.showSummary) {
      sections.push(`${h2}1. RÉSUMÉ DU PROJET
${bullet}${bold('Type de plate-forme :')} ${formData.projectType || 'N/A'}
${bullet}${bold('Description courte :')} ${formData.shortDescription || 'N/A'}
${bullet}${bold('Description détaillée :')} ${formData.longDescription || 'N/A'}
${bullet}${bold('Cible :')} ${formData.targetAudience || 'N/A'}
${bullet}${bold('Objectif principal :')} ${formData.mainGoal || 'N/A'}`);
    }

    if (options.showPages) {
      sections.push(`${h2}2. PAGES & STRUCTURE
${formData.pages.map(p => `${bullet}${bold(p.name || 'Page sans nom')} : ${p.description || 'Pas de description'}`).join('\n')}`);
    }

    if (options.showDesign) {
      sections.push(`${h2}3. DIRECTION DESIGN & TON
${bullet}${bold('Ambiances :')} ${formData.ambiances.join(', ') || 'N/A'}
${bullet}${bold('Sites de référence :')} ${formData.referenceSites || 'N/A'}
${bullet}${bold('Ton de voix :')} ${formData.toneOfVoice || 'N/A'}`);
    }

    if (options.showColors) {
      sections.push(`${h2}4. CHARTE GRAPHIQUE
${bullet}${bold('Couleur Primaire :')} ${formData.primaryColor}
${bullet}${bold('Couleur Secondaire :')} ${formData.secondaryColor}
${bullet}${bold('Couleur Accent :')} ${formData.accentColor}
${bullet}${bold('Polices :')} ${formData.fonts || 'N/A'}`);
    }

    if (options.showFeatures) {
      sections.push(`${h2}5. FONCTIONNALITÉS CLÉS
${bullet}${bold('Fonctionnalités :')} ${formData.features || 'N/A'}
${bullet}${bold('Stack technique :')} ${formData.techStack || 'N/A'}
${bullet}${bold('Langues :')} ${formData.languages || 'N/A'}`);
    }

    if (options.showTechnical) {
      sections.push(`${h2}6. TECHNIQUE & DONNÉES
${bullet}${bold('Modèle de données :')} ${formData.dataModel || 'N/A'}
${bullet}${bold('Intégrations :')} ${formData.integrations || 'N/A'}`);
    }

    if (options.showConstraints) {
      sections.push(`${h2}7. CONTRAINTES & CONTEXTE
${bullet}${bold('Responsive :')} ${formData.responsiveExigences || 'N/A'}
${bullet}${bold('SEO :')} ${formData.seoExigences || 'N/A'}
${bullet}${bold('Contraintes spécifiques :')} ${formData.specificConstraints || 'N/A'}`);
    }

    if (options.showStrategy) {
      sections.push(`${h2}8. STRATÉGIE & CIBLE
${bullet}${bold('User Personas :')} ${formData.userPersonas || 'N/A'}
${bullet}${bold('Concurrents :')} ${formData.competitors || 'N/A'}`);
    }

    if (options.showRoadmap) {
      sections.push(`${h2}9. ROADMAP & FUTUR
${bullet}${bold('Roadmap :')} ${formData.roadmap || 'N/A'}`);
    }

    const prompt = sections.join('\n\n') + '\n\n---\n*Généré avec PromptArchitect*';
    return prompt.trim();
  };

  const handleGeneratePrompt = () => {
    const prompt = generatePromptText(promptOptions);
    setEditablePrompt(prompt);
    setView('preview');
  };

  useEffect(() => {
    if (view === 'preview') {
      const prompt = generatePromptText(promptOptions);
      setEditablePrompt(prompt);
    }
  }, [promptOptions, view]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editablePrompt).then(() => {
      setCopySuccess(true);
      setIsGenerated(true);
      setTimeout(() => {
        setCopySuccess(false);
        setIsGenerated(false);
      }, 3000);
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      isScrollingRef.current = true;
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      
      // Reset the manual scroll flag after the animation is likely finished
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
        {/* Noise Texture Overlay */}
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Background Gradients */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-black/40 backdrop-blur-2xl px-8 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">PromptArchitect</span>
            </div>
            <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/50">
              <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">Méthode</a>
              <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
            </div>
            <button 
              onClick={() => setView('form')}
              className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              Lancer l'outil
            </button>
          </div>
        </nav>

        <main className="relative pt-40 pb-32 px-8">
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto text-center mb-40">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase mb-12">
                <Zap className="w-3 h-3 fill-current" />
                L'avenir du développement IA est ici
              </div>
              
              <h1 className="text-7xl md:text-[140px] font-display font-bold tracking-tighter leading-[0.8] mb-12">
                <span className="block">CONCEVEZ.</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">GÉNÉREZ.</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">RÉUSSISSEZ.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto mb-16 font-light leading-relaxed">
                Transformez vos idées en architectures logicielles précises. <br className="hidden md:block" />
                Générez des prompts structurés pour Lovable, Bolt et v0 en quelques secondes.
              </p>

              <div className="flex flex-col sm:row items-center justify-center gap-6">
                <button 
                  onClick={() => setView('form')}
                  className="group relative bg-white text-black px-10 py-5 rounded-2xl font-black text-xl transition-all flex items-center gap-4 shadow-2xl shadow-white/10 hover:scale-105 active:scale-95"
                >
                  Démarrer maintenant
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-10 py-5 rounded-2xl font-bold text-xl text-white/80 hover:bg-white/5 transition-all border border-white/10 backdrop-blur-sm">
                  Explorer les templates
                </button>
              </div>
            </motion.div>
          </section>

          {/* Partner Marquee */}
          <section className="mb-40 overflow-hidden py-10 border-y border-white/5 bg-white/[0.02]">
            <div className="flex whitespace-nowrap animate-marquee">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-20 px-10">
                  <span className="text-4xl font-display font-black tracking-tighter opacity-20 hover:opacity-100 transition-opacity cursor-default">LOVABLE</span>
                  <span className="text-4xl font-display font-black tracking-tighter opacity-20 hover:opacity-100 transition-opacity cursor-default">BOLT.NEW</span>
                  <span className="text-4xl font-display font-black tracking-tighter opacity-20 hover:opacity-100 transition-opacity cursor-default">V0.DEV</span>
                  <span className="text-4xl font-display font-black tracking-tighter opacity-20 hover:opacity-100 transition-opacity cursor-default">CURSOR</span>
                  <span className="text-4xl font-display font-black tracking-tighter opacity-20 hover:opacity-100 transition-opacity cursor-default">REPLICATE</span>
                  <span className="text-4xl font-display font-black tracking-tighter opacity-20 hover:opacity-100 transition-opacity cursor-default">MIDJOURNEY</span>
                </div>
              ))}
            </div>
          </section>

          {/* Bento Grid Features */}
          <section id="features" className="max-w-7xl mx-auto mb-40">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">Une boîte à outils complète.</h2>
              <p className="text-white/40 text-lg">Tout ce dont vous avez besoin pour passer de l'idée au code.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
              {/* Feature 1: Large */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="md:col-span-8 md:row-span-2 bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 rounded-[40px] p-12 flex flex-col justify-between relative group overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Layout className="w-8 h-8" />
                  </div>
                  <h3 className="text-4xl font-display font-bold mb-6">Architecture Système</h3>
                  <p className="text-white/40 text-xl max-w-md leading-relaxed">Définissez vos entités de données, vos pages et vos flux utilisateurs avec une précision chirurgicale.</p>
                </div>
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
                <div className="mt-12 grid grid-cols-2 gap-6 relative z-10">
                  <div className="h-48 bg-black/40 rounded-3xl border border-white/5 p-6 backdrop-blur-xl">
                    <div className="flex gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-3/4 bg-white/20 rounded-full" />
                      <div className="h-2 w-full bg-white/10 rounded-full" />
                      <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                    </div>
                  </div>
                  <div className="h-48 bg-blue-600/10 rounded-3xl border border-blue-500/20 p-6 backdrop-blur-xl flex items-center justify-center">
                    <Database className="w-12 h-12 text-blue-400/50" />
                  </div>
                </div>
              </motion.div>

              {/* Feature 2: Tall */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="md:col-span-4 md:row-span-2 bg-[#111] border border-white/10 rounded-[40px] p-12 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-16 h-16 bg-purple-600/20 text-purple-400 rounded-3xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-6">Vitesse de Lumière</h3>
                  <p className="text-white/40 leading-relaxed">Générez des instructions complexes en un clic. Gagnez des heures de rédaction manuelle.</p>
                </div>
                <div className="h-64 bg-gradient-to-t from-purple-600/20 to-transparent rounded-3xl border border-purple-500/10 flex items-end p-8">
                  <div className="w-full space-y-4">
                    <div className="h-1 w-full bg-purple-500/40 rounded-full" />
                    <div className="h-1 w-2/3 bg-purple-500/20 rounded-full" />
                  </div>
                </div>
              </motion.div>

              {/* Feature 3: Wide */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="md:col-span-6 bg-white/[0.03] border border-white/10 rounded-[40px] p-12 flex items-center gap-8 group"
              >
                <div className="flex-1">
                  <div className="w-14 h-14 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                    <Palette className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4">Identité Visuelle</h3>
                  <p className="text-white/40 text-sm">Intégrez votre charte graphique directement dans le prompt.</p>
                </div>
                <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin-slow" />
              </motion.div>

              {/* Feature 4: Standard */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="md:col-span-6 bg-white/[0.03] border border-white/10 rounded-[40px] p-12 flex items-center gap-8 group"
              >
                <div className="flex-1">
                  <div className="w-14 h-14 bg-orange-600/20 text-orange-400 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4">Précision Cible</h3>
                  <p className="text-white/40 text-sm">Définissez vos personas pour un ton de voix parfaitement adapté.</p>
                </div>
                <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full bg-white/10 border-2 border-black" />
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Method Section */}
          <section id="how-it-works" className="max-w-7xl mx-auto mb-40">
            <div className="flex flex-col md:flex-row gap-20 items-center">
              <div className="flex-1">
                <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-12">La méthode <span className="text-blue-500">Architect.</span></h2>
                <div className="space-y-12">
                  {[
                    { step: '01', title: 'Conception', desc: 'Définissez vos objectifs, votre cible et la vision globale de votre application.' },
                    { step: '02', title: 'Architecture', desc: 'Structurez vos entités de données, vos pages et vos flux utilisateurs avec précision.' },
                    { step: '03', title: 'Génération', desc: 'Obtenez un prompt optimisé prêt à être utilisé dans Lovable, Bolt ou v0.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-8 group">
                      <span className="text-2xl font-display font-black text-white/10 group-hover:text-blue-500 transition-colors">{item.step}</span>
                      <div>
                        <h4 className="text-2xl font-bold mb-2">{item.title}</h4>
                        <p className="text-white/40 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full aspect-square bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-[60px] border border-white/10 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="relative z-10 w-3/4 h-3/4 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                  <div className="flex gap-2 mb-8">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-3/4 bg-blue-500/20 rounded-full animate-pulse" />
                    <div className="h-4 w-full bg-white/5 rounded-full" />
                    <div className="h-4 w-5/6 bg-white/5 rounded-full" />
                    <div className="h-4 w-2/3 bg-white/5 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Showcase Section */}
          <section id="showcase" className="max-w-7xl mx-auto mb-40">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">Inspirations.</h2>
              <p className="text-white/40 text-lg">Découvrez ce que vous pouvez construire avec PromptArchitect.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'SaaS Dashboard', tag: 'Analytics', img: 'https://picsum.photos/seed/saas/800/600' },
                { title: 'E-commerce Platform', tag: 'Shop', img: 'https://picsum.photos/seed/shop/800/600' },
                { title: 'AI Portfolio', tag: 'Creative', img: 'https://picsum.photos/seed/creative/800/600' },
                { title: 'Mobile App MVP', tag: 'Startup', img: 'https://picsum.photos/seed/app/800/600' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="group relative aspect-[4/3] rounded-[40px] overflow-hidden border border-white/10 cursor-pointer"
                >
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-12 flex flex-col justify-end">
                    <span className="text-blue-400 text-xs font-black tracking-widest uppercase mb-4">{item.tag}</span>
                    <h4 className="text-3xl font-display font-bold">{item.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-5xl mx-auto mb-40">
            <div className="bg-gradient-to-tr from-blue-600 to-purple-700 rounded-[48px] p-16 md:p-24 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <div className="relative z-10">
                <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-10">Prêt à construire ?</h2>
                <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto">Rejoignez les milliers de builders qui utilisent PromptArchitect pour accélérer leur workflow.</p>
                <button 
                  onClick={() => setView('form')}
                  className="bg-white text-black px-12 py-6 rounded-2xl font-black text-2xl hover:scale-105 transition-transform shadow-2xl shadow-black/20"
                >
                  Commencer gratuitement
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-20 px-8 bg-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <span className="text-2xl font-display font-bold tracking-tight">PromptArchitect</span>
              </div>
              <p className="text-white/30 max-w-sm leading-relaxed">L'architecte de vos projets IA. Structurez vos idées, générez vos prompts, construisez le futur.</p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Produit</h4>
              <ul className="space-y-4 text-white/40 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Communauté</h4>
              <ul className="space-y-4 text-white/40 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:row items-center justify-between gap-6 text-xs text-white/20">
            <p>© 2026 PromptArchitect. Fait avec passion pour les builders.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Conditions</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (view === 'preview') {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-blue-100">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setView('form')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Aperçu du Prompt</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView('form')}
              className="text-gray-500 hover:text-gray-900 font-medium px-4 py-2"
            >
              Retour à l'édition
            </button>
            <button 
              onClick={copyToClipboard}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95"
            >
              {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copySuccess ? 'Copié !' : 'Copier le prompt final'}
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Customization Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Personnalisation
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Style Markdown</label>
                  <div className="grid grid-cols-1 gap-2">
                    {(['standard', 'compact', 'bold'] as MarkdownStyle[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setPromptOptions(prev => ({ ...prev, style: s }))}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                          promptOptions.style === s 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Sections à inclure</label>
                  <div className="space-y-2">
                    {[
                      { key: 'showSummary', label: 'Résumé' },
                      { key: 'showPages', label: 'Pages' },
                      { key: 'showStrategy', label: 'Stratégie' },
                      { key: 'showDesign', label: 'Design' },
                      { key: 'showColors', label: 'Charte Graphique' },
                      { key: 'showFeatures', label: 'Fonctionnalités' },
                      { key: 'showTechnical', label: 'Technique' },
                      { key: 'showConstraints', label: 'Contraintes' },
                      { key: 'showRoadmap', label: 'Roadmap' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <input 
                          type="checkbox"
                          checked={promptOptions[item.key as keyof PromptOptions] as boolean}
                          onChange={() => setPromptOptions(prev => ({ 
                            ...prev, 
                            [item.key]: !prev[item.key as keyof PromptOptions] 
                          }))}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Prompt Preview */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Votre prompt structuré</h2>
                  <p className="text-sm text-gray-500">Vous pouvez modifier ou compléter le texte ci-dessous avant de le copier.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                  <FileText className="w-3 h-3" />
                  {editablePrompt.length} caractères
                </div>
              </div>
              
              <textarea 
                value={editablePrompt}
                onChange={(e) => setEditablePrompt(e.target.value)}
                className="w-full h-[65vh] p-6 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm leading-relaxed"
                spellCheck={false}
              />
            </motion.div>
          </div>
        </main>

        {/* Success Notification */}
        <AnimatePresence>
          {isGenerated && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[100]"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <p className="font-bold">Copié dans le presse-papier !</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => setView('landing')}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <h1 className="text-xl font-bold tracking-tight text-gray-900">PromptArchitect</h1>
        </button>
        <button 
          onClick={handleGeneratePrompt}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          Générer le prompt
        </button>
      </header>

      <main className="max-w-6xl mx-auto flex gap-8 p-8">
        {/* Sidebar Navigation */}
        <aside className="w-64 shrink-0 hidden lg:block sticky top-24 h-fit">
          <nav className="space-y-1">
            {SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              const colorClasses: Record<string, string> = {
                blue: isActive ? 'bg-blue-50 text-blue-600 ring-blue-100' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50',
                indigo: isActive ? 'bg-indigo-50 text-indigo-600 ring-indigo-100' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50',
                orange: isActive ? 'bg-orange-50 text-orange-600 ring-orange-100' : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50',
                amber: isActive ? 'bg-amber-50 text-amber-600 ring-amber-100' : 'text-gray-500 hover:text-amber-600 hover:bg-amber-50',
                emerald: isActive ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50',
                purple: isActive ? 'bg-purple-50 text-purple-600 ring-purple-100' : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50',
                cyan: isActive ? 'bg-cyan-50 text-cyan-600 ring-cyan-100' : 'text-gray-500 hover:text-cyan-600 hover:bg-cyan-50',
                rose: isActive ? 'bg-rose-50 text-rose-600 ring-rose-100' : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50',
              };

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'shadow-sm ring-1' : ''
                  } ${colorClasses[section.color]}`}
                >
                  <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                    {section.icon}
                  </div>
                  {section.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Form Content */}
        <div className="flex-1 space-y-12 pb-32">
          {/* Section 1 */}
          <section id="section1" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Résumé du projet</h2>
                <p className="text-sm text-gray-500">Posez le contexte général de votre application.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nom du projet</label>
                <input 
                  type="text" 
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="Ex: MySaaS, Portfolio..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Type de plate-forme</label>
                <input 
                  type="text" 
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  placeholder="Ex: E-commerce, Dashboard..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description courte</label>
                <textarea 
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Décrivez brièvement ce que fait votre site..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description détaillée (Longue)</label>
                <textarea 
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Détaillez ici le concept, les valeurs, ou tout autre information contextuelle importante..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Cible</label>
                <input 
                  type="text" 
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  placeholder="Ex: Développeurs, PME..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Objectif principal</label>
                <input 
                  type="text" 
                  name="mainGoal"
                  value={formData.mainGoal}
                  onChange={handleInputChange}
                  placeholder="Ex: Vendre des cours, Générer des leads..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section2" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 scroll-mt-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Pages & Structure</h2>
                  <p className="text-sm text-gray-500">Définissez l'architecture de votre site.</p>
                </div>
              </div>
              <button 
                onClick={addPage}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" /> Ajouter une page
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {formData.pages.map((page, index) => (
                  <motion.div 
                    key={page.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative bg-gray-50 rounded-2xl p-6 border border-gray-100"
                  >
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-4">
                        <input 
                          type="text" 
                          value={page.name}
                          onChange={(e) => updatePage(page.id, 'name', e.target.value)}
                          placeholder="Nom de la page (ex: Tarifs)"
                          className="w-full bg-transparent text-lg font-bold placeholder:text-gray-400 outline-none"
                        />
                        <textarea 
                          value={page.description}
                          onChange={(e) => updatePage(page.id, 'description', e.target.value)}
                          placeholder="Description du contenu de la page..."
                          rows={2}
                          className="w-full bg-transparent text-sm text-gray-600 placeholder:text-gray-400 outline-none resize-none"
                        />
                      </div>
                      <button 
                        onClick={() => removePage(page.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-50 rounded-lg h-fit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          <section id="section3" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Direction design & ton</h2>
                <p className="text-sm text-gray-500">Guidez la direction artistique du projet.</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Ambiances visuelles</label>
                <div className="flex flex-wrap gap-2">
                  {AMBIANCE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleAmbiance(option)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        formData.ambiances.includes(option)
                          ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-100'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Sites de référence</label>
                <textarea 
                  name="referenceSites"
                  value={formData.referenceSites}
                  onChange={handleInputChange}
                  placeholder="Listez des URLs ou noms de sites qui vous inspirent..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Ton de voix</label>
                <input 
                  type="text" 
                  name="toneOfVoice"
                  value={formData.toneOfVoice}
                  onChange={handleInputChange}
                  placeholder="Ex: Professionnel, amical, minimaliste, enthousiaste..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section4" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Charte graphique</h2>
                <p className="text-sm text-gray-500">Transmettez une identité visuelle cohérente.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 block">Primaire</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleInputChange}
                    className="w-12 h-12 rounded-xl border-none cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-gray-500 uppercase">{formData.primaryColor}</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 block">Secondaire</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleInputChange}
                    className="w-12 h-12 rounded-xl border-none cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-gray-500 uppercase">{formData.secondaryColor}</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 block">Accent</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleInputChange}
                    className="w-12 h-12 rounded-xl border-none cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-gray-500 uppercase">{formData.accentColor}</span>
                </div>
              </div>
              <div className="col-span-3 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Polices de caractères</label>
                <input 
                  type="text" 
                  name="fonts"
                  value={formData.fonts}
                  onChange={handleInputChange}
                  placeholder="Ex: Inter pour le corps, Playfair Display pour les titres..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section5" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Fonctionnalités clés</h2>
                <p className="text-sm text-gray-500">Cadrez les capacités techniques à implémenter.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Fonctionnalités attendues</label>
                <textarea 
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Ex: Authentification, Paiement Stripe, Blog, Dashboard..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Stack technique</label>
                  <input 
                    type="text" 
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleInputChange}
                    placeholder="Ex: Next.js, Firebase, Tailwind..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Langues</label>
                  <input 
                    type="text" 
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    placeholder="Ex: Français, Anglais..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section8" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Technique & Données</h2>
                <p className="text-sm text-gray-500">Détaillez la structure des données et les services tiers.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Modèle de données (Entités)</label>
                <textarea 
                  name="dataModel"
                  value={formData.dataModel}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Ex: Utilisateurs (nom, email), Produits (titre, prix, stock)..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Intégrations & APIs</label>
                <textarea 
                  name="integrations"
                  value={formData.integrations}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Ex: Stripe pour les paiements, SendGrid pour les emails, Google Maps API..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>
          </section>
          <section id="section6" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Contraintes & contexte</h2>
                <p className="text-sm text-gray-500">Anticipez les limitations techniques ou métier.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Responsive design</label>
                <input 
                  type="text" 
                  name="responsiveExigences"
                  value={formData.responsiveExigences}
                  onChange={handleInputChange}
                  placeholder="Ex: Mobile-first, Tablettes..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">SEO</label>
                <input 
                  type="text" 
                  name="seoExigences"
                  value={formData.seoExigences}
                  onChange={handleInputChange}
                  placeholder="Ex: Balises meta, Sitemap, Performance..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Contraintes spécifiques</label>
                <textarea 
                  name="specificConstraints"
                  value={formData.specificConstraints}
                  onChange={handleInputChange}
                  placeholder="Ex: Accessibilité WCAG, RGPD, Pas de bibliothèques externes..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section7" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Stratégie & Cible</h2>
                <p className="text-sm text-gray-500">Approfondissez la connaissance de vos utilisateurs et du marché.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">User Personas</label>
                <textarea 
                  name="userPersonas"
                  value={formData.userPersonas}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Décrivez vos utilisateurs types (âge, besoins, frustrations...)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Concurrents & Références</label>
                <textarea 
                  name="competitors"
                  value={formData.competitors}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Quels sont les sites similaires et comment vous en différenciez-vous ?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section9" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Milestone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Roadmap & Futur</h2>
                <p className="text-sm text-gray-500">Prévoyez l'évolution de votre application.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Évolutions futures (Roadmap)</label>
                <textarea 
                  name="roadmap"
                  value={formData.roadmap}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Quelles fonctionnalités prévoyez-vous d'ajouter plus tard ? (Aide l'IA à prévoir une architecture évolutive)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>
          </section>
          <div className="flex items-center justify-center pt-8">
            <button 
              onClick={handleGeneratePrompt}
              className="group relative bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all flex items-center gap-4 shadow-xl shadow-blue-200 active:scale-95"
            >
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Générer le prompt structuré
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      {/* Success Notification */}
      <AnimatePresence>
        {isGenerated && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[100]"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Prompt généré et copié !</p>
              <p className="text-xs text-gray-400">Prêt à être collé dans Lovable ou Bolt.</p>
            </div>
            <button 
              onClick={() => setIsGenerated(false)}
              className="ml-4 text-gray-400 hover:text-white"
            >
              Fermer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
