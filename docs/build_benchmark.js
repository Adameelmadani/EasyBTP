const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, Header, Footer,
  TableOfContents, ExternalHyperlink, TabStopType, TabStopPosition
} = require("docx");

// ---- Palette (thème EasyBTP : vert & blanc) ----
const BRAND_DARK = "0A7543";
const BRAND = "16B563";
const HEADER_FILL = "0A7543";
const ROW_ALT = "EAF7EF";
const ROW_HEAD = "Dff0E4".toUpperCase();
const GREY = "CCCCCC";
const TXT = "222222";

const CW = 9026; // largeur de contenu A4, marges 1 pouce

// ---- Helpers ----
const border = { style: BorderStyle.SINGLE, size: 1, color: GREY };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 60, bottom: 60, left: 110, right: 110 };

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 120, before: opts.before ?? 0, line: 276 },
    alignment: opts.align,
    children: Array.isArray(text) ? text : [new TextRun({ text, size: opts.size ?? 21, color: TXT, bold: opts.bold, italics: opts.italics })],
  });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 60, line: 268 },
    children: Array.isArray(text) ? text : [new TextRun({ text, size: 21, color: TXT })],
  });
}

function run(text, o = {}) {
  return new TextRun({ text, size: o.size ?? 21, bold: o.bold, italics: o.italics, color: o.color ?? TXT });
}

function headCell(text, w) {
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA }, margins: cellMargins,
    shading: { fill: HEADER_FILL, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 19 })] })],
  });
}

function cell(content, w, o = {}) {
  const paras = Array.isArray(content)
    ? content
    : [new Paragraph({ alignment: o.align, children: [new TextRun({ text: content, size: o.size ?? 19, bold: o.bold, color: o.color ?? TXT })] })];
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA }, margins: cellMargins,
    verticalAlign: VerticalAlign.CENTER,
    shading: o.fill ? { fill: o.fill, type: ShadingType.CLEAR } : undefined,
    children: paras,
  });
}

function table(widths, headers, rows, opts = {}) {
  const headRow = new TableRow({
    tableHeader: true,
    children: headers.map((hcell, i) => headCell(hcell, widths[i])),
  });
  const bodyRows = rows.map((r, ri) =>
    new TableRow({
      children: r.map((c, i) => {
        const fill = ri % 2 === 1 ? ROW_ALT : undefined;
        if (typeof c === "object" && c !== null && "text" in c) {
          return cell(c.text, widths[i], { fill, align: c.align, bold: c.bold, color: c.color, size: c.size });
        }
        return cell(String(c), widths[i], { fill, align: i === 0 ? AlignmentType.LEFT : opts.center ? AlignmentType.CENTER : AlignmentType.LEFT, bold: i === 0 && opts.boldFirst });
      }),
    })
  );
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: [headRow, ...bodyRows],
  });
}

const YES = { text: "✔", align: AlignmentType.CENTER, bold: true, color: BRAND_DARK };
const NO = { text: "✘", align: AlignmentType.CENTER, color: "B00020" };
const PART = { text: "◐", align: AlignmentType.CENTER, color: "B07A00" };

// ====================================================================
//  CONTENU
// ====================================================================
const children = [];

