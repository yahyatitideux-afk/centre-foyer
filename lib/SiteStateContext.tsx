"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

// Types
export interface Chronique {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  desc: string;
}

export interface GalerieItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
}

export interface OrganiNode {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  duties: string[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  dateAdded: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  label: string;
  actionType: "text" | "image" | "file";
  date: string;
  user: string;
}

export interface AssistanceRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  smsSentStatus: "success" | "pending" | "failed";
  phone?: string;
  createdAt?: string;
}

export interface Publication {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  author: string;
  pdfDataBase64?: string;
  comments: Comment[];
  fileType?: "pdf" | "image" | "video" | "none";
  fileUrl?: string;
  fileName?: string;
}

export interface StaffMember {
  id: string;
  role: string;
  desc: string;
  icon: string;
  highlight: boolean;
}

export interface Expertise {
  id: string;
  badge: string;
  title: string;
  desc: string;
  imageUrl: string;
  iconName: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  desc: string;
  imageUrl: string;
  status: string;
  stats: string;
}

export interface GeneralConfig {
  phoneEmergency: string;
  email: string;
  address: string;
  title: string;
  tagline: string;
  alertInfo: string;
  heroBgUrl?: string;
  heroSlogan?: string;
  heroQuote?: string;
  heroSubText?: string;
  gouvernanceIntro?: string;
  adminPassword?: string;
  stat1Num?: string;
  stat1Title?: string;
  stat1Desc?: string;
  stat2Num?: string;
  stat2Title?: string;
  stat2Desc?: string;
  stat3Num?: string;
  stat3Title?: string;
  stat3Desc?: string;
  stat4Num?: string;
  stat4Title?: string;
  stat4Desc?: string;
  statsTag?: string;
  statsTitle?: string;
  statsDescText?: string;
  stat1IconUrl?: string;
  stat2IconUrl?: string;
  stat3IconUrl?: string;
  stat4IconUrl?: string;
  bannerTitle?: string;
  bannerDesc?: string;
  footerDesc?: string;
  footerCol2Title?: string;
  footerCol3Title?: string;
  footerCopyright?: string;
  footerLink1?: string;
  footerLink2?: string;
  card1Title?: string;
  card1Subtitle?: string;
  card1Desc?: string;
  card2Title?: string;
  card2Subtitle?: string;
  card2Desc?: string;
  card3Title?: string;
  card3Subtitle?: string;
  card3Desc?: string;
  presidenceTitle?: string;
  presidenceSubtitle?: string;
  presidenceBadge?: string;
  presidenceDesc?: string;
  presidenceDuty1?: string;
  presidenceDuty2?: string;
  presidenceDuty3?: string;
  presidenceDuty4?: string;
  organigramLabel?: string;
  organigramTitle?: string;
  organigramDesc?: string;
  organigramSidebarLabel?: string;
  staffLabel?: string;
  staffTitle?: string;
  staffDesc?: string;
  organiSectionBadge?: string;
  organiSectionTitle?: string;
  organiSectionDesc?: string;
  organiSidebarTitle?: string;
  organiDocBadge?: string;
  organiDocTitle?: string;
  organiDocDesc?: string;
  staffSectionBadge?: string;
  staffSectionTitle?: string;
  staffSectionDesc?: string;
  missionsSectionBadge?: string;
  missionsSectionTitle?: string;
  missionsSectionDesc?: string;
  homeExpertiseBadge?: string;
  homeExpertiseTitle?: string;
  homeExpertiseDesc?: string;
  homeCrewBadge?: string;
  homeCrewTitle?: string;
  homeCrewDesc?: string;
}

