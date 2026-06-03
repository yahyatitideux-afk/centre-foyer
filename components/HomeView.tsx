"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSiteState } from "@/lib/SiteStateContext";
import Editable from "@/components/Editable";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, CalendarRange, HeartPulse, Sparkles, ArrowRight, Play, Landmark, FileText, Activity, Users, Award, Heart, Stethoscope, Check, Star, Camera } from "lucide-react";

function ImageUploaderOverlay({ 
  label, 
  currentValue, 
  onImageUploaded 
}: { 
  label: string; 
  currentValue?: string; 
  onImageUploaded: (base64: string) => void; 
}) {
  const { isAdminUnlocked, isEditModeActive, registerModification, addMediaFile } = useSiteState();
  if (!isAdminUnlocked || !isEditModeActive) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newBase64 = reader.result as string;
        const oldValue = currentValue;

        registerModification(
          `Image "${label}" : mise à jour avec "${file.name}"`,
          "image",
          () => {
            if (oldValue) {
              onImageUploaded(oldValue);
            }
          }
        );

        // Calculate size in KB
        const sizeKB = `${Math.round(file.size / 1024)} KB`;
        addMediaFile(file.name, newBase64, file.type, sizeKB);

        onImageUploaded(newBase64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <label className="absolute inset-0 bg-slate-950/80 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white cursor-pointer select-none">
      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      <Camera className="h-8 w-8 mb-2 text-sky-400 animate-pulse" />
      <span className="text-[10px] font-mono tracking-wider uppercase font-black px-2.5 py-1 bg-slate-900/90 rounded-xl border border-white/10 text-center">
        {label}
      </span>
    </label>
  );
}

