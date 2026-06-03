"use client";

import React from "react";
import { useSiteState } from "@/lib/SiteStateContext";
import HomeView from "@/components/HomeView";
import AboutView from "@/components/AboutView";
import MissionsView from "@/components/MissionsView";
import PublicationsView from "@/components/PublicationsView";
import GalleryView from "@/components/GalleryView";
import ContactView from "@/components/ContactView";
import AdminPanel from "@/components/AdminPanel";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const { activeView } = useSiteState();

  return (
    <div id="active-view-port" className="relative overflow-hidden w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full"
        >
          {activeView === "home" && <HomeView />}
          {activeView === "about" && <AboutView />}
          {activeView === "missions" && <MissionsView />}
          {activeView === "publications" && <PublicationsView />}
          {activeView === "gallery" && <GalleryView />}
          {activeView === "contact" && <ContactView />}
          {activeView === "admin" && <AdminPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
