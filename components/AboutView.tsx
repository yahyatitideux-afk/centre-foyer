"use client";

import React, { useState } from "react";
import { useSiteState } from "@/lib/SiteStateContext";
import Editable from "@/components/Editable";
import { ShieldCheck, MapPin, UserCheck, ChevronRight, Info, BadgeAlert, Sparkles, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutView() {
  const { structure, setStructure, general, setGeneral, personnel, setPersonnel, t } = useSiteState();
  const [selectedNode, setSelectedNode] = useState("ca");
  const [copiedCardIndex, setCopiedCardIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const handleShare = (index: number) => {
    if (typeof window !== "undefined") {
      try {
        navigator.clipboard.writeText(window.location.href);
        setCopiedCardIndex(index);
        setTimeout(() => setCopiedCardIndex(null), 3000);
      } catch (e) {
        console.error("Clipboard copy error", e);
      }
    }
  };

  const matchedNode = structure.find((n) => n.id === selectedNode) || structure[0];

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-20" id="about-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title with modern badge and serif pairing */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] bg-blue-100 text-[#1E3A8A] font-black px-4 py-1.5 rounded-full inline-block border border-blue-200">
            Crédibilité &amp; Gouvernance
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl italic font-black text-slate-900 tracking-tight leading-tight">
            Qui sommes-nous ?
          </h1>
          <Editable
            label="Texte d'introduction de la Fiche de Gouvernance"
            value={general.gouvernanceIntro || t("")}
            onSave={(newVal) => setGeneral((prev) => ({ ...prev, gouvernanceIntro: newVal }))}
          >
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {general.gouvernanceIntro || t("Établi au cœur de Djibouti-ville, le Centre d'Accueil et d'Urgence (CAU) est une structure associative de salut public agréée, dédiée à la sauvegarde physique, affective et légale des mineurs orphelins, abandonnés ou brutalisés.")}
            </p>
          </Editable>
        </motion.div>

        {/* 1. OFFICIEL IDENTITY CARDS WITH GLOW & ANIMATION */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {/* Card 1 */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(30, 58, 138, 0.12)" }}
            className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#1E3A8A] mb-6 font-mono font-bold border border-blue-100/50">
                CAU
              </div>
              <Editable
                label="Titre de la Carte 1"
                value={general.card1Title || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, card1Title: newVal }))}
              >
                <h3 className="font-serif italic font-bold text-xl text-slate-900">{general.card1Title || t("Dénomination Officielle")}</h3>
              </Editable>
              <Editable
                label="Sous-titre de la Carte 1"
                value={general.card1Subtitle || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, card1Subtitle: newVal }))}
              >
                <p className="text-xs text-blue-700 font-mono tracking-wider mt-1 uppercase block mt-1">{general.card1Subtitle || t("Centre d’Accueil et d’Urgence (CAU)")}</p>
              </Editable>
              <Editable
                label="Description de la Carte 1"
                value={general.card1Desc || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, card1Desc: newVal }))}
              >
                <p className="text-slate-605 text-xs sm:text-sm mt-4 leading-relaxed font-sans block">
                  {general.card1Desc || t("Marque d'attention locale et refuge chaleureux connu sous le nom de Daryel, désignant la prévenance et la sauvegarde bienveillante.")}
                </p>
              </Editable>
            </div>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
              <span className="text-[9px] uppercase font-mono text-slate-400">Partager le portail</span>
              <button
                onClick={() => handleShare(1)}
                className={`py-2 px-4 rounded-xl text-xs font-bold font-sans transition-all duration-300 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  copiedCardIndex === 1
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-50 text-[#1E3A8A] hover:bg-slate-100 border border-slate-150"
                }`}
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{copiedCardIndex === 1 ? "Copié !" : "Partager"}</span>
              </button>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(16, 185, 129, 0.12)" }}
            className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 border border-emerald-100/50">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <Editable
                label="Titre de la Carte 2"
                value={general.card2Title || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, card2Title: newVal }))}
              >
                <h3 className="font-serif italic font-bold text-xl text-slate-900">{general.card2Title || t("Forme Juridique")}</h3>
              </Editable>
              <Editable
                label="Sous-titre de la Carte 2"
                value={general.card2Subtitle || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, card2Subtitle: newVal }))}
              >
                <p className="text-xs text-emerald-700 font-mono tracking-wider mt-1 uppercase block mt-1">{general.card2Subtitle || t("Association agréée de salut public")}</p>
              </Editable>
              <Editable
                label="Description de la Carte 2"
                value={general.card2Desc || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, card2Desc: newVal }))}
              >
                <p className="text-slate-605 text-xs sm:text-sm mt-4 leading-relaxed font-sans block">
                  {general.card2Desc || t("Personnalité de droit privé reconnue d'utilité publique par l'État, fonctionnant sous le régime de tutelle de la protection de la famille de Djibouti.")}
                </p>
              </Editable>
            </div>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
              <span className="text-[9px] uppercase font-mono text-slate-400">Partager le portail</span>
              <button
                onClick={() => handleShare(2)}
                className={`py-2 px-4 rounded-xl text-xs font-bold font-sans transition-all duration-300 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  copiedCardIndex === 2
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-50 text-emerald-800 hover:bg-slate-100 border border-slate-150"
                }`}
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{copiedCardIndex === 2 ? "Copié !" : "Partager"}</span>
              </button>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(244, 63, 94, 0.12)" }}
            className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-6 border border-rose-100/50">
                <MapPin className="h-6 w-6" />
              </div>
              <Editable
                label="Titre de la Carte 3"
                value={general.card3Title || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, card3Title: newVal }))}
              >
                <h3 className="font-serif italic font-bold text-xl text-slate-900">{general.card3Title || t("Siège Social")}</h3>
              </Editable>
              <Editable
                label="Sous-titre de la Carte 3"
                value={general.card3Subtitle || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, card3Subtitle: newVal }))}
              >
                <p className="text-xs text-rose-700 font-mono tracking-wider mt-1 uppercase block mt-1">{general.card3Subtitle || t("Djibouti-ville — Quartier Daryel")}</p>
              </Editable>
              <Editable
                label="Description de la Carte 3"
                value={general.card3Desc || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, card3Desc: newVal }))}
              >
                <p className="text-slate-605 text-xs sm:text-sm mt-4 leading-relaxed font-sans block">
                  {general.card3Desc || t("Locaux d'hébergement complets situés dans la banlieue d'accès rapide de Djibouti, permettant un transfert sécurisé immédiat 24h/24.")}
                </p>
              </Editable>
            </div>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
              <span className="text-[9px] uppercase font-mono text-slate-400">Partager le portail</span>
              <button
                onClick={() => handleShare(3)}
                className={`py-2 px-4 rounded-xl text-xs font-bold font-sans transition-all duration-300 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  copiedCardIndex === 3
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-50 text-rose-850 hover:bg-slate-100 border border-slate-150"
                }`}
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{copiedCardIndex === 3 ? "Copié !" : "Partager"}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* 2. STRATEGIC GOVERNANCE WITH GLOWING INTERIOR */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-14 border border-slate-800 shadow-xl mb-20 relative overflow-hidden text-left"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -mr-32 -mt-32" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-4 flex flex-col items-center text-center lg:text-left lg:items-start border-b lg:border-b-0 lg:border-r border-slate-800 pb-8 lg:pb-0 lg:pr-8 gap-4">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-blue-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-900/40 border border-blue-400/20">
                CAU
              </div>
              <div>
                <Editable
                  label="Titre du rôle stratégique"
                  value={general.presidenceTitle || t("")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, presidenceTitle: newVal }))}
                >
                  <h3 className="font-serif italic font-bold text-2xl text-white block">{general.presidenceTitle || t("Présidence")}</h3>
                </Editable>

                <Editable
                  label="Sous-titre du rôle stratégique"
                  value={general.presidenceSubtitle || t("")}
                  onSave={(newVal) => setGeneral((prev) => ({ ...prev, presidenceSubtitle: newVal }))}
                >
                  <p className="text-xs font-mono tracking-wider text-slate-400 mt-1 uppercase block">{general.presidenceSubtitle || t("Responsable Général de l'Association")}</p>
                </Editable>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4 text-left">
              <Editable
                label="Libellé du badge de mandat"
                value={general.presidenceBadge || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, presidenceBadge: newVal }))}
              >
                <span className="text-amber-400 text-xs uppercase tracking-widest font-mono font-bold flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 w-fit px-3 py-1 rounded-full cursor-pointer">
                  <UserCheck className="h-4 w-4 shrink-0" /> {general.presidenceBadge || t("Mandat institutionnel stratégique")}
                </span>
              </Editable>

              <Editable
                label="Texte de description stratégique de la Présidence"
                value={general.presidenceDesc || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, presidenceDesc: newVal }))}
              >
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans block">
                  {general.presidenceDesc || t("Le Président assume le mandat stratégique complet vis-à-vis des juridictions étatiques djiboutiennes. Il assure le positionnement légal de l'association, décompresse et désamorce les tensions avec la brigade des mineurs et supervise l'ensemble de nos paires opérationnels pour garantir le respect de l'intérêt supérieur des enfants protégés.")}
                </p>
              </Editable>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 mt-4 font-sans">
                <div onClick={(e) => e.stopPropagation()}>
                  <Editable
                    label="Mission / Arbitrage 1"
                    value={general.presidenceDuty1 || t("")}
                    onSave={(newVal) => setGeneral((prev) => ({ ...prev, presidenceDuty1: newVal }))}
                  >
                    <span className="flex items-center gap-2.5 bg-slate-950/40 py-2.5 px-3.5 rounded-xl border border-slate-800/60 cursor-pointer block w-full">
                      <div className="h-2 w-2 bg-blue-500 rounded-full shrink-0" /> {general.presidenceDuty1 || t("Arbitre la direction stratégique générale")}
                    </span>
                  </Editable>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <Editable
                    label="Mission / Arbitrage 2"
                    value={general.presidenceDuty2 || t("")}
                    onSave={(newVal) => setGeneral((prev) => ({ ...prev, presidenceDuty2: newVal }))}
                  >
                    <span className="flex items-center gap-2.5 bg-slate-950/40 py-2.5 px-3.5 rounded-xl border border-slate-800/60 cursor-pointer block w-full">
                      <div className="h-2 w-2 bg-blue-500 rounded-full shrink-0" /> {general.presidenceDuty2 || t("Négocie avec les Procureurs de la République")}
                    </span>
                  </Editable>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <Editable
                    label="Mission / Arbitrage 3"
                    value={general.presidenceDuty3 || t("")}
                    onSave={(newVal) => setGeneral((prev) => ({ ...prev, presidenceDuty3: newVal }))}
                  >
                    <span className="flex items-center gap-2.5 bg-slate-950/40 py-2.5 px-3.5 rounded-xl border border-slate-800/60 cursor-pointer block w-full">
                      <div className="h-2 w-2 bg-blue-500 rounded-full shrink-0" /> {general.presidenceDuty3 || t("Représente légalement l’association")}
                    </span>
                  </Editable>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <Editable
                    label="Mission / Arbitrage 4"
                    value={general.presidenceDuty4 || t("")}
                    onSave={(newVal) => setGeneral((prev) => ({ ...prev, presidenceDuty4: newVal }))}
                  >
                    <span className="flex items-center gap-2.5 bg-slate-950/40 py-2.5 px-3.5 rounded-xl border border-slate-800/60 cursor-pointer block w-full">
                      <div className="h-2 w-2 bg-blue-500 rounded-full shrink-0" /> {general.presidenceDuty4 || t("Réfère devant les ministères consulaires")}
                    </span>
                  </Editable>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* 3. INTERACTIVE ORGANIGRAM WITH HIGHLIGHT ENHANCEMENTS */}
        <div className="mb-24" id="organigram-section">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <Editable
              label="Surlignage / Badge de la section organigramme"
              value={general.organiSectionBadge || t("")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, organiSectionBadge: newVal }))}
            >
              <span className="text-indigo-600 font-mono text-xs uppercase tracking-widest font-bold block">{general.organiSectionBadge || t("L'Organigramme Opérationnel Interactif")}</span>
            </Editable>
            <Editable
              label="Titre de la section organigramme"
              value={general.organiSectionTitle || t("")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, organiSectionTitle: newVal }))}
            >
              <h3 className="font-serif text-2xl sm:text-4xl italic font-black text-slate-900 block">{general.organiSectionTitle || t("Arbre actif de gouvernance")}</h3>
            </Editable>
            <Editable
              label="Description de la section organigramme"
              value={general.organiSectionDesc || t("")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, organiSectionDesc: newVal }))}
            >
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans block">
                {general.organiSectionDesc || t("Sélectionnez les différents pôles d'activité de notre organigramme pour consulter en temps réel les attributions, effectifs qualifiés et responsabilités respectives.")}
              </p>
            </Editable>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Tree representation Column (Left) */}
            <div className="lg:col-span-5 flex flex-col gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 justify-center">
              <Editable
                label="Libellé latéral des Pôles"
                value={general.organiSidebarTitle || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, organiSidebarTitle: newVal }))}
              >
                <span className="text-slate-400 font-mono text-[9px] uppercase tracking-widest mb-2 font-bold block text-left">{general.organiSidebarTitle || t("Pôles d'activité")}</span>
              </Editable>
              
              {/* Node 1: CA */}
              <button
                onClick={() => setSelectedNode("ca")}
                className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-300 w-full flex items-center justify-between cursor-pointer group ${
                  selectedNode === "ca" 
                    ? "bg-[#1E3A8A] text-white border-blue-900 shadow-lg shadow-blue-105" 
                    : "bg-slate-50 text-slate-800 border-slate-200/60 hover:bg-slate-100 hover:border-slate-350"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl text-xs font-black tracking-wider transition-colors duration-300 ${selectedNode === "ca" ? "bg-white/10 text-white" : "bg-blue-50 text-[#1E3A8A] group-hover:bg-blue-100"}`}>
                    CA
                  </div>
                  <div>
                    <h4 className="font-serif italic font-bold text-sm sm:text-base">Conseil d&apos;Administration</h4>
                    <p className={`text-[10px] font-mono mt-0.5 ${selectedNode === "ca" ? "text-blue-200" : "text-slate-500"}`}>Stratégie d&apos;Orientation</p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${selectedNode === "ca" ? "translate-x-1.5" : "text-slate-400"}`} />
              </button>

              {/* Node 2: Admin */}
              <button
                onClick={() => setSelectedNode("admin")}
                className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-300 w-full flex items-center justify-between cursor-pointer group ${
                  selectedNode === "admin" 
                    ? "bg-[#1E3A8A] text-white border-blue-900 shadow-lg shadow-blue-105" 
                    : "bg-slate-50 text-slate-800 border-slate-200/60 hover:bg-slate-100 hover:border-slate-350"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl text-xs font-black tracking-wider transition-colors duration-300 ${selectedNode === "admin" ? "bg-white/10 text-white" : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100"}`}>
                    AF
                  </div>
                  <div>
                    <h4 className="font-serif italic font-bold text-sm sm:text-base">Pôle Administratif &amp; Financier</h4>
                    <p className={`text-[10px] font-mono mt-0.5 ${selectedNode === "admin" ? "text-blue-200" : "text-slate-500"}`}>Logistique &amp; Dotations</p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${selectedNode === "admin" ? "translate-x-1.5" : "text-slate-400"}`} />
              </button>

              {/* Node 3: Medical/Educ */}
              <button
                onClick={() => setSelectedNode("medical")}
                className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-300 w-full flex items-center justify-between cursor-pointer group ${
                  selectedNode === "medical" 
                    ? "bg-[#1E3A8A] text-white border-blue-900 shadow-lg shadow-blue-105" 
                    : "bg-slate-50 text-slate-800 border-slate-200/60 hover:bg-slate-100 hover:border-slate-350"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl text-xs font-black tracking-wider transition-colors duration-300 ${selectedNode === "medical" ? "bg-white/10 text-white" : "bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100"}`}>
                    MED
                  </div>
                  <div>
                    <h4 className="font-serif italic font-bold text-sm sm:text-base">Pôle Médical &amp; Éducatif</h4>
                    <p className={`text-[10px] font-mono mt-0.5 ${selectedNode === "medical" ? "text-blue-200" : "text-slate-500"}`}>Synergie d&apos;Accueil Clinique</p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${selectedNode === "medical" ? "translate-x-1.5" : "text-slate-400"}`} />
              </button>
            </div>

            {/* Content Display Column (Right) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedNode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-2xs h-full flex flex-col justify-between text-left"
                >
                  <div>
                    <Editable
                      label="Sous-titre du département"
                      value={matchedNode.subtitle}
                      onSave={(newVal) => {
                        setStructure((prev) =>
                          prev.map((n) => (n.id === matchedNode.id ? { ...n, subtitle: newVal } : n))
                        );
                      }}
                    >
                      <span className="text-blue-600 text-[10px] sm:text-xs font-mono tracking-widest uppercase font-bold bg-blue-50 border border-blue-100/45 px-3 py-1 rounded-full">
                        {matchedNode.subtitle}
                      </span>
                    </Editable>
                    <Editable
                      label="Intitulé du pôle"
                      value={matchedNode.title}
                      onSave={(newVal) => {
                        setStructure((prev) =>
                          prev.map((n) => (n.id === matchedNode.id ? { ...n, title: newVal } : n))
                        );
                      }}
                    >
                      <h3 className="font-serif text-2xl sm:text-3xl italic font-black text-slate-900 mt-4 leading-tight">
                        {matchedNode.title}
                      </h3>
                    </Editable>
                    <Editable
                      label="Attribution clé ou présentation générale"
                      value={matchedNode.desc}
                      onSave={(newVal) => {
                        setStructure((prev) =>
                          prev.map((n) => (n.id === matchedNode.id ? { ...n, desc: newVal } : n))
                        );
                      }}
                    >
                      <p className="text-slate-600 text-xs sm:text-sm mt-4 leading-relaxed font-sans">
                        {matchedNode.desc}
                      </p>
                    </Editable>
                    
                    <div className="border-t border-slate-100 pt-6 mt-6">
                      <span className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider block mb-4">
                        Attributions fondamentales :
                      </span>
                      <ul className="grid grid-cols-1 gap-3">
                        {matchedNode.duties.map((duty, idx) => (
                          <li key={idx} className="flex items-start gap-4 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 font-sans">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1E3A8A] text-white text-[9.5px] font-mono">
                              {idx + 1}
                            </span>
                            <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                              <Editable
                                label={`Mission attribution #${idx + 1}`}
                                value={duty}
                                onSave={(newVal) => {
                                  setStructure((prev) =>
                                    prev.map((n) => {
                                      if (n.id === matchedNode.id) {
                                        const nextDuties = [...n.duties];
                                        nextDuties[idx] = newVal;
                                        return { ...n, duties: nextDuties };
                                      }
                                      return n;
                                    })
                                  );
                                }}
                              >
                                <span className="leading-relaxed block">{duty}</span>
                              </Editable>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="text-[9.5px] text-slate-505 font-mono italic mt-6 bg-amber-50/40 p-3 rounded-xl border border-amber-100/50 flex items-center gap-2">
                    <Info className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    Enregistrements officiels validés par le conseil de tutelle judiciaire du CAU de Djibouti.
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* 3.5 REAL SATELLITE MAP SHOWCASE */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-200 shadow-xl mb-24 text-left relative overflow-hidden"
          id="graphic-organigram-section"
        >
          {/* Decorative background grid and ambient lighting glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/20 rounded-full blur-[100px] pointer-events-none -ml-20 -mb-20" />

          {/* Heading structure with editable options */}
          <div className="max-w-3xl mb-8 space-y-3 text-left relative z-10">
            <Editable
              label="Badge de la Localisation"
              value={general.organiDocBadge || t("")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, organiDocBadge: newVal }))}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-150 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-blue-700 font-mono text-[10px] uppercase tracking-widest font-black block">{general.organiDocBadge || t("PLAN DE LOCALISATION SATELLITE")}</span>
              </div>
            </Editable>
            
            <Editable
              label="Titre de la Localisation"
              value={general.organiDocTitle || t("")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, organiDocTitle: newVal }))}
            >
              <h3 className="font-serif text-3xl sm:text-4xl italic font-black text-slate-900 tracking-tight flex items-center gap-3">
                <MapPin className="h-8 w-8 text-[#00ADEF] shrink-0 animate-bounce" />
                <span>{general.organiDocTitle || t("Où se trouve Pouponnière Daryel ?")}</span>
              </h3>
            </Editable>

            <Editable
              label="Description de la Localisation"
              value={general.organiDocDesc || t("")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, organiDocDesc: newVal }))}
            >
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans max-w-4xl block">
                {general.organiDocDesc || t("Le Foyer est idéalement implanté de manière stratégique à Djibouti, sur la Route de l'Aéroport à Gabode. Une position centrale facilitant les interventions d'urgence pédiatriques de la Brigade des Mineurs et l'accès sécurisé pour nos collaborateurs.")}
              </p>
            </Editable>
          </div>

          {/* MASTERPIECE INTERACTIVE CONTAINER FOR CART */}
          <div className="relative rounded-[2rem] overflow-hidden border-2 border-slate-200/80 bg-slate-100 p-2 sm:p-4 hover:border-[#00ADEF] transition-all duration-700 group shadow-md hover:shadow-2xl">
            
            {/* Glossy Grid Line tech style mask */}
            <div className="absolute inset-0 bg-grid-dots z-10 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
            
            {/* The Satellite Image Container */}
            <div className="relative rounded-[1.5rem] overflow-hidden bg-slate-950 aspect-[16/10] sm:aspect-[16/9] max-h-[660px] flex items-center justify-center">
              
              <motion.img 
                src="/carte.png" 
                alt="Carte Satellite Pouponnière Daryel à Djibouti" 
                className="w-full h-full object-cover select-none transition-all duration-[1200ms] group-hover:scale-110 group-hover:brightness-[0.90] cursor-crosshair"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('/carte.png')) {
                    target.src = '/carte.png';
                  }
                }}
              />

              {/* PULSING SCI-FI GLASS GLOW OVER POUPOUNIERRE PIN */}
              {/* Coords align specifically with Pouponnière Daryel pin in user's image */}
              <div 
                className="absolute top-[41.5%] left-[49.5%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              >
                {/* 1st Pulse Ring */}
                <div className="absolute -inset-10 rounded-full border-2 border-red-500/60 animate-ping opacity-75" />
                {/* 2nd Pulse Ring */}
                <div className="absolute -inset-16 rounded-full border border-[#00ADEF]/40 animate-pulse duration-1000 opacity-50" />
                {/* 3rd Small Ring */}
                <div className="absolute -inset-4 rounded-full bg-red-500/10 border-2 border-white/80 shadow-lg shadow-red-500/50 animate-bounce" />
                
                {/* Inner radar crosshair ticks */}
                <div className="absolute h-8 w-[2px] bg-red-500 -top-4 left-0 right-0 mx-auto opacity-80" />
                <div className="absolute h-[2px] w-8 bg-red-500 top-0 bottom-0 my-auto -left-4 opacity-80" />
              </div>

              {/* FLOATING TOP CORNER HUD: STATUS CONTAINER */}
              <div className="absolute top-4 left-4 z-20 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-white/10 px-4 py-2.5 shadow-lg select-none hidden sm:block pointer-events-none transform group-hover:translate-x-1 transition-all duration-500">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span className="text-white font-mono text-[9px] uppercase tracking-widest font-black">GPS LIVE TRACKING AT CIVIL MILITARY AIRPORT AREA</span>
                </div>
                <div className="text-[10px] text-slate-300 font-mono mt-1 flex items-center gap-3">
                  <span>LAT: 11.5756° N</span>
                  <span className="text-white/20">|</span>
                  <span>LNG: 43.1447° E</span>
                  <span className="text-white/20">|</span>
                  <span className="text-[#00ADEF]">ALT: 12m</span>
                </div>
              </div>

              {/* RIGHT CORNER HUD: MAP SPECIFICS */}
              <div className="absolute bottom-4 right-4 z-20 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-white/10 p-3 shadow-lg select-none pointer-events-none max-w-xs transition-all duration-500 transform group-hover:-translate-x-1">
                <span className="text-[#00ADEF] font-mono text-[9px] uppercase tracking-wider font-bold block mb-1">Repères à proximité</span>
                <p className="text-white text-[11px] font-sans leading-tight">
                  Entre l&apos;Académie Arabe et la Route de l&apos;Aéroport, face au CEM Gabode II
                </p>
                <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[8px] font-mono text-slate-400">
                  <span>SATELLITE RESOLUTION 0.5m</span>
                  <span>DJIBOUTI DISTRICT</span>
                </div>
              </div>

              {/* SHIMMERING REFLECTION SWEET SWEEP EFFECT ON HOVER */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none -skew-x-12 transform translate-x-full group-hover:-translate-x-full ease-out" />
            </div>

            {/* BUTTON CTA BLOCK BELOW SATELLITE PHOTO */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2 py-1.5 z-20 relative">
              <div className="flex items-center gap-3 text-left">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-[#00ADEF]/10 text-[#00ADEF] flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-sans">Adresse Foyer Daryel</h4>
                  <p className="text-slate-500 text-xs font-sans">Gabode, Route de l&apos;Aéroport (à côté de la Brigade des Mineurs), Djibouti-Ville</p>
                </div>
              </div>

              <a 
                href="https://maps.google.com/?q=Pouponniere+Daryel+Djibouti"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00ADEF] hover:bg-sky-600 text-white font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-lg shadow-sky-500/20 active:scale-95 transition cursor-pointer"
              >
                <span>Ouvrir l&apos;Itinéraire Google Maps</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

          </div>
        </motion.div>

        {/* 4. THE CLINIC & OPERATIONAL STAFF */}
        <div id="staff-section">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <Editable
              label="Badge de la section Staff"
              value={general.staffSectionBadge || t("")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, staffSectionBadge: newVal }))}
            >
              <span className="text-rose-600 font-mono text-xs uppercase tracking-widest font-bold block">{general.staffSectionBadge || t("La Clinique de Réhabilitation")}</span>
            </Editable>
            <Editable
              label="Titre de la section Staff"
              value={general.staffSectionTitle || t("")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, staffSectionTitle: newVal }))}
            >
              <h3 className="font-serif text-2xl sm:text-4xl italic font-black text-slate-900 block">{general.staffSectionTitle || t("Le Staff Clinique Médico-Éducatif")}</h3>
            </Editable>
            <Editable
              label="Description de la section Staff"
              value={general.staffSectionDesc || t("")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, staffSectionDesc: newVal }))}
            >
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans block">
                {general.staffSectionDesc || t("Une présence continue h24 de professionnels cliniques aguerris couvrant toutes les sphères du bien-être, de la pédiatrie et de l'intégrité infantile.")}
              </p>
            </Editable>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            {personnel.map((p, idx) => (
              <motion.div 
                key={p.id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`p-6 rounded-2xl border transition duration-300 flex flex-col justify-between shadow-2xs text-left ${
                  p.highlight
                    ? "bg-gradient-to-b from-rose-50 to-white border-rose-300 shadow-md shadow-rose-100/30"
                    : "bg-white border-slate-200/80 hover:border-slate-350"
                }`}
              >
                <div>
                  <div className={`p-2 w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-xs font-mono font-bold tracking-tight border ${
                    p.highlight 
                      ? "bg-rose-600 text-white shadow-sm border-rose-500" 
                      : "bg-emerald-50 text-emerald-700 border-emerald-100"
                  }`}>
                    <Editable
                      label="Émoji Icône du personnel"
                      value={p.icon}
                      onSave={(newVal) => {
                        setPersonnel((prev) =>
                          prev.map((item) => (item.id === p.id ? { ...item, icon: newVal } : item))
                        );
                      }}
                    >
                      <span className="text-xl leading-none cursor-pointer">{p.icon}</span>
                    </Editable>
                  </div>
                  <Editable
                    label="Rôle du personnel"
                    value={p.role}
                    onSave={(newVal) => {
                      setPersonnel((prev) =>
                        prev.map((item) => (item.id === p.id ? { ...item, role: newVal } : item))
                      );
                    }}
                  >
                    <h4 className="font-serif italic font-bold text-sm sm:text-base text-slate-900 leading-tight block">
                      {p.role}
                    </h4>
                  </Editable>
                  <Editable
                    label="Description ou attribution du personnel"
                    value={p.desc}
                    onSave={(newVal) => {
                      setPersonnel((prev) =>
                        prev.map((item) => (item.id === p.id ? { ...item, desc: newVal } : item))
                      );
                    }}
                  >
                    <p className="text-slate-605 text-[11px] sm:text-xs mt-3 leading-relaxed font-sans block">
                      {p.desc}
                    </p>
                  </Editable>
                </div>

                {p.highlight && (
                  <div className="mt-5 p-3 rounded-xl bg-rose-600/5 border border-rose-600/20 text-left">
                    <span className="text-[9px] font-mono font-bold text-rose-800 uppercase tracking-widest flex items-center gap-1">
                      <BadgeAlert className="h-3 w-3 text-rose-600 animate-pulse" /> Saisine immédiate
                    </span>
                    <p className="text-[10px] text-rose-950 leading-relaxed font-semibold mt-1 font-sans">
                      Habilité à ordonner la sauvegarde obligatoire auprès du Juge si l&apos;intégrité physique d&apos;un mineur s&apos;avère compromise.
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
