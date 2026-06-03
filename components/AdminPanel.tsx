"use client";

import React, { useState } from "react";
import { useSiteState } from "@/lib/SiteStateContext";
import { Settings, Plus, Trash2, RotateCcw, Save, ShieldAlert, Image as ImageIcon, FileText, Activity, Users, Award, Camera, Upload, Undo, ClipboardList } from "lucide-react";

export default function AdminPanel() {
  const {
    general,
    setGeneral,
    chroniques,
    setChroniques,
    galerie,
    setGalerie,
    addGalleryItem,
    deleteGalleryItem,
    publications,
    setPublications,
    addPublication,
    deletePublication,
    resetToDefault,
    expertises,
    addExpertise,
    deleteExpertise,
    updateExpertise,
    crewMembers,
    addCrewMember,
    deleteCrewMember,
    updateCrewMember,
    auditLog,
    registerModification,
    undoLastAction,
    mediaFiles,
    addMediaFile,
    renameMediaFile,
    deleteMediaFile,
    assistanceRequests,
    deleteAssistanceRequest,
    t
  } = useSiteState();

  const [activeTab, setActiveTab] = useState<"general" | "timeline" | "gallery" | "publications" | "expertises" | "crew" | "audit" | "media" | "assistance">("general");

  // Filter states for Audit Log calendar and user
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>("");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");

  // Expertises form states
  const [newExpTitle, setNewExpTitle] = useState("");
  const [newExpBadge, setNewExpBadge] = useState("Clinique");
  const [newExpDesc, setNewExpDesc] = useState("");
  const [newExpIcon, setNewExpIcon] = useState("Stethoscope"); // Stethoscope, Heart, ShieldCheck, Users
  const [newExpFileBase64, setNewExpFileBase64] = useState<string | null>(null);

  // Crew form states
  const [newCrewName, setNewCrewName] = useState("");
  const [newCrewRole, setNewCrewRole] = useState("");
  const [newCrewDesc, setNewCrewDesc] = useState("");
  const [newCrewStatus, setNewCrewStatus] = useState("En Service"); // En Service, En Astreinte, Au Tribunal
  const [newCrewStats, setNewCrewStats] = useState("Garde: 24h / Actif");
  const [newCrewFileBase64, setNewCrewFileBase64] = useState<string | null>(null);

  // Form states
  const [phoneState, setPhoneState] = useState(general.phoneEmergency);
  const [taglineState, setTaglineState] = useState(general.tagline);
  const [alertInfoState, setAlertInfoState] = useState(general.alertInfo);
  const [emailState, setEmailState] = useState(general.email);
  const [addressState, setAddressState] = useState(general.address);
  const [heroBgUrlState, setHeroBgUrlState] = useState(general.heroBgUrl || t(""));

  // Extended Custom Wordings States
  const [heroSloganState, setHeroSloganState] = useState(general.heroSlogan || t(""));
  const [heroQuoteState, setHeroQuoteState] = useState(general.heroQuote || t(""));
  const [heroSubTextState, setHeroSubTextState] = useState(general.heroSubText || t(""));
  const [gouvernanceIntroState, setGouvernanceIntroState] = useState(general.gouvernanceIntro || t(""));
  const [adminPasswordState, setAdminPasswordState] = useState(general.adminPassword || t("daryel2026"));

  // Device Photo Import States
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string>("");

  // Gallery item form state
  const [newImgUrl, setNewImgUrl] = useState("");
  const [newImgCaption, setNewImgCaption] = useState("");
  const [newImgCat, setNewImgCat] = useState("Installations");
  const [galleryFileBase64, setGalleryFileBase64] = useState<string | null>(null);
  const [galleryFileName, setGalleryFileName] = useState<string>("");

  // Publication item form state
  const [newPubTitle, setNewPubTitle] = useState("");
  const [newPubCat, setNewPubCat] = useState("Juridique");
  const [newPubAuthor, setNewPubAuthor] = useState("");
  const [newPubSummary, setNewPubSummary] = useState("");
  const [newPubContent, setNewPubContent] = useState("");
  const [newPubFileBase64, setNewPubFileBase64] = useState<string | null>(null);
  const [newPubFileName, setNewPubFileName] = useState<string>("");
  const [newPubFileType, setNewPubFileType] = useState<"pdf" | "image" | "video" | "none">("none");

  const [notif, setNotif] = useState<string | null>(null);

  const triggerNotif = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImageBase64(reader.result as string);
        triggerNotif(`Image "${file.name}" chargée avec succès ! Choisissez son attribution ci-dessous.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyImportedImage = (target: "bg" | "gallery") => {
    if (!uploadedImageBase64) return;
    if (target === "bg") {
      setHeroBgUrlState(uploadedImageBase64);
      setGeneral((prev) => ({ ...prev, heroBgUrl: uploadedImageBase64 }));
      triggerNotif("Arrière-plan d'accueil redéfini avec le fichier importé de votre appareil ! Cliquez sur sauvegarder.");
    } else if (target === "gallery") {
      addGalleryItem({
        imageUrl: uploadedImageBase64,
        caption: "Importation : " + (uploadFileName.replace(/\.[^/.]+$/, "") || "Photo d'activité"),
        category: "Vie quotidienne"
      });
      triggerNotif("Photo de votre appareil ajoutée à l'album d'activité !");
    }
    // clear states
    setUploadedImageBase64(null);
    setUploadFileName("");
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneral((prev) => ({
      ...prev,
      heroBgUrl: heroBgUrlState,
      adminPassword: adminPasswordState
    }));
    triggerNotif("Configuration d'accès et arrière-plan enregistrés avec succès !");
  };

  const handleUpdateStep = (id: string, field: "title" | "subtitle" | "desc", value: string) => {
    setChroniques((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGalleryFileName(file.name);
      if (!newImgCaption) {
        // Auto-fill filename nicely
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setNewImgCaption(cleanName);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryFileBase64(reader.result as string);
        triggerNotif(`Image "${file.name}" importée ! Indiquez sa légende et sa catégorie ci-dessous.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImageUrl = galleryFileBase64 || newImgUrl;
    if (!finalImageUrl) {
      triggerNotif("Veuillez sélectionner un fichier ou insérer une URL valide.");
      return;
    }
    if (!newImgCaption) {
      triggerNotif("Veuillez écrire une légende pour cette image.");
      return;
    }
    addGalleryItem({
      imageUrl: finalImageUrl,
      caption: newImgCaption,
      category: newImgCat
    });
    setNewImgUrl("");
    setNewImgCaption("");
    setGalleryFileBase64(null);
    setGalleryFileName("");
    triggerNotif("Photo d'activité ajoutée avec succès !");
  };

  const handlePubFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPubFileName(file.name);
      
      let detectedType: "pdf" | "image" | "video" | "none" = "none";
      if (file.type.includes("pdf")) {
        detectedType = "pdf";
      } else if (file.type.includes("image")) {
        detectedType = "image";
      } else if (file.type.includes("video")) {
        detectedType = "video";
      }
      setNewPubFileType(detectedType);

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPubFileBase64(reader.result as string);
        triggerNotif(`Fichier "${file.name}" lié ! (${detectedType.toUpperCase()})`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPubTitle || !newPubContent) {
      triggerNotif("Veuillez remplir au moins le titre et le contenu.");
      return;
    }

    const newId = "p_" + Math.random().toString(36).substring(2, 9);

    registerModification(
      `Publication "${newPubTitle}" ajoutée`,
      "file",
      () => {
        deletePublication(newId);
      }
    );

    addPublication({
      id: newId,
      title: newPubTitle,
      category: newPubCat,
      author: newPubAuthor || "Pôle Administration",
      summary: newPubSummary || "Directive rédigée par le Foyer Daryel",
      content: newPubContent,
      date: new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
      fileType: newPubFileType,
      fileUrl: newPubFileBase64 || undefined,
      fileName: newPubFileName || undefined
    });

    if (newPubFileBase64) {
      const sizeKB = "Pièce Joint";
      addMediaFile(
        newPubFileName,
        newPubFileBase64,
        newPubFileType === "pdf" ? "application/pdf" : newPubFileType === "video" ? "video/mp4" : "image/jpeg",
        sizeKB
      );
    }

    setNewPubTitle("");
    setNewPubAuthor("");
    setNewPubSummary("");
    setNewPubContent("");
    setNewPubFileBase64(null);
    setNewPubFileName("");
    setNewPubFileType("none");
    triggerNotif("Nouvelle directive publiée avec succès !");
  };

  const handleReset = () => {
    if (confirm("Voulez-vous restaurer les valeurs par défaut du portail ? Vos modifications locales seront supprimées.")) {
      resetToDefault();
      triggerNotif("Configuration restaurée aux valeurs d'usine !");
      // Force refresh input fields
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-20" id="admin-panel-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] bg-slate-900 text-white font-black px-4 py-1.5 rounded-full inline-block">
            Console d&apos;Administration
          </span>
          <h1 className="font-serif italic text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
            Console de Gestion CAU
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
            Configurez en direct les textes, coordonnées d&apos;alerte d&apos;urgence, galeries d&apos;action ou publications légales du portail de Djibouti.
          </p>
        </div>

        {/* Global Action Notifications Banner */}
        {notif && (
          <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl text-emerald-800 text-xs sm:text-sm font-semibold mb-8 animate-pulse text-center">
            {notif}
          </div>
        )}



        {/* Main Double Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Navigation drawer (Left) */}
          <div className="lg:col-span-3 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-2xs space-y-2">
            <span className="text-[9px] font-mono tracking-widest text-slate-400 font-bold uppercase block mb-3">Sections de gestion</span>
            
            <button
              onClick={() => setActiveTab("general")}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-3 cursor-pointer ${
                activeTab === "general" ? "bg-[#1E3A8A] text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <Settings className="h-4.5 w-4.5" />
              <span>Général &amp; Alertes</span>
            </button>

            <button
              onClick={() => setActiveTab("timeline")}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-3 cursor-pointer ${
                activeTab === "timeline" ? "bg-[#1E3A8A] text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <Activity className="h-4.5 w-4.5" />
              <span>Parcours de l&apos;Enfant</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-3 cursor-pointer ${
                activeTab === "gallery" ? "bg-[#1E3A8A] text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <ImageIcon className="h-4.5 w-4.5" />
              <span>Galerie d&apos;Action</span>
            </button>

            <button
              onClick={() => setActiveTab("publications")}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-3 cursor-pointer ${
                activeTab === "publications" ? "bg-[#1E3A8A] text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              <span>Publications Légales</span>
            </button>

            <button
              onClick={() => setActiveTab("expertises")}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-3 cursor-pointer ${
                activeTab === "expertises" ? "bg-[#1E3A8A] text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <Award className="h-4.5 w-4.5" />
              <span>Nos Expertises</span>
            </button>

            <button
              onClick={() => setActiveTab("crew")}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-3 cursor-pointer ${
                activeTab === "crew" ? "bg-[#1E3A8A] text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <Users className="h-4.5 w-4.5" />
              <span>Notre Équipage</span>
            </button>

            <button
              onClick={() => setActiveTab("media")}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-3 cursor-pointer ${
                activeTab === "media" ? "bg-[#1E3A8A] text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <Upload className="h-4.5 w-4.5" />
              <span>Médiathèque &amp; Fichiers</span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-3 cursor-pointer ${
                activeTab === "audit" ? "bg-[#1E3A8A] text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <ClipboardList className="h-4.5 w-4.5" />
              <span>Journal d&apos;Audit &amp; Action</span>
            </button>

            <button
              onClick={() => setActiveTab("assistance")}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-3 cursor-pointer ${
                activeTab === "assistance" ? "bg-[#1E3A8A] text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              <span>Formulaires d&apos;Assistance</span>
            </button>

            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={handleReset}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 py-3.5 px-4 rounded-xl text-xs font-bold font-sans transition flex items-center justify-center gap-2 cursor-pointer border border-rose-150"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Restaurer d&apos;usine</span>
              </button>
            </div>
          </div>

          {/* Form Content body (Right) */}
          <div className="lg:col-span-9 bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xs min-h-[500px]">
            
            {/* TAB: GENERAL CONFIGS */}
            {activeTab === "general" && (
              <form onSubmit={handleSaveGeneral} className="space-y-6 text-left">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                  <Settings className="h-5.5 w-5.5 text-[#1E3A8A]" />
                  <h3 className="font-serif italic text-lg sm:text-xl font-bold text-slate-900">Variables d&apos;Accès &amp; Arrière-plan</h3>
                </div>

                {/* MOT DE PASSE CONFIGURABLE PAR L'ADMINISTRATEUR */}
                <div className="p-6 bg-amber-50/50 border border-amber-200 rounded-[2rem] space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🔑</span>
                    <div>
                      <h4 className="font-serif italic font-bold text-slate-800 text-sm sm:text-base">Sécuriser l&apos;accès : Modifier le Mot de passe</h4>
                      <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed font-sans">
                        Modifiez la clé secrète requise pour débloquer l&apos;accès à la console administrative et au mode Édition Directe.
                      </p>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      value={adminPasswordState}
                      onChange={(e) => setAdminPasswordState(e.target.value)}
                      placeholder="Saisissez le nouveau mot de passe administratif (ex: daryel2026)"
                      className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-sans font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
                  >
                    <Save className="h-4.5 w-4.5" />
                    <span>Sauvegarder la clé d&apos;accès</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB: CHRONIQUE PARCOURS */}
            {activeTab === "timeline" && (
              <div className="space-y-8 text-left">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Activity className="h-5.5 w-5.5 text-[#1E3A8A]" />
                  <h3 className="font-serif italic text-lg sm:text-xl font-bold text-slate-900">Étapes chronologiques du placement pénal</h3>
                </div>

                <div className="space-y-6">
                  {chroniques.map((item) => (
                    <div key={item.id} className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-black text-blue-800 bg-blue-105 px-3 py-1 rounded-full uppercase">
                          Étape {item.step}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-slate-500 text-[9.5px] font-mono font-semibold uppercase tracking-wider block mb-1">Titre de l&apos;action</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateStep(item.id, "title", e.target.value)}
                            className="w-full bg-white border border-slate-205 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 text-[9.5px] font-mono font-semibold uppercase tracking-wider block mb-1">Période ou durée indicative</label>
                          <input
                            type="text"
                            value={item.subtitle}
                            onChange={(e) => handleUpdateStep(item.id, "subtitle", e.target.value)}
                            className="w-full bg-white border border-slate-205 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-500 text-[9.5px] font-mono font-semibold uppercase tracking-wider block mb-1">Procédure de placement détaillée</label>
                        <textarea
                          rows={2}
                          value={item.desc}
                          onChange={(e) => handleUpdateStep(item.id, "desc", e.target.value)}
                          className="w-full bg-white border border-slate-205 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-slate-400 font-mono italic">
                  Note : Les changements appliqués ci-dessus s&apos;injectent instantanément dans l&apos;arbre de navigation des missions.
                </p>
              </div>
            )}

            {/* TAB: GALERIE ACTIONS */}
            {activeTab === "gallery" && (
              <div className="space-y-8 text-left">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <ImageIcon className="h-5.5 w-5.5 text-[#1E3A8A]" />
                  <h3 className="font-serif italic text-lg sm:text-xl font-bold text-slate-900">Gestion de la Galerie d&apos;activité</h3>
                </div>

                {/* List preview images with delete access */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100">
                  {galerie.map((img) => (
                    <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.imageUrl} alt={img.caption} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center">
                        <button
                          onClick={() => {
                            deleteGalleryItem(img.id);
                            triggerNotif("Photo retirée de la galerie.");
                          }}
                          className="p-2.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer"
                          title="Supprimer la photo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upgraded form to add high quality image */}
                <form onSubmit={handleAddGallery} className="space-y-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif italic font-bold text-slate-900 text-base sm:text-lg">Ajouter une nouvelle photo d&apos;activité</h4>
                    {galleryFileBase64 && (
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryFileBase64(null);
                          setGalleryFileName("");
                        }}
                        className="text-xs text-rose-600 hover:underline font-mono"
                      >
                        Effacer la sélection
                      </button>
                    )}
                  </div>

                  {/* PREMIUM FILE DROPZONE / DEVICE SELECTOR */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    
                    {/* Device Upload Container */}
                    <div className="space-y-2">
                      <span className="text-slate-600 text-[10px] font-mono font-bold uppercase tracking-wider block">Option 1 : Importer depuis votre PC ou Téléphone</span>
                      
                      <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#1E3A8A] rounded-[2rem] p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all duration-300 min-h-[160px]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleGalleryFileUpload}
                          className="hidden"
                        />
                        
                        {galleryFileBase64 ? (
                          <div className="space-y-3 w-full flex flex-col items-center justify-center">
                            <div className="h-20 w-32 rounded-xl overflow-hidden shadow-md border border-white/5 relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={galleryFileBase64} alt="Prévisualisation" className="h-full w-full object-cover" />
                            </div>
                            <div className="text-slate-700 text-xs font-mono font-bold truncate max-w-xs block">
                              ✓ {galleryFileName}
                            </div>
                            <span className="text-[10px] text-emerald-600 font-sans font-bold block bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-150">
                              Image chargée avec succès
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-2.5 flex flex-col items-center justify-center">
                            <div className="h-10 w-10 rounded-2xl bg-[#1D4ED8]/10 text-[#1D4ED8] flex items-center justify-center group-hover:scale-110 transition duration-300">
                              <Plus className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800">Cliquez pour parcourir vos fichiers</p>
                              <p className="text-[10px] text-slate-500 font-sans mt-1">Accepte tous les formats de photos (PC &amp; Mobiles)</p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* URL Option Container */}
                    <div className="space-y-2">
                      <span className="text-slate-600 text-[10px] font-mono font-bold uppercase tracking-wider block">Option 2 : Fournir un lien d&apos;image internet (URL)</span>
                      
                      <div className="bg-slate-50 border border-slate-200 p-5 rounded-[2rem] space-y-4 min-h-[160px] flex flex-col justify-center">
                        <div>
                          <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1.5">Lien d&apos;image publique (URL)</label>
                          <input
                            type="url"
                            disabled={!!galleryFileBase64}
                            placeholder={galleryFileBase64 ? "Fichier importé actif (URL désactivée)" : "https://images.unsplash.com/photo-..."}
                            value={newImgUrl}
                            onChange={(e) => setNewImgUrl(e.target.value)}
                            className="w-full bg-white disabled:bg-slate-100 disabled:text-slate-400 border border-slate-205 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
                          />
                        </div>
                        {galleryFileBase64 && (
                          <p className="text-[10px] text-amber-605 font-mono italic">
                            * Une image locale est actuellement importée. Pour utiliser une URL, veuillez d&apos;abord effacer la sélection locale.
                          </p>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Caption & Category Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                      <label className="text-slate-600 text-[10px] font-mono font-bold uppercase tracking-wider block mb-2">Légende descriptive de la photo d&apos;activité</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Séance éducative de réhabilitation émotionnelle..."
                        value={newImgCaption}
                        onChange={(e) => setNewImgCaption(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 text-[10px] font-mono font-bold uppercase tracking-wider block mb-2">Catégorie de l&apos;image</label>
                      <select
                        value={newImgCat}
                        onChange={(e) => setNewImgCat(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none cursor-pointer"
                      >
                        <option value="Installations">Installations</option>
                        <option value="Ateliers">Ateliers</option>
                        <option value="Vie quotidienne">Vie quotidienne</option>
                        <option value="Médical">Médical</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-sans font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 shadow-md shadow-blue-500/10"
                    >
                      <Plus className="h-4.5 w-4.5" />
                      <span>Insérer la photo dans la Galerie</span>
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* TAB: PUBLICATIONS */}
            {activeTab === "publications" && (
              <div className="space-y-8 text-left">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <FileText className="h-5.5 w-5.5 text-[#1E3A8A]" />
                  <h3 className="font-serif italic text-lg sm:text-xl font-bold text-slate-900">Publications de directives judiciaires</h3>
                </div>

                {/* List publications with delete button */}
                <div className="space-y-3 pb-6 border-b border-slate-100">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Directives actives</span>
                  {publications.map((pub) => (
                    <div key={pub.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex justify-between items-center">
                      <div className="text-left space-y-1">
                        <span className="text-[9px] font-mono text-blue-800 font-bold uppercase">{pub.category}</span>
                        <h4 className="font-serif italic font-bold text-slate-950 text-xs sm:text-sm line-clamp-1">{pub.title}</h4>
                      </div>
                      <button
                        onClick={() => {
                          deletePublication(pub.id);
                          triggerNotif("Directive juridique supprimée.");
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-100 hover:text-rose-800 rounded-lg transition shrink-0 cursor-pointer"
                        title="Supprimer la publication"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Create publication form */}
                <form onSubmit={handleAddPub} className="space-y-4 pt-4">
                  <h4 className="font-serif italic font-bold text-slate-900">Éditer et publier une nouvelle directive officielle</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Titre de la directive sociale</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Protocole d'écoute préliminaire du mineur de Djibouti"
                        value={newPubTitle}
                        onChange={(e) => setNewPubTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Catégorie</label>
                      <select
                        value={newPubCat}
                        onChange={(e) => setNewPubCat(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none"
                      >
                        <option value="Juridique">Juridique</option>
                        <option value="Médical">Médical</option>
                        <option value="Rapport annuel">Rapport annuel</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Rédacteur habilité</label>
                      <input
                        type="text"
                        placeholder="Ex: Commission Droit et Famille du CAU"
                        value={newPubAuthor}
                        onChange={(e) => setNewPubAuthor(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Bref résumé du texte</label>
                      <input
                        type="text"
                        placeholder="Ex: Guide destiné aux éducateurs portant sur les mineurs..."
                        value={newPubSummary}
                        onChange={(e) => setNewPubSummary(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Contenu complet de la directive législative</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Saisissez les textes de lois ou protocoles officiels ici..."
                      value={newPubContent}
                      onChange={(e) => setNewPubContent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-2 border border-dashed border-slate-200 p-5 rounded-2xl bg-slate-50/50">
                    <label className="text-slate-600 text-[10px] font-mono font-bold uppercase tracking-wider block">Insérer une Pièce Jointe de la Directive (PDF, Image ou Vidéo)</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                      <label className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 cursor-pointer font-sans font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition flex items-center justify-center gap-2 shadow-xs text-center border-b-2">
                        <Upload className="h-4.5 w-4.5 text-blue-700" />
                        <span>Sélectionner depuis l&apos;appareil</span>
                        <input
                          type="file"
                          accept="application/pdf,image/*,video/*"
                          onChange={handlePubFileChange}
                          className="hidden"
                        />
                      </label>
                      {newPubFileName ? (
                        <div className="flex bg-blue-50/50 text-[#1E3A8A] border border-blue-150 py-2.5 px-4 rounded-xl items-center gap-2 max-w-sm overflow-hidden shrink-0">
                          <FileText className="h-4 w-4 shrink-0 text-blue-600" />
                          <span className="text-xs font-mono font-semibold line-clamp-1">{newPubFileName}</span>
                          <span className="text-[9.5px] font-mono font-bold bg-[#1E3A8A] text-white rounded px-2 py-0.5 shrink-0 uppercase tracking-widest leading-none flex items-center justify-center h-5">{newPubFileType}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Aucun média officiel joint actuellement</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-slate-950 hover:bg-slate-850 text-white font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer animate-pulse-slow"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    <span>Lancer la publication officielle</span>
                  </button>
                </form>

              </div>
            )}

            {/* TAB: EXPORT EXPERTISES */}
            {activeTab === "expertises" && (
              <div className="space-y-8 text-left animate-fade-in">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Award className="h-5.5 w-5.5 text-[#1E3A8A]" />
                  <h3 className="font-serif italic text-lg sm:text-xl font-bold text-slate-900">Éditer les Pôles d&apos;Expertise</h3>
                </div>

                {/* Form to add secondary Expertise */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newExpTitle) return;
                    addExpertise({
                      title: newExpTitle,
                      badge: newExpBadge,
                      desc: newExpDesc || "Description de l'expertise...",
                      iconName: newExpIcon,
                      imageUrl: newExpFileBase64 || "https://picsum.photos/seed/expert/600/400"
                    });
                    setNewExpTitle("");
                    setNewExpDesc("");
                    setNewExpFileBase64(null);
                    triggerNotif("Pôle d'expertise ajouté avec succès !");
                  }} 
                  className="p-6 bg-slate-50 border border-slate-200/80 rounded-[2rem] space-y-4"
                >
                  <h4 className="font-serif text-sm sm:text-base font-bold text-slate-800">Ajouter un nouveau pôle d&apos;expertise</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Titre de l&apos;Expertise</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Soin & Clinique Pédiatrique"
                        value={newExpTitle}
                        onChange={(e) => setNewExpTitle(e.target.value)}
                        className="w-full bg-white border border-slate-205 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Badge de catégorie</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Clinique Actuelle"
                        value={newExpBadge}
                        onChange={(e) => setNewExpBadge(e.target.value)}
                        className="w-full bg-white border border-slate-205 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Icône representative</label>
                      <select
                        value={newExpIcon}
                        onChange={(e) => setNewExpIcon(e.target.value)}
                        className="w-full bg-white border border-slate-205 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
                      >
                        <option value="Stethoscope">Stethoscope (Stéthoscope)</option>
                        <option value="Heart">Heart (Cœur / Émotionnel)</option>
                        <option value="ShieldCheck">ShieldCheck (Justice / Droit)</option>
                        <option value="Users">Users (Social / Famille)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Sélectionner une photo</label>
                      <div className="flex items-center gap-2">
                        <label className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-sans font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl cursor-pointer transition text-center select-none">
                          <span>Choisir de mon appareil</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setNewExpFileBase64(reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }} 
                            className="hidden" 
                          />
                        </label>
                        {newExpFileBase64 && <span className="text-[10px] text-emerald-600 font-bold">✓ Chargé</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Description concise</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Indiquez le rôle et l'importance de cette protection sociale..."
                      value={newExpDesc}
                      onChange={(e) => setNewExpDesc(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    <span>Créer le Pôle d&apos;expertise</span>
                  </button>
                </form>

                {/* List & Edit existing Expertises */}
                <div className="space-y-4">
                  <h4 className="font-serif text-sm sm:text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Pôles en cours d&apos;activité :</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {expertises.map((exp) => (
                      <div key={exp.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                        <div className="flex items-center gap-3 w-full">
                          <img src={exp.imageUrl} alt={exp.title} className="h-14 w-14 rounded-lg object-cover border shrink-0" />
                          <div className="w-full space-y-1">
                            <span className="text-[10px] font-mono uppercase font-extrabold text-[#00ADEF] block">{exp.badge}</span>
                            <span className="font-bold text-xs sm:text-sm text-slate-800">{exp.title}</span>
                            <p className="text-[10.5px] text-slate-500 font-sans leading-tight mt-0.5 line-clamp-2">{exp.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => deleteExpertise(exp.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2.5 rounded-lg border border-rose-200 transition cursor-pointer"
                            title="Supprimer ce pôle"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: EDIT CREW MEMBERS */}
            {activeTab === "crew" && (
              <div className="space-y-8 text-left animate-fade-in">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Users className="h-5.5 w-5.5 text-[#1E3A8A]" />
                  <h3 className="font-serif italic text-lg sm:text-xl font-bold text-slate-900">Gérer l&apos;Équipage de Garde</h3>
                </div>

                {/* Form to add secondary Crew Member */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCrewName || !newCrewRole) return;
                    addCrewMember({
                      name: newCrewName,
                      role: newCrewRole,
                      desc: newCrewDesc || "Membre actif de l'équipe sociale de nuit...",
                      status: newCrewStatus,
                      stats: newCrewStats || "Disponible 24h/24",
                      imageUrl: newCrewFileBase64 || "https://picsum.photos/seed/crew/500/500"
                    });
                    setNewCrewName("");
                    setNewCrewRole("");
                    setNewCrewDesc("");
                    setNewCrewFileBase64(null);
                    triggerNotif(`Nouveau membre d'équipage ajouté !`);
                  }} 
                  className="p-6 bg-slate-50 border border-slate-200/80 rounded-[2rem] space-y-4"
                >
                  <h4 className="font-serif text-sm sm:text-base font-bold text-slate-800 font-sans">Ajouter un nouveau soignant ou coordinateur</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Nom complet</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Dr. Amina Omar"
                        value={newCrewName}
                        onChange={(e) => setNewCrewName(e.target.value)}
                        className="w-full bg-white border border-slate-205 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Rôle / Spécialité</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Sénior Pédiatre & Dir. Clinique"
                        value={newCrewRole}
                        onChange={(e) => setNewCrewRole(e.target.value)}
                        className="w-full bg-white border border-slate-205 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">État opérationnel</label>
                      <select
                        value={newCrewStatus}
                        onChange={(e) => setNewCrewStatus(e.target.value)}
                        className="w-full bg-white border border-slate-205 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
                      >
                        <option value="En Service">En Service</option>
                        <option value="En Astreinte">En Astreinte</option>
                        <option value="Au Tribunal">Au Tribunal</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Statistiques de garde</label>
                      <input
                        type="text"
                        placeholder="Ex: Garde: 24h / Actif"
                        value={newCrewStats}
                        onChange={(e) => setNewCrewStats(e.target.value)}
                        className="w-full bg-white border border-slate-205 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Sélectionner un portrait</label>
                      <div className="flex items-center gap-2">
                        <label className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-sans font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl cursor-pointer transition text-center select-none">
                          <span>Uploader</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setNewCrewFileBase64(reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }} 
                            className="hidden" 
                          />
                        </label>
                        {newCrewFileBase64 && <span className="text-[10px] text-emerald-600 font-bold">✓ Chargée</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-500 text-[9px] font-mono uppercase tracking-wider block mb-1">Description d&apos;activité</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Présentation des missions de garde de la personne..."
                      value={newCrewDesc}
                      onChange={(e) => setNewCrewDesc(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    <span>Créer le Membre d&apos;Équipage</span>
                  </button>
                </form>

                {/* List existing Crew Members */}
                <div className="space-y-4">
                  <h4 className="font-serif text-sm sm:text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Membres enregistrés :</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {crewMembers.map((member) => (
                      <div key={member.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                        <div className="flex items-center gap-3 w-full">
                          <img src={member.imageUrl} alt={member.name} className="h-14 w-14 rounded-full object-cover border shrink-0" />
                          <div className="w-full space-y-1">
                            <span className="text-[10px] font-mono uppercase font-semibold text-emerald-600 block">{member.role} ({member.status})</span>
                            <span className="font-bold text-xs sm:text-sm text-slate-800">{member.name}</span>
                            <p className="text-[10.5px] text-slate-500 font-sans leading-tight mt-0.5 line-clamp-2">{member.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => deleteCrewMember(member.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2.5 rounded-lg border border-rose-200 transition cursor-pointer"
                            title="Retirer d'équipe"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MEDIA MANAGER */}
            {activeTab === "media" && (
              <div className="space-y-8 text-left animate-fade-in shadow-xs p-1">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Upload className="h-5.5 w-5.5 text-[#1E3A8A]" />
                  <h3 className="font-serif italic text-lg sm:text-xl font-bold text-slate-900">Médiathèque &amp; Fichiers</h3>
                </div>

                {/* Local Image/File Uploader Tool */}
                <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-[2rem] space-y-4">
                  <span className="text-[9.5px] font-mono tracking-widest text-[#1E3A8A] font-black uppercase block font-sans">Téléverser dans le gestionnaire</span>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <label className="bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl cursor-pointer transition flex items-center justify-center gap-2 shadow-sm shrink-0 border-b-2 border-slate-950 select-none">
                      <Upload className="h-4.5 w-4.5 text-sky-400" />
                      <span>Parcourir les fichiers locaux</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64 = reader.result as string;
                              const sizeKB = `${Math.round(file.size / 1024)} KB`;

                              addMediaFile(file.name, base64, file.type, sizeKB);
                              triggerNotif(`Fichier "${file.name}" ajouté à la médiathèque.`);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                      Uploadez des fichiers d&apos;images (.jpg, .png), de documents (.pdf), ou de vidéos (.mp4) directement de votre PC ou téléphone d&apos;une manière professionnelle. Les fichiers seront mémorisés pour liaisons.
                    </p>
                  </div>
                </div>

                {/* Files Grid Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {mediaFiles.map((file) => (
                    <div key={file.id} className="bg-white border border-slate-200/80 rounded-[2rem] overflow-hidden flex flex-col justify-between shadow-2xs group hover:border-[#1E3A8A] transition-all duration-300">
                      <div className="p-4 space-y-3">
                        <div className="h-40 w-full rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center relative">
                          {file.type && file.type.startsWith("image/") ? (
                            <img src={file.url} alt={file.name} className="h-full w-full object-cover select-none pointer-events-none group-hover:scale-105 duration-500 transition-all" />
                          ) : file.type && file.type.includes("pdf") ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-12 w-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">PDF</div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">VID</div>
                            </div>
                          )}
                          <span className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[8.5px] font-mono tracking-wider uppercase px-2 py-0.5 rounded font-bold">
                            {file.size}
                          </span>
                        </div>
                        
                        <div className="text-left space-y-1">
                          <h4 className="font-mono text-xs text-slate-800 break-all font-bold line-clamp-1" title={file.name}>
                            {file.name}
                          </h4>
                          <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider">{file.dateAdded} • {file.type || "Inconnu"}</span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-150 flex gap-2 rounded-b-[2rem]">
                        <button
                          onClick={() => {
                            const currentName = file.name;
                            const newName = prompt("Nouveau nom du fichier :", currentName);
                            if (newName && newName.trim() && newName !== currentName) {
                              renameMediaFile(file.id, newName.trim());
                              triggerNotif(`Fichier renommé en "${newName}".`);
                            }
                          }}
                          className="flex-1 bg-white hover:bg-slate-100 text-slate-705 border border-slate-205 rounded-xl py-2 px-2.5 text-[10.5px] font-sans font-bold uppercase tracking-wider transition cursor-pointer text-center"
                        >
                          Renommer
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Voulez-vous définitivement supprimer le fichier "${file.name}" de la médiathèque ?`)) {
                              deleteMediaFile(file.id);
                              triggerNotif("Fichier supprimé de la médiathèque.");
                            }
                          }}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-605 border border-slate-205 hover:border-rose-205 rounded-xl p-2.5 transition shrink-0 cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: AUDIT LOG */}
            {activeTab === "audit" && (
              <div className="space-y-8 text-left animate-fade-in shadow-xs p-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5.5 w-5.5 text-[#1E3A8A]" />
                    <h3 className="font-serif italic text-lg sm:text-xl font-bold text-slate-900">Journal d&apos;Audit &amp; Historique Des Actions</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap pb-1">
                    <button
                      onClick={() => {
                        try {
                          const { jsPDF } = require("jspdf");
                          const doc = new jsPDF({
                            orientation: "portrait",
                            unit: "mm",
                            format: "a4"
                          });

                          // Document Header Title Card
                          doc.setFillColor(30, 58, 138); // Deep Premium Royal Blue
                          doc.rect(0, 0, 210, 42, "F");

                          doc.setTextColor(255, 255, 255);
                          doc.setFont("helvetica", "bold");
                          doc.setFontSize(20);
                          doc.text(" FOYER DARYEL - REPUBLIQUE DE DJIBOUTI ".toUpperCase(), 15, 18);

                          doc.setFont("helvetica", "italic");
                          doc.setFontSize(10);
                          doc.setTextColor(230, 230, 230);
                          doc.text("Unite d'Acceuil d'Urgence Sociale et de Tutelle Sociale de l'Enfance", 15, 25);
                          doc.text("Rapport d'audit de confidentialite et tracabilite des modifications du site", 15, 30);

                          // Date Metadata info on right
                          doc.setFont("helvetica", "normal");
                          doc.setFontSize(9);
                          doc.setTextColor(255, 255, 255);
                          doc.text(`Genere le: ${new Date().toLocaleDateString("fr-FR")}`, 148, 18);
                          doc.text("Format: CERTIFIE CONFORME", 148, 24);
                          doc.text("ID Session: DARYEL-SECURE", 148, 30);

                          // Secondary Accent Line
                          doc.setFillColor(0, 173, 239); // Cyan
                          doc.rect(0, 42, 210, 3, "F");

                          // Section Title
                          doc.setTextColor(30, 30, 30);
                          doc.setFont("helvetica", "bold");
                          doc.setFontSize(14);
                          doc.text("RAPPORT D'AUDIT SUR LA MODIFICATION DU CONTENU", 15, 56);

                          // Active Filters descriptor
                          doc.setFont("helvetica", "italic");
                          doc.setFontSize(9.5);
                          doc.setTextColor(110, 110, 110);
                          const currentUFilter = selectedUserFilter || "Tous les administrateurs";
                          const currentDFilter = selectedDateFilter || "Toutes les dates";
                          doc.text(`Filtre Utilisateur: ${currentUFilter}   |   Calendrier: ${currentDFilter}`, 15, 63);

                          // Drawing Premium Header Table Box
                          doc.setDrawColor(210, 210, 210);
                          doc.setFillColor(245, 247, 250);
                          doc.rect(15, 69, 180, 10, "F");
                          doc.rect(15, 69, 180, 10, "S");

                          doc.setTextColor(30, 58, 138);
                          doc.setFont("helvetica", "bold");
                          doc.setFontSize(10);
                          doc.text("Date / Horodatage", 18, 75.5);
                          doc.text("Auteur de la Modification", 58, 75.5);
                          doc.text("Type", 100, 75.5);
                          doc.text("Libelle de l'evenement", 116, 75.5);

                          // Fetching filtered rows
                          const printedRows = auditLog.filter((log) => {
                            if (selectedUserFilter && log.user !== selectedUserFilter) return false;
                            if (selectedDateFilter && log.date !== selectedDateFilter) return false;
                            return true;
                          });

                          // Data render
                          doc.setFont("helvetica", "normal");
                          doc.setFontSize(9);
                          let currentY = 79;

                          if (printedRows.length === 0) {
                            doc.setTextColor(120, 120, 120);
                            doc.text("Aucun log d'evenement ne correspond a vos critères de filtres selectionnes.", 25, currentY + 10);
                            currentY += 20;
                          } else {
                            printedRows.forEach((log) => {
                              if (currentY > 260) {
                                doc.addPage();
                                currentY = 25;
                                doc.setFillColor(30, 58, 138);
                                doc.rect(0, 0, 210, 15, "F");
                                doc.setTextColor(255, 255, 255);
                                doc.setFont("helvetica", "bold");
                                doc.setFontSize(10);
                                doc.text("REPUBLIQUE DE DJIBOUTI - SUIVI DE DIRECTIVES SOCIALES", 15, 10);
                                currentY = 32;
                              }

                              // Draw outline
                              doc.setDrawColor(230, 230, 230);
                              doc.rect(15, currentY, 180, 11, "S");

                              // Print Row columns
                              doc.setTextColor(40, 40, 40);
                              doc.setFont("helvetica", "bold");
                              doc.text(`${log.date} ${log.timestamp}`, 17, currentY + 7);

                              doc.setFont("helvetica", "normal");
                              const shortUser = log.user.length > 22 ? log.user.substring(0, 19) + ".." : log.user;
                              doc.text(shortUser, 58, currentY + 7);

                              doc.setFont("helvetica", "bold");
                              doc.setTextColor(0, 120, 201);
                              doc.text(log.actionType.toUpperCase(), 100, currentY + 7);

                              doc.setFont("helvetica", "normal");
                              doc.setTextColor(60, 60, 60);
                              const shortLabel = log.label.length > 39 ? log.label.substring(0, 36) + "..." : log.label;
                              doc.text(shortLabel, 116, currentY + 7);

                              currentY += 11;
                            });
                          }

                          // Footer Signature Area
                          if (currentY > 235) {
                            doc.addPage();
                            currentY = 30;
                          }
                          currentY += 20;
                          doc.setDrawColor(180, 180, 180);
                          doc.line(120, currentY, 185, currentY);
                          doc.setFont("helvetica", "bold");
                          doc.setTextColor(30, 30, 30);
                          doc.text("Cachet de l'Etablissement", 125, currentY + 5);
                          doc.setFont("helvetica", "normal");
                          doc.text("Secrétariat General de la Securite Sociale", 121, currentY + 10);

                          doc.save(`Foyer_Daryel_Audit_Rapport_${new Date().toISOString().slice(0, 10)}.pdf`);
                          triggerNotif("Rapport d'audit PDF généré et téléchargé avec succès !");
                        } catch (err) {
                          console.error("Failed to generate PDF audit:", err);
                          triggerNotif("Erreur de librairie PDF lors du téléchargement.");
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 shadow-md shadow-emerald-500/10"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Exporter Rapport (PDF)</span>
                    </button>

                    <button
                      onClick={() => {
                        const success = undoLastAction();
                        if (success) {
                          triggerNotif("Dernière action annulée avec succès !");
                        } else {
                          triggerNotif("Rien à annuler.");
                        }
                      }}
                      disabled={auditLog.length === 0}
                      className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-100 disabled:text-slate-400 border border-amber-500/10 text-white font-sans font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 disabled:pointer-events-none disabled:shadow-none shadow-md shadow-amber-500/10"
                    >
                      <Undo className="h-4.5 w-4.5" />
                      <span>Annuler Action (Undo)</span>
                    </button>
                  </div>
                </div>

                <p className="text-slate-605 text-xs leading-relaxed font-sans -mt-2">
                  Chaque mise à jour de texte en ligne, modification d&apos;image héro, ajout de spécialité expertise, et mise en ligne de directive officielle est consignée avec précision. Vous pouvez restaurer l&apos;ancienne valeur instantanément grâce à la fonction d&apos;annulation intelligente.
                </p>

                {/* FILTERS PANEL COULEUR CALENDRIER */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Filtrer par Calendrier (Date)</label>
                    <input 
                      type="date"
                      value={selectedDateFilter}
                      onChange={(e) => setSelectedDateFilter(e.target.value)}
                      className="w-full bg-white border border-slate-250 py-2.5 px-3 rounded-xl focus:ring-1 focus:ring-[#1E3A8A] outline-hidden text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Filtrer par Auteur / Utilisateur</label>
                    <select
                      value={selectedUserFilter}
                      onChange={(e) => setSelectedUserFilter(e.target.value)}
                      className="w-full bg-white border border-slate-250 py-2.5 px-3 rounded-xl focus:ring-1 focus:ring-[#1E3A8A] outline-hidden text-xs text-slate-800 cursor-pointer"
                    >
                      <option value="">Tous les utilisateurs</option>
                      <option value="Omar Farah (Directeur)">Omar Farah (Directeur)</option>
                      <option value="Fathia Ali (Educatrice)">Fathia Ali (Educatrice)</option>
                      <option value="Amin Aden (Superviseur)">Amin Aden (Superviseur)</option>
                      <option value="Secrétaire d'Urgence">Secrétaire d&apos;Urgence</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedDateFilter("");
                        setSelectedUserFilter("");
                        triggerNotif("Filtres d'historique effacés.");
                      }}
                      disabled={!selectedDateFilter && !selectedUserFilter}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-300 text-slate-700 py-3 px-4 rounded-xl text-xs font-semibold font-sans transition cursor-pointer"
                    >
                      Effacer les filtres
                    </button>
                  </div>
                </div>

                {auditLog.filter((log) => {
                  if (selectedUserFilter && log.user !== selectedUserFilter) return false;
                  if (selectedDateFilter && log.date !== selectedDateFilter) return false;
                  return true;
                }).length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] text-slate-400 italic text-xs">
                    Aucune modification ne correspond aux filtres de calendrier et d&apos;utilisateurs sélectionnés.
                  </div>
                ) : (
                  <div className="space-y-4 max-w-3xl">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-black block font-sans">
                      Dossier de Traçabilité ({auditLog.filter((log) => {
                        if (selectedUserFilter && log.user !== selectedUserFilter) return false;
                        if (selectedDateFilter && log.date !== selectedDateFilter) return false;
                        return true;
                      }).length} événements trouvés)
                    </span>
                    <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-6 before:w-0.5 before:bg-slate-200/80">
                      {auditLog
                        .filter((log) => {
                          if (selectedUserFilter && log.user !== selectedUserFilter) return false;
                          if (selectedDateFilter && log.date !== selectedDateFilter) return false;
                          return true;
                        })
                        .map((log, index) => (
                          <div key={log.id} className="relative flex gap-4 p-4 bg-white border border-slate-200/85 rounded-2xl shadow-2xs items-start pl-12 hover:border-slate-300 transition group">
                            {/* Position Ring dot */}
                            <div className={`absolute left-4 top-5.5 h-4 w-4 rounded-full border-4 border-white shadow-xs ${
                              index === 0 ? "bg-amber-500 ring-4 ring-amber-100 animate-pulse" : "bg-slate-400"
                            }`} />

                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-baseline flex-wrap gap-2 text-[10px] font-mono">
                                <span className={`font-bold uppercase tracking-wider ${
                                  log.actionType === "text" ? "text-blue-750" : log.actionType === "image" ? "text-emerald-755" : "text-[#00ADEF]"
                                }`}>
                                  {log.actionType.toUpperCase()}
                                </span>
                                <div className="text-slate-400 font-sans flex items-center gap-2">
                                  <span className="font-semibold text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md font-mono">{log.date || "Date Locale"}</span>
                                  <span>{log.timestamp}</span>
                                </div>
                              </div>
                              <h5 className="text-xs sm:text-sm text-slate-800 leading-normal font-sans font-semibold">
                                {log.label}
                              </h5>
                              
                              <div className="pt-1 flex items-center justify-between">
                                <span className="text-[10px] text-slate-500 italic">Modifier par: <strong className="font-bold text-slate-700 non-italic">{log.user || "Administrateur principal"}</strong></span>
                                {index === 0 && (
                                  <button
                                    onClick={() => {
                                      const success = undoLastAction();
                                      if (success) {
                                        triggerNotif("Dernière action annulée avec succès !");
                                      }
                                    }}
                                    className="bg-amber-50 hover:bg-amber-100 text-amber-800 text-[9.5px] font-mono font-bold uppercase tracking-wider py-1 px-2.5 rounded border border-amber-200 transition cursor-pointer"
                                  >
                                    Lancer l&apos;annulation
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: ASSISTANCE FORM VIEW (PROFESSIONAL REGISTER COMPONENT) */}
            {activeTab === "assistance" && (
              <div className="space-y-8 text-left animate-fade-in shadow-xs p-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5.5 w-5.5 text-[#1E3A8A]" />
                    <h3 className="font-serif italic text-lg sm:text-xl font-bold text-slate-900">Demandes d&apos;Assistance &amp; Signalements</h3>
                  </div>
                  <span className="bg-[#1E3A8A]/10 text-[#1E3A8A] font-mono font-black text-xs px-3 py-1.5 rounded-full">{assistanceRequests.length} Requêtes enregistrées</span>
                </div>

                <p className="text-slate-605 text-xs leading-relaxed font-sans -mt-2">
                  Voici le registre gouvernemental gouvernemental de suivi d&apos;assistance d&apos;urgence. Chaque formulaire soumis par un internaute djiboutien pour un signalement d&apos;enfance en danger est trié et daté, avec un journal téléphonique simulé envoyé au numéro d&apos;urgence sécurisé principal (<span className="font-bold font-mono text-emerald-600">+253 77179755</span>).
                </p>

                {assistanceRequests.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] text-slate-400 italic text-xs">
                    Aucune fiche d&apos;assistance n&apos;a été soumise pour le moment.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5">
                    {assistanceRequests.map((req) => (
                      <div key={req.id} className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-350 p-6 rounded-[2rem] shadow-3xs transition duration-300 relative group flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-[#1E3A8A] text-white text-[9.5px] font-mono font-black uppercase tracking-wider py-1 px-2.5 rounded-full">
                              📌 NIVEAU D&apos;URGENCE
                            </span>
                            <span className="bg-slate-200 text-slate-700 text-[9.5px] font-mono font-bold tracking-wider py-1 px-2.5 rounded-full">
                              Djibouti-Ville
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Déposé le: <strong className="text-slate-600">{req.createdAt || req.date || "Date non définie"}</strong>
                            </span>
                          </div>

                          <h4 className="font-serif italic text-base sm:text-lg font-bold text-slate-900 leading-tight">
                            {req.name} <span className="font-sans font-normal text-xs text-slate-500 italic">({req.email} • {req.phone || "Aucun téléphone"})</span>
                          </h4>

                          <blockquote className="border-l-3 border-[#00ADEF] pl-4 text-xs italic text-slate-605 leading-relaxed bg-[#00ADEF]/5 p-3 rounded-r-xl">
                            &quot;{req.message}&quot;
                          </blockquote>

                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span>Alerte SMS transmise avec succès au numéro +253 77179755 (Appel éducatif d&apos;astreinte requis)</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (confirm("Voulez-vous vraiment supprimer définitivement cette fiche d'assistance de l'historique ?")) {
                              deleteAssistanceRequest(req.id);
                              triggerNotif("Fiche d'assistance supprimée de l'administration.");
                            }
                          }}
                          className="bg-rose-50 hover:bg-rose-200 text-rose-700 border border-rose-150 p-3 rounded-full hover:scale-105 transition cursor-pointer duration-300"
                          title="Archiver"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
