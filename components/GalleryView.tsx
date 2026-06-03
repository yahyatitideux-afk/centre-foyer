"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSiteState } from "@/lib/SiteStateContext";
import Editable from "@/components/Editable";
import { Eye, ChevronLeft, ChevronRight, X, Sparkles, Image as ImageIcon, Play, Pause, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryView() {
  const { galerie, setGalerie, deleteGalleryItem, t } = useSiteState();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [fullscreenIsPlaying, setFullscreenIsPlaying] = useState(true);

  const categories = ["all", "Installations", "Ateliers", "Vie quotidienne", "Médical"];

  const filteredItems = galerie.filter((item) => {
    return filterCategory === "all" || item.category === filterCategory;
  });

  // States for the automatic cinematic carousel ticker
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Reset slider index when filter changes to avoid out of bounds
  useEffect(() => {
    setCarouselIndex(0);
    setFullscreenIndex(0);
  }, [filterCategory]);

  // Handle cinematic autoplay progression
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => {
        if (filteredItems.length === 0) return 0;
        return (prev + 1) % filteredItems.length;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, filteredItems.length]);

  // Handle fullscreen immersive autoplay progression
  useEffect(() => {
    if (!isFullscreenActive || !fullscreenIsPlaying) return;
    const timer = setInterval(() => {
      setFullscreenIndex((prev) => {
        if (filteredItems.length === 0) return 0;
        return (prev + 1) % filteredItems.length;
      });
    }, 4000); // Ticks every 4 seconds in fullscreen
    return () => clearInterval(timer);
  }, [isFullscreenActive, fullscreenIsPlaying, filteredItems.length]);

  const showNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % filteredItems.length;
    });
  }, [lightboxIndex, filteredItems.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + filteredItems.length) % filteredItems.length;
    });
  }, [lightboxIndex, filteredItems.length]);

  // Keyboard navigation for Lightbox and Fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Lightbox navigation
      if (lightboxIndex !== null) {
        if (e.key === "ArrowRight") showNext();
        if (e.key === "ArrowLeft") showPrev();
        if (e.key === "Escape") setLightboxIndex(null);
      }
      
      // Fullscreen slideshow navigation
      if (isFullscreenActive) {
        if (e.key === "ArrowRight") {
          setFullscreenIndex((prev) => (prev + 1) % filteredItems.length);
          setFullscreenIsPlaying(false);
        }
        if (e.key === "ArrowLeft") {
          setFullscreenIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
          setFullscreenIsPlaying(false);
        }
        if (e.key === " ") {
          e.preventDefault();
          setFullscreenIsPlaying((prev) => !prev);
        }
        if (e.key === "Escape") {
          setIsFullscreenActive(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, isFullscreenActive, filteredItems.length, showNext, showPrev]);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-20" id="gallery-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and Category controllers */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-150 px-3.5 py-1 rounded-full uppercase font-black inline-block">
            Installations &amp; Actions
          </span>
          <h1 className="font-serif italic text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
            Notre Foyer en Images
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
            Aperçu visuel authentique de nos infrastructures de soins pédiatriques, de notre pouponnière d&apos;accueil d&apos;urgence et de nos espaces de repos pour enfants.
          </p>
        </div>

        {/* Toggles categories filter */}
        <div className="flex flex-wrap gap-3 justify-center items-center mb-12" id="gallery-filters-bar">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
                  filterCategory === cat
                    ? "bg-[#1E3A8A] text-white border-blue-900 shadow-md shadow-blue-900/10"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                {cat === "all" ? "Toutes les images" : cat}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px h-6 bg-slate-200 mx-2" />

          <button
            onClick={() => {
              setFullscreenIndex(0);
              setIsFullscreenActive(true);
              setFullscreenIsPlaying(true);
            }}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2 border border-emerald-500 active:scale-95"
            title="Lancer le diaporama plein écran interactif automatique"
          >
            <Film className="h-4 w-4 animate-pulse text-emerald-100" />
            <span>Plein Écran</span>
          </button>
        </div>

        {/* CINEMATIC SLIDESHOW CAROUSEL */}
        {filteredItems.length > 0 && (
          <div 
            className="mb-16 relative overflow-hidden rounded-[2.5rem] bg-slate-950 border border-slate-800 shadow-2xl h-[320px] sm:h-[500px] group/carousel text-left" 
            id="cinematic-slideshow-container"
          >
            {/* Ambient Blurred Background for cinematic depth */}
            <div className="absolute inset-0 scale-105 blur-2xl opacity-40 pointer-events-none transition-all duration-1000">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={filteredItems[carouselIndex]?.imageUrl} 
                className="w-full h-full object-cover" 
                alt="" 
              />
            </div>

            {/* Slide Image Wrapper with Framer motion AnimatePresence */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={carouselIndex}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.75, ease: "easeInOut" }}
                  className="w-full h-full relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={filteredItems[carouselIndex]?.imageUrl}
                    alt={filteredItems[carouselIndex]?.caption}
                    className="w-full h-full object-cover sm:object-contain"
                  />

                  {/* Visual gradient screen on bottom and sides */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Premium Frosted Glass Control Overlay & Captions */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-8 z-20 bg-gradient-to-t from-slate-950/90 to-transparent flex flex-col justify-end gap-3 min-h-[140px]">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                
                {/* Caption Details - Sliding animation */}
                <div className="space-y-2 text-left max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#00ADEF] bg-sky-500/10 border border-sky-400/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      Cinéma du Foyer — En défilement
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono text-slate-400 font-bold">
                      {String(carouselIndex + 1).padStart(2, '0')} / {String(filteredItems.length).padStart(2, '0')}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={carouselIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-serif italic text-white text-lg sm:text-2xl font-black leading-tight drop-shadow-md">
                        {filteredItems[carouselIndex]?.caption}
                      </h3>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Control Action Buttons (Previous, Pause/Play, Next) */}
                <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
                  <button
                    onClick={() => {
                      setCarouselIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
                      setIsPlaying(false); // pause on click
                    }}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition active:scale-95 cursor-pointer"
                    title="Précédent"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full border flex items-center justify-center transition active:scale-95 cursor-pointer ${
                      isPlaying
                        ? "bg-white text-slate-900 border-white hover:bg-slate-100"
                        : "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700"
                    }`}
                    title={isPlaying ? "Mettre en pause" : "Reprendre"}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white" />}
                  </button>

                  <button
                    onClick={() => {
                      setCarouselIndex((prev) => (prev + 1) % filteredItems.length);
                      setIsPlaying(false); // pause on click
                    }}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition active:scale-95 cursor-pointer"
                    title="Suivant"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => {
                      setFullscreenIndex(carouselIndex);
                      setIsFullscreenActive(true);
                      setFullscreenIsPlaying(true);
                    }}
                    className="p-2 sm:p-3 bg-[#00ADEF] hover:bg-sky-500 hover:text-white text-white border border-sky-450 rounded-xl text-xs font-mono uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-md shadow-sky-500/20"
                    title="Lancer le Plein écran immersif avec défilement"
                  >
                    <Film className="h-4 w-4 text-white animate-pulse" />
                    <span className="hidden sm:inline text-[9px] font-extrabold">Plein Écran</span>
                  </button>
                </div>
              </div>

              {/* Progress dynamic timeline indicator */}
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-white/10 mt-1 overflow-x-auto overflow-y-hidden max-w-full">
                {filteredItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCarouselIndex(idx);
                      setIsPlaying(false); // pause on click
                    }}
                    className="h-1 sm:h-1.5 rounded-full flex-1 min-w-[30px] sm:min-w-[40px] max-w-[80px] bg-white/20 overflow-hidden relative cursor-pointer"
                  >
                    {carouselIndex === idx && isPlaying && (
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4.5, ease: "linear" }}
                        className="absolute inset-y-0 left-0 bg-[#00ADEF]"
                      />
                    )}
                    {carouselIndex === idx && !isPlaying && (
                      <div className="absolute inset-0 bg-[#00ADEF]" />
                    )}
                  </button>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* Galerie Cards Grid elements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="gallery-cards-grid">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group cursor-pointer bg-white rounded-[2rem] border border-slate-200/80 p-4 transition-all duration-350 hover:shadow-lg hover:shadow-blue-900/5 hover:-translate-y-1 relative"
            >
              {/* Image Frame */}
              <div className="relative aspect-4/3 overflow-hidden rounded-[1.5rem] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Hover overlay icon eye */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-all duration-300">
                    <Eye className="h-5.5 w-5.5" />
                  </div>
                </div>

                <span className="absolute bottom-3 left-3 bg-slate-950/60 backdrop-blur-md text-white font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10">
                  {item.category}
                </span>
              </div>

              {/* Caption Text details */}
              <div className="mt-4 px-2 text-left space-y-1" onClick={(e) => e.stopPropagation()}>
                <span className="text-[9px] font-mono tracking-widest text-[#1E3A8A] font-bold block uppercase">
                  Foyer Daryel Djibouti
                </span>
                <Editable
                  label="Légende de la photo de galerie"
                  value={item.caption}
                  onSave={(newVal) => {
                    setGalerie((prev) =>
                      prev.map((img) => (img.id === item.id ? { ...img, caption: newVal } : img))
                    );
                  }}
                  onDelete={() => {
                    deleteGalleryItem(item.id);
                  }}
                >
                  <p className="text-slate-800 text-xs sm:text-sm font-semibold leading-relaxed line-clamp-1">
                    {item.caption}
                  </p>
                </Editable>
              </div>
            </div>
          ))}
        </div>

        {/* 3. LIGHTBOX COMPREHENSIVE VIEWPORT (Modal backdrop) */}
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
            
            {/* Upper controls close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Left controller navigate */}
            <button
              onClick={showPrev}
              className="absolute left-4 sm:left-8 text-white/75 hover:text-white p-4 rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Main Visual Image Body representation */}
            <div className="max-w-4xl w-full flex flex-col items-center gap-4 text-center">
              <div className="relative aspect-16/10 max-h-[70vh] w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={filteredItems[lightboxIndex].imageUrl}
                  alt={filteredItems[lightboxIndex].caption}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Gallery index numbers and detailed text captions */}
              <div className="space-y-1.5 max-w-xl text-center">
                <span className="text-amber-400 font-mono text-[10px] tracking-widest uppercase block">
                  Installation {lightboxIndex + 1} de {filteredItems.length}
                </span>
                <h3 className="text-white font-serif italic text-lg sm:text-xl leading-relaxed">
                  {filteredItems[lightboxIndex].caption}
                </h3>
                <span className="inline-block border border-white/15 bg-white/5 text-white/80 font-mono text-[9px] px-3 py-1 rounded-full uppercase tracking-widest leading-none mt-2">
                  Catégorie : {filteredItems[lightboxIndex].category}
                </span>
              </div>
            </div>

            {/* Right controller navigate */}
            <button
              onClick={showNext}
              className="absolute right-4 sm:right-8 text-white/75 hover:text-white p-4 rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

          </div>
        )}

        {/* 4. IMMERSIVE FULLSCREEN SLIDESHOW COMPONENT */}
        {isFullscreenActive && filteredItems.length > 0 && (
          <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-md flex flex-col justify-between p-6 sm:p-10 select-none">
            
            {/* Background ambient glow matching the slide image for maximum cinematic depth */}
            <div className="absolute inset-0 scale-105 blur-3xl opacity-30 pointer-events-none transition-all duration-1000">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={filteredItems[fullscreenIndex]?.imageUrl} 
                className="w-full h-full object-cover" 
                alt="" 
              />
            </div>

            {/* Top Bar Controls */}
            <div className="relative z-10 flex items-center justify-between gap-4 font-mono">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full bg-emerald-400 ${fullscreenIsPlaying ? 'animate-ping' : ''}`} />
                  Diaporama Actif
                </span>
                <span className="text-xs text-slate-300 font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  {String(fullscreenIndex + 1).padStart(2, '0')} / {String(filteredItems.length).padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFullscreenIsPlaying(!fullscreenIsPlaying)}
                  className={`p-3.5 rounded-full border flex items-center justify-center transition cursor-pointer ${
                    fullscreenIsPlaying 
                      ? "bg-white/10 border-white/10 text-white hover:bg-white/20" 
                      : "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700"
                  }`}
                  title={fullscreenIsPlaying ? "Mettre en pause (Espace)" : "Relancer le défilement (Espace)"}
                >
                  {fullscreenIsPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white" />}
                </button>

                <button
                  onClick={() => setIsFullscreenActive(false)}
                  className="p-3.5 rounded-full bg-white/10 border border-white/15 text-slate-300 hover:text-white hover:bg-white/20 transition cursor-pointer"
                  title="Fermer le plein écran (Echap)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Main Cinema Screen (Image) */}
            <div className="relative z-10 flex-1 flex items-center justify-center my-6 overflow-hidden max-h-[70vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={fullscreenIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="relative w-full h-full max-w-5xl flex items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={filteredItems[fullscreenIndex]?.imageUrl}
                    alt={filteredItems[fullscreenIndex]?.caption}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/5 bg-slate-900"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Floating Left Navigation Button */}
              <button
                onClick={() => {
                  setFullscreenIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
                  setFullscreenIsPlaying(false);
                }}
                className="absolute left-2 sm:left-6 p-4 rounded-full bg-slate-950/40 hover:bg-slate-950/80 hover:scale-105 text-white border border-white/10 transition cursor-pointer"
                title="Séquence précédente (Flèche Gauche)"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Floating Right Navigation Button */}
              <button
                onClick={() => {
                  setFullscreenIndex((prev) => (prev + 1) % filteredItems.length);
                  setFullscreenIsPlaying(false);
                }}
                className="absolute right-2 sm:right-6 p-4 rounded-full bg-slate-950/40 hover:bg-slate-950/80 hover:scale-105 text-white border border-white/10 transition cursor-pointer"
                title="Séquence suivante (Flèche Droite)"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Bottom Panel (Captions & Progress dynamic bars) */}
            <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6">
              
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-[#00ADEF] bg-sky-500/10 border border-sky-400/20 px-3.5 py-1.5 rounded-full uppercase font-black inline-block">
                  {filteredItems[fullscreenIndex]?.category}
                </span>
                
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={fullscreenIndex}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="font-serif italic text-white text-xl sm:text-3xl font-black tracking-tight"
                  >
                    {filteredItems[fullscreenIndex]?.caption}
                  </motion.h2>
                </AnimatePresence>
                
                <p className="text-xs text-slate-400 font-sans tracking-wide">
                  Centre d’Accueil et d’Urgence Foyer Daryel de Djibouti
                </p>
              </div>

              {/* Progress Slider Dots / Micro Timelines */}
              <div className="flex items-center gap-2 max-w-xl mx-auto overflow-x-auto justify-center pb-2">
                {filteredItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setFullscreenIndex(idx);
                      setFullscreenIsPlaying(false);
                    }}
                    className="h-1.5 rounded-full flex-1 min-w-[20px] max-w-[50px] bg-white/20 overflow-hidden relative cursor-pointer"
                  >
                    {fullscreenIndex === idx && fullscreenIsPlaying && (
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4, ease: "linear" }}
                        className="absolute inset-y-0 left-0 bg-emerald-500"
                      />
                    )}
                    {fullscreenIndex === idx && !fullscreenIsPlaying && (
                      <div className="absolute inset-0 bg-emerald-500" />
                    )}
                  </button>
                ))}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
