# ViaBTP: Plateforme de suivi de chantier de construction

Application web complète de pilotage de chantiers (BTP): suivi d'avancement, réserves, gestion
documentaire, planning, réunions, finance et **gestion complète de l'approvisionnement
en matériaux**.

Interface **glassmorphism** thème **blanc, vert & orange**, multi-rôles, multi-projets.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 18 · Vite · TailwindCSS · Recharts · React Router · Axios |
| Backend | Node.js · Express · JWT · Multer · Zod |
| ORM / BDD | Prisma · **PostgreSQL 16** (Docker) |
| Auth | JWT + bcrypt, contrôle d'accès par rôle |

---

## Démarrage rapide

### Prérequis
- **Node.js ≥ 18** (testé sur Node 24)
- **Docker Desktop** (pour PostgreSQL) *ou* un PostgreSQL local

### 1. Lancer la base de données (PostgreSQL via Docker)
```bash
docker compose up -d db
```
> Adminer (explorateur de BDD) est aussi disponible sur http://localhost:8080
> (système `PostgreSQL`, serveur `db`, user/mot de passe/base = `viabtp`).

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env          # déjà fourni
npx prisma db push            # crée le schéma dans PostgreSQL
npm run seed                  # données de démonstration
npm run dev                   # API sur http://localhost:4000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev                   # interface sur http://localhost:5173
```

### Tout-en-un (depuis la racine)
```bash
npm run setup     # installe tout, lance la BDD, pousse le schéma et seed
npm run backend   # terminal 1
npm run frontend  # terminal 2
```

---

## Comptes de démonstration

Mot de passe pour tous : **`password123`**

| Rôle | Email |
|---|---|
| Administrateur | `admin@viabtp.ma` |
| Maître d'ouvrage | `mo@viabtp.ma` |
| Architecte | `archi@viabtp.ma` |
| Bureau d'études | `bet@viabtp.ma` |
| Entreprise | `entreprise@viabtp.ma` |
| Contrôle technique | `controle@viabtp.ma` |
| Conducteur de travaux | `conducteur@viabtp.ma` |
| Chef de chantier | `chef@viabtp.ma` |
| Visiteur | `visiteur@viabtp.ma` |

---

## Modules fonctionnels (conformes au CPT)

| # | Module | Statut |
|---|---|---|
| 4.1 | Gestion des utilisateurs (9 rôles, permissions, journalisation) | |
| 4.2 | Gestion des projets (GPS, budget, intervenants, marché) | |
| 4.3 | Tableau de bord dynamique (KPIs, graphiques, alertes) | |
| 4.4 | Suivi d'avancement par lot (saisie, historique, validation) | |
| 4.5 | Gestion documentaire (catégories, versions, signature) | |
| 4.6 | Réserves & non-conformités (Kanban, statuts, affectation) | |
| 4.7 | Planning chantier (diagramme de Gantt, dépendances) | |
| 4.8 | Gestion des réunions (PV, présence, actions à suivre) | |
| 4.9 | Gestion financière (situations, décomptes, suivi budgétaire) | |
| 4.10 | Module photo & géolocalisation (zones, GPS, horodatage) | |
| 4.11 | **Approvisionnement** : matériaux, demandes, fournisseurs, bons de commande, stock, mouvements, valorisation, alertes seuil | |
| 5.1 | Sécurité : JWT, bcrypt, RBAC, journal d'activité | |

---

## Structure du projet

```
ViaBTP/
├── docker-compose.yml        # PostgreSQL + Adminer
├── package.json              # scripts racine (setup, db:up, ...)
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma     # modèle de données complet
│   │   └── seed.js           # données de démo (chantiers marocains)
│   └── src/
│       ├── server.js / app.js
│       ├── lib/              # prisma, auth (JWT), helpers
│       ├── middleware/       # auth, rôles, upload, erreurs
│       └── routes/           # 17 routeurs REST
└── frontend/
    └── src/
        ├── components/       # UI kit glassmorphism, Layout
        ├── context/          # Auth + Toast
        ├── lib/              # constantes, hooks
        └── pages/            # 19 pages
```

---

## Aperçu de l'API REST

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` · `/register` · `/me` | Authentification |
| GET/POST/PUT/DELETE | `/api/projects` | Projets + `/:id/members` |
| GET/POST/PUT | `/api/lots` · `/api/lots/:id/progress` | Lots & avancement |
| GET/POST/PUT/DELETE | `/api/reserves` | Réserves / NC |
| GET/POST | `/api/documents` · `/api/photos` | GED & photos (upload) |
| GET/POST/PUT | `/api/tasks` | Planning (Gantt) |
| GET/POST | `/api/meetings` | Réunions |
| GET/POST/PUT | `/api/finance` · `/summary/:id` | Finance |
| CRUD | `/api/materials` · `/suppliers` · `/supply` · `/orders` | Approvisionnement |
| GET/POST | `/api/stock/movements` · `/valuation` | Stock |
| GET | `/api/dashboard` | KPIs agrégés |
| GET | `/api/notifications` · `/api/activity` | Notifs & audit |

> Toutes les routes (hors `/auth`) exigent un header `Authorization: Bearer <token>`.

---

## Design

- **Glassmorphism** : cartes translucides (`backdrop-blur`), bordures claires, halos verts & orange.
- **Palette** : blanc cassé + vert `brand` (`#16b563` → `#0a7543`) + orange `accent` (`#ff6a1a`).
- **Responsive** : sidebar repliable, grilles fluides, optimisé terrain.
- Typographie : **Quantify** pour les titres & sous-titres, **Inter** pour le corps de texte.
- Animations douces, toasts, modales.

---

## Notes

- Les uploads sont stockés dans `backend/uploads/` et servis sur `/uploads`.
- Pour basculer sur un PostgreSQL non-Docker, ajustez `DATABASE_URL` dans `backend/.env`.
- `npx prisma studio` ouvre un explorateur visuel de la base.

© 2026 ViaBTP