export interface SiteStateContextType {
  language: "fr" | "ar";
  setLanguage: (lang: "fr" | "ar") => void;
  t: (key: string) => string;
  activeView: string;
  setActiveView: (view: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  general: GeneralConfig;
  setGeneral: React.Dispatch<React.SetStateAction<GeneralConfig>>;
  chroniques: Chronique[];
  setChroniques: React.Dispatch<React.SetStateAction<Chronique[]>>;
  galerie: GalerieItem[];
  setGalerie: React.Dispatch<React.SetStateAction<GalerieItem[]>>;
  structure: OrganiNode[];
  setStructure: React.Dispatch<React.SetStateAction<OrganiNode[]>>;
  personnel: StaffMember[];
  setPersonnel: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  publications: Publication[];
  setPublications: React.Dispatch<React.SetStateAction<Publication[]>>;
  
  expertises: Expertise[];
  setExpertises: React.Dispatch<React.SetStateAction<Expertise[]>>;
  addExpertise: (item: Omit<Expertise, "id">) => void;
  deleteExpertise: (id: string) => void;
  updateExpertise: (id: string, updated: Partial<Expertise>) => void;

  crewMembers: CrewMember[];
  setCrewMembers: React.Dispatch<React.SetStateAction<CrewMember[]>>;
  addCrewMember: (item: Omit<CrewMember, "id">) => void;
  deleteCrewMember: (id: string) => void;
  updateCrewMember: (id: string, updated: Partial<CrewMember>) => void;

  addComment: (pubId: string, author: string, content: string) => void;
  addGalleryItem: (item: Omit<GalerieItem, "id">) => void;
  deleteGalleryItem: (id: string) => void;
  addPublication: (pub: Omit<Publication, "id" | "comments" | "fileType" | "fileUrl" | "fileName"> & {
    id?: string;
    fileType?: "pdf" | "image" | "video" | "none";
    fileUrl?: string;
    fileName?: string;
  }) => void;
  deletePublication: (id: string) => void;
  resetToDefault: () => void;

  // New Audit Log & Media Manager signatures
  auditLog: AuditLogEntry[];
  registerModification: (label: string, actionType: "text" | "image" | "file", undo: () => void) => void;
  undoLastAction: () => boolean;

  mediaFiles: MediaFile[];
  addMediaFile: (name: string, url: string, type: string, size: string) => void;
  renameMediaFile: (id: string, newName: string) => void;
  deleteMediaFile: (id: string) => void;
  
  // Assistance requests submitted by guests
  assistanceRequests: AssistanceRequest[];
  addAssistanceRequest: (item: Omit<AssistanceRequest, "id" | "date" | "smsSentStatus">) => void;
  deleteAssistanceRequest: (id: string) => void;
  
  // Dynamic Admin Authentication & Inline Editing Features
  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (unlocked: boolean) => void;
  isEditModeActive: boolean;
  setIsEditModeActive: (active: boolean) => void;
  globalEditor: {
    label: string;
    value: string;
    onSave: (newValue: string) => void;
    onDelete?: () => void;
  } | null;
  setGlobalEditor: (editor: {
    label: string;
    value: string;
    onSave: (newValue: string) => void;
    onDelete?: () => void;
  } | null) => void;
}

const defaultGeneral: GeneralConfig = {
  phoneEmergency: "+253 21 35 12 12 / +253 77 81 44 44",
  email: "direction.cau@daryel.dj",
  address: "Quartier Daryel, Secteur Dar-El-Salam, Djibouti-ville, BP 2045",
  title: "Centre d’Accueil et d’Urgence (CAU)",
  tagline: "Sécuriser sans délai l'enfance en détresse à Djibouti.",
  alertInfo: "Le CAU de Djibouti assure une garde d'urgence h24 sous l'égide de la Brigade des Mineurs. Tout signalement d'abus physique ou d'abandon déclenche une saisine immédiate.",
  heroBgUrl: "/lieu_organisation.jpeg",
  heroSlogan: "« Parce que l'avenir de Djibouti s'écrit dans le regard protégé de ses enfants. »",
  heroQuote: "“Chaque enfant sauvé de l'abandon ou de la détresse est un phare d'espoir pour notre nation. Au Foyer Daryel, nous reconstruisons les rêves brisés sous le manteau de la dignité et d'un amour inconditionnel.”",
  heroSubText: "Le Centre d’Accueil et d’Urgence de Djibouti (Couramment appelé Foyer Daryel) est une association nationale agréée de salut public, opérant 24h/24 en coordination with les tribunaux et la Brigade des mineurs pour sauver les orphelins, abandonnés ou brutalisés.",
  gouvernanceIntro: "Établi au cœur de Djibouti-ville, le Centre d'Accueil et d'Urgence (CAU) est une structure associative de salut public agréée, dédiée à la sauvegarde physique, affective et légale des mineurs orphelins, abandonnés ou brutalisés.",
  adminPassword: "daryel2026",
  stat1Num: "520+",
  stat1Title: "Enfants Secourus",
  stat1Desc: "Admissions gérées en situation critique d'abus ou d'abandon total à Djibouti-ville.",
  stat2Num: "87%",
  stat2Title: "Réintégration Réussie",
  stat2Desc: "Retour en famille élargie sécurisée après ordonnance et bilan psychosocial.",
  stat3Num: "24h / 7",
  stat3Title: "Garde Clinique HPTV",
  stat3Desc: "Permanence d'un infirmier pédiatrique et de l'équipe éducative d'astreinte.",
  stat4Num: "< 2 Heures",
  stat4Title: "Prise en Charge Médicale",
  stat4Desc: "Délai maximum de mise en sécurité d'un mineur suite au signalement de la brigade.",
  bannerTitle: "Que faire face à un mineur en rupture sociale ou maltraité ?",
  bannerDesc: "La loi djiboutienne punit sévèrement la non-assistance à mineur en danger. Le placement temporaire au Foyer Daryel se fait exclusivement sous le contrôle légal des autorités d'État. Notre assistant conversationnel intelligent de garde (en bas à droite de votre écran) est configuré pour vous guider instantanément à travers les protocoles officiels de signalement judiciaire.",
  footerDesc: "Le Centre d'Accueil et d'Urgence de Djibouti est une association d'interpellation publique conventionnée par le Ministère de la Justice, assurant l'accueil clinique et la réhabilitation pédiatrique de crise.",
  footerCol2Title: "Signalements & Gardes",
  footerCol3Title: "Agrément & Parquet",
  footerCopyright: "© 2026 Foyer Daryel (CAU) — République de Djibouti. Tous droits réservés.",
  footerLink1: "Lois de protection",
  footerLink2: "Rapports annuels",
  card1Title: "Dénomination Officielle",
  card1Subtitle: "Centre d’Accueil et d’Urgence (CAU)",
  card1Desc: "Marque d'attention locale et refuge chaleureux connu sous le nom de Daryel, désignant la prévenance et la sauvegarde bienveillante.",
  card2Title: "Forme Juridique",
  card2Subtitle: "Association agréée de salut public",
  card2Desc: "Personnalité de droit privé reconnue d'utilité publique par l'État, fonctionnant sous le régime de tutelle de la protection de la famille de Djibouti.",
  card3Title: "Siège Social",
  card3Subtitle: "Djibouti-ville — Quartier Daryel",
  card3Desc: "Locaux d'hébergement complets situés dans la banlieue d'accès rapide de Djibouti, permettant un transfert sécurisé immédiat 24h/24.",
  presidenceTitle: "Présidence",
  presidenceSubtitle: "Responsable Général de l'Association",
  presidenceBadge: "Mandat institutionnel stratégique",
  presidenceDesc: "Le Président assume le mandat stratégique complet vis-à-vis des juridictions étatiques djiboutiennes. Il assure le positionnement légal de l'association, décompresse et désamorce les tensions with la brigade des mineurs et supervise l'ensemble de nos paires opérationnels pour garantir le respect de l'intérêt supérieur des enfants protégés.",
  presidenceDuty1: "Arbitre la direction stratégique générale",
  presidenceDuty2: "Négocie avec les Procureurs de la République",
  presidenceDuty3: "Représente légalement l'association",
  presidenceDuty4: "Réfère devant les ministères consulaires",
  organigramLabel: "L'Organigramme Opérationnel Interactif",
  organigramTitle: "Arbre actif de gouvernance",
  organigramDesc: "Sélectionnez les différents pôles d'activité de notre organigramme pour consulter en temps réel les attributions, effectifs qualifiés et responsabilités respectives.",
  organigramSidebarLabel: "Pôles d'activité",
  staffLabel: "La Clinique de Réhabilitation",
  staffTitle: "Le Staff Clinique Médico-Éducatif",
  staffDesc: "Une présence continue h24 de professionnels cliniques aguerris couvrant toutes les sphères du bien-être, de la pédiatrie et de l'intégrité psycho-affective infantile.",
  missionsSectionBadge: "Attributions Institutionnelles",
  missionsSectionTitle: "Nos grandes missions",
  missionsSectionDesc: "Un triptyque d'attribution fondé sur la protection permanente de la vie, le soutien psychologique global et le renforcement des structures de codétection communautaires de Djibouti.",
  homeExpertiseBadge: "Domaines de Spécialisation",
  homeExpertiseTitle: "Nos Pôles d'Expertise Médicale & Sociale",
  homeExpertiseDesc: "Le Foyer Daryel combine des protocoles d'urgence clinique hautement spécialisés et un encadrement à dimension humaine pour restaurer la dignité infantile.",
  homeCrewBadge: "L'Équipage & Équipes de Garde",
  homeCrewTitle: "Le Cœur Battant de Notre Actions",
  homeCrewDesc: "Des infirmiers pédiatres, éducateurs cliniques et juristes dévoués qui œuvrent jour et nuit pour offrir un havre inviolable de protection sociale à Djibouti."
};

const defaultGeneralAr: GeneralConfig = {
  phoneEmergency: "+253 21 35 12 12 / +253 77 81 44 44",
  email: "direction.cau@daryel.dj",
  address: "حي داريل، قطاع دار السلام، جيبوتي العاصمة، ص.ب 2045",
  title: "مركز الاستقبال والتدخل العاجل (CAU)",
  tagline: "تأمين الأطفال المعرضين للخطر في جيبوتي دون تأخير.",
  alertInfo: "يقدم مركز الاستقبال والتدخل العاجل في جيبوتي حراسة مستمرة على مدار الساعة تحت إشراف شرطة الأحداث. أي إبلاغ عن إساءة أو إهمال يؤدي إلى تدخل فوري.",
  heroBgUrl: "/lieu_organisation.jpeg",
  heroSlogan: "« لأن مستقبل جيبوتي يكتب في عيون أطفالها المحمية. »",
  heroQuote: "“كل طفل يتم إنقاذه من الإهمال أو الضياع هو منارة أمل لأمتنا. في داريل، نعيد بناء الأحلام المكسورة تحت مظلة الكرامة والمحبة غير المشروطة.”",
  heroSubText: "إن مركز الاستقبال والتدخل العاجل في جيبوتي (المعروف كـ داريل) هو جمعية وطنية مرخصة للمصلحة العامة، تعمل على مدار 24 ساعة بالتنسيق مع المحاكم وشرطة الأحداث لإنقاذ الأيتام والمتخلى عنهم والمضطهدين.",
  gouvernanceIntro: "تأسس مركز الاستقبال والتدخل العاجل (CAU) في قلب مدينة جيبوتي، وهو جمعية نفع عام معتمدة، تسعى جاهدة لحماية سلامة الأطفال القصر الأيتام، المتخلى عنهم، أو الذين تعرضوا للإساءة جسدياً أو معنوياً وقانونياً.",
  adminPassword: "daryel2026",
  stat1Num: "520+",
  stat1Title: "طفل تم إنقاذه",
  stat1Desc: "حالات إيواء حرجة تم التعامل معها في حالات الإساءة أو الإهمال التام بجيبوتي العاصمة.",
  stat2Num: "87%",
  stat2Title: "إعادة دمج ناجحة",
  stat2Desc: "العودة المسلمة والآمنة للأسر الموسعة بعد قرار القضاء والتقييم الاجتماعي والنفسي.",
  stat3Num: "24 ساعة / 7",
  stat3Title: "رعاية سريرية مستمرة",
  stat3Desc: "تواجد دائم لممرض أطفال وفريق تربوي مناوب طوال الليل والنهار.",
  stat4Num: "< ساعتين",
  stat4Title: "استجابة طبية عاجلة",
  stat4Desc: "أقصى مهلة لتأمين طفل قاصر وتوفير الرعاية الطبية له فور تلقي البلاغ من الشرطة.",
  bannerTitle: "ماذا تفعل عند العثور على طفل قاصر متشرد أو يتعرض للمعامة السيئة ؟",
  bannerDesc: "يعاقب القانون الجيبوتي بشدة على عدم تقديم المساعدة لقاصر في خطر. إن الإيواء المؤقت في داريل يتم حصرياً تحت إشراف السلطات القانونية للدولة. تم إعداد مساعدنا التفاعلي الذكي (أسفل يمين الشاشة) لإرشادكم خطوة بخطوة بالبروتوكولات الرسمية للإبلاغ القضائي.",
  footerDesc: "مركز الاستقبال والتدخل العاجل في جيبوتي هو جمعية منفعة عامة متعاقدة مع وزارة العدل، تضمن الإيواء السريري وإعادة التأهيل للأطفال في وضعية صعبة.",
  footerCol2Title: "البلاغات والمناوبات",
  footerCol3Title: "الاعتماد والنيابة",
  footerCopyright: "© 2026 داريل (CAU) — جمهورية جيبوتي. جميع الحقوق محفوظة.",
  footerLink1: "قوانين الحماية",
  footerLink2: "التقارير السنوية",
  card1Title: "التسمية الرسمية",
  card1Subtitle: "مركز الاستقبال والتدخل العاجل (CAU)",
  card1Desc: "لفتة من الرعاية المحلية وملجأ دافئ يُعرف باسم داريل، والذي يعني العناية والحماية الحنونة.",
  card2Title: "الشكل القانوني",
  card2Subtitle: "جمعية معتمدة ذات منفعة عامة",
  card2Desc: "مؤسسة خاضعة للقانون الخاص، معترف بنفعها العام من طرف الدولة، وتعمل تحت وصاية وزارة حماية الأسرة بجيبوتي.",
  card3Title: "المقر الرئيسي",
  card3Subtitle: "مدينة جيبوتي — حي داريل",
  card3Desc: "مقر إقامة متكامل يقع في منطقة يسهل الوصول إليها في جيبوتي، مما يضمن النقل الآمن الفوري على مدار 24 ساعة.",
  presidenceTitle: "الرئاسة",
  presidenceSubtitle: "المسؤول العام للجمعية",
  presidenceBadge: "تفويض استراتيجي ومؤسساتي",
  presidenceDesc: "يتولى الرئيس التفويض الاستراتيجي الكامل أمام الهيئات القضائية والوزارية في جيبوتي. يضمن الحفاظ على الموقف القانوني للجمعية، تحسين قنوات التعاون مع شرطة الأحداث، ويشرف على كافة الفرق لضمان الاحترام المطلق للمصلحة الفضلى للأطفال المحميين.",
  presidenceDuty1: "إدارة التوجه الاستراتيجي العام",
  presidenceDuty2: "التفاوض مع وكلاء الجمهورية والنواب",
  presidenceDuty3: "تمثيل الجمعية بصفة قانونية ورسمية",
  presidenceDuty4: "التواصل الفعال مع الوزارات الشريكة",
  organigramLabel: "الهيكل التنظيمي التفاعلي",
  organigramTitle: "هيكل الحوكمة والشراكات",
  organigramDesc: "اضغط على الأقسام المختلفة للاطلاع المباشر على المهام والموارد البشرية المؤهلة والمسؤوليات المنوطة بكل قطاع.",
  organigramSidebarLabel: "أقطاب النشاط والخدمة",
  staffLabel: "عيادة إعادة التأهيل",
  staffTitle: "الفريق الطبي والتربوي المناوب",
  staffDesc: "حضور متواصل على مدار الساعة لمتخصصين في الصحة المدرسية، طب الأطفال والدعم النفسي والاجتماعي.",
  missionsSectionBadge: "المهام المؤسساتية",
  missionsSectionTitle: "أهدافنا السامية ومهمتنا",
  missionsSectionDesc: "نسعى إلى حماية دائمة لحق الأطفال في الحياة، وتقديم الدعم النفسي المتكامل، وتعزيز قنوات الرصد المجتمعي في جيبوتي.",
  homeExpertiseBadge: "مجالات الاختصاص",
  homeExpertiseTitle: "أقطاب الخبرة الطبية والاجتماعية",
  homeExpertiseDesc: "يجمع داريل بين بروتوكولات الاستعجال السريري المتقدم ودعم نفسي على مقاس الطفل لاستعادة كرامته الضائعة.",
  homeCrewBadge: "طواقم العمل والمناوبة",
  homeCrewTitle: "قلب عملنا النابض بالرحمة",
  homeCrewDesc: "ممرضو أطفال، مربون وأخصائيون حقوقيون يسهرون الليل والنهار لتقديم ملاذ دافئ وآمن للأطفال في جيبوتي."
};

const defaultChroniquesAr: Chronique[] = [
  {
    id: "1",
    step: "01",
    title: "البلاغ عن حالة خطر",
    subtitle: "إجراء التنبيه الرسمي (عاجل h24)",
    desc: "يقوم وكيل الجمهورية أو شرطة الأحداث في جيبوتي بالإبلاغ عن الحادثة وإصدار أمر إيداع فوري لحماية الطفل من خطر داهم."
  },
  {
    id: "2",
    step: "02",
    title: "الرعاية السريرية الفورية",
    subtitle: "أقل من 24 ساعة",
    desc: "يستفيد الطفل المقبول من رعاية طبية شاملة: فحص أطفال متكامل، الإسعافات الأولية المناسبة، التغذية المقوية والدعم النفسي لتأمين استقراره."
  },
  {
    id: "3",
    step: "03",
    title: "البحث والتقييم الاجتماعي",
    subtitle: "فترة الاستقرار (15 إلى 30 يوماً)",
    desc: "تقوم المساعدة الاجتماعية بدراسة الحالة والاتصال بالإدارات والمحكمة لبناء تقرير مفصل حول الوضع العائلي أو العثور على عائلة بديلة موثوقة."
  },
  {
    id: "4",
    step: "04",
    title: "قرار الخروج والدمج المستدام",
    subtitle: "مرحلة الدمج النهائي (~شهر واحد)",
    desc: "يعتمد القاضي على تحقيقاتنا الاجتماعية ليقرر إما دمج الطفل داخل أسرته الكبرى بأمان، أو نقله بصفة مستدامة لمؤسسات الطفولة الرسمية بجيبوتي."
  }
];

const defaultExpertisesAr: Expertise[] = [
  {
    id: "e1",
    badge: "سريري حالي",
    title: "رعاية وعلاج طب الأطفال",
    desc: "تدخل طبي فوري: الكشف عن علامات سوء المعاملة الجسدية، طب أطفال مكثف، وعلاجات سريرية مخصصة لإعادة تأهيل الطفل.",
    imageUrl: "https://picsum.photos/seed/pedia_expert/600/400",
    iconName: "Stethoscope"
  },
  {
    id: "e2",
    badge: "الصحة النفسية",
    title: "العلاج وتجاوز الصدمات العاطفية",
    desc: "مرافقة نفسية مخصصة لمساعدة الأطفال على التعبير عن الذات، تجاوز متلازمة الصدمة، واسترجاع الاستقرار العاطفي والنفسي.",
    imageUrl: "https://picsum.photos/seed/psych_expert/600/400",
    iconName: "Heart"
  },
  {
    id: "e3",
    badge: "قضاء الدولة",
    title: "الإيداع المستعجل على مدار 24 ساعة",
    desc: "التطبيق السريع لأوامر النيابة والمحكمة بالتنسيق الكامل والوثيق مع شرطة الأحداث لاستخلاص أي قاصر معرض للأذى.",
    imageUrl: "https://picsum.photos/seed/legal_expert/600/400",
    iconName: "ShieldCheck"
  },
  {
    id: "e4",
    badge: "إعادة البناء",
    title: "إعادة الدمج الأسري الفعال",
    desc: "تحقيقات اجتماعية ميدانية ومعمقة، تقييم الأسر الراعية، وتدبير دقيق وشامل لعملية الإيواء المؤقت أو كفالة اليتيم.",
    imageUrl: "https://picsum.photos/seed/family_expert/600/400",
    iconName: "Users"
  }
];

const defaultCrewMembersAr: CrewMember[] = [
  {
    id: "c1",
    name: "د. أمينة عمر",
    role: "أخصائية طب الأطفال ومديرة العيادة",
    desc: "تشرف وتتابع الرعاية الطبية والتشخيصات السريرية الطارئة للأطفال النزلاء داخل المركز.",
    imageUrl: "https://picsum.photos/seed/doccaudj/500/500",
    status: "En Service",
    stats: "حراسة ومتابعة متواصلة"
  },
  {
    id: "c2",
    name: "يوسف علمي",
    role: "رئيس خلية الطوارئ والاتصال",
    desc: "مسؤول الاتصال الفوري المباشر مع النيابة العامة وشرطة الأحداث التابعة لجمهورية جيبوتي.",
    imageUrl: "https://picsum.photos/seed/coordcaudj/500/550",
    status: "En Service",
    stats: "إدارة وتصريف الطوارئ"
  },
  {
    id: "c3",
    name: "فاطمة فرح",
    role: "مربية تربوية مختصة",
    desc: "تسهر على حماية الأطفال نفسياً ونشر الطمأنينة والإشراف على برامج التنشيط المسائية.",
    imageUrl: "https://picsum.photos/seed/educcaudj/500/500",
    status: "En Astreinte",
    stats: "متابعة ورعاية ليلة"
  },
  {
    id: "c4",
    name: "قادر إبراهيم",
    role: "أخصائي قانوني ومتابعة الدمج",
    desc: "يقدم الدعم القانوني في قضايا النيابة العامة ويتابع كفاءة وأمان عائلات الحضانة المؤقتة.",
    imageUrl: "https://picsum.photos/seed/legalcaudj/500/500",
    status: "Au Tribunal",
    stats: "التنسيق والدعم القانوني"
  }
];

const defaultStructureAr: OrganiNode[] = [
  {
    id: "ca",
    title: "مجلس الإدارة والشركاء",
    subtitle: "التوجيه الاستراتيجي والحوكمة العامة",
    desc: "لجنة رفيعة المستوى تضم قضاة أحداث وممثلي وزارات مختصة وأخصائيين لتوجيه الميزانيات واعتماد معايير الرعاية الفضلى.",
    duties: [
      "المصادقة على ميزانية قسم الرعاية والعيادة",
      "إبرام بروتوكولات حماية الطفولة مع وزارة العدل",
      "تطوير العلاقات الخارجية والشراكات الدولية"
    ]
  },
  {
    id: "admin",
    title: "القطاع المالي والإداري",
    subtitle: "اللوجستيات والمخازن والتموين",
    desc: "قطاع يدير الموارد اليومية للملجأ: توفير حليب الأطفال، وإدارة الصيدلية الطارئة وتطوير الخدمات الفندقية وصيانة المباني.",
    duties: [
      "المراقبة الدقيقة لتوفر مخزون التغذية المعززة",
      "إعداد وتوزيع حقائب الاستقبال الفوري للنزلاء الجدد",
      "تقديم تقارير مالية وإدارية شهرية لمجلس الإدارة"
    ]
  },
  {
    id: "medical",
    title: "القطاع الطبي والتربوي الاجتماعي",
    subtitle: "العيادة الدائمة والتحقيق والعمل الاجتماعي",
    desc: "خلية ميدانية تتابع السلامة الجسدية والنفسية للأطفال، تضم الطبيب المناوب والمساعدة الاجتماعية المختصة والمربين.",
    duties: [
      "حراسة طبية دائمة للتأكد من خلو الأطفال من التعذيب",
      "إعداد بحوث ودراسات اجتماعية موثوقة لصالح المحكمة والقضاة",
      "تنظيم برامج العلاج باللعب والأنشطة الترفيهية للأطفال"
    ]
  }
];

const defaultPublicationsAr: Publication[] = [
  {
    id: "p1",
    title: "التقرير السنوي لأنشطة حماية الأحداث 2025",
    category: "تقرير سنوي",
    date: "يناير 2026",
    summary: "ملخص مكثف للإجراءات السريرية لمركز الاستقبال والتدخل العاجل (CAU) في مواجهة عدد الرعاية الاستعجالية الصامتة.",
    content: "يقدم هذا التقرير تحليلاً كاملاً لقانون جنايات الأحداث في جيبوتي لعام 2025. ويوضح أن 87% من حالات الدخول المستعجل إلى مركز الاستقبال والتدخل العاجل تنتهي بالحصول على إعادة دمج عائلية إيجابية بعد إجراء بحث اجتماعي معمق. كما يركز على ملاءمة البنية التحتية للإيواء الاستعجالي المتاح على مدار 24 ساعة.",
    author: "الإدارة العامة CAU",
    pdfDataBase64: "JVBERi0xLjQKJeLjz9MKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PgplbmRvYmoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvQ29udGVudHMgNCAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDY1ID4+CnN0cmVhbQpCVAovRjEgMTIgVGYKMTAwIDcwMCBUZAooUmFwcG9ydCBPZmZpY2llbCBDQVUgLSBGb3llciBEYXJ5ZWwgRGppYm91dGkpIFRqCkUKZW5kc3RyZWFtCmVuZG9iagp0cmFpbGVyCiAgPDwgL1Jvb3QgMSAwIFIgPj4KJSVFT0Y=",
    comments: [
      { id: "c1", author: "المستشار ف. عمر", content: "وثيقة بالغة الأهمية لتوحيد خطط الحماية والاستماع.", date: "12 أبريل 2026" },
      { id: "c2", author: "خلية الحراسة", content: "معطيات متميزة للغاية تساعدنا في حكامة المناوبات.", date: "15 أبريل 2026" }
    ]
  },
  {
    id: "p2",
    title: "دليل الممارسة الأخلاقية للاستجابة النفسية للأطفال المصابين بالصدمات",
    category: "قانوني",
    date: "مارس 2026",
    summary: "بروتوكول موجه لمربين ورجال الأمن للتخفيف من حدة الصدمات النفسية الحادة لدى الأطفال والرضع المقبولين.",
    content: "إن الوصول لمركز داريل لحظة فارقة وقلقة للغاية في حياة القاصر المضطهد. يشرح هذا الدليل أسس التكامل الوثيق بين شرطة الأحداث وممرض العيادة المناوب لتنفيذ كفالة حنونة وآمنة بكفاءة عالية.",
    author: "لجنة الأخلاقيات القضائية",
    pdfDataBase64: "JVBERi0xLjQKJeLjz9MKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PgplbmRvYmoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvQ29udGVudHMgNCAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDYwID4+CnN0cmVhbQpCVAovRjEgMTIgVGYKMTAwIDcwMCBUZAooR3VpZGUgZGUgbCdBdWRpdGlvbiAtIENBVSBEamlib3V0aSkgVGoKWAplbmRzdHJlYW0KZW5kb2JqCnRyYWlsZXIKICA8PCAvUm9vdCAxIDAgUiA+PgplbmRvYmoKJSVFT0Y=",
    comments: []
  }
];

const arDictionary: Record<string, string> = {
  "Accueil": "الرئيسية",
  "Gouvernance": "الحوكمة",
  "Missions": "المهام",
  "Publications": "المنشورات",
  "La Galerie": "المعرض",
  "Signalement & Contact": "الإبلاغ والاتصال",
  "L'Équipage & Équipes de Garde": "طاقم الحراسة والعمل",
  "Domaines de Spécialisation": "مجالات التخصص",
  "Urgence Signalement H24": "طوارئ الإبلاغ 24 ساعة",
  "Portail National Djibouti": "البوابة الوطنية جيبوتي",
  "Alerte Téléphonique": "اتصال الطوارئ الهاتفي",
  "Centre d'Accueil et d'Urgence — Foyer Daryel (Djibouti)": "مركز الاستقبال والتدخل العاجل — داريل جيبوتي",
  "Clé Secrète Autoritaire": "المفتاح السري الإداري",
  "Saisissez le mot de passe administrateur...": "أدخل الرمز السري للمشرف...",
  "Se Connecter": "تسجيل الدخول",
  "Fermer": "إغلاق",
  "Console d'Administration": "لوحة التحكم الإدارية",
  "Cette zone est réservée exclusivement à l'Administration Générale du Foyer Daryel de Djibouti.": "هذه المنطقة مخصصة حصرياً للإدارة العامة لداريل جيبوتي.",
  "Accès Très Sécurisé": "دخول آمن للغاية",
  "Clé d'habilitation administrative incorrecte.": "مفتاح الترخيص الإداري غير صحيح.",
  "Bande d'Urgence Défilante": "شريط الطوارئ المتحرك",
  "En Service": "في الخدمة Active",
  "En Astreinte": "في الحراسة",
  "Au Tribunal": "بالمحكمة",
  "Assistant de Garde": "مساعد المناوبة",
  "Ligne d'écoute active": "خط الاستماع النشط",
  "Bonjour ! Je suis l'assistant d'orientation réglementaire du Foyer Daryel. Comment puis-je vous aider aujourd'hui ?": "مرحباً بك! أنا مساعد التوجيه التنظيمي لداريل جيبوتي. كيف يمكنني مساعدتك اليوم؟",
  "Des urgences médicales pédiatriques ? Composez de suite le +253 21 35 12 12.": "طوارئ طب الأطفال؟ اتصل فوراً على الرقم 21351212.",
  "Questions fréquemment posées :": "الأسئلة الشائعة:",
  "Saisissez une question d'orientation...": "أكتب سؤالك هنا...",
  "Comment signaler un enfant maltraité à Djibouti ?": "كيف يمكنني الإبلاغ عن طفل يتعرض للأذى في جيبوتي؟",
  "Quelles sont les conditions de garde d'urgence du foyer ?": "ما هي شروط الإيواء الاستعجالي في المركز؟",
  "Quel est le rôle du procureur dans le placement ?": "ما هو دور وكيل الجمهورية في رعاية وتوجيه القصر؟",
  "Nous rencontrons un problème de liaison avec notre réseau d'assistance. Veuillez appeler notre cellule de garde administrative au +253 21 35 12 12.": "نواجه مشكلة في الاتصال بشبكة دعمنا المباشر. يرجى الاتصال على الرقم 21351212.",
  "Problème de communication avec le serveur d'assistance. N'hésitez pas à nous joindre directement au +253 21 35 12 12.": "حدث خطأ في الاتصال بخادم المساعدة. لا تتردد في الاتصال بنا مباشرة على الرقم 21351212.",
  "Urgences Placement :": "طوارئ الإيداع والاتصال:",
  "Astreinte Sociale :": "حراسة المتابعة الاجتماعية:",
  "Courriel Administrateur :": "البريد الإلكتروني المنسق:",
  "Protection Sociale Agréée de l'État": "الحماية الاجتماعية المعتمدة من الدولة",
  "RÉPUBLIQUE DE DJIBOUTI • NOMINATION NATIONALE": "جمهورية جيبوتي • المسمى والاعتماد الوطني",
  "Voir le parcours d'orientation": "الاطلاع على مسار الحماية والتوجيه",
  "Nous joindre immédiatement": "الاتصال الفوري بنا",
  "Parcours de Protection Sociale du Mineur": "مسار الحماية الاجتماعية والرعاية للطفل",
  "Consultez la trajectoire institutionnelle rigoureuse d'un enfant pris en charge par l'État à Djibouti.": "اطلع على المسار المؤسسي الدقيق الذي يمر به الطفل المكفول من الدولة في جيبوتي.",
  "Signalement Judiciaire & Liaison Administrative": "الإبلاغ القضائي والتنسيق الإداري",
  "Ligne de Garde H24": "خط الحراسة الدائم h24",
  "Pour toute urgence vitale, composez le 17.": "للطوارئ القصوى وتهديد الحياة، اتصل فوراً بالرقم 17.",
  "Formulaire de Liaison Administrative d'Urgence": "استمارة التنسيق الإداري الاستعجالي",
  "Les informations transmises font l'objet d'un chiffrement hautement sécurisé et d'un traitement diligent en coordination avec le Parquet et la Brigade des mineurs.": "تخضع المعلومات المرسلة لتشفير عالي الأمان ومعالجة فورية دقيقة بالتنسيق مع النيابة العامة وشرطة الأحداث.",
  "Nom complet de l'autorité émettrice": "الاسم الكامل لجهة التبليغ أو السلطة",
  "Adresse e-mail sécurisée": "البريد الإلكتروني الآمن",
  "Numéro de téléphone d'intervention": "رقم هاتف التدخل المباشر",
  "Contenu détaillé du signalement judiciaire": "المضمون التفصيلي للتقرير القضائي",
  "Transmettre le Signalement Sécurisé": "إرسال تقرير الإبلاغ الآمن",
  "Ligne directe Brigade des mineurs & Foyer": "الخط المباشر لشرطة الأحداث والملجأ",
  "Utilisez ce formulaire officiel pour des requêtes d'orientation administrative non urgentes. Les messages sont audités par le pôle administratif de concert avec la direction sociale et les magistrats.": "استخدم هذه الاستمارة الرسمية لطلبات التوجيه الإداري غير المستعجلة. تخضع الرسائل لتدقيق إداري بتنسيق مع المديرية والقضاة.",
  "Votre signalement d'urgence administrative a été déposé avec succès !": "تم تسجيل البلاغ والتقرير الإداري بنجاح!",
  "Un SMS d'alerte instantanée a été routé vers l'éducateur de garde h24.": "تم إرسال بلاغ هاتفي فوري إلى المربي المناوب.",
  "Missions & Attributions Institutionnelles": "المهام والمسؤوليات المؤسساتية",
  "Le triptyque opérationnel pour la sécurité de l'enfance": "أهدافنا السامية لتأمين ونجدة الطفولة",
  "Ressources Cliniques & Logistiques d'Urgence": "الموارد والعيادة الطبية الاستعجالية",
  "Le Centre dispose d'une infrastructure dédiée à l'accueil h24 de nourrissons et jeunes enfants.": "يتوفر المركز على بنية تحتية مجهزة ومخصصة للاستقبال h24 للرضع والأطفال الصغار.",
  "Garde Infirmerie H24": "العيادة والحراسة الطبية h24",
  "Pouponnière de Crise": "حضانة الرعاية الاستعجالية",
  "Récupération Nutritionnelle": "علاج سوء التغذية المعزز",
  "Dignité Infantile": "حفظ كرامة وحقوق الطفل",
  "Conseil d'Administration & Organigramme": "مجلس الإدارة والهيكل التنظيمي",
  "Découvrez notre conseil stratégique et les attributions respectives de chaque pôle d'activité.": "اكتشف مجلسنا الاستراتيجي وصلاحيات ومهام كل قطاع وهيئة تفاعلية.",
  "Gouvernance & Administration": "الحوكمة والإدارة العامة",
  "Cadre d'Astreinte Médico-Pédiatrique": "إطار الحراسة الطبية للأطفال",
  "Renseignements légaux d'utilité publique": "البيانات القانونية ذات النفع العام",
  "Rapport de tutelle légale": "تقرير المتابعة والوصاية القانونية",
  "Publications Judiciaires & Directives Légales": "المنشورات القضائية والتوجيهات القانونية",
  "Retrouvez les circulaires ministérielles, guides de déontologie, et rapports d'activité officiels concernant la protection infantile.": "تصفح المناشير الوزارية، دلائل السلوك المهني والتقارير الرسمية لحماية الطفولة.",
  "Rechercher une directive sociale...": "البحث في تلميح أو توجيه اجتماعي...",
  "Ajouter un commentaire officiel": "إضافة تعقيب أو ملاحظة رسمية",
  "Rédigez votre observation ou annotation réglementaire...": "اكتب ملاحظتك أو تعقيبك التنظيمي هنا...",
  "Publier le commentaire": "نشر التعليق",
  "Éléments complémentaires joints": "الملاحق والمستندات المرفقة",
  "Cliquez pour télécharger la directive": "اضغط هنا لتحميل المستند القانوني (pdf)",
  "Rechercher une directive...": "البحث في مستند حماية...",
  "Lire la directive complète": "قراءة المستند كاملاً",
  "Auteur :": "الناشر والمصدر:",
  "La Galerie d'Activité Institutionnelle": "المعرض والأنشطة المؤسساتية",
  "Retrouvez en images les ateliers éducatifs, les équipements cliniques et la vie quotidienne au sein du Centre.": "تصفح الأنشطة بالصور لورشات التعليم، الأجهزة العيادية والحياة اليومية بالدار."
};

const defaultChroniques: Chronique[] = [
  {
    id: "1",
    step: "01",
    title: "Signalement de détresse",
    subtitle: "Procédure d'alerte officiellle (24h/24)",
    desc: "Le procureur de la République ou la Brigade des mineurs de Djibouti signale l'incident et ordonne un placement d'urgence immédiat pour soustraire l'enfant au danger physique."
  },
  {
    id: "2",
    step: "02",
    title: "Accueil Clinique & Hospitalisation",
    subtitle: "Sous 24 Heures",
    desc: "L'enfant bénéficie d'une prise en charge clinique intégrale : bilan pédiatrique complet, soins d'urgence de pédiatrie, alimentation fortifiée et soutien psychologique d'apaisement."
  },
  {
    id: "3",
    step: "03",
    title: "Enquête psychosociale active",
    subtitle: "Période de stabilisation (15 à 30 jours)",
    desc: "L'assistante sociale instruit le dossier en étroite liaison with les administrations de tutelle et le tribunal afin de clarifier la situation parentale ou d'identifier des parents éloignés de confiance."
  },
  {
    id: "4",
    step: "04",
    title: "Mesure de sortie & Foyer pérenne",
    subtitle: "Transition durable (~1 mois)",
    desc: "Le magistrat s'appuie sur nos enquêtes pour prononcer la réintégration familiale sécurisée ou le transfert pérenne de confiance vers les structures publiques de l'enfance de Djibouti."
  }
];

const defaultGalerie: GalerieItem[] = [
  {
    id: "g_lieu",
    imageUrl: "/public/lieu_organisation.jpeg",
    caption: "Le Siège & Centre d'Accueil Principal - Foyer Daryel à Djibouti-ville",
    category: "Installations"
  },
  {
    id: "g1",
    imageUrl: "https://images.unsplash.com/photo-1540479859555-17af45c78602?q=80&w=600&auto=format&fit=crop",
    caption: "L'espace de jeu sécurisé au cœur du Foyer Daryel",
    category: "Installations"
  },
  {
    id: "g2",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop",
    caption: "Atelier éducatif d'expression créative et de dessin thérapie",
    category: "Ateliers"
  },
  {
    id: "g3",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop",
    caption: "L'infirmerie d'auscultation du Centre pour la garde médicale 24h/24",
    category: "Médical"
  },
  {
    id: "g4",
    imageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=600&auto=format&fit=crop",
    caption: "La pouponnière d'accueil d'urgence pour les nourrissons abandonnés",
    category: "Installations"
  },
  {
    id: "g5",
    imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=600&auto=format&fit=crop",
    caption: "Le réfectoire chaleureux propice au réapprentissage des repas",
    category: "Vie quotidienne"
  }
];

const defaultStructure: OrganiNode[] = [
  {
    id: "ca",
    title: "Conseil d'Administration",
    subtitle: "Gouvernance & Administration Globale",
    desc: "Comité de pilotage de haut niveau réunissant des magistrats, des représentants ministériels et des docteurs en pédiatrie de Djibouti pour orienter les budgets et ratifier les traités de protection.",
    duties: [
      "Validation des budgets de l'unité de soins",
      "Établissement des protocoles de placement d'urgence de concert avec le Ministère de la Justice",
      "Relations extérieures avec les partenaires institutionnels et bailleurs internationaux"
    ]
  },
  {
    id: "admin",
    title: "Pôle Administratif et Financier",
    subtitle: "Logistique, Garde-Magasin & Dotations",
    desc: "Pôle gérant les ressources quotidiennes du foyer : approvisionnement en denrées infantiles, gestion de la pharmacie de secours, blanchisserie, conformité sanitaire et entretien de la structure.",
    duties: [
      "Suivi rigoureux de l'état des stocks d'alimentation fortifiée",
      "Gestion de la dotation des kits d'accueil d'urgence remis à chaque enfant admis",
      "Rapports de transparence comptable soumis mensuellement au Conseil d'Administration"
    ]
  },
  {
    id: "medical",
    title: "Pôle Médical, Clinique et Éducatif",
    subtitle: "Garde Médicale H24, Social & Psychologie",
    desc: "Pôle de terrain gérant l'intégrité clinique et mentale d'un enfant en détresse physique. Regroupe l'infirmier major, l'assistante sociale spécialisée en affaires infantiles et les éducateurs.",
    duties: [
      "Garde médicale obligatoire permanente pour la détection clinique des maltraitances physiques",
      "Élaboration d'enquêtes psychosociales approfondies pour guider la décision pénale des magistrats",
      "Animation d'exercices d'accompagnement ludique et de dessin thérapeutique"
    ]
  }
];

const defaultPersonnel: StaffMember[] = [
  {
    id: "sf1",
    role: "Médecin Pédiatre de Garde",
    desc: "Assure l'intégrité clinique, diagnostique les traces d'abus physiques et prescrit les protocoles d'alimentation fortifiée de crise.",
    icon: "🩺",
    highlight: true
  },
  {
    id: "sf2",
    role: "Coordinatrice Sociale d'Admissions",
    desc: "Gère l'accueil de secours, rédige les rapports de police, et établit la liaison de placement avec le procureur.",
    icon: "📋",
    highlight: false
  },
  {
    id: "sf3",
    role: "Éducateur Pédagogique Spécialisé",
    desc: "Anime les ateliers de réinsertion, stimule la confiance en soi, et accompagne les enfants admis à travers la thérapie par le jeu.",
    icon: "🎨",
    highlight: false
  },
  {
    id: "sf4",
    role: "Garde-Blanchisseur Major",
    desc: "Gère la distribution quotidienne des draps, draps d'infirmerie stériles, vêtements chauds, et kits d'accueil d'urgence.",
    icon: "👕",
    highlight: false
  },
  {
    id: "sf5",
    role: "Auxiliaire de Puériculture",
    desc: "Prend soin h24 des nourrissons abandonnés de la pouponnière de crise du Foyer, régulant les biberons de secours.",
    icon: "🍼",
    highlight: false
  }
];

const defaultPublications: Publication[] = [
  {
    id: "p1",
    title: "Rapport d'activité annuel 2025 : Protection et Justice des mineurs",
    category: "Rapport annuel",
    date: "Janvier 2026",
    summary: "Bilan condensé des actions cliniques du CAU face au nombre croissant de prises en charge médicales urgentes sous saisine de la Brigade des Mineurs de Djibouti.",
    content: "Ce rapport dresse le diagnostic complet du droit pénal des mineurs à Djibouti en 2025. Il démontre que 87% des admissions d'urgence au Centre d’Accueil et d’Urgence finissent par obtenir une réintégration parentale positive après une enquête sociale approfondie. Il met l'accent sur les infrastructures d'hébergement d'urgence pédiatrique adaptées h24.",
    author: "Direction Générale CAU",
    pdfDataBase64: "JVBERi0xLjQKJeLjz9MKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PgplbmRvYmoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvQ29udGVudHMgNCAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDY1ID4+CnN0cmVhbQpCVAovRjEgMTIgVGYKMTAwIDcwMCBUZAooUmFwcG9ydCBPZmZpY2llbCBDQVUgLSBGb3llciBEYXJ5ZWwgRGppYm91dGkpIFRqCkUKZW5kc3RyZWFtCmVuZG9iagp0cmFpbGVyCiAgPDwgL1Jvb3QgMSAwIFIgPj4KJSVFT0Y=",
    comments: [
      { id: "c1", author: "Magistrat F. Omar", content: "Un document capital pour harmoniser nos procédures de protection d'urgence.", date: "12 Avril 2026" },
      { id: "c2", author: "Brigade d'Alerte", content: "Données très précieuses pour planifier les rotations de garde.", date: "15 Avril 2026" }
    ]
  },
  {
    id: "p2",
    title: "Guide déontologique de l'audition et de l'apaisement du mineur traumatisé",
    category: "Juridique",
    date: "Mars 2026",
    summary: "Protocole clinique destiné aux forces de l'ordre et aux éducateurs sociaux de Djibouti-ville pour atténuer le syndrome de stress aigu chez le nourrisson ou le jeune enfant admis.",
    content: "L'arrivée au sein du Centre d'Accueil et d'Urgence est un moment d'intense anxiété pour le mineur maltraité ou abandonné. Ce guide explique la synergie entre la brigade d'alerte des mineurs et l'infirmier de garde du Foyer Daryel pour favoriser une transition protectrice sans traumatismes additionnels.",
    author: "Comité de déontologie CAU",
    pdfDataBase64: "JVBERi0xLjQKJeLjz9MKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PgplbmRvYmoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvQ29udGVudHMgNCAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDYwID4+CnN0cmVhbQpCVAovRjEgMTIgVGYKMTAwIDcwMCBUZAooR3VpZGUgZGUgbCdBdWRpdGlvbiAtIENBVSBEamlib3V0aSkgVGoKWAplbmRzdHJlYW0KZW5kb2JqCnRyYWlsZXIKICA8PCAvUm9vdCAxIDAgUiA+PgplbmRvYmoKJSVFT0Y=",
    comments: []
  }
];

const defaultExpertises: Expertise[] = [
  {
    id: "e1",
    badge: "Clinique Actuelle",
    title: "Soin & Clinique Pédiatrique",
    desc: "Prise en charge médicale instantanée : bilans de maltraitance physique, pédiatrie intensive, et soins cliniques de reconstruction infantile.",
    imageUrl: "https://picsum.photos/seed/pedia_expert/600/400",
    iconName: "Stethoscope"
  },
  {
    id: "e2",
    badge: "Santé Mentale",
    title: "Traitement Émotionnel",
    desc: "Accompagnement psychologique personnalisé pour libérer la parole de l'enfant, traiter les syndromes de choc et restaurer l'équilibre affectif.",
    imageUrl: "https://picsum.photos/seed/psych_expert/600/400",
    iconName: "Heart"
  },
  {
    id: "e3",
    badge: "Judiciaire d'État",
    title: "Placements d'Urgence H24",
    desc: "Saisie instantanée par ordonnance de justice en coordination avec la Brigade des Mineurs pour extraire de force tout enfant exposé au péril.",
    imageUrl: "https://picsum.photos/seed/legal_expert/600/400",
    iconName: "ShieldCheck"
  },
  {
    id: "e4",
    badge: "Reconstruction",
    title: "Réintégration Familiale",
    desc: "Enquêtes sociales poussées de réintégration, bilans familiaux, et processus progressif d'hébergement d'accueil parrains.",
    imageUrl: "https://picsum.photos/seed/family_expert/600/400",
    iconName: "Users"
  }
];

const defaultCrewMembers: CrewMember[] = [
  {
    id: "c1",
    name: "Dr. Amina Omar",
    role: "Sénior Pédiatre & Dir. Clinique",
    desc: "Supervise la prise en charge clinique et les diagnostics d'urgence post-traumatique des petits pensionnaires du centre.",
    imageUrl: "https://picsum.photos/seed/doccaudj/500/500",
    status: "En Service",
    stats: "Garde: 24h / Actif"
  },
  {
    id: "c2",
    name: "Youssef Elmi",
    role: "Chef de File d'Urgence",
    desc: "Pilote de crise en liaison H24 directe avec le Parquet Général et la Brigade des Mineurs de la République.",
    imageUrl: "https://picsum.photos/seed/coordcaudj/500/550",
    status: "En Service",
    stats: "Régulation de crise"
  },
  {
    id: "c3",
    name: "Faduma Farah",
    role: "Éducatrice Spécialisée",
    desc: "Gère l'apaisement affectif des petits pensionnaires et coordonne les programmes de socialisation nocturnes.",
    imageUrl: "https://picsum.photos/seed/educcaudj/500/500",
    status: "En Astreinte",
    stats: "Relais Nocturne H24"
  },
  {
    id: "c4",
    name: "Kader Ibrahim",
    role: "Juriste & Réintégrations",
    desc: "Soutient légalement les démarches judiciaires de l'association et audite la conformité des foyers d'accueil civils.",
    imageUrl: "https://picsum.photos/seed/legalcaudj/500/500",
    status: "Au Tribunal",
    stats: "Régulation Juridique"
  }
];

const defaultMediaFiles: MediaFile[] = [
  { id: "m1", name: "image_hero_accueil.jpeg", url: "/lieu_organisation.jpeg", type: "image/jpeg", size: "148 KB", dateAdded: "03/06/2026" },
  { id: "m2", name: "expertise_clinique_pediatrique.jpeg", url: "https://picsum.photos/seed/pedia_expert/600/400", type: "image/jpeg", size: "84 KB", dateAdded: "03/06/2026" },
  { id: "m3", name: "expertise_soutien_psychologique.jpeg", url: "https://picsum.photos/seed/psych_expert/600/400", type: "image/jpeg", size: "91 KB", dateAdded: "03/06/2026" },
  { id: "m4", name: "expertise_protection_juridique.jpeg", url: "https://picsum.photos/seed/legal_expert/600/400", type: "image/jpeg", size: "75 KB", dateAdded: "03/06/2026" }
];

const SiteStateContext = createContext<SiteStateContextType | undefined>(undefined);

export const SiteStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState("home");
  const [language, setLanguageState] = useState<"fr" | "ar">("fr");

