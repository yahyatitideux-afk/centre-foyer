import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("La clé d'API GEMINI_API_KEY est requise mais manquante dans l'environnement");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
Tu es l'Assistant Intelligent de Garde du Centre d'Accueil et d'Urgence (CAU) de Djibouti - Foyer Daryel.
Portail d'orientation et de secours agréé par la Brigade des Mineurs.

DIRECTIVES COMPORTEMENTALES STRICTES :
1. TON DE VOIX : Reste extrêmement calme, sérieux, rassurant, professionnel et conforme à la déontologie légale et judiciaire.
2. RECOURS EXCLUSIF À L'AIDE : Dirige toujours les citoyens vers l'appel d'urgence au +253 21 35 12 12 ou +253 77 81 44 44 si la situation clinique de l'enfant est immédiatement préoccupante (maltraitances physiques sévères, coup et blessures actuels).
3. EXPLICATION DES ÉTAPES :
   - Étape 1 : Signalement au Parquet ou Brigade des mineurs (H24). Le placement d'un enfant requiert une décision d'urgence du magistrat.
   - Étape 2 : Accueil clinique et hospitalier immédiat au Foyer Daryel (Pédiatrie de secours sous 2h).
   - Étape 3 : Instruction et rapports d'enquêtes sociales menés activement (15 à 30 jours) pour identifier la famille élargie ou de confiance.
   - Étape 4 : Sortie statutaire pérenne : transition vers une intégration contrôlée ou transfert de longue durée prononcé par ordonnance du Juge des enfants.
