"use client";

import React, { useState } from "react";
import { useSiteState } from "@/lib/SiteStateContext";
import Editable from "@/components/Editable";
import { FileText, Download, MessageSquare, Send, User, ChevronLeft, Search, Calendar, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function PublicationsView() {
  const { publications, setPublications, deletePublication, addComment, t } = useSiteState();
  const [selectedPubId, setSelectedPubId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");

  const categories = ["all", "Rapport annuel", "Juridique", "Médical"];

  const filteredPubs = publications.filter((pub) => {
    const matchesCategory = filterCategory === "all" || pub.category === filterCategory;
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pub.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pub.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownloadPDF = (pdfBase64: string, filename: string) => {
    try {
      const binaryString = window.atob(pdfBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (e) {
      console.error("Failed to compile or download PDF Blob", e);
    }
  };

  const handlePostComment = (e: React.FormEvent, pubId: string) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentContent.trim()) return;
    addComment(pubId, commentAuthor.trim(), commentContent.trim());
    setCommentAuthor("");
    setCommentContent("");
  };

  const activePub = publications.find((p) => p.id === selectedPubId);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-20" id="publications-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* If viewing a single detailed publication */}
        {activePub ? (
          <div className="max-w-4xl mx-auto space-y-8 text-left" id="single-publication-details">
            <button
              onClick={() => setSelectedPubId(null)}
              className="flex items-center gap-2 text-[#1E3A8A] font-semibold text-sm hover:underline cursor-pointer bg-white py-2 px-4 rounded-xl border border-slate-205 shadow-2xs w-fit"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Retourner aux publications</span>
            </button>

            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-mono tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase font-black">
                  {activePub.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Publié en {activePub.date}</span>
                </span>
              </div>

              <Editable
                label="Titre de la publication"
                value={activePub.title}
                onSave={(newVal) => {
                  setPublications((prev) =>
                    prev.map((p) => (p.id === activePub.id ? { ...p, title: newVal } : p))
                  );
                }}
                onDelete={() => {
                  deletePublication(activePub.id);
                  setSelectedPubId(null);
                }}
              >
                <h1 className="font-serif text-3xl sm:text-4xl italic font-black text-slate-900 leading-tight">
                  {activePub.title}
                </h1>
              </Editable>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <User className="h-4 w-4" />
                <span>Rédacteur officiel : <strong className="text-slate-800">{activePub.author}</strong></span>
              </div>

              <Editable
                label="Résumé court"
                value={activePub.summary}
                onSave={(newVal) => {
                  setPublications((prev) =>
                    prev.map((p) => (p.id === activePub.id ? { ...p, summary: newVal } : p))
                  );
                }}
              >
                <p className="text-slate-700 leading-relaxed font-sans text-sm sm:text-base border-l-4 border-slate-300 pl-4 py-1 italic bg-slate-50/50 rounded-r-xl">
                  {activePub.summary}
                </p>
              </Editable>

              <Editable
                label="Contenu intégral de la directive"
                value={activePub.content}
                onSave={(newVal) => {
                  setPublications((prev) =>
                    prev.map((p) => (p.id === activePub.id ? { ...p, content: newVal } : p))
                  );
                }}
              >
                <div className="whitespace-pre-line text-slate-650 text-sm sm:text-base leading-relaxed font-sans pt-4 border-t border-slate-100">
                  {activePub.content}
                </div>
              </Editable>

              {/* PDF & Multi-format Media Attachments & Previews */}
              {activePub.fileType && activePub.fileType !== "none" && activePub.fileUrl ? (
                <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif italic font-bold text-slate-900 text-lg">Document officiel attaché</h3>
                      <p className="text-[10.5px] font-mono text-slate-500">Média réglementaire : {activePub.fileName || "Fichier joint"}</p>
                    </div>
                  </div>

                  {activePub.fileType === "pdf" && (
                    <div className="space-y-4">
                      {/* Interactive PDF in-app viewer object */}
                      <div className="border border-slate-200 rounded-2xl overflow-hidden h-[500px] w-full bg-slate-105 shadow-inner">
                        <iframe
                          src={activePub.fileUrl}
                          className="w-full h-full border-0"
                          title="Visualiseur PDF intégré"
                        />
                      </div>
                      <div className="flex flex-wrap gap-3 justify-end">
                        <a
                          href={activePub.fileUrl}
                          download={activePub.fileName || `CAU_Directive_${activePub.id}.pdf`}
                          className="bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs uppercase tracking-wider font-extrabold py-3.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-all duration-200"
                        >
                          <Download className="h-4 w-4" />
                          <span>Télécharger le Fichier PDF</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {activePub.fileType === "image" && (
                    <div className="space-y-4">
                      <div className="border border-slate-200 rounded-3xl overflow-hidden max-h-[480px] w-full bg-slate-50 flex items-center justify-center p-4">
                        <img
                          src={activePub.fileUrl}
                          alt={activePub.title}
                          className="max-h-[440px] w-auto object-contain rounded-xl shadow-sm border border-slate-100"
                        />
                      </div>
                      <div className="flex justify-end">
                        <a
                          href={activePub.fileUrl}
                          download={activePub.fileName || `CAU_Directive_${activePub.id}.png`}
                          className="bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs uppercase tracking-wider font-extrabold py-3.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition"
                        >
                          <Download className="h-4 w-4" />
                          <span>Télécharger l&apos;Image</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {activePub.fileType === "video" && (
                    <div className="space-y-4">
                      <div className="border border-slate-900 rounded-3xl overflow-hidden bg-black flex items-center justify-center p-1">
                        <video
                          src={activePub.fileUrl}
                          controls
                          className="w-full max-h-[440px] rounded-2xl"
                        />
                      </div>
                      <div className="flex justify-end">
                        <a
                          href={activePub.fileUrl}
                          download={activePub.fileName || `CAU_Directive_${activePub.id}.mp4`}
                          className="bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs uppercase tracking-wider font-extrabold py-3.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition"
                        >
                          <Download className="h-4 w-4" />
                          <span>Télécharger la Vidéo</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback legacy download button for standard hardcoded base64 publications */
                activePub.pdfDataBase64 && (
                  <div className="bg-blue-50/50 border border-blue-150/80 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shadow-md shadow-blue-900/10">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-serif italic font-bold text-slate-950 text-base">Fichier Mandat PDF Signé</h4>
                        <p className="text-[10px] font-mono text-slate-500">Document officiel avec sceau pénal du greffe</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadPDF(activePub.pdfDataBase64!, `CAU_Djibouti_${activePub.id}.pdf`)}
                      className="bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs uppercase tracking-wider font-bold py-3.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-all duration-350"
                    >
                      <Download className="h-4 w-4" />
                      <span>Télécharger l&apos;Agréement (.pdf)</span>
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Comments block */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-2xs space-y-6 text-left">
              <h3 className="font-serif italic text-xl font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#1E3A8A]" />
                <span>Observations de concertation ({activePub.comments.length})</span>
              </h3>

              <div className="space-y-4">
                {activePub.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic font-mono py-4">Aucune observation n&apos;a été consignée sous ce texte légal.</p>
                ) : (
                  activePub.comments.map((comm) => (
                    <div key={comm.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-150 relative text-left">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-xs text-[#1E3A8A] flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{comm.author}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{comm.date}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-650 font-sans leading-relaxed">{comm.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Append custom comments Form */}
              <form onSubmit={(e) => handlePostComment(e, activePub.id)} className="pt-6 border-t border-slate-100 space-y-4">
                <h4 className="font-serif italic font-bold text-sm text-slate-800">Ajouter une observation ou un avis juridique</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Votre nom complet ou titre officiel"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  placeholder="Écrivez votre observation..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white resize-none"
                />
                <button
                  type="submit"
                  className="bg-slate-950 hover:bg-slate-850 text-white font-semibold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Poster l&apos;observation</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* General Publications List */
          <div className="space-y-12 text-left" id="publications-listings">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-blue-600 font-mono text-xs uppercase tracking-widest font-black bg-blue-50 border border-blue-150 px-3.5 py-1.5 rounded-full inline-block">
                Directives &amp; Textes Légaux
              </span>
              <h1 className="font-serif italic text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
                Publications &amp; Rapports
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-mono leading-relaxed">
                Retrouvez la documentation de référence, guides de réhabilitation et rapports pénaux d&apos;activité du Foyer Daryel.
              </p>
            </div>

            {/* Controls Filter and Search */}
            <div className="bg-white border border-slate-205 rounded-[2rem] p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-2xs">
              
              {/* Category Toggles (Left/Center) */}
              <div className="md:col-span-7 flex flex-wrap gap-2 justify-start">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                      filterCategory === cat
                        ? "bg-[#1E3A8A] text-white"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-150"
                    }`}
                  >
                    {cat === "all" ? "Toutes les publications" : cat}
                  </button>
                ))}
              </div>

              {/* Input search (Right) */}
              <div className="md:col-span-5 relative">
                <input
                  type="text"
                  placeholder="Rechercher une directive sociale..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                />
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

            </div>

            {/* Publications Grid cards representation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {filteredPubs.length === 0 ? (
                <div className="col-span-2 text-center py-16 bg-white rounded-3xl border border-slate-200/80">
                  <p className="text-sm text-slate-500 font-mono italic">Aucune publication ne correspond à vos filtres de recherche.</p>
                </div>
              ) : (
                filteredPubs.map((pub) => (
                  <div
                    key={pub.id}
                    className="p-6 sm:p-8 bg-white rounded-[2rem] border border-slate-200/80 hover:border-slate-350 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between items-stretch text-left"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#1E3A8A] bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-full font-bold">
                          {pub.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-medium">{pub.date}</span>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Editable
                          label="Titre du document"
                          value={pub.title}
                          onSave={(newVal) => {
                            setPublications((prev) =>
                              prev.map((p) => (p.id === pub.id ? { ...p, title: newVal } : p))
                            );
                          }}
                          onDelete={() => {
                            deletePublication(pub.id);
                          }}
                        >
                          <h3 className="font-serif italic font-bold text-lg text-slate-900 leading-snug">
                            {pub.title}
                          </h3>
                        </Editable>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Editable
                          label="Résumé de la publication"
                          value={pub.summary}
                          onSave={(newVal) => {
                            setPublications((prev) =>
                              prev.map((p) => (p.id === pub.id ? { ...p, summary: newVal } : p))
                            );
                          }}
                        >
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans line-clamp-3">
                            {pub.summary}
                          </p>
                        </Editable>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-5 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedPubId(pub.id)}
                        className="text-[#1E3A8A] font-semibold text-xs sm:text-sm hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>Lire la directive complète</span>
                        <ChevronLeft className="h-4 w-4 rotate-180" />
                      </button>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{pub.comments.length} avis</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
