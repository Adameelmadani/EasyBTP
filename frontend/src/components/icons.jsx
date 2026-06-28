/**
 * Jeu d'icônes maison "VaiBTP" — dessinées à la main (chantier / BTP).
 * Pas de bibliothèque externe. SVG inline (sans xmlns), trait = currentColor,
 * donc les icônes héritent de la couleur du texte (blanc sur tuiles, etc.).
 */

function Svg({ size = 22, strokeWidth = 1.7, children, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* Casque de chantier */
export const HardHat = (p) => (
  <Svg {...p}>
    <path d="M3 18h18" />
    <path d="M5 18a7 7 0 0 1 14 0" />
    <path d="M12 4v4" />
    <path d="M9.2 8.3a7 7 0 0 1 5.6 0" />
  </Svg>
);

/* Flèches */
export const ArrowRight = (p) => (
  <Svg {...p}>
    <path d="M4 12h15" />
    <path d="M13 6l6 6-6 6" />
  </Svg>
);
export const ArrowUpRight = (p) => (
  <Svg {...p}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </Svg>
);

/* Panneau d'avertissement (réserves / non-conformités) */
export const Warning = (p) => (
  <Svg {...p}>
    <path d="M12 4 2.5 20h19L12 4Z" />
    <path d="M12 10v4.5" />
    <path d="M12 17.6h.01" />
  </Svg>
);

/* Tableau de bord (modules) */
export const Dashboard = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="8" height="9" rx="1.5" />
    <rect x="3" y="15" width="8" height="6" rx="1.5" />
    <rect x="13" y="3" width="8" height="6" rx="1.5" />
    <rect x="13" y="12" width="8" height="9" rx="1.5" />
  </Svg>
);

/* Presse-papiers (avancement) */
export const ClipboardList = (p) => (
  <Svg {...p}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <rect x="9" y="2.5" width="6" height="3.2" rx="1" />
    <path d="M9 11h6" />
    <path d="M9 15h4" />
  </Svg>
);

/* Appareil photo (photos & géoloc) */
export const Camera = (p) => (
  <Svg {...p}>
    <path d="M4.5 7H7l1.3-2h7.4L17 7h2.5A1.5 1.5 0 0 1 21 8.5V18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V8.5A1.5 1.5 0 0 1 4.5 7Z" />
    <circle cx="12" cy="13" r="3.2" />
  </Svg>
);

/* Plan / document (gestion documentaire) */
export const Plan = (p) => (
  <Svg {...p}>
    <path d="M7 3h7l4.5 4.5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M14 3v4.5h4.5" />
    <path d="M8.5 13h7" />
    <path d="M8.5 16.5h7" />
  </Svg>
);

/* Calendrier / planning (allure Gantt) */
export const Calendar = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9.5h18" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
    <path d="M7 13h6" />
    <path d="M10 17h6" />
  </Svg>
);

/* Pièces empilées (finance / MAD) */
export const Coins = (p) => (
  <Svg {...p}>
    <ellipse cx="12" cy="6" rx="6.5" ry="2.6" />
    <path d="M5.5 6v5c0 1.4 2.9 2.6 6.5 2.6S18.5 12.4 18.5 11V6" />
    <path d="M5.5 11v5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6v-5" />
  </Svg>
);

/* Briques (matériaux) */
export const Bricks = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="M3 12h18" />
    <path d="M11 5v7" />
    <path d="M7 12v7" />
    <path d="M15 12v7" />
  </Svg>
);

/* Palette de stockage (stock) */
export const Pallet = (p) => (
  <Svg {...p}>
    <rect x="6" y="5" width="12" height="8" rx="0.5" />
    <path d="M12 5v8" />
    <path d="M4 16.5h16" />
    <path d="M4 20h16" />
    <path d="M6 16.5V20" />
    <path d="M12 16.5V20" />
    <path d="M18 16.5V20" />
  </Svg>
);

/* Intervenants (utilisateurs) */
export const Users = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6" />
    <path d="M17.5 14.2A6.5 6.5 0 0 1 21.5 20" />
  </Svg>
);

/* Bouclier (sécurité) */
export const Shield = (p) => (
  <Svg {...p}>
    <path d="M12 3 5 6v5.5c0 4.3 3 7.3 7 8.5 4-1.2 7-4.2 7-8.5V6Z" />
    <path d="M9 11.5l2 2 4-4" />
  </Svg>
);

/* Activité (journal) */
export const Activity = (p) => (
  <Svg {...p}>
    <path d="M3 12h3.5l2.5-7 4.5 14 2.5-7H21" />
  </Svg>
);

/* Puce / IA */
export const Cpu = (p) => (
  <Svg {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    <path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M6 9H3M6 15H3M21 9h-3M21 15h-3" />
  </Svg>
);

/* Cube isométrique (BIM 3D) */
export const Cube = (p) => (
  <Svg {...p}>
    <path d="M12 3l8 4.5v9L12 21 4 16.5v-9Z" />
    <path d="M12 12 20 7.5" />
    <path d="M12 12 4 7.5" />
    <path d="M12 12v9" />
  </Svg>
);

/* Graphique (reporting) */
export const Chart = (p) => (
  <Svg {...p}>
    <path d="M4 4v15a1 1 0 0 0 1 1h15" />
    <path d="M7.5 15l3.5-4.5 3 2.5 4.5-6" />
  </Svg>
);

/* Éclats / sparkles */
export const Sparkles = (p) => (
  <Svg {...p}>
    <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7Z" />
    <path d="M18.5 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9Z" />
  </Svg>
);

/* Repère de localisation (géoloc) */
export const MapPin = (p) => (
  <Svg {...p}>
    <path d="M12 21s6.5-5.8 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.2 12 21 12 21Z" />
    <circle cx="12" cy="10.3" r="2.3" />
  </Svg>
);

/* Cloche (notifications) */
export const Bell = (p) => (
  <Svg {...p}>
    <path d="M6 16V10a6 6 0 0 1 12 0v6l1.5 2.5H4.5Z" />
    <path d="M10 19.5a2 2 0 0 0 4 0" />
  </Svg>
);