4. PROTECTION DES DONNÉES : Ne demande jamais d'informations nominatives ou sensibles d'enfants directement dans le chat. Demande de se déplacer au Foyer Daryel ou de téléphoner de manière sécurisée.
5. RESTRICTIONS GÉOGRAPHIQUES : Tu n'interviens qu'au sujet de la juridiction de la République de Djibouti.
6. LANGUE : Réponds toujours de façon claire, polie et concise en français ou somali/afar selon la formulation de l'usager.
`.trim();

function getFallbackFaq(lowercaseText: string): string | null {
  if (lowercaseText.includes("signaler") || lowercaseText.includes("maltrait") || lowercaseText.includes("viol") || lowercaseText.includes("abus")) {
    return "Pour signaler un enfant maltraité à Djibouti :\n\n📞 **Téléphone d'urgence (H24) :** Contactez immédiatement la Brigade des Mineurs de la Police Nationale au **+253 21 35 12 12** ou composez le **17**.\n\n⚖️ **Signalement légal :** Vous pouvez également effectuer une déclaration auprès du Parquet (Procureur de la République) au Palais de Justice.\n\n⚠️ **Urgence Vitale :** Si l'enfant présente des blessures physiques graves ou est en danger immédiat, emmenez-le ou orientez-le vers le service d'urgence pédiatrique de l'hôpital le plus proche, le Foyer Daryel pourra ensuite assurer sa prise en charge d'urgence sous 2 heures après accord des autorités.";
  }
  if (lowercaseText.includes("condition") || lowercaseText.includes("garde") || lowercaseText.includes("admiss") || lowercaseText.includes("accueil") || lowercaseText.includes("urgen")) {
    return "Le Foyer Daryel applique des conditions strictes pour la mise à l'abri d'un mineur :\n\n🛡️ **Garantie Légale :** L'admission d'un enfant nécessite obligatoirement soit un signalement officiel de la Brigade des Mineurs, soit une décision ou ordonnance du Procureur de la République.\n\n🏥 **Examen médical initial :** Dès l'admission, un contrôle pédiatrique et clinique complet est réalisé sous 2 heures pour soigner les blessures visibles et stabiliser l'état psycho-affectif.\n\n🏠 **Hébergement sécurisé :** Le foyer offre un toit sûr, une alimentation saine et fortifiée, ainsi qu'un encadrement par des éducateurs spécialisés.";
  }
  if (lowercaseText.includes("procureur") || lowercaseText.includes("juge") || lowercaseText.includes("magistrat") || lowercaseText.includes("tribunal") || lowercaseText.includes("justice")) {
    return "Le Procureur de la République joue un rôle central dans le processus d'accueil et de placement :\n\n⚖️ **Autorité de décision :** C'est le magistrat du Parquet qui décide en urgence du placement provisoire de l'enfant au Foyer Daryel après enquête de la Brigade des Mineurs.\n\n📊 **Instruction du dossier & Enquêtes sociales :** Durant la période d'observation (15 à 30 jours), le procureur instruit le dossier et coordonne nos enquêtes psychosociales afin de rechercher la famille élargie ou une famille de confiance.\n\n👩‍⚖️ **Saisine du Juge :** Si aucune solution familiale sécurisée n'est identifiée, le Procureur saisit le Juge des enfants qui prononcera par ordonnance un placement de plus longue durée ou une réorientation statutaire pérenne.";
  }
  if (lowercaseText.includes("mission") || lowercaseText.includes("rôle") || lowercaseText.includes("que fait") || lowercaseText.includes("but") || lowercaseText.includes("objectif")) {
    return "Le Centre d'Accueil et d'Urgence (CAU) Daryel de Djibouti mène 3 grandes missions :\n\n1️⃣ **Sauvetage & Hébergement d'urgence (H24) :** Retrait immédiat des mineurs d'un environnement nocif pour leur offrir un abri, des repas équilibrés et des vêtements adaptés.\n\n2️⃣ **Réhabilitation Psycho-Affective :** Prise en charge psychoclinique quotidienne et ateliers pour aider l'enfant à surmonter ses traumatismes.\n\n3️⃣ **Enquêtes psychosociales & Support juridique :** Collaboration permanente avec les autorités judiciaires pour préparer l'avenir de l'enfant (réintégration sécurisée ou placement à long terme).";
  }
  if (lowercaseText.includes("contact") || lowercaseText.includes("téléphone") || lowercaseText.includes("numéro") || lowercaseText.includes("joindre") || lowercaseText.includes("mail") || lowercaseText.includes("courriel")) {
    return "Vous pouvez contacter le Foyer Daryel par les canaux officiels suivants :\n\n📞 **Ligne de Garde Administrative / Urgence :** +253 21 35 12 12\n\n✉️ **E-mail officiel :** contact@foyer-daryel.dj\n\n📌 **Situation géographique :** Secteur protégé, Djibouti-Ville (République de Djibouti).\n\n*Pour toute urgence vitale concernant un enfant en danger immédiat, composez directement le 17 pour joindre la Police ou Brigade des mineurs.*";
  }
  if (lowercaseText.includes("adresse") || lowercaseText.includes("situé") || lowercaseText.includes("localiser") || lowercaseText.includes("ville") || lowercaseText.includes("géograph")) {
    return "Le Foyer Daryel est situé dans un **secteur sécurisé et protégé de Djibouti-Ville** pour préserver la sécurité physique et l'anonymat des enfants admis. Pour des raisons évidentes de protection des mineurs, l'accès complet et les visites nécessitent une autorisation écrite rigoureuse du Parquet ou d'une autorité policière agréée. Pour tout rendez-vous administratif, merci de nous contacter d'abord par téléphone au **+253 21 35 12 12**.";
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, sentiment } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Le format des messages est invalide" }, { status: 400 });
    }

    const userPrompt = messages[messages.length - 1]?.content || "Bonjour";
    const lowercaseText = userPrompt.toLowerCase().trim();

    // Determine custom system instruction with adaptive empathy tone
    let customInstruction = SYSTEM_INSTRUCTION;
    if (sentiment === "distressed") {
      customInstruction += "\n\n⚠️ ALERTE SENTIMENT DE DÉTRESSE : L'interlocuteur exprime de l'angoisse, de la détresse, de l'urgence ou relate des maltraitances. Tu dois COMMENCER ton message par une courte phrase extrêmement compatissante, chaleureuse et réconfortante (par exemple, exprimer que sa voix est entendue, qu'on est là pour lui, et qu'il est en sécurité pour s'exprimer). Adapte ton vocabulaire pour être d'une empathie sans faille tout en restant extrêmement fidèle aux numéros d'urgence de la Brigade des Mineurs de Djibouti (+253 21 35 12 12) et du foyer.";
    } else if (sentiment === "grateful") {
      customInstruction += "\n\n🌟 ALERTE SENTIMENT DE RECONNAISSANCE : L'utilisateur est reconnaissant ou positif. Sois poli, encourageant, remercie-le chaleureusement et réaffirme noblement la mission du Foyer Daryel.";
    }

    // Lazy initialization of chemical safety check of API key
    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      console.error("Gemini initialization failure", err);
      
      // Attempt local FAQ resolution on server fallback when API key is missing
      let fallbackAnswer = getFallbackFaq(lowercaseText);
      if (fallbackAnswer) {
        if (sentiment === "distressed") {
          fallbackAnswer = "💔 **Soutien Empathique :** *Je perçois beaucoup de stress ou de souffrance dans votre message. Sachez que le Foyer Daryel de Djibouti est un lieu d'écoute et de refuge entièrement sécurisé. Nous sommes à vos côtés pour traverser cette épreuve. Voici la procédure à suivre :*\n\n" + fallbackAnswer;
        } else if (sentiment === "grateful") {
          fallbackAnswer = "✨ **Gratitude :** *Un grand merci pour vos encouragements bienveillants ! C'est un honneur de servir la protection des mineurs à Djibouti.*\n\n" + fallbackAnswer;
        }
        return NextResponse.json({ text: fallbackAnswer });
      }

      // Default safe response
      let defaultText = "Bonjour. Je suis l'assistant de garde du Foyer Daryel.";
      if (sentiment === "distressed") {
        defaultText = "💔 **Soutien Empathique :** *Je ressens l'urgence de votre situation. S'il s'agit d'un enfant en détresse immédiate, s'il vous plaît composez le +253 21 35 12 12 immédiatement.*";
      } else {
        defaultText = "Bonjour. Je suis l'assistant de garde du Foyer Daryel. Notre intelligence de conseil n'est pas encore activée en production, veuillez appeler directement notre cellule de garde d'urgence au +253 21 35 12 12 ou interroger une des questions d'orientation prédéfinies.";
      }
      return NextResponse.json({ text: defaultText });
    }

    // Attempt local FAQ triage first for speed and precision
    let directFaq = getFallbackFaq(lowercaseText);
    if (directFaq) {
      if (sentiment === "distressed") {
        directFaq = "💔 **Soutien Empathique :** *Je comprends tout à fait la sensibilité ou le stress de votre demande. Au Foyer Daryel, la sécurité et la confidentialité sont notre priorité absolue. Nous sommes là pour vous aider :*\n\n" + directFaq;
      } else if (sentiment === "grateful") {
        directFaq = "✨ **Gratitude :** *Merci du fond du cœur pour votre message chaleureux. Votre soutien donne de la force à nos équipes :*\n\n" + directFaq;
      }
      return NextResponse.json({ text: directFaq });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: customInstruction,
        temperature: 0.7
      }
    });

    const botResponseText = response.text || "Pardon, je n'ai pas pu compiler de réponse pour le moment.";

    return NextResponse.json({ text: botResponseText });
  } catch (e: any) {
    console.error("General API Failure in chat routing loop", e);
    return NextResponse.json(
      { error: "Échec du serveur de traitement de secours", details: e?.message },
      { status: 500 }
    );
  }
}