  const [generalFr, setGeneralFr] = useState<GeneralConfig>(defaultGeneral);
  const [generalAr, setGeneralAr] = useState<GeneralConfig>(defaultGeneralAr);

  const [chroniquesFr, setChroniquesFr] = useState<Chronique[]>(defaultChroniques);
  const [chroniquesAr, setChroniquesAr] = useState<Chronique[]>(defaultChroniquesAr);

  const [structureFr, setStructureFr] = useState<OrganiNode[]>(defaultStructure);
  const [structureAr, setStructureAr] = useState<OrganiNode[]>(defaultStructureAr);

  const [publicationsFr, setPublicationsFr] = useState<Publication[]>(defaultPublications);
  const [publicationsAr, setPublicationsAr] = useState<Publication[]>(defaultPublicationsAr);

  const [expertisesFr, setExpertisesFr] = useState<Expertise[]>(defaultExpertises);
  const [expertisesAr, setExpertisesAr] = useState<Expertise[]>(defaultExpertisesAr);

  const [crewMembersFr, setCrewMembersFr] = useState<CrewMember[]>(defaultCrewMembers);
  const [crewMembersAr, setCrewMembersAr] = useState<CrewMember[]>(defaultCrewMembersAr);

  const [galerie, setGalerie] = useState<GalerieItem[]>(defaultGalerie);
  const [personnel, setPersonnel] = useState<StaffMember[]>(defaultPersonnel);