export default function HomeView() {
  const { setActiveView, general, setGeneral, expertises, updateExpertise, crewMembers, updateCrewMember, t } = useSiteState();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile to avoid high-performance canvas loops
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Interactive Particle Canvas (Desktop) for a technical modern feel
  useEffect(() => {
    if (isMobile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }> = [];

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || window.innerWidth;
      canvas.height = rect?.height || 500;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1.5,
        alpha: Math.random() * 0.3 + 0.1
      });
    }

    const mouse = { x: -1000, y: -1000, radius: 140 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.parentElement?.addEventListener("mousemove", handleMouseMove);
    canvas.parentElement?.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce borders
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw connections to mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          ctx.strokeStyle = `rgba(0, 173, 239, ${force * 0.25})`; // sky blue accent of Djibouti
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        // Draw particle
        ctx.fillStyle = `rgba(18, 173, 43, ${p.alpha * 1.5})`; // green accent of Djibouti
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.parentElement?.removeEventListener("mousemove", handleMouseMove);
      canvas.parentElement?.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#1A202C]" id="home-view-container">
      
      {/* SECTION HERO */}
      <section className="relative overflow-hidden py-16 lg:py-24 flex items-center min-h-[78vh] border-b border-slate-200 bg-slate-950 text-white">
        
        {/* Background Image with Blur & Deep Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden group">
          <img
            src={general.heroBgUrl || t("/lieu_organisation.jpeg")}
            alt="Foyer Daryel Background"
            className="w-full h-full object-cover opacity-90 filter saturate-[1.15] brightness-[0.88] contrast-[1.05] animate-kenburns select-none pointer-events-none transition-all duration-700"
          />
          <ImageUploaderOverlay 
            label={t("Changer l'image Hero")}
            currentValue={general.heroBgUrl || t("/lieu_organisation.jpeg")}
            onImageUploaded={(newBase64) => setGeneral((prev) => ({ ...prev, heroBgUrl: newBase64 }))}
          />
          {/* High-fidelity Dot-Grid Tech Overlay */}
          <div className="absolute inset-0 bg-grid-dots z-10 pointer-events-none opacity-20" />

          {/* National Identity Tint Layer (Sky Blue to Green blend) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ADEF]/15 via-transparent to-[#12AD2B]/10 mix-blend-color z-10" />

          {/* Rich gradients (Dark side for text readability on left side, but light transparent on right side where foyer image is visible) */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FDFBF7] to-transparent pointer-events-none opacity-25 z-10" />
        </div>

        {/* Decorative background gradients & ambient lights */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 w-[350px] h-[350px] bg-[#E31B23]/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Dynamic Particle Canvas (Desktop Only) */}
        {!isMobile && (
          <div className="absolute inset-0 z-10 opacity-40 pointer-events-auto">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
        )}

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            
            {/* Left Column: Heading and Description with Integrated Logo */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 85, damping: 16 } }
              }}
              className="lg:col-span-7 space-y-7 text-left" 
              id="hero-left-col"
            >
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8" id="hero-logo-title-group">
                {/* Embedded Animated Logo - Larger & More Prominent & Perfectly Clear */}
                <motion.div 
                  animate={{ 
                    y: [0, -12, 0], 
                    rotate: [0, 2, -2, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 6, 
                    ease: "easeInOut" 
                  }}
                  className="relative shrink-0 block" 
                  id="hero-animated-logo-container"
                >
                  {/* Glowing halo ring to make the logo look stunning */}
                  <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-[#00ADEF] via-white to-[#12AD2B] opacity-100 blur-lg animate-pulse" />
                  
                  {/* Rotating decorative accent border ring */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="absolute -inset-1 rounded-[2.2rem] bg-gradient-to-r from-[#00ADEF] via-transparent to-[#12AD2B] opacity-80"
                  />

                  {/* High Quality white capsule backer container - scaled up */}
                  <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-[2rem] bg-white p-2.5 shadow-2xl overflow-hidden flex items-center justify-center group/logo transition-transform duration-500 hover:scale-105 border-[4px] border-white">
                    <img
                      src="/logo.jpeg"
                      alt="Logo Foyer Daryel"
                      className="h-full w-full object-contain rounded-2xl select-none transition-transform duration-700 group-hover/logo:scale-112 filter drop-shadow-md"
                    />
                    {/* Glowing reflection shimmer effect sweep */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/75 to-transparent pointer-events-none"
                      initial={{ left: "-150%" }}
                      animate={{ left: "150%" }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "loop", 
                        duration: 3, 
                        ease: "linear",
                        repeatDelay: 2
                      }}
                    />
                  </div>
                </motion.div>
 
                {/* Subtitle / tag info and small badge stack */}
                <div className="space-y-2">
                  <motion.div 
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00ADEF]/15 border border-[#00ADEF]/25 text-[#00ADEF] text-xs font-mono uppercase tracking-widest font-black"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#00ADEF] animate-spin" style={{ animationDuration: '4s' }} />
                    <span>{t("Protection Sociale Agréée de l'État")}</span>
                  </motion.div>
                  <div className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                    {t("RÉPUBLIQUE DE DJIBOUTI • NOMINATION NATIONALE")}
                  </div>
                </div>
              </div>
 
              {/* Touching and High-impact Heading - Dynamic */}
              <Editable
                label={t("Phrase d'accroche principale H1")}
                value={general.heroSlogan || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, heroSlogan: newVal }))}
              >
                <motion.h1 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 14 } }
                  }}
                  className="font-serif text-3xl sm:text-5xl italic font-black text-white leading-tight tracking-tight block" 
                  id="hero-main-slogan-title"
                >
                  {general.heroSlogan || t("« Parce que l'avenir de Djibouti s'écrit dans le regard protégé de ses enfants. »")}
                </motion.h1>
              </Editable>
 
              {/* Touching paragraph / Message touchant - Dynamic */}
              <Editable
                label={t("Citation philosophique inspirante du Centre")}
                value={general.heroQuote || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, heroQuote: newVal }))}
              >
                <motion.p 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 14 } }
                  }}
                  className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed max-w-2xl border-l-[3px] border-[#00ADEF] pl-4 italic block"
                >
                  {general.heroQuote || t("“Chaque enfant sauvé de l'abandon ou de la détresse est un phare d’espoir pour notre nation. Au Foyer Daryel, nous reconstruisons les rêves brisés sous le manteau de la dignité et d'un amour inconditionnel.”")}
                </motion.p>
              </Editable>
 
              <Editable
                label={t("Paragraphe d'explication d'accueil")}
                value={general.heroSubText || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, heroSubText: newVal }))}
              >
                <motion.p 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 14 } }
                  }}
                  className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-2xl block"
                >
                  {general.heroSubText || `${general.tagline} Le Centre d’Accueil et d’Urgence de Djibouti (Couramment appelé Foyer Daryel) est une association nationale agréée de salut public, opérant 24h/24 en coordination avec les tribunaux et la Brigade des mineurs pour sauver les orphelins, abandonnés ou brutalisés.`}
                </motion.p>
              </Editable>
 
              <Editable
                label={t("Bandeau d'Alerte Judiciaire / Procédure de placement")}
                value={general.alertInfo || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, alertInfo: newVal }))}
              >
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
                  }}
                  className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl max-w-xl flex gap-3 block"
                >
                  <div className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0 mt-0.5 animate-pulse">!</div>
                  <div className="text-xs text-slate-200 leading-relaxed font-semibold">
                    {general.alertInfo}
                  </div>
                </motion.div>
              </Editable>
 
              {/* Action Buttons */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4" 
                id="hero-cta-group"
              >
                <button
                  onClick={() => setActiveView("contact")}
                  className="bg-[#00ADEF] hover:bg-sky-600 text-white font-sans font-bold text-sm uppercase tracking-wider py-4 px-8 rounded-2xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 border border-sky-500/10 cursor-pointer active:scale-95 transition-all duration-300"
                >
                  <span>{t("Lancer un signalement d'alerte")}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveView("about")}
                  className="bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm py-4 px-8 rounded-2xl border border-slate-700 shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all duration-300"
                >
                  <span>{t("Consulter l'Organigramme")}</span>
                </button>
              </motion.div>
 
            </motion.div>
 
            {/* Right Column: Visual illustration of state actions & emergency cards */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 85, damping: 16, delay: 0.2 } }
              }}
              className="lg:col-span-5 relative" 
              id="hero-right-col"
            >
              
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  rotateZ: [0, 0.4, -0.4, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5, 
                  ease: "easeInOut" 
                }}
                whileHover={{ scale: 1.04, y: -6, transition: { duration: 0.25 } }}
                className="relative mx-auto max-w-[360px] aspect-square rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-2xl hover:shadow-[#00ADEF]/15 p-7 flex flex-col justify-between overflow-hidden border border-slate-800/90 cursor-pointer group transition-shadow duration-300"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-[#00ADEF]/20 transition-all duration-700" />
                
                {/* Visual Header */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">
                    {t("Portail Officiel")}
                  </span>
                </div>
 
                {/* Main Identity showcase */}
                <div className="space-y-4 relative z-10 text-left">
                  <div className="h-16 w-16 rounded-2xl bg-white p-1.5 border border-[#00ADEF]/30 flex items-center justify-center overflow-hidden shadow-md transition-transform duration-500 group-hover:rotate-12" id="hero-right-logo-container">
                    <img
                      src="/logo.jpeg"
                      alt="Logo Foyer Daryel"
                      className="h-full w-full object-contain rounded-xl select-none"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif italic font-medium text-2xl text-white group-hover:text-sky-300 transition-colors duration-300">{t("Centre d'Accueil et d'Urgence")}</h3>
                    <p className="text-[11px] font-mono text-slate-400 tracking-wider uppercase mt-1">{t("Djibouti - Foyer d'Hébergement Secouru")}</p>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {t("Une unité de crise médico-sociale ouverte toute l'année pour garantir l'intérêt supérieur de l'enfant. Tous les placements sont répertoriés au greffe de Djibouti.")}
                  </p>
                </div>
 
                {/* Operational Badge */}
                <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <ShieldCheck className="h-5.5 w-5.5 animate-bounce" style={{ animationDuration: '3s' }} />
                    </div>
                    <div>
                      <p className="text-xs font-serif italic font-bold text-white">{t("Placement Agréé d'Urgence")}</p>
                      <p className="text-[10px] text-emerald-400 font-medium font-mono">{t("Contrôle Judicaire Actif")}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveView("missions")}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                  </button>
                </div>
 
              </motion.div>
 
            </motion.div>
 
          </motion.div>
        </div>
      </section>

      {/* SECTION KEY STATISTICS */}
      <section className="py-20 bg-white border-b border-slate-100" id="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Editable
              label="Tag En-Tête Statistiques"
              value={general.statsTag || t("Rareté, Impact & Transparence")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, statsTag: newVal }))}
            >
              <span className="text-emerald-600 font-mono text-xs uppercase tracking-[0.2em] font-bold block">{general.statsTag || t("Rareté, Impact & Transparence")}</span>
            </Editable>
            
            <Editable
              label="Titre En-Tête Statistiques"
              value={general.statsTitle || t("Indicateurs de Performance Sociale")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, statsTitle: newVal }))}
            >
              <h2 className="font-serif italic text-3xl sm:text-4xl font-black text-slate-900 mt-2">{general.statsTitle || t("Indicateurs de Performance Sociale")}</h2>
            </Editable>

            <Editable
              label="Description En-Tête Statistiques"
              value={general.statsDescText || t("Chaque statistique représente un parcours singulier, validé par le conseil de tutelle sociale de Djibouti.")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, statsDescText: newVal }))}
            >
              <p className="text-xs sm:text-sm text-slate-500 mt-3 font-medium">
                {general.statsDescText || t("Chaque statistique représente un parcours singulier, validé par le conseil de tutelle sociale de Djibouti.")}
              </p>
            </Editable>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            
            {/* Stat 1 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 15 } }
              }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-slate-50/50 hover:bg-slate-50/20 p-8 rounded-[2rem] border border-slate-200/80 text-center transition duration-300 shadow-xs hover:shadow-lg hover:shadow-slate-100 flex flex-col justify-between items-center group cursor-pointer"
            >
              <div className="mb-4">
                <Editable
                  label="Image Icône Statistique 1 (URL)"
                  value={general.stat1IconUrl || t("/logo.jpeg")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat1IconUrl: newVal }))}
                >
                  <img
                    src={general.stat1IconUrl || t("/logo.jpeg")}
                    alt="Stat 1 Icon"
                    className="h-12 w-12 object-contain rounded-full shadow-xs border border-slate-200/80 p-0.5 group-hover:scale-110 transition duration-300"
                  />
                </Editable>
              </div>

              <div className="space-y-2">
                <Editable
                  label="Valeur Statistique 1"
                  value={general.stat1Num || t("520+")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat1Num: newVal }))}
                >
                  <span className="text-3xl sm:text-4xl font-serif italic font-black text-[#1E3A8A] block">{general.stat1Num || t("520+")}</span>
                </Editable>
                
                <Editable
                  label="Titre Statistique 1"
                  value={general.stat1Title || t("Enfants Secourus")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat1Title: newVal }))}
                >
                  <h4 className="font-semibold text-sm text-slate-800 font-sans">{general.stat1Title || t("Enfants Secourus")}</h4>
                </Editable>

                <Editable
                  label="Description Statistique 1"
                  value={general.stat1Desc || t("Admissions gérées en situation critique d'abus ou d'abandon total à Djibouti-ville.")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat1Desc: newVal }))}
                >
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-sans">
                    {general.stat1Desc || t("Admissions gérées en situation critique d'abus ou d'abandon total à Djibouti-ville.")}
                  </p>
                </Editable>
              </div>
            </motion.div>

            {/* Stat 2 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 15 } }
              }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-slate-50/50 hover:bg-slate-50/20 p-8 rounded-[2rem] border border-slate-200/80 text-center transition duration-300 shadow-xs hover:shadow-lg hover:shadow-slate-100 flex flex-col justify-between items-center group cursor-pointer"
            >
              <div className="mb-4">
                <Editable
                  label="Image Icône Statistique 2 (URL)"
                  value={general.stat2IconUrl || t("/logo.jpeg")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat2IconUrl: newVal }))}
                >
                  <img
                    src={general.stat2IconUrl || t("/logo.jpeg")}
                    alt="Stat 2 Icon"
                    className="h-12 w-12 object-contain rounded-full shadow-xs border border-slate-200/80 p-0.5 group-hover:scale-110 transition duration-300"
                  />
                </Editable>
              </div>

              <div className="space-y-2">
                <Editable
                  label="Valeur Statistique 2"
                  value={general.stat2Num || t("87%")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat2Num: newVal }))}
                >
                  <span className="text-3xl sm:text-4xl font-serif italic font-black text-emerald-600 block">{general.stat2Num || t("87%")}</span>
                </Editable>

                <Editable
                  label="Titre Statistique 2"
                  value={general.stat2Title || t("Réintégration Réussie")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat2Title: newVal }))}
                >
                  <h4 className="font-semibold text-sm text-slate-800 font-sans">{general.stat2Title || t("Réintégration Réussie")}</h4>
                </Editable>

                <Editable
                  label="Description Statistique 2"
                  value={general.stat2Desc || t("Retour en famille élargie sécurisée après ordonnance et bilan psychosocial.")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat2Desc: newVal }))}
                >
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-sans">
                    {general.stat2Desc || t("Retour en famille élargie sécurisée après ordonnance et bilan psychosocial.")}
                  </p>
                </Editable>
              </div>
            </motion.div>

            {/* Stat 3 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 15 } }
              }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-slate-50/50 hover:bg-slate-50/20 p-8 rounded-[2rem] border border-slate-200/80 text-center transition duration-300 shadow-xs hover:shadow-lg hover:shadow-slate-100 flex flex-col justify-between items-center group cursor-pointer"
            >
              <div className="mb-4">
                <Editable
                  label="Image Icône Statistique 3 (URL)"
                  value={general.stat3IconUrl || t("/logo.jpeg")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat3IconUrl: newVal }))}
                >
                  <img
                    src={general.stat3IconUrl || t("/logo.jpeg")}
                    alt="Stat 3 Icon"
                    className="h-12 w-12 object-contain rounded-full shadow-xs border border-slate-200/80 p-0.5 group-hover:scale-110 transition duration-300"
                  />
                </Editable>
              </div>

              <div className="space-y-2">
                <Editable
                  label="Valeur Statistique 3"
                  value={general.stat3Num || t("24h / 7")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat3Num: newVal }))}
                >
                  <span className="text-3xl sm:text-4xl font-serif italic font-black text-rose-600 block">{general.stat3Num || t("24h / 7")}</span>
                </Editable>

                <Editable
                  label="Titre Statistique 3"
                  value={general.stat3Title || t("Garde Clinique HPTV")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat3Title: newVal }))}
                >
                  <h4 className="font-semibold text-sm text-slate-800 font-sans">{general.stat3Title || t("Garde Clinique HPTV")}</h4>
                </Editable>

                <Editable
                  label="Description Statistique 3"
                  value={general.stat3Desc || t("Permanence d'un infirmier pédiatrique et de l'équipe éducative d'astreinte.")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat3Desc: newVal }))}
                >
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-sans">
                    {general.stat3Desc || t("Permanence d'un infirmier pédiatrique et de l'équipe éducative d'astreinte.")}
                  </p>
                </Editable>
              </div>
            </motion.div>

            {/* Stat 4 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 15 } }
              }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-slate-50/50 hover:bg-slate-50/20 p-8 rounded-[2rem] border border-slate-200/80 text-center transition duration-300 shadow-xs hover:shadow-lg hover:shadow-slate-100 flex flex-col justify-between items-center group cursor-pointer"
            >
              <div className="mb-4">
                <Editable
                  label="Image Icône Statistique 4 (URL)"
                  value={general.stat4IconUrl || t("/logo.jpeg")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat4IconUrl: newVal }))}
                >
                  <img
                    src={general.stat4IconUrl || t("/logo.jpeg")}
                    alt="Stat 4 Icon"
                    className="h-12 w-12 object-contain rounded-full shadow-xs border border-slate-200/80 p-0.5 group-hover:scale-110 transition duration-300"
                  />
                </Editable>
              </div>

              <div className="space-y-2">
                <Editable
                  label="Valeur Statistique 4"
                  value={general.stat4Num || t("< 2 Heures")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat4Num: newVal }))}
                >
                  <span className="text-3xl sm:text-4xl font-serif italic font-black text-amber-600 block">{general.stat4Num || t("< 2 Heures")}</span>
                </Editable>

                <Editable
                  label="Titre Statistique 4"
                  value={general.stat4Title || t("Prise en Charge Médicale")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat4Title: newVal }))}
                >
                  <h4 className="font-semibold text-sm text-slate-800 font-sans">{general.stat4Title || t("Prise en Charge Médicale")}</h4>
                </Editable>

                <Editable
                  label="Description Statistique 4"
                  value={general.stat4Desc || t("Délai maximum de mise en sécurité d'un mineur suite au signalement de la brigade.")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, stat4Desc: newVal }))}
                >
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-sans">
                    {general.stat4Desc || t("Délai maximum de mise en sécurité d'un mineur suite au signalement de la brigade.")}
                  </p>
                </Editable>
              </div>
            </motion.div>
 
          </motion.div>
 
        </div>
      </section>

      {/* SECTION NOS EXPERTISES (PROFESSIONNEL ET CINÉMATIQUE) */}
      <section className="py-20 bg-[#FDFBF7] border-b border-slate-200/60 relative overflow-hidden" id="expertises-showcase">
        {/* Subtle decorative lights */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#00ADEF]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header block */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-[#00ADEF] font-mono text-xs uppercase tracking-widest font-black bg-[#00ADEF]/10 border border-[#00ADEF]/20 px-3.5 py-1.5 rounded-full inline-block cursor-pointer"
            >
              <Editable
                label="Badge Section Expertises"
                value={general.homeExpertiseBadge || t("Domaines de Spécialisation")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, homeExpertiseBadge: newVal }))}
              >
                <span>{general.homeExpertiseBadge || t("Domaines de Spécialisation")}</span>
              </Editable>
            </motion.span>
            
            <Editable
              label="Titre Section Expertises"
              value={general.homeExpertiseTitle || t("Nos Pôles d'Expertise Médicale & Sociale")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, homeExpertiseTitle: newVal }))}
            >
              <h2 className="font-serif italic text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {general.homeExpertiseTitle || t("Nos Pôles d'Expertise Médicale & Sociale")}
              </h2>
            </Editable>

            <Editable
              label="Description Section Expertises"
              value={general.homeExpertiseDesc || t("Le Foyer Daryel combine des protocoles d'urgence clinique hautement spécialisés et un encadrement à dimension humaine pour restaurer la dignité infantile.")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, homeExpertiseDesc: newVal }))}
            >
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                {general.homeExpertiseDesc || t("Le Foyer Daryel combine des protocoles d'urgence clinique hautement spécialisés et un encadrement à dimension humaine pour restaurer la dignité infantile.")}
              </p>
            </Editable>
          </div>

          {/* Expertises Grid (4 poles) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {expertises.map((item, idx) => {
              // Icon mapping helper
              const IconComponent = (() => {
                switch (item.iconName) {
                  case "Stethoscope": return Stethoscope;
                  case "Heart": return Heart;
                  case "ShieldCheck": return ShieldCheck;
                  case "Users": return Users;
                  default: return Activity;
                }
              })();

              const hoverShadowColors = [
                "hover:shadow-[#00ADEF]/10",
                "hover:shadow-rose-500/10",
                "hover:shadow-emerald-500/10",
                "hover:shadow-amber-500/10"
              ];
              const shadowColor = hoverShadowColors[idx % hoverShadowColors.length];

              const decorativeLineColors = [
                "bg-[#00ADEF]",
                "bg-rose-500",
                "bg-[#12AD2B]",
                "bg-amber-500"
              ];
              const lineBg = decorativeLineColors[idx % decorativeLineColors.length];

              const iconColors = [
                "bg-[#00ADEF]",
                "bg-rose-500",
                "bg-[#12AD2B]",
                "bg-amber-500"
              ];
              const iconBg = iconColors[idx % iconColors.length];

              return (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -10, scale: 1.02 }}
                  viewport={{ once: true, margin: "-100px" }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0, transition: { type: "spring", duration: 0.8, delay: idx * 0.1 } }}
                  className={`bg-white rounded-[2.5rem] p-6 border border-slate-200/50 shadow-xl shadow-slate-100/40 hover:shadow-2xl ${shadowColor} transition-all duration-300 flex flex-col justify-between group overflow-hidden relative`}
                >
                  <div>
                    {/* Image with zoom on hover */}
                    <div className="h-52 w-full rounded-3xl overflow-hidden relative mb-6 bg-slate-105">
                      <div className="absolute inset-0 bg-slate-950/20 z-10 mix-blend-multiply group-hover:bg-transparent transition-all duration-500" />
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute top-4 left-4 z-20 h-10 w-10 rounded-2xl ${iconBg} flex items-center justify-center text-white shadow-lg`}>
                        <IconComponent className="h-5.5 w-5.5" />
                      </div>

                      {/* Direct upload camera button if admin is active */}
                      <ImageUploaderOverlay 
                        label="Changer l'image"
                        currentValue={item.imageUrl}
                        onImageUploaded={(newBase64) => updateExpertise(item.id, { imageUrl: newBase64 })}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Editable
                        label="Badge Expertise"
                        value={item.badge}
                        onSave={(newBadge) => updateExpertise(item.id, { badge: newBadge })}
                      >
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00ADEF] bg-sky-500/5 px-3 py-1 rounded-full border border-sky-400/10 inline-block">
                          {item.badge}
                        </span>
                      </Editable>
                      
                      <Editable
                        label="Titre Expertise"
                        value={item.title}
                        onSave={(newTitle) => updateExpertise(item.id, { title: newTitle })}
                      >
                        <h3 className="font-serif text-lg font-black italic text-slate-900 group-hover:text-[#00ADEF] transition-colors">
                          {item.title}
                        </h3>
                      </Editable>

                      <Editable
                        label="Description Expertise"
                        value={item.desc}
                        onSave={(newDesc) => updateExpertise(item.id, { desc: newDesc })}
                      >
                        <p className="text-xs text-slate-500 leading-relaxed font-sans">
                          {item.desc}
                        </p>
                      </Editable>
                    </div>
                  </div>

                  {/* Decorative line */}
                  <div className={`h-1 w-0 ${lineBg} absolute bottom-0 left-0 transition-all duration-500 group-hover:w-full`} />
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION NOTRE ÉQUIPAGE DE GARDE (PROFESSIONNEL ET CINÉMATIQUE) */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden" id="crew-showcase">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#00ADEF]/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-[#12AD2B]/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-grid-dots z-0 opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
          
          {/* Header block */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-black bg-emerald-500/15 border border-emerald-500/20 px-3.5 py-1.5 rounded-full inline-block cursor-pointer"
            >
              <Editable
                label="Badge Section Équipage"
                value={general.homeCrewBadge || t("L'Équipage & Équipes de Garde")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, homeCrewBadge: newVal }))}
              >
                <span>{general.homeCrewBadge || t("L'Équipage & Équipes de Garde")}</span>
              </Editable>
            </motion.span>
            
            <Editable
              label="Titre Section Équipage"
              value={general.homeCrewTitle || t("Le Cœur Battant de Notre Action")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, homeCrewTitle: newVal }))}
            >
              <h2 className="font-serif italic text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {general.homeCrewTitle || t("Le Cœur Battant de Notre Actions")}
              </h2>
            </Editable>

            <Editable
              label="Description Section Équipage"
              value={general.homeCrewDesc || t("Des infirmiers pédiatres, éducateurs cliniques et juristes dévoués qui œuvrent jour et nuit pour offrir un havre inviolable de protection sociale à Djibouti.")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, homeCrewDesc: newVal }))}
            >
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed font-sans">
                {general.homeCrewDesc || t("Des infirmiers pédiatres, éducateurs cliniques et juristes dévoués qui œuvrent jour et nuit pour offrir un havre inviolable de protection sociale à Djibouti.")}
              </p>
            </Editable>
          </div>

          {/* Interactive Crew Slider / Deck */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {crewMembers.map((item, idx) => {
              // Status text and style mapping
              const isEnService = item.status === "En Service";
              const isEnAstreinte = item.status === "En Astreinte";
              
              const statusColors = isEnService 
                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30" 
                : isEnAstreinte 
                ? "text-amber-400 bg-amber-500/10 border border-amber-500/30" 
                : "text-[#00ADEF] bg-[#00ADEF]/10 border border-[#00ADEF]/30";

              const statusDot = isEnService 
                ? "bg-emerald-400 animate-pulse" 
                : isEnAstreinte 
                ? "bg-amber-400" 
                : "bg-[#00ADEF]";

              const delayedDelay = idx * 0.15;

              return (
                <motion.div 
                  key={item.id}
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1, transition: { type: "spring", duration: 0.7, delay: delayedDelay } }}
                  viewport={{ once: true }}
                  className="bg-slate-900/60 backdrop-blur-md rounded-[2rem] border border-slate-800 p-5 flex flex-col justify-between group overflow-hidden relative cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Photo container */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl border border-white/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
                      <img 
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transform duration-500 group-hover:scale-105"
                      />
                      {/* Status Ring */}
                      <span className={`absolute bottom-3 left-3 z-20 text-[9px] font-mono font-black ${statusColors} px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-widest`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
                        {item.status}
                      </span>

                      {/* Direct upload camera button if admin is active */}
                      <ImageUploaderOverlay 
                        label="Remplacer la photo"
                        currentValue={item.imageUrl}
                        onImageUploaded={(newBase64) => updateCrewMember(item.id, { imageUrl: newBase64 })}
                      />
                    </div>

                    <div className="text-left">
                      <Editable
                        label="Nom Équipage"
                        value={item.name}
                        onSave={(newName) => updateCrewMember(item.id, { name: newName })}
                      >
                        <h4 className="font-serif text-lg font-black text-white italic group-hover:text-emerald-400 transition-colors">
                          {item.name}
                        </h4>
                      </Editable>
                      
                      <Editable
                        label="Rôle Équipage"
                        value={item.role}
                        onSave={(newRole) => updateCrewMember(item.id, { role: newRole })}
                      >
                        <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mt-0.5 font-bold">
                          {item.role}
                        </p>
                      </Editable>

                      <Editable
                        label="Description Équipage"
                        value={item.desc}
                        onSave={(newDesc) => updateCrewMember(item.id, { desc: newDesc })}
                      >
                        <p className="text-xs text-slate-300 mt-2 font-sans line-clamp-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </Editable>
                    </div>
                  </div>

                  {/* Quick interactive stats */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <Editable
                      label="Statistiques de garde"
                      value={item.stats}
                      onSave={(newStats) => updateCrewMember(item.id, { stats: newStats })}
                    >
                      <span>{item.stats}</span>
                    </Editable>
                    <span className="text-[#00ADEF] flex items-center gap-1 group-hover:underline font-extrabold" onClick={() => setActiveView("about")}>Voir Fiche →</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION GUIDANCE INFORMATION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden" id="action-guidelines-banner">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-left">
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-black bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full inline-block">
                Information Juridique Importante
              </span>
              <Editable
                label="Titre de la bannière conseil"
                value={general.bannerTitle || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, bannerTitle: newVal }))}
              >
                <h3 className="font-serif text-2xl sm:text-4xl italic font-black leading-tight">
                  {general.bannerTitle || t("Que faire face à un mineur en rupture sociale ou maltraité ?")}
                </h3>
              </Editable>

              <Editable
                label="Texte de la bannière d'information juridique"
                value={general.bannerDesc || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, bannerDesc: newVal }))}
              >
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-3xl">
                  {general.bannerDesc || t("La loi djiboutienne punit sévèrement la non-assistance à mineur en danger. Le placement temporaire au Foyer Daryel se fait exclusivement sous le contrôle légal des autorités d'État. Notre assistant conversationnel intelligent de garde (en bas à droite de votre écran) est configuré pour vous guider instantanément à travers les protocoles officiels de signalement judiciaire.")}
                </p>
              </Editable>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => setActiveView("contact")}
                className="w-full bg-white hover:bg-slate-50 text-slate-900 font-sans font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-2"
              >
                <span>Accéder aux numéros d&apos;alerte</span>
                <ArrowRight className="h-4.5 w-4.5 text-slate-900" />
              </button>
              <button
                onClick={() => setActiveView("publications")}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-700"
              >
                <FileText className="h-4.5 w-4.5" />
                <span>Télécharger les textes législatifs</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
