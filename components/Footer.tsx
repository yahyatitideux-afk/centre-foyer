"use client";

import React from "react";
import { useSiteState } from "@/lib/SiteStateContext";
import Editable from "@/components/Editable";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  const { general, setGeneral, t } = useSiteState();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 text-left" id="main-portal-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Column 1: Logo & General Description */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden border border-slate-750 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpeg"
                alt="Logo Foyer Daryel"
                className="h-full w-full object-contain rounded-lg select-none"
              />
            </div>
            <div>
              <span className="font-serif italic font-bold text-white text-base leading-none block">Foyer Daryel</span>
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-400">CAU de Djibouti</span>
            </div>
          </div>
          <Editable
            label="Texte de présentation courte (Footer)"
            value={general.footerDesc || t("")}
            onSave={(newVal) => setGeneral((prev) => ({ ...prev, footerDesc: newVal }))}
          >
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
              {general.footerDesc || t("Le Centre d'Accueil et d'Urgence de Djibouti est une association d'interpellation publique conventionnée par le Ministère de la Justice, assurant l'accueil clinique et la réhabilitation pédiatrique de crise.")}
            </p>
          </Editable>
        </div>

        {/* Column 2: Emergency contacts/Schedule header & numbers */}
        <div className="md:col-span-4 space-y-3">
          <Editable
            label="Titre de la Colonne de Contacts (Footer)"
            value={general.footerCol2Title || t("")}
            onSave={(newVal) => setGeneral((prev) => ({ ...prev, footerCol2Title: newVal }))}
          >
            <span className="text-slate-200 text-xs font-serif font-bold italic block uppercase tracking-wide">
              {general.footerCol2Title || t("Signalements & Gardes")}
            </span>
          </Editable>
          
          <ul className="text-xs space-y-2 font-mono leading-relaxed">
            <li>
              ☎ Urgences Placement :{" "}
              <Editable
                label="Numéro Urgence 1"
                value={general.phoneEmergency || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, phoneEmergency: newVal }))}
              >
                <strong className="text-white font-serif inline cursor-pointer">{general.phoneEmergency || t("+253 21 35 12 12")}</strong>
              </Editable>
            </li>
            <li>
              📞 Astreinte Sociale : +253 77 81 44 44
            </li>
            <li>
              ✉ Courriel Administrateur :{" "}
              <Editable
                label="Courriel Administratif"
                value={general.email || t("")}
                onSave={(newVal) => setGeneral((prev) => ({ ...prev, email: newVal }))}
              >
                <span className="cursor-pointer font-bold inline">{general.email || t("direction.cau@daryel.dj")}</span>
              </Editable>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal reference context */}
        <div className="md:col-span-3 space-y-3">
          <Editable
            label="Titre de la Colonne d'Agrément"
            value={general.footerCol3Title || t("")}
            onSave={(newVal) => setGeneral((prev) => ({ ...prev, footerCol3Title: newVal }))}
          >
            <span className="text-slate-200 text-xs font-serif font-bold italic block uppercase tracking-wide">
              {general.footerCol3Title || t("Agrément & Parquet")}
            </span>
          </Editable>
          
          <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
            <Editable
              label="Mention d'Agrément judiciaire"
              value={general.alertInfo || t("")}
              onSave={(newVal) => setGeneral((prev) => ({ ...prev, alertInfo: newVal }))}
            >
              <p className="text-[10.5px] text-slate-450 leading-relaxed cursor-pointer">
                {general.alertInfo || t("Toutes les décisions de garde d'urgence du CAU font l'objet d'une ordonnance validée devant le Greffe de Djibouti.")}
              </p>
            </Editable>
          </div>
        </div>

      </div>

      {/* Footer Bottom copyright & customizable linkages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-850 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10.5px] text-slate-500 gap-4">
        <Editable
          label="Copyright & Mentions Légales"
          value={general.footerCopyright || t("")}
          onSave={(newVal) => setGeneral((prev) => ({ ...prev, footerCopyright: newVal }))}
        >
          <span className="cursor-pointer">
            {general.footerCopyright || `© ${new Date().getFullYear()} Foyer Daryel (CAU) — République de Djibouti. Tous droits réservés.`}
          </span>
        </Editable>

        <div className="flex gap-4 font-mono uppercase">
          <Editable
            label="Nom Lien 1 (Footer)"
            value={general.footerLink1 || t("")}
            onSave={(newVal) => setGeneral((prev) => ({ ...prev, footerLink1: newVal }))}
          >
            <span className="hover:text-slate-200 cursor-pointer">{general.footerLink1 || t("Lois de protection")}</span>
          </Editable>
          
          <Editable
            label="Nom Lien 2 (Footer)"
            value={general.footerLink2 || t("")}
            onSave={(newVal) => setGeneral((prev) => ({ ...prev, footerLink2: newVal }))}
          >
            <span className="hover:text-slate-200 cursor-pointer">{general.footerLink2 || t("Rapports annuels")}</span>
          </Editable>
        </div>
      </div>
    </footer>
  );
}
