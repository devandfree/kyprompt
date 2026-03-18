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
  Users,
  Database,
  Link,
  MessageSquare,
  Milestone,
  X
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
      }, 6000);
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
      <div className="min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden relative">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        </div>

        <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Column 1: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs mb-6">
              <Zap className="w-3.5 h-3.5" />
              Propulsé par l'IA
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-6 leading-[0.95]">
              Architecte de <span className="text-blue-600">Prompts</span> pour Builders.
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg leading-relaxed font-medium">
              Structurez vos idées, définissez votre design et générez des prompts optimisés pour Lovable, Google AI Studio, Bolt et v0.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={() => setView('form')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
              >
                Commencer
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img 
                        src={`https://picsum.photos/seed/user${i}/32/32`} 
                        alt="User" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">100+ Utilisateurs</span>
                  <span className="text-[10px] text-gray-500 font-medium">Nous font confiance</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[32px] overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] border border-gray-100 bg-gray-50 aspect-[4/5] max-w-[400px] mx-auto">
               <img 
                 src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=1000" 
                 alt="Architect Visual" 
                 className="w-full h-full object-cover mix-blend-multiply opacity-90"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent" />
            </div>
            
            {/* Floating UI Elements */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 -left-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 z-20"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <div className="text-[10px] font-bold text-gray-900">Prompt Optimisé</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-0 -right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 z-20"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-3 h-3" />
                </div>
                <div className="text-[10px] font-bold text-gray-900">Vitesse IA</div>
              </div>
            </motion.div>

            {/* Decorative background blurs */}
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-blue-200 rounded-full blur-[80px] opacity-20 -z-10" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-200 rounded-full blur-[80px] opacity-20 -z-10" />
          </motion.div>
        </main>
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
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className="fixed bottom-8 left-1/2 bg-gray-900 text-white px-6 py-5 rounded-2xl shadow-2xl flex items-center gap-6 z-[100] min-w-[320px] max-w-[90vw] border border-white/10"
            >
              <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg mb-0.5">Prompt copié !</p>
                <p className="text-sm text-white/60 leading-relaxed">
                  Il est prêt à être collé dans <span className="text-white font-medium">Lovable</span>, <span className="text-white font-medium">Bolt</span> ou <span className="text-white font-medium">v0</span> pour lancer votre projet.
                </p>
              </div>
              <button 
                onClick={() => setIsGenerated(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>
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
        <div 
          onClick={() => setView('landing')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-6 h-6 bg-blue-600 rounded-lg" />
          <h1 className="text-xl font-bold tracking-tight text-gray-900">PromptArchitect</h1>
        </div>
        <button 
          onClick={handleGeneratePrompt}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95"
        >
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
