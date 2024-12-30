type RoleConfig = {
  title: string;
  description: string;
  permissions: string[];
};

export const roleDescriptions: Record<string, RoleConfig> = {
  client: {
    title: "Client",
    description: "Accès au suivi des études commandées et à la communication avec l'équipe projet",
    permissions: [
      "Suivi en temps réel de l'avancement des études",
      "Communication directe avec le chargé d'études",
      "Accès aux documents et livrables",
      "Planification et gestion des rendez-vous",
      "Consultation de l'historique des échanges",
      "Accès au système de paiement",
      "Possibilité de laisser des avis",
    ],
  },
  student: {
    title: "Étudiant",
    description: "Accès aux opportunités de missions et à la participation aux études",
    permissions: [
      "Consultation des missions disponibles",
      "Candidature aux missions d'études",
      "Accès aux ressources pédagogiques",
      "Communication avec l'équipe encadrante",
      "Suivi des missions en cours",
      "Gestion du profil étudiant",
      "Accès aux formations",
    ],
  },
  alumni: {
    title: "Alumni",
    description: "Accès au réseau des anciens et aux opportunités professionnelles",
    permissions: [
      "Accès à l'annuaire des Alumni",
      "Participation aux événements exclusifs",
      "Consultation des offres d'emploi dédiées",
      "Mentorat et networking",
      "Accès aux ressources et actualités du réseau",
      "Publication d'articles et de témoignages",
      "Participation aux programmes de mentorat",
    ],
  },
  member: {
    title: "Membre",
    description: "Accès limité à la consultation",
    permissions: [
      "Consultation de l'espace membre",
      "Visualisation des études en cours",
      "Accès aux documents communs",
    ],
  },
  "project-manager": {
    title: "Chargé de projet",
    description: "Gestion des projets assignés",
    permissions: [
      "Gestion des études assignées",
      "Communication avec les clients",
      "Suivi de l'avancement",
      "Gestion des équipes projet",
      "Reporting et analyses",
    ],
  },
  moderator: {
    title: "Modérateur",
    description: "Accès privilégié selon le poste",
    permissions: [
      "Gestion des études",
      "Modération des contenus",
      "Accès aux statistiques",
      "Gestion des utilisateurs",
    ],
  },
  treasurer: {
    title: "Trésorier",
    description: "Gestion financière",
    permissions: [
      "Gestion de la facturation",
      "Suivi des transactions",
      "Gestion des dons",
      "Reporting financier",
    ],
  },
  commercial: {
    title: "Responsable Commercial",
    description: "Gestion commerciale",
    permissions: [
      "Création des comptes clients",
      "Gestion des études",
      "Attribution des chargés d'études",
      "Suivi commercial",
    ],
  },
  hr: {
    title: "Responsable RH",
    description: "Gestion des ressources humaines",
    permissions: [
      "Gestion du recrutement",
      "Publication des offres",
      "Gestion des candidatures",
      "Formation des membres",
    ],
  },
  quality: {
    title: "Responsable Qualité",
    description: "Suivi qualité",
    permissions: [
      "Consultation des retours clients",
      "Analyse des questionnaires",
      "Suivi des indicateurs",
      "Amélioration des processus",
    ],
  },
  secretary: {
    title: "Secrétaire Général",
    description: "Gestion administrative",
    permissions: [
      "Modération des Alumni",
      "Publication d'articles",
      "Gestion du répertoire",
      "Organisation des événements",
    ],
  },
  admin: {
    title: "Admin",
    description: "Administration complète de l'entité",
    permissions: [
      "Navigation inter-entités",
      "Modification complète de l'entité",
      "Gestion des accès",
      "Configuration système",
    ],
  },
  "super-admin": {
    title: "Super Admin",
    description: "Accès total au système",
    permissions: [
      "Accès absolu à tous les modules",
      "Modification sur toutes les entités",
      "Gestion système complète",
      "Configuration avancée",
    ],
  },
};