  const setLanguage = (lang: "fr" | "ar") => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    if (language === "ar") {
      return arDictionary[key] || key;
    }
    return key;
  };

  const general = language === "fr" ? generalFr : generalAr;
  const chroniques = language === "fr" ? chroniquesFr : chroniquesAr;
  const structure = language === "fr" ? structureFr : structureAr;
  const publications = language === "fr" ? publicationsFr : publicationsAr;
  const expertises = language === "fr" ? expertisesFr : expertisesAr;
  const crewMembers = language === "fr" ? crewMembersFr : crewMembersAr;

  const setGeneral = (valueOrFn: React.SetStateAction<GeneralConfig>) => {
    if (language === "fr") setGeneralFr(valueOrFn); else setGeneralAr(valueOrFn);
  };
  const setChroniques = (valueOrFn: React.SetStateAction<Chronique[]>) => {
    if (language === "fr") setChroniquesFr(valueOrFn); else setChroniquesAr(valueOrFn);
  };
  const setStructure = (valueOrFn: React.SetStateAction<OrganiNode[]>) => {
    if (language === "fr") setStructureFr(valueOrFn); else setStructureAr(valueOrFn);
  };
  const setPublications = (valueOrFn: React.SetStateAction<Publication[]>) => {
    if (language === "fr") setPublicationsFr(valueOrFn); else setPublicationsAr(valueOrFn);
  };
  const setExpertises = (valueOrFn: React.SetStateAction<Expertise[]>) => {
    if (language === "fr") setExpertisesFr(valueOrFn); else setExpertisesAr(valueOrFn);
  };
  const setCrewMembers = (valueOrFn: React.SetStateAction<CrewMember[]>) => {
    if (language === "fr") setCrewMembersFr(valueOrFn); else setCrewMembersAr(valueOrFn);
  };

  // New Audit Log & Media Manager states
  const defaultAuditLog: AuditLogEntry[] = [
    {
      id: "log_1",
      timestamp: "09:12:30",
      label: "Mise à jour du numéro d'urgence de garde de l'accueil",
      actionType: "text",
      date: "2026-06-03",
      user: "Omar Farah (Directeur)"
    },
    {
      id: "log_2",
      timestamp: "14:20:00",
      label: "Upload d'une nouvelle photo d'illustration d'entrevue médicale",
      actionType: "image",
      date: "2026-06-02",
      user: "Fathia Ali (Educatrice)"
    },
    {
      id: "log_3",
      timestamp: "10:05:15",
      label: "Ajout de la publication de directive judiciaire Nº 204",
      actionType: "file",
      date: "2026-06-02",
      user: "Amin Aden (Superviseur)"
    },
    {
      id: "log_4",
      timestamp: "16:45:00",
      label: "Correction grammaticale du slogan principal du héros",
      actionType: "text",
      date: "2026-06-01",
      user: "Fathia Ali (Educatrice)"
    },
    {
      id: "log_5",
      timestamp: "11:30:22",
      label: "Modification de l'adresse réglementaire du Foyer Daryel",
      actionType: "text",
      date: "2026-06-01",
      user: "Omar Farah (Directeur)"
    }
  ];

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(defaultAuditLog);
  const undoStackRef = useRef<Record<string, () => void>>({});

  const registerModification = (
    label: string, 
    actionType: "text" | "image" | "file", 
    undoFn: () => void,
    user: string = "Secrétaire d'Urgence"
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const entry: AuditLogEntry = {
      id,
      timestamp: new Date().toLocaleTimeString("fr-FR"),
      label,
      actionType,
      date: formattedDate,
      user
    };
    setAuditLog((prev) => [entry, ...prev].slice(0, 100));
    undoStackRef.current[id] = undoFn;
  };

  const undoLastAction = () => {
    if (auditLog.length === 0) return false;
    const lastEntry = auditLog[0];
    const undoFn = undoStackRef.current[lastEntry.id];
    if (undoFn) {
      try {
        undoFn();
        setAuditLog((prev) => prev.slice(1));
        delete undoStackRef.current[lastEntry.id];
        return true;
      } catch (e) {
        console.error("Undo failed:", e);
      }
    }
    return false;
  };

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const defaultAssistanceRequests: AssistanceRequest[] = [
    {
      id: "req_1",
      name: "Abdourahman Hassan",
      email: "abdo.hassan@gmail.dj",
      message: "Demande d'orientation de placement alternatif pour un mineur de 12 ans retiré du secteur insalubre du Port. Bilan de santé pédiatrique en cours au Foyer.",
      date: "03/06/2026 à 09:15",
      smsSentStatus: "success"
    },
    {
      id: "req_2",
      name: "Houmed Mohamed",
      email: "houmed.tadjourah@yahoo.com",
      message: "Signalement d'absentéisme et d'anxiété sévère d'une jeune fille suite à une rupture de tutelle parentale à Tadjourah. Nous sollicitons une évaluation psychosociale.",
      date: "02/06/2026 à 14:30",
      smsSentStatus: "success"
    }
  ];

  const [assistanceRequests, setAssistanceRequests] = useState<AssistanceRequest[]>(defaultAssistanceRequests);

  const addAssistanceRequest = (item: Omit<AssistanceRequest, "id" | "date" | "smsSentStatus">) => {
    const formattedDate = new Date().toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).replace(",", " à");

    const newRequest: AssistanceRequest = {
      ...item,
      id: "req_" + Math.random().toString(36).substring(2, 9),
      date: formattedDate,
      smsSentStatus: "success"
    };
    setAssistanceRequests((prev) => [newRequest, ...prev]);
  };

  const deleteAssistanceRequest = (id: string) => {
    setAssistanceRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const addMediaFile = (name: string, url: string, type: string, size: string) => {
    const newMedia: MediaFile = {
      id: "media_" + Math.random().toString(36).substring(2, 9),
      name,
      url,
      type,
      size,
      dateAdded: new Date().toLocaleDateString("fr-FR")
    };
    setMediaFiles((prev) => [newMedia, ...prev]);
  };

  const renameMediaFile = (id: string, newName: string) => {
    setMediaFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName } : f))
    );
  };

  const deleteMediaFile = (id: string) => {
    setMediaFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Dynamic Admin Authentication & Inline Editing States
  const [isAdminUnlocked, setIsAdminUnlockedState] = useState(false);
  const [isEditModeActive, setIsEditModeActive] = useState(true);
  const [globalEditor, setGlobalEditor] = useState<{
    label: string;
    value: string;
    onSave: (newValue: string) => void;
    onDelete?: () => void;
  } | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load from localStorage of browser carefully
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedLanguage = localStorage.getItem("daryel_language") as "fr" | "ar" | null;
        if (savedLanguage === "fr" || savedLanguage === "ar") {
          setLanguageState(savedLanguage);
        }

        const savedGeneralFr = localStorage.getItem("daryel_general_fr");
        const savedGeneralAr = localStorage.getItem("daryel_general_ar");
        const savedGeneral = localStorage.getItem("daryel_general");
        if (savedGeneralFr) setGeneralFr(JSON.parse(savedGeneralFr));
        if (savedGeneralAr) setGeneralAr(JSON.parse(savedGeneralAr));
        if (savedGeneral && !savedGeneralFr) setGeneralFr(JSON.parse(savedGeneral));

        const savedChroniquesFr = localStorage.getItem("daryel_chroniques_fr");
        const savedChroniquesAr = localStorage.getItem("daryel_chroniques_ar");
        const savedChroniques = localStorage.getItem("daryel_chroniques");
        if (savedChroniquesFr) setChroniquesFr(JSON.parse(savedChroniquesFr));
        if (savedChroniquesAr) setChroniquesAr(JSON.parse(savedChroniquesAr));
        if (savedChroniques && !savedChroniquesFr) setChroniquesFr(JSON.parse(savedChroniques));

        const savedStructureFr = localStorage.getItem("daryel_structure_fr");
        const savedStructureAr = localStorage.getItem("daryel_structure_ar");
        const savedStructure = localStorage.getItem("daryel_structure");
        if (savedStructureFr) setStructureFr(JSON.parse(savedStructureFr));
        if (savedStructureAr) setStructureAr(JSON.parse(savedStructureAr));
        if (savedStructure && !savedStructureFr) setStructureFr(JSON.parse(savedStructure));

        const savedPublicationsFr = localStorage.getItem("daryel_publications_fr");
        const savedPublicationsAr = localStorage.getItem("daryel_publications_ar");
        const savedPublications = localStorage.getItem("daryel_publications");
        if (savedPublicationsFr) setPublicationsFr(JSON.parse(savedPublicationsFr));
        if (savedPublicationsAr) setPublicationsAr(JSON.parse(savedPublicationsAr));
        if (savedPublications && !savedPublicationsFr) setPublicationsFr(JSON.parse(savedPublications));

        const savedExpertisesFr = localStorage.getItem("daryel_expertises_fr");
        const savedExpertisesAr = localStorage.getItem("daryel_expertises_ar");
        const savedExpertises = localStorage.getItem("daryel_expertises");
        if (savedExpertisesFr) setExpertisesFr(JSON.parse(savedExpertisesFr));
        if (savedExpertisesAr) setExpertisesAr(JSON.parse(savedExpertisesAr));
        if (savedExpertises && !savedExpertisesFr) setExpertisesFr(JSON.parse(savedExpertises));

        const savedCrewFr = localStorage.getItem("daryel_crew_fr");
        const savedCrewAr = localStorage.getItem("daryel_crew_ar");
        const savedCrew = localStorage.getItem("daryel_crew");
        if (savedCrewFr) setCrewMembersFr(JSON.parse(savedCrewFr));
        if (savedCrewAr) setCrewMembersAr(JSON.parse(savedCrewAr));
        if (savedCrew && !savedCrewFr) setCrewMembersFr(JSON.parse(savedCrew));

        const savedComponentGalerie = localStorage.getItem("daryel_galerie");
        const savedPersonnel = localStorage.getItem("daryel_personnel");
        const savedAdminUnlocked = sessionStorage.getItem("daryel_admin_unlocked") === "true";
        const savedDarkMode = localStorage.getItem("daryel_dark_mode") === "true";

        if (savedComponentGalerie) setGalerie(JSON.parse(savedComponentGalerie));
        if (savedPersonnel) setPersonnel(JSON.parse(savedPersonnel));

        const savedMedia = localStorage.getItem("daryel_media");
        const savedAssistance = localStorage.getItem("daryel_assistance");
        const savedAudit = localStorage.getItem("daryel_audit");

        if (savedMedia) {
          setMediaFiles(JSON.parse(savedMedia));
        } else {
          setMediaFiles(defaultMediaFiles);
        }
        if (savedAssistance) {
          setAssistanceRequests(JSON.parse(savedAssistance));
        }
        if (savedAudit) {
          setAuditLog(JSON.parse(savedAudit));
        }
        setIsAdminUnlockedState(savedAdminUnlocked);
        setIsDarkMode(savedDarkMode);
      } catch (e) {
        console.error("Killed when loading localStorage files", e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_language", language);
      if (language === "ar") {
        document.documentElement.setAttribute("dir", "rtl");
        document.documentElement.classList.add("rtl");
      } else {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.classList.remove("rtl");
      }
    }
  }, [language]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_dark_mode", isDarkMode ? "true" : "false");
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDarkMode]);

  const setIsAdminUnlocked = (unlocked: boolean) => {
    setIsAdminUnlockedState(unlocked);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("daryel_admin_unlocked", unlocked ? "true" : "false");
    }
  };

  // Save to localStorage whenever components change state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_general_fr", JSON.stringify(generalFr));
    }
  }, [generalFr]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_general_ar", JSON.stringify(generalAr));
    }
  }, [generalAr]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_chroniques_fr", JSON.stringify(chroniquesFr));
    }
  }, [chroniquesFr]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_chroniques_ar", JSON.stringify(chroniquesAr));
    }
  }, [chroniquesAr]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_galerie", JSON.stringify(galerie));
    }
  }, [galerie]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_structure_fr", JSON.stringify(structureFr));
    }
  }, [structureFr]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_structure_ar", JSON.stringify(structureAr));
    }
  }, [structureAr]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_personnel", JSON.stringify(personnel));
    }
  }, [personnel]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_publications_fr", JSON.stringify(publicationsFr));
    }
  }, [publicationsFr]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_publications_ar", JSON.stringify(publicationsAr));
    }
  }, [publicationsAr]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_expertises_fr", JSON.stringify(expertisesFr));
    }
  }, [expertisesFr]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_expertises_ar", JSON.stringify(expertisesAr));
    }
  }, [expertisesAr]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_crew_fr", JSON.stringify(crewMembersFr));
    }
  }, [crewMembersFr]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_crew_ar", JSON.stringify(crewMembersAr));
    }
  }, [crewMembersAr]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_media", JSON.stringify(mediaFiles));
    }
  }, [mediaFiles]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_assistance", JSON.stringify(assistanceRequests));
    }
  }, [assistanceRequests]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daryel_audit", JSON.stringify(auditLog));
    }
  }, [auditLog]);

  const addComment = (pubId: string, author: string, content: string) => {
    setPublications((prev) =>
      prev.map((pub) => {
        if (pub.id === pubId) {
          return {
            ...pub,
            comments: [
              ...pub.comments,
              {
                id: Math.random().toString(36).substring(2, 9),
                author,
                content,
                date: new Date().toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })
              }
            ]
          };
        }
        return pub;
      })
    );
  };

  const addGalleryItem = (item: Omit<GalerieItem, "id">) => {
    const newItem: GalerieItem = {
      ...item,
      id: "g" + Math.random().toString(36).substring(2, 9)
    };
    setGalerie((prev) => [...prev, newItem]);
  };

  const deleteGalleryItem = (id: string) => {
    setGalerie((prev) => prev.filter((item) => item.id !== id));
  };

  const addPublication = (pub: Omit<Publication, "id" | "comments"> & { id?: string }) => {
    const pubId = pub.id || "p" + Math.random().toString(36).substring(2, 9);
    const newPub: Publication = {
      ...pub,
      id: pubId,
      comments: []
    };
    setPublications((prev) => [newPub, ...prev]);
  };

  const deletePublication = (id: string) => {
    setPublications((prev) => prev.filter((pub) => pub.id !== id));
  };

  const addExpertise = (item: Omit<Expertise, "id">) => {
    const newItem: Expertise = {
      ...item,
      id: "e" + Math.random().toString(36).substring(2, 9)
    };
    setExpertises((prev) => [...prev, newItem]);
  };

  const deleteExpertise = (id: string) => {
    setExpertises((prev) => prev.filter((item) => item.id !== id));
  };

  const updateExpertise = (id: string, updated: Partial<Expertise>) => {
    setExpertises((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const addCrewMember = (item: Omit<CrewMember, "id">) => {
    const newItem: CrewMember = {
      ...item,
      id: "c" + Math.random().toString(36).substring(2, 9)
    };
    setCrewMembers((prev) => [...prev, newItem]);
  };

  const deleteCrewMember = (id: string) => {
    setCrewMembers((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCrewMember = (id: string, updated: Partial<CrewMember>) => {
    setCrewMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const resetToDefault = () => {
    setGeneralFr(defaultGeneral);
    setGeneralAr(defaultGeneralAr);
    setChroniquesFr(defaultChroniques);
    setChroniquesAr(defaultChroniquesAr);
    setStructureFr(defaultStructure);
    setStructureAr(defaultStructureAr);
    setPublicationsFr(defaultPublications);
    setPublicationsAr(defaultPublicationsAr);
    setExpertisesFr(defaultExpertises);
    setExpertisesAr(defaultExpertisesAr);
    setCrewMembersFr(defaultCrewMembers);
    setCrewMembersAr(defaultCrewMembersAr);

    setLanguageState("fr");
    setGalerie(defaultGalerie);
    setPersonnel(defaultPersonnel);

    if (typeof window !== "undefined") {
      localStorage.removeItem("daryel_language");
      localStorage.removeItem("daryel_general_fr");
      localStorage.removeItem("daryel_general_ar");
      localStorage.removeItem("daryel_chroniques_fr");
      localStorage.removeItem("daryel_chroniques_ar");
      localStorage.removeItem("daryel_structure_fr");
      localStorage.removeItem("daryel_structure_ar");
      localStorage.removeItem("daryel_publications_fr");
      localStorage.removeItem("daryel_publications_ar");
      localStorage.removeItem("daryel_expertises_fr");
      localStorage.removeItem("daryel_expertises_ar");
      localStorage.removeItem("daryel_crew_fr");
      localStorage.removeItem("daryel_crew_ar");

      localStorage.removeItem("daryel_general");
      localStorage.removeItem("daryel_chroniques");
      localStorage.removeItem("daryel_galerie");
      localStorage.removeItem("daryel_structure");
      localStorage.removeItem("daryel_personnel");
      localStorage.removeItem("daryel_publications");
      localStorage.removeItem("daryel_expertises");
      localStorage.removeItem("daryel_crew");
    }
  };

  return (
    <SiteStateContext.Provider
      value={{
        activeView,
        setActiveView,
        isDarkMode,
        setIsDarkMode,
        language,
        setLanguage,
        t,
        general,
        setGeneral,
        chroniques,
        setChroniques,
        galerie,
        setGalerie,
        structure,
        setStructure,
        personnel,
        setPersonnel,
        publications,
        setPublications,
        expertises,
        setExpertises,
        addExpertise,
        deleteExpertise,
        updateExpertise,
        crewMembers,
        setCrewMembers,
        addCrewMember,
        deleteCrewMember,
        updateCrewMember,
        addComment,
        addGalleryItem,
        deleteGalleryItem,
        addPublication,
        deletePublication,
        resetToDefault,
        auditLog,
        registerModification,
        undoLastAction,
        mediaFiles,
        addMediaFile,
        renameMediaFile,
        deleteMediaFile,
        assistanceRequests,
        addAssistanceRequest,
        deleteAssistanceRequest,
        isAdminUnlocked,
        setIsAdminUnlocked,
        isEditModeActive,
        setIsEditModeActive,
        globalEditor,
        setGlobalEditor
      }}
    >
      {children}
    </SiteStateContext.Provider>
  );
};

export const useSiteState = () => {
  const context = useContext(SiteStateContext);
  if (!context) {
    throw new Error("useSiteState must be used inside a SiteStateProvider");
  }
  return context;
};
