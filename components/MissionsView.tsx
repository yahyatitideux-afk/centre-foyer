"use client";

import React from "react";
import { useSiteState } from "@/lib/SiteStateContext";
import Editable from "@/components/Editable";
import { ShieldCheck, CalendarRange, HeartPulse, UserCheck, ShieldAlert, Award, HelpingHand } from "lucide-react";
import { motion } from "framer-motion";

export default function MissionsView() {
  const { chroniques, setChroniques, general, setGeneral, t } = useSiteState();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 16
      }
    }
  };

  const missions = [
    {
      title: t("Sauvetage & Hébergement d'Urgence"),
      tagline: t("Action numéro 1 (H24)"),
      desc: t("Retirer sans délai un mineur d'un milieu familial ou social néfaste. Le foyer offre un abri chaud, une alimentation fortifiée médicalement contrôlée et des vêtements adaptés."),
      icon: <ShieldAlert className="h-6 w-6 text-blue-600" />,
      color: "border-blue-100 hover:border-blue-300",
      detail: t("Mise à l'abri physique sécurisée dans la banlieue d'accès protégé de Djibouti.")
    },
    {
      title: t("Réhabilitation Psycho-Affective"),
      tagline: t("Soins cliniques approfondis"),
      desc: t("Prise en charge médico-psychologique d'apaisement pour dissiper les traumatismes. Présence d'éducateurs permanents favorisant le réapprentissage social par le jeu et le dessin thérapeutique."),
      icon: <HelpingHand className="h-6 w-6 text-emerald-600" />,
      color: "border-emerald-100 hover:border-emerald-300",
      detail: t("Consoles cliniques d'écoute quotidiennes pour stabiliser le stress pédiatrique.")
    },
    {
      title: t("Enquêtes psychosociales"),
      tagline: t("Soutien juridique expert"),
      desc: t("Liaison continue avec le Parquet et la brigade des mineurs pour mener des enquêtes approfondies. Permet d'identifier des alternatives durables : réintégration sécurisée ou placement pérenne."),
      icon: <Award className="h-6 w-6 text-[#1E3A8A]" />,
      color: "border-indigo-100 hover:border-indigo-300",
      detail: t("Rapports instruits aux greffes pour garantir l'intérêt supérieur de chaque enfant.")
    }
  ];

  const timelineIcons = [
    <ShieldAlert key="1" className="h-4 w-4" />,
    <HeartPulse key="2" className="h-4 w-4" />,
    <CalendarRange key="3" className="h-4 w-4" />,
    <UserCheck key="4" className="h-4 w-4" />
  ];

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-20" id="missions-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header with elegant badges and serif typography */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <Editable
            label="Surlignage / Badge des Missions"
            value={general.missionsSectionBadge || t("")}
            onSave={(newVal) => setGeneral((prev) => ({ ...prev, missionsSectionBadge: newVal }))}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] bg-[#1E3A8A]/10 text-[#1E3A8A] font-black px-4 py-1.5 rounded-full inline-block border border-[#1E3A8A]/15 cursor-pointer">
              {general.missionsSectionBadge || t("Attributions Institutionnelles")}
            </span>
          </Editable>

          <Editable
            label={t("Titre des Missions")}
            value={general.missionsSectionTitle || t("")}
            onSave={(newVal) => setGeneral((prev) => ({ ...prev, missionsSectionTitle: newVal }))}
          >
            <h1 className="font-serif text-3xl sm:text-5xl italic font-black text-slate-900 tracking-tight leading-tight block">
              {general.missionsSectionTitle || t("Nos grandes missions")}
            </h1>
          </Editable>

          <Editable
            label={t("Description du paragraphe d'en-tête")}
            value={general.missionsSectionDesc || t("")}
            onSave={(newVal) => setGeneral((prev) => ({ ...prev, missionsSectionDesc: newVal }))}
          >
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium block">
              {general.missionsSectionDesc || t("Un triptyque d'attribution fondé sur la protection permanente de la vie, le soutien psychologique global et le renforcement des structures de codétection communautaires de Djibouti.")}
            </p>
          </Editable>
        </motion.div>

        {/* 1. MISSIONS GRID (Cards) with interactive scaling and spring physics */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24"
        >
          {missions.map((mission, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 25px 50px -12px rgba(30, 58, 138, 0.08)"
              }}
              className={`bg-white border rounded-[2rem] p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between shadow-2xs ${mission.color} text-left`}
            >
              <div>
                <div className="p-4 w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-2xs mb-8 transition-transform duration-300 hover:rotate-3">
                  {mission.icon}
                </div>
                <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-[#1E3A8A]/80 block mb-2">
                  {mission.tagline}
                </span>
                <h3 className="font-serif italic font-bold text-2xl text-slate-900 leading-tight">
                  {mission.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-4 leading-relaxed font-sans">
                  {mission.desc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100/80 text-left">
                <span className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 block mb-2">{t("Action Concrète :")}</span>
                <p className="text-xs sm:text-sm text-[#1E3A8A] leading-relaxed italic font-serif">
                  &ldquo;{mission.detail}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>



      </div>
    </div>
  );
}