// ---------- PAGE DE GARDE ----------
children.push(
  new Paragraph({ spacing: { before: 1800 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BRAND, space: 8 } },
    children: [new TextRun({ text: "EasyBTP", bold: true, size: 72, color: BRAND_DARK })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 240, after: 120 },
    children: [new TextRun({ text: "Étude de Benchmarking", bold: true, size: 40, color: TXT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 600 },
    children: [new TextRun({ text: "Plateforme de suivi de chantier de construction (BTP)", italics: true, size: 26, color: "555555" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 100 },
    children: [new TextRun({ text: "Analyse comparative du marché, fonctionnalités, solutions existantes et limites", size: 22, color: TXT })],
  }),
  new Paragraph({ spacing: { before: 1400 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 60 },
    children: [new TextRun({ text: "ENSAM, Projet de Semestre 8", size: 22, bold: true, color: TXT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 60 },
    children: [new TextRun({ text: "Document établi à partir du Cahier des Prescriptions Techniques (CPT)", size: 20, color: "555555" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Juin 2026", size: 20, color: "555555" })],
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---------- SOMMAIRE ----------
children.push(
  h1("Sommaire"),
  new TableOfContents("Sommaire", { hyperlink: true, headingStyleRange: "1-2" }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---------- 1. INTRODUCTION ----------
children.push(
  h1("1. Introduction et méthodologie"),
  h2("1.1. Contexte"),
  p("Le secteur du Bâtiment et des Travaux Publics (BTP) connaît une transformation numérique profonde. Au Maroc, cette dynamique est portée par d'importants programmes d'infrastructures, Plan Maroc 2030, préparation de la Coupe du Monde 2030 (stades, autoroutes, ligne à grande vitesse, hôtellerie), qui multiplient le nombre et la complexité des chantiers à piloter. Pourtant, dans de nombreuses économies émergentes, plus de 55 % des petits entrepreneurs s'appuient encore sur des procédés manuels ou de simples tableurs pour le suivi de leurs projets."),
  p("Dans ce contexte, EasyBTP est une plateforme web de pilotage de chantier conçue à partir du Cahier des Prescriptions Techniques (CPT) du projet. Elle vise à centraliser, structurer et fluidifier le suivi de l'avancement physique et financier, la gestion documentaire, les réserves, le planning, les réunions, la finance et l'approvisionnement en matériaux."),
  h2("1.2. Objectif du benchmarking"),
  p("Ce document a pour objet de positionner EasyBTP au sein de l'offre logicielle existante. Il poursuit trois objectifs :"),
  bullet("Recenser les fonctionnalités qu'une application de suivi de chantier peut (et doit) couvrir, sur la base du CPT et des standards du marché ;"),
  bullet("Cartographier les solutions concurrentes existantes (internationales, françaises/européennes et marocaines) et décrire leurs fonctionnalités ;"),
  bullet("Identifier les problèmes et limites récurrents de ces solutions, afin de dégager les opportunités de différenciation pour EasyBTP."),
  h2("1.3. Méthodologie"),
  p("L'analyse repose sur : (i) le périmètre fonctionnel défini par le CPT du projet ; (ii) une revue documentaire des principaux éditeurs et comparatifs publics (sites éditeurs, plateformes d'avis G2, Capterra, TrustRadius, et comparatifs spécialisés BTP) ; (iii) une synthèse des retours d'usage recensés (avis utilisateurs, articles sectoriels). Les solutions ont été évaluées selon des critères communs : couverture fonctionnelle, ergonomie et adoption terrain, mobilité/hors-ligne, intégrations, adaptation au contexte local (langue, devise, réglementation) et modèle tarifaire."),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---------- 2. PERIMETRE FONCTIONNEL ----------
children.push(
  h1("2. Périmètre fonctionnel d'EasyBTP"),
  p("EasyBTP couvre l'ensemble des modules définis par le CPT. Le tableau ci-dessous récapitule les fonctionnalités que la plateforme peut contenir, regroupées par module."),
  table(
    [560, 2466, 6000],
    ["#", "Module", "Fonctionnalités couvertes"],
    [
      ["4.1", "Gestion des utilisateurs", "9 profils (Administrateur, Maître d'ouvrage, Architecte, Bureau d'études, Entreprise, Contrôle technique, Conducteur de travaux, Chef de chantier, Visiteur), rôles et permissions, authentification sécurisée, historique des connexions et journalisation."],
      ["4.2", "Gestion des projets", "Fiche projet structurée : localisation GPS, référence, adresse, surface, dates (début / fin prévisionnelle), budget, montant du marché, documents contractuels, liste des intervenants, état d'avancement."],
      ["4.3", "Tableau de bord", "Visualisation dynamique : taux d'avancement et retards, alertes et statistiques par chantier, réserves ouvertes, photos récentes, situation financière, KPIs et graphiques."],
      ["4.4", "Suivi d'avancement", "Mise à jour par lot (Gros œuvre, VRD, Électricité, Fluides, Finitions, Menuiserie, Aménagement extérieur), pourcentage d'avancement, quantités exécutées, historique et validation hiérarchique."],
      ["4.5", "Gestion documentaire (GED)", "Upload, classement par catégories (plans, PV, rapports, attachements, situations, contrats, notes techniques), gestion des versions, recherche multicritère, signature électronique, consultation mobile."],
      ["4.6", "Réserves & non-conformités", "Création de réserves, affectation à un responsable, géolocalisation, photos, suivi de traitement et levée ; statuts Ouverte / En cours / Traitée / Validée / Rejetée (vue Kanban)."],
      ["4.7", "Planning chantier", "Diagramme de Gantt, gestion des tâches et dépendances, alertes de retard, synchronisation calendrier."],
      ["4.8", "Gestion des réunions", "Planification, comptes rendus (PV), liste de présence, actions à suivre, historique des décisions."],
      ["4.9", "Gestion financière", "Situations de travaux, décomptes, attachements, suivi budgétaire, prévisions, validation des paiements."],
      ["4.10", "Photo & géolocalisation", "Photos horodatées et géolocalisées, comparaison avant/après, classement par zone, annotations."],
      ["4.11", "Approvisionnement matériaux", "Catalogue articles, demandes d'approvisionnement, base fournisseurs et évaluation, bons (commande / livraison / réception / facture), gestion des stocks (entrées/sorties, inventaire, valorisation), alertes de seuil, KPIs (rupture, délai, rotation, taux de perte)."],
    ],
    { boldFirst: false }
  ),
  p(""),
  h2("2.1. Exigences transverses et fonctionnalités avancées"),
  bullet([run("Sécurité : ", { bold: true }), run("authentification JWT/OAuth2, chiffrement SSL, gestion fine des permissions (RBAC), journalisation des actions, protection OWASP, sauvegardes automatiques.")]),
  bullet([run("Performance & scalabilité : ", { bold: true }), run("multi-projets simultanés, temps de réponse < 3 s, support d'au moins 500 utilisateurs concurrents.")]),
  bullet([run("Mobilité & hors-ligne : ", { bold: true }), run("application mobile Android/iOS, fonctionnement hors connexion, synchronisation automatique, saisie et photos terrain.")]),
  bullet([run("Ergonomie : ", { bold: true }), run("interface moderne et responsive, multilingue (français / arabe / anglais), optimisée pour le terrain.")]),
  bullet([run("Reporting : ", { bold: true }), run("génération PDF et export Excel, rapports automatiques, tableaux statistiques, historique complet.")]),
  bullet([run("Technologies avancées (cible) : ", { bold: true }), run("IA (détection des retards, analyse des photos, prévision budgétaire et des besoins en matériaux), BIM (maquette 3D, réserves sur maquette, quantités automatiques), IoT (capteurs, balances connectées, RFID).")]),
  bullet([run("Intégrations possibles : ", { bold: true }), run("BIM / AutoCAD, ERP & comptabilité, SIG, Microsoft Project & Primavera.")]),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---------- 3. PANORAMA DES SOLUTIONS ----------
children.push(
  h1("3. Panorama des solutions existantes"),
  p("Le marché des logiciels de gestion de chantier se structure en trois grandes familles : les plateformes internationales (souvent destinées aux grands donneurs d'ordre), les solutions françaises/européennes (terrain et TPE-PME) et les solutions marocaines/locales (adaptées au contexte, à la devise et à la réglementation)."),

  h2("3.1. Leaders internationaux"),

  h3("Procore"),
  p([run("Origine / cible : ", { bold: true }), run("États-Unis ; grandes entreprises générales et projets commerciaux d'envergure (> 10 M$). Solution de référence du marché.")]),
  p([run("Fonctionnalités clés : ", { bold: true }), run("plateforme tout-en-un très riche, gestion de projet, documents et plans, RFI/soumissions, qualité et sécurité, finance et budget, planning, gestion des sous-traitants, large écosystème d'intégrations.")]),
  p([run("Limites / problèmes : ", { bold: true }), run("coût très élevé et tarification opaque (devis sur volume annuel, de l'ordre de 4 500 à 10 000 $/an pour les petites structures, bien plus pour l'entreprise) ; surdimensionné pour les TPE/PME et les corps d'état spécialisés ; courbe d'apprentissage et onboarding lourds ; interface jugée parfois lente (rechargements de page, aperçu PDF limité) ; service client critiqué sur les délais.")]),

  h3("Autodesk Construction Cloud / Autodesk Build (ex-BIM 360 + PlanGrid)"),
  p([run("Origine / cible : ", { bold: true }), run("États-Unis ; firmes orientées conception-construction (design-build) et projets à forte composante BIM.")]),
  p([run("Fonctionnalités clés : ", { bold: true }), run("intégration native AutoCAD/Revit, coordination et visualisation BIM 3D, gestion documentaire et des plans, collaboration, planning, qualité ; PlanGrid et BIM 360 ont été fusionnés dans Autodesk Build.")]),
  p([run("Limites / problèmes : ", { bold: true }), run("coût d'entreprise élevé (à partir d'environ 480 $/utilisateur/an pour certains modules, devis personnalisés au global) ; complexité et mise en place plus difficiles (notes G2 d'ergonomie/installation inférieures à des outils terrain plus simples) ; pleine valeur surtout pour les organisations déjà investies dans l'écosystème Autodesk ; PlanGrid n'est plus commercialisé en tant que tel.")]),

  h3("Buildertrend"),
  p([run("Origine / cible : ", { bold: true }), run("États-Unis ; constructeurs résidentiels et petits projets commerciaux, relation client (maître d'ouvrage particulier).")]),
  p([run("Fonctionnalités clés : ", { bold: true }), run("portail client, planification, suivi des sélections, communication, suivi financier et facturation ; expérience intuitive orientée maître d'ouvrage.")]),
  p([run("Limites / problèmes : ", { bold: true }), run("abonnement élevé (de l'ordre de 449 à 499 $/mois) ; pensé pour le résidentiel, moins adapté aux grands chantiers d'infrastructure ou aux logiques de marché public ; couverture BIM/coordination limitée.")]),

  h3("Fieldwire (by Hilti)"),
  p([run("Origine / cible : ", { bold: true }), run("États-Unis ; équipes terrain, conducteurs de travaux et chefs de chantier.")]),
  p([run("Fonctionnalités clés : ", { bold: true }), run("consultation de plans, gestion des tâches et punch lists (réserves), rapports, RFI et ordres de changement, visualisation de modèles 3D, mode hors-ligne fiable ; réputé pour sa simplicité (très bonnes notes d'ergonomie).")]),
  p([run("Limites / problèmes : ", { bold: true }), run("centré sur l'exécution terrain, couverture plus faible de la finance, de la comptabilité et de l'ERP ; nécessite souvent d'être complété par d'autres outils pour le pilotage global de l'entreprise.")]),

  h2("3.2. Solutions françaises et européennes"),

  h3("Finalcad"),
  p([run("Cible : ", { bold: true }), run("entreprises de construction, suivi terrain et qualité.")]),
  p([run("Points forts : ", { bold: true }), run("application mobile orientée terrain, gestion des non-conformités, documentation, rapports personnalisés, workflows configurables, mode hors-ligne, forte dimension collaborative.")]),
  p([run("Limites : ", { bold: true }), run("centré sur le suivi terrain/qualité ; couverture plus partielle de la finance, des achats/approvisionnement et de la planification avancée ; orienté projets et acteurs de taille importante.")]),

  h3("Alobees"),
  p([run("Cible : ", { bold: true }), run("PME du BTP, planification des équipes et suivi multi-chantiers.")]),
  p([run("Points forts : ", { bold: true }), run("affectation et planification des tâches/équipes, vues synthétiques de supervision multi-projets, génération de rapports.")]),
  p([run("Limites : ", { bold: true }), run("positionnement principalement planning/suivi d'équipes ; modules financiers, GED et approvisionnement moins approfondis.")]),

  h3("Vertuoza"),
  p([run("Cible : ", { bold: true }), run("professionnels du BTP (gros œuvre, menuiserie, chauffage, électricité...), de la demande à la livraison.")]),
  p([run("Points forts : ", { bold: true }), run("interface unique de gestion d'entreprise, optimisation des marges en temps réel, maîtrise des coûts et des imprévus.")]),
  p([run("Limites : ", { bold: true }), run("orientée gestion d'entreprise/rentabilité ; coordination BIM et fonctionnalités avancées (IA, IoT) limitées.")]),

  h3("Graneet"),
  p([run("Cible : ", { bold: true }), run("PME du BTP, pilotage financier et rentabilité.")]),
  p([run("Points forts : ", { bold: true }), run("suivi des marges par chantier (budget, commandes, factures, encaissements), pointage des heures simplifié, facturation de situation et avancement automatisé.")]),
  p([run("Limites : ", { bold: true }), run("expert du volet financier/administratif, suivi terrain (réserves, photos géolocalisées), planning Gantt et BIM peu ou pas couverts.")]),

  h3("Archipad"),
  p([run("Cible : ", { bold: true }), run("architectes, bureaux de contrôle et maîtrise d'œuvre ; suivi terrain sur tablette.")]),
  p([run("Points forts : ", { bold: true }), run("constats et réserves sur plans, PV de réception, rapports automatisés, usage hors-ligne sur iPad.")]),
  p([run("Limites : ", { bold: true }), run("spécialisé réserves/réception ; pas une plateforme de pilotage global (finance, approvisionnement, planning d'entreprise).")]),

  h2("3.3. Solutions marocaines et locales"),
  p("Ces solutions présentent l'avantage d'être pensées pour le contexte local : facturation en dirhams (MAD), conformité réglementaire, et parfois support de la langue arabe."),

  h3("MarocBTP"),
  p([run("Cible : ", { bold: true }), run("professionnels du BTP au Maroc ; application « 100 % marocaine ».")]),
  p([run("Points forts : ", { bold: true }), run("gestion en MAD, fonctionnalités intuitives, tarification accessible et lisible (formules Starter ~200 DH/mois pour 5 chantiers, Business ~400 DH/mois pour 15, Premium ~1 000 DH/mois pour 50).")]),
  p([run("Limites : ", { bold: true }), run("périmètre plus restreint que les leaders internationaux ; coordination BIM, IA et intégrations avancées limitées.")]),

  h3("EBP Bâtiment (Édition Maroc)"),
  p([run("Cible : ", { bold: true }), run("entreprises marocaines du bâtiment ; gestion devis/facturation et suivi de chantier.")]),
  p([run("Points forts : ", { bold: true }), run("chiffrage des devis, facturation personnalisée, suivi de chantier, solution localisée et bien implantée.")]),
  p([run("Limites : ", { bold: true }), run("logique d'abord comptable/devis-facture ; collaboration terrain, réserves géolocalisées et BIM peu couverts ; application historiquement orientée poste de travail.")]),

  h3("Sage Batigest / ERP (Odoo, etc.)"),
  p([run("Cible : ", { bold: true }), run("PME et ETI ; gestion intégrée (devis, achats, comptabilité, RH).")]),
  p([run("Points forts : ", { bold: true }), run("couverture ERP large et intégration comptable/financière, adaptable via intégrateurs locaux.")]),
  p([run("Limites : ", { bold: true }), run("coût et durée d'intégration élevés (un déploiement Odoo pour une ETI peut atteindre 400 000 à 800 000 DH la première année) ; ergonomie terrain et mobilité moins natives ; projet d'intégration lourd.")]),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---------- 4. TABLEAU COMPARATIF ----------
children.push(
  h1("4. Tableau comparatif"),
  h2("4.1. Synthèse des solutions"),
  table(
    [1650, 1900, 2700, 2776],
    ["Solution", "Origine / cible", "Points forts", "Limites principales"],
    [
      ["Procore", "USA, grands GC", "Tout-en-un, riche, écosystème", "Très cher, opaque, lourd, complexe"],
      ["Autodesk Build", "USA, BIM / design-build", "BIM 3D, AutoCAD/Revit natif", "Coûteux, complexe, écosystème Autodesk"],
      ["Buildertrend", "USA, résidentiel", "Portail client, simple", "Cher, peu adapté infrastructure"],
      ["Fieldwire", "USA, terrain", "Ergonomie, hors-ligne, plans", "Faible sur finance/ERP"],
      ["Finalcad", "France, terrain/qualité", "Mobile, NC, workflows", "Finance/achats partiels"],
      ["Vertuoza", "Belgique/FR, PME", "Marges temps réel, gestion globale", "BIM/IA limités"],
      ["Graneet", "France, PME finance", "Rentabilité, facturation situation", "Terrain/planning/BIM faibles"],
      ["Archipad", "France, MOE/contrôle", "Réserves sur plans, PV", "Spécialisé réception"],
      ["MarocBTP", "Maroc, TPE/PME", "MAD, prix accessible, local", "Périmètre restreint, pas de BIM/IA"],
      ["EBP Maroc", "Maroc, bâtiment", "Devis/facture, localisé", "Orienté compta, terrain limité"],
      [{ text: "EasyBTP", bold: true, color: BRAND_DARK }, { text: "Maroc, académique", bold: true }, { text: "11 modules CPT, multilingue FR/AR/EN, MAD, approvisionnement complet", bold: true }, { text: "Projet académique : BIM/IA/IoT en cible", bold: true }],
    ]
  ),
  p(""),
  h2("4.2. Matrice fonctionnelle"),
  p("Couverture par module : ✔ couvert · ◐ partiel · ✘ absent ou non natif. (Lecture indicative, synthétisée à partir des positionnements éditeurs.)"),
  table(
    [2426, 1100, 1200, 1100, 1100, 1100, 1000],
    ["Module / critère", "Procore", "Autodesk", "Finalcad", "Graneet", "MarocBTP", "EasyBTP"],
    [
      [{ text: "Suivi d'avancement par lot" }, YES, YES, YES, PART, YES, YES],
      [{ text: "Réserves / non-conformités" }, YES, YES, YES, NO, PART, YES],
      [{ text: "Gestion documentaire (GED)" }, YES, YES, YES, PART, PART, YES],
      [{ text: "Planning / Gantt" }, YES, YES, PART, NO, PART, YES],
      [{ text: "Réunions / PV" }, YES, PART, YES, NO, NO, YES],
      [{ text: "Gestion financière" }, YES, PART, PART, YES, YES, YES],
      [{ text: "Photo géolocalisée" }, YES, YES, YES, NO, PART, YES],
      [{ text: "Approvisionnement / stock" }, PART, PART, NO, PART, PART, YES],
      [{ text: "BIM 3D" }, PART, YES, PART, NO, NO, PART],
      [{ text: "IA / prédictif" }, PART, PART, PART, NO, NO, PART],
      [{ text: "Mobile / hors-ligne" }, YES, YES, YES, PART, PART, PART],
      [{ text: "Multilingue FR/AR" }, NO, NO, PART, NO, PART, YES],
      [{ text: "Devise MAD / local" }, NO, NO, NO, NO, YES, YES],
      [{ text: "Tarif accessible TPE/PME" }, NO, NO, PART, YES, YES, YES],
    ],
    { center: true }
  ),
  p("Note : pour EasyBTP, les modules BIM, IA et le hors-ligne complet relèvent de la cible (phases 2-3 du CPT) ; le périmètre métier (modules 4.1 à 4.11) est, lui, couvert par le projet.", { italics: true, size: 18 }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---------- 5. PROBLEMES COMMUNS ----------
children.push(
  h1("5. Problèmes et limites communs des solutions existantes"),
  p("Au-delà des spécificités de chaque produit, la revue fait ressortir des problèmes récurrents qui freinent l'adoption des logiciels de gestion de chantier, autant d'axes d'opportunité pour EasyBTP."),
  h3("5.1. Coût élevé et tarification opaque"),
  p("Les plateformes leaders pratiquent des tarifs sur devis, indexés sur le volume d'affaires, souvent prohibitifs pour les TPE/PME (plusieurs milliers à dizaines de milliers de dollars par an). L'absence de grille publique complique la décision et l'onboarding est fréquemment facturé."),
  h3("5.2. Complexité et surdimensionnement"),
  p("Très riches, ces outils sont souvent surdimensionnés pour les petites structures ou les corps d'état spécialisés. La courbe d'apprentissage est raide et la valeur n'est atteinte qu'au prix d'un paramétrage important."),
  h3("5.3. Faible adoption terrain"),
  p("Les équipes non techniques (ouvriers, chefs de chantier, sous-traitants) peinent à s'approprier des interfaces complexes. Quand l'outil devient plus contraignant qu'utile, son usage s'effrite : c'est l'un des premiers facteurs d'échec des déploiements."),
  h3("5.4. Intégration et interopérabilité"),
  p("La cohabitation avec les systèmes existants (comptabilité, ERP, outils des architectes/BET) reste un point dur. Les incompatibilités entre solutions des différents intervenants fragmentent la donnée et compliquent la collaboration ; la sécurité et l'intégration au legacy sont des préoccupations majeures."),
  h3("5.5. Mobilité et mode hors-ligne insuffisants"),
  p("Sur chantier, la connectivité est souvent mauvaise. Un mode hors-ligne robuste avec synchronisation reste un différenciateur fort que toutes les solutions ne maîtrisent pas également."),
  h3("5.6. Faible adaptation au contexte local"),
  p("Les leaders internationaux ne sont pas pensés pour le marché marocain : pas de devise MAD native, absence de langue arabe, réglementation et modèles de marché (situations, attachements, décomptes) éloignés des pratiques locales. Les solutions locales, plus adaptées, offrent en revanche une couverture fonctionnelle plus étroite."),
  h3("5.7. Spécialisation excessive"),
  p("Beaucoup d'outils excellent sur un seul axe (Graneet = finance, Archipad = réserves, Fieldwire = terrain), obligeant les entreprises à empiler plusieurs logiciels, au prix de coûts et de ruptures de données supplémentaires."),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---------- 6. POSITIONNEMENT ----------
children.push(
  h1("6. Positionnement et opportunités pour EasyBTP"),
  p("Face à ce paysage, EasyBTP se positionne comme une plateforme intégrée, accessible et adaptée au contexte local, couvrant l'ensemble du cycle de vie du chantier défini par le CPT."),
  h2("6.1. Facteurs de différenciation"),
  bullet([run("Couverture tout-en-un : ", { bold: true }), run("les 11 modules du CPT (du suivi terrain à l'approvisionnement et la finance) dans une seule plateforme, là où le marché impose souvent d'empiler plusieurs outils.")]),
  bullet([run("Approvisionnement matériaux complet : ", { bold: true }), run("catalogue, demandes, fournisseurs, bons, stock et valorisation, alertes de seuil et KPIs, un module rarement aussi abouti chez les solutions terrain.")]),
  bullet([run("Adaptation locale : ", { bold: true }), run("multilingue français / arabe / anglais, devise MAD, logique de situations/attachements conforme aux pratiques marocaines.")]),
  bullet([run("Accessibilité : ", { bold: true }), run("alternative open/académique sans tarification opaque, pensée pour les TPE/PME éligibles aux aides à la digitalisation (ex. programme MOWAKABA).")]),
  bullet([run("Expérience moderne : ", { bold: true }), run("interface glassmorphism responsive (thème blanc & vert), simple et optimisée pour le terrain, gestion multi-rôles (9 profils) et multi-projets.")]),
  h2("6.2. Analyse SWOT synthétique"),
  table(
    [4513, 4513],
    ["Forces", "Faiblesses"],
    [
      [
        { text: "• Périmètre fonctionnel complet (11 modules)\n• Adaptation locale (langue, MAD)\n• Architecture moderne (React/Node/PostgreSQL)\n• Coût d'accès faible" },
        { text: "• Projet académique (maturité, support)\n• BIM/IA/IoT encore à l'état de cible\n• Mobile natif & hors-ligne à consolider\n• Écosystème d'intégrations limité" },
      ],
      [
        { text: "Opportunités", bold: true, color: BRAND_DARK },
        { text: "Menaces", bold: true, color: "B00020" },
      ],
      [
        { text: "• Grands chantiers Maroc 2030 / Mondial 2030\n• Digitalisation des TPE/PME (aides publiques)\n• Faible adaptation locale des leaders\n• Marché encore peu équipé" },
        { text: "• Concurrents établis et financés\n• Solutions locales déjà implantées (MarocBTP, EBP)\n• Résistance au changement sur le terrain\n• Exigences de sécurité/maintenance" },
      ],
    ]
  ),
  p(""),
  h2("6.3. Recommandations"),
  bullet("Conserver une logique de MVP simple et robuste (projets, suivi, photos, réserves, dashboard) avant d'enrichir."),
  bullet("Prioriser l'ergonomie et l'adoption terrain : application mobile très simple et mode hors-ligne fiable."),
  bullet("Capitaliser sur l'adaptation locale (FR/AR/EN, MAD, marché public) comme principal avantage face aux leaders internationaux."),
  bullet("Préparer l'ouverture aux intégrations (comptabilité/ERP, BIM) pour lever un frein d'adoption majeur."),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---------- 7. CONCLUSION ----------
children.push(
  h1("7. Conclusion"),
  p("Le marché de la gestion de chantier est mûr mais segmenté : les leaders internationaux (Procore, Autodesk) offrent une couverture très large au prix d'une complexité et d'un coût élevés, peu adaptés aux TPE/PME et au contexte marocain ; les solutions françaises (Finalcad, Graneet, Archipad, Vertuoza, Alobees) sont efficaces mais souvent spécialisées sur un axe ; les solutions locales (MarocBTP, EBP) sont accessibles et adaptées, mais d'un périmètre plus restreint."),
  p("EasyBTP trouve sa place à l'intersection de ces trois familles : une plateforme intégrée couvrant les 11 modules du CPT, pensée pour le contexte local (multilingue, MAD), accessible et moderne. Les principaux chantiers de consolidation, mobilité hors-ligne, intégrations et technologies avancées (BIM/IA/IoT), constituent la feuille de route naturelle des phases ultérieures du projet."),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---------- 8. REFERENCES ----------
function ref(label, url) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { after: 70, line: 264 },
    children: [
      run(label + ", ", {}),
      new ExternalHyperlink({ children: [new TextRun({ text: url, style: "Hyperlink", size: 18 })], link: url }),
    ],
  });
}
children.push(
  h1("8. Références"),
  p("Comparatifs, avis utilisateurs et documentation éditeurs consultés (juin 2026) :", { size: 20 }),
  ref("Best Construction Management Software 2026 (comparatif Procore/Buildertrend/Autodesk)", "https://www.fuzen.io/posts/best-construction-management-software"),
  ref("Autodesk vs Procore, comparatif éditeur", "https://construction.autodesk.com/compare/autodesk-vs-procore-construction-software/"),
  ref("Procore, avis et limites (G2)", "https://www.g2.com/products/procore/reviews"),
  ref("Procore, features, pricing and limitations", "https://www.constructionbase.ai/blog/procore-features-pricing-and-limitations-explained"),
  ref("PlanGrid / Autodesk Build, avis et migration", "https://constructable.ai/blog/plangrid-reviews-pricing-alternatives"),
  ref("BIM 360 vs Fieldwire, coût et ergonomie", "https://www.itqlick.com/compare/bim-360/fieldwire"),
  ref("Top 20 des logiciels de suivi de chantier (Vertuoza)", "https://www.vertuoza.com/fr-fr/blog/meilleurs-logiciels-de-suivi-de-chantier"),
  ref("Meilleurs logiciels de suivi de chantier (Archipad)", "https://archipad.com/fr/meilleur-logiciel-suivi-de-chantier/"),
  ref("Barrières à l'adoption des logiciels de construction (Civalgo)", "https://www.civalgo.com/en/blog/construction-software-adoption-barriers"),
  ref("Défis d'adoption et user buy-in (Wunderbuild)", "https://www.wunderbuild.com/blog/encouraging-user-adoption-for-your-construction-software-how-to-get-buy-in-from-site-workers-and-subcontractors"),
  ref("Logiciel gestion BTP Maroc, solutions et prix (Oasis Techno Cloud)", "https://oasistechnocloud.com/blog/logiciel-gestion-btp-maroc/"),
  ref("MarocBTP, solution marocaine de gestion de chantier", "https://www.marocbtp.com/"),
  ref("EBP Bâtiment, Édition Maroc", "https://www.ebp.ma/logiciel-devis-facture-batiment/batiment-maroc"),
);

// ====================================================================
//  DOCUMENT
// ====================================================================
const doc = new Document({
  creator: "EasyBTP, ENSAM S8",
  title: "EasyBTP, Étude de Benchmarking",
  description: "Benchmarking des solutions de suivi de chantier BTP",
  styles: {
    default: { document: { run: { font: "Calibri", size: 21, color: TXT } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Calibri", color: BRAND_DARK },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND, space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 25, bold: true, font: "Calibri", color: BRAND_DARK },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Calibri", color: "333333" },
        paragraph: { spacing: { before: 140, after: 60 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 280 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 280 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GREY, space: 4 } },
        children: [new TextRun({ text: "EasyBTP, Étude de Benchmarking", size: 16, color: "888888" })],
      })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: GREY, space: 4 } },
        children: [
          new TextRun({ text: "ENSAM S8, Projet EasyBTP", size: 16, color: "888888" }),
          new TextRun({ text: "\tPage ", size: 16, color: "888888" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "888888" }),
          new TextRun({ text: " / ", size: 16, color: "888888" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: "888888" }),
        ],
      })] }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("D:/ENSAM/ENSAM S8/EasyBTP/docs/Benchmarking_EasyBTP.docx", buffer);
  console.log("OK: Benchmarking_EasyBTP.docx généré");
});
