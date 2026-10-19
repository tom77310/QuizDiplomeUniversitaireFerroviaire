// ============================================================
// BANQUE DE QUESTIONS
// ============================================================
// Chaque question contient :
// - id          : identifiant unique de la question
// - difficulty  : niveau de difficulté (easy / medium / hard)
// - theme       : thème auquel la question appartient
// - type        : single / multiple / truefalse
// - question    : énoncé de la question
// - answers     : propositions de réponse
// - correct     : index des bonnes réponses dans le tableau answers
// - explanation : explication affichée après validation
//
// Certains éléments peuvent également être présents :
// - trap       : indique une question piège
// - trapNote   : explication du piège
// ============================================================

const QUESTIONS = [
  // ==========================================================
  // EC21-1 — SÉCURITÉ GÉNÉRALE
  // ==========================================================

  {
    id: 1,
    difficulty: "easy",
    theme: "EC21-1 — Sécurité générale",
    type: "single",
    question:
      "Quels sont les cinq risques majeurs identifiés en milieu ferroviaire ?",
    answers: [
      "Heurt/souffle, électrique, chute, matières dangereuses et électromagnétique",
      "Incendie, routier, chimique, météo et noyade",
      "Glissade, incendie, chaleur, chimique et routier",
      "Incendie, bruit, manutention, routier et météo",
    ],
    correct: [0],
    explanation:
      "Les cinq risques majeurs sont le heurt/souffle, le risque électrique, le risque de chute, le risque lié aux matières dangereuses et le risque électromagnétique.",
  },

  {
    id: 2,
    difficulty: "easy",
    theme: "EC21-1 — Sécurité générale",
    type: "single",
    question: "Lequel constitue un facteur aggravant d’un risque ?",
    answers: [
      "La fatigue",
      "La connaissance des consignes",
      "La préparation de l’intervention",
      "Le port des EPI",
    ],
    correct: [0],
    explanation:
      "La fatigue est identifiée comme un facteur aggravant du risque.",
  },

  {
    id: 3,
    difficulty: "easy",
    theme: "EC21-1 — Sécurité générale",
    type: "single",
    question: "En milieu ferroviaire, toute voie doit être considérée comme :",
    answers: [
      "Parcourue par des véhicules ferroviaires",
      "Neutralisée pendant les travaux",
      "Fermée tant qu’aucun train n’est visible",
      "Accessible uniquement après autorisation verbale",
    ],
    correct: [0],
    explanation:
      "Une voie doit être considérée comme pouvant être parcourue par des véhicules ferroviaires.",
  },

  {
    id: 4,
    difficulty: "easy",
    theme: "EC21-1 — Sécurité générale",
    type: "single",
    question: "En gare, les circulations peuvent :",
    answers: [
      "Survenir à tout moment dans l’un ou l’autre sens",
      "Toujours arriver du même côté",
      "Être limitées aux voies principales",
      "Être annoncées systématiquement",
    ],
    correct: [0],
    explanation:
      "Une circulation peut survenir à tout moment et dans l’un ou l’autre sens.",
  },

  {
    id: 5,
    difficulty: "easy",
    theme: "EC21-1 — Sécurité générale",
    type: "single",
    question: "Quel est l’objectif premier des règles de sécurité ?",
    answers: [
      "Assurer sa propre sécurité et celle des autres",
      "Améliorer la productivité",
      "Réduire les temps d’arrêt",
      "Faciliter les manœuvres",
    ],
    correct: [0],
    explanation:
      "La priorité est d’assurer sa propre sécurité et celle des autres.",
  },

  {
    id: 6,
    difficulty: "easy",
    theme: "EC21-1 — Sécurité générale",
    type: "single",
    question: "Le port des EPI est :",
    answers: [
      "Obligatoire",
      "Conseillé uniquement",
      "Réservé aux travaux",
      "Facultatif",
    ],
    correct: [0],
    explanation: "Le port des EPI est obligatoire.",
  },

  {
    id: 7,
    difficulty: "medium",
    trap: true,
    trapNote:
      "Plusieurs propositions sont correctes : ne sélectionne pas les équipements qui sont justement autorisés.",
    theme: "EC21-1 — Sécurité générale",
    type: "multiple",
    question:
      "Dans l’enceinte du SFN, quelles actions ou situations sont interdites ?",
    answers: [
      "Porter un casque audio",
      "Utiliser une tenue qui gêne la visibilité",
      "Porter un gilet haute visibilité",
      "Se déplacer sans nécessité de service",
    ],
    correct: [0, 1, 3],
    explanation:
      "Le casque audio, les tenues gênant la visibilité et les déplacements sans nécessité de service sont identifiés comme interdits.",
  },

  {
    id: 8,
    difficulty: "easy",
    theme: "EC21-1 — Sécurité générale",
    type: "single",
    question: "Quel vêtement est interdit dans les emprises ferroviaires ?",
    answers: [
      "Les tenues amples",
      "La veste de travail",
      "Le pantalon de sécurité",
      "Le gilet haute visibilité",
    ],
    correct: [0],
    explanation:
      "Les tenues amples sont interdites dans les emprises ferroviaires.",
  },

  {
    id: 9,
    difficulty: "easy",
    theme: "EC21-1 — Sécurité générale",
    type: "single",
    question: "Les chaussures doivent être :",
    answers: [
      "Fermées, antidérapantes et de sécurité",
      "Des chaussures de sport",
      "Ouvertes pour plus de confort",
      "Au choix de l’agent",
    ],
    correct: [0],
    explanation:
      "Les chaussures doivent être fermées, antidérapantes et de sécurité.",
  },

  // ==========================================================
  // EC21-2 — CHEMINEMENT
  // ==========================================================

  {
    id: 10,
    difficulty: "easy",
    theme: "EC21-2 — Cheminement",
    type: "single",
    question:
      "Quel est le premier principe à respecter lors d’un cheminement aux abords des voies ?",
    answers: [
      "Ne pas engager la zone dangereuse",
      "Traverser les voies le plus rapidement possible",
      "Marcher le plus près possible de la voie",
      "Toujours circuler entre les rails",
    ],
    correct: [0],
    explanation:
      "Le premier principe est de ne pas engager la zone dangereuse.",
  },

  {
    id: 11,
    difficulty: "medium",
    theme: "EC21-2 — Cheminement",
    type: "single",
    question:
      "La zone dangereuse est la zone dans laquelle une personne est exposée :",
    answers: [
      "Aux risques de heurt, d’accrochage ou d’effet de souffle",
      "Uniquement au risque électrique",
      "Uniquement au risque de chute",
      "Aux risques liés aux intempéries",
    ],
    correct: [0],
    explanation:
      "La zone dangereuse correspond notamment à l’exposition aux risques de heurt, d’accrochage ou d’effet de souffle.",
  },

  {
    id: 12,
    difficulty: "easy",
    theme: "EC21-2 — Cheminement",
    type: "single",
    question: "Le stationnement dans la zone dangereuse est :",
    answers: [
      "Interdit",
      "Autorisé avec un gilet haute visibilité",
      "Autorisé pendant les travaux",
      "Autorisé en l’absence de circulation visible",
    ],
    correct: [0],
    explanation: "Le stationnement dans la zone dangereuse est interdit.",
  },

  {
    id: 13,
    difficulty: "easy",
    theme: "EC21-2 — Cheminement",
    type: "single",
    question:
      "Sur une voie dont la vitesse est inférieure ou égale à 40 km/h, la distance minimale de la zone dangereuse est de :",
    answers: ["1,25 mètre", "1 mètre", "1,50 mètre", "2 mètres"],
    correct: [0],
    explanation: "La distance minimale est de 1,25 mètre.",
  },

  {
    id: 14,
    difficulty: "easy",
    trap: true,
    trapNote:
      "L’absence de train visible ne supprime jamais le risque ferroviaire.",
    theme: "EC21-2 — Cheminement",
    type: "truefalse",
    question:
      "L’absence de train visible signifie que l’on peut considérer la voie comme sûre.",
    answers: ["Vrai", "Faux"],
    correct: [1],
    explanation:
      "Faux : toute voie doit être considérée comme pouvant être parcourue par des véhicules ferroviaires.",
  },

  // ==========================================================
  // EC21-2 — RISQUES ÉLECTRIQUES
  // ==========================================================

  {
    id: 15,
    difficulty: "easy",
    theme: "EC21-2 — Risques électriques",
    type: "single",
    question:
      "Pourquoi les conducteurs doivent-ils être formés au risque électrique ?",
    answers: [
      "Parce qu’ils évoluent quotidiennement dans un environnement électrique",
      "Parce qu’ils assurent la maintenance des sous-stations",
      "Parce qu’ils remplacent les électriciens",
      "Parce qu’ils interviennent uniquement sur les caténaires",
    ],
    correct: [0],
    explanation:
      "Le conducteur évolue quotidiennement dans un environnement électrique.",
  },

  {
    id: 16,
    difficulty: "easy",
    theme: "EC21-2 — Risques électriques",
    type: "single",
    question: "L’habilitation électrique C0 doit être renouvelée :",
    answers: [
      "Tous les trois ans",
      "Tous les ans",
      "Tous les cinq ans",
      "Uniquement après un accident",
    ],
    correct: [0],
    explanation:
      "L’habilitation électrique C0 doit être renouvelée tous les trois ans.",
  },

  {
    id: 17,
    difficulty: "medium",
    theme: "EC21-2 — Risques électriques",
    type: "single",
    question: "Le contact avec une pièce nue sous tension peut provoquer :",
    answers: [
      "Une électrocution ou une électrisation",
      "Uniquement une perte d’équilibre",
      "Uniquement des brûlures superficielles",
      "Aucun danger si le contact est bref",
    ],
    correct: [0],
    explanation:
      "Un contact avec une pièce nue sous tension peut provoquer une électrisation ou une électrocution.",
  },

  {
    id: 18,
    difficulty: "medium",
    trap: true,
    trapNote:
      "Le piège consiste à confondre amorçage et contact direct : l’arc peut se produire à distance.",
    theme: "EC21-2 — Risques électriques",
    type: "single",
    question: "Un amorçage électrique peut se produire :",
    answers: [
      "Sans contact direct, lorsqu’on s’approche trop près d’une pièce sous tension",
      "Uniquement lorsque l’on touche un conducteur",
      "Uniquement sur les lignes à basse tension",
      "Seulement par temps de pluie",
    ],
    correct: [0],
    explanation:
      "Un amorçage peut se produire sans contact direct lorsqu’on s’approche trop près d’une partie sous tension.",
  },

  {
    id: 19,
    difficulty: "medium",
    theme: "EC21-2 — Risques électriques",
    type: "single",
    question:
      "Quel comportement est interdit à proximité des installations électriques ?",
    answers: [
      "Monter sur un poteau supportant des conducteurs électriques",
      "Respecter les distances de sécurité",
      "Signaler un ouvrage présentant des étincelles",
      "S’éloigner d’un conducteur tombé au sol",
    ],
    correct: [0],
    explanation:
      "Monter sur un poteau supportant des conducteurs électriques est interdit.",
  },

  {
    id: 20,
    difficulty: "medium",
    theme: "EC21-2 — Risques électriques",
    type: "single",
    question:
      "Que faut-il faire devant un conducteur électrique tombé au sol ?",
    answers: [
      "Ne pas le toucher et empêcher toute personne de s’en approcher",
      "Le déplacer hors des voies",
      "Le recouvrir avec un vêtement",
      "Le couper avec un outil isolé",
    ],
    correct: [0],
    explanation:
      "Il ne faut pas toucher le conducteur et il faut empêcher les personnes de s’en approcher.",
  },

  {
    id: 21,
    difficulty: "medium",
    theme: "EC21-2 — Risques électriques",
    type: "single",
    question:
      "Si un conducteur électrique tombé engage le gabarit de la voie, il doit être considéré comme :",
    answers: [
      "Un obstacle inopiné",
      "Un simple incident",
      "Un équipement de signalisation",
      "Une installation hors service",
    ],
    correct: [0],
    explanation: "Il doit être considéré comme un obstacle inopiné.",
  },

  {
    id: 22,
    difficulty: "easy",
    theme: "EC21-2 — Risques électriques",
    type: "single",
    question:
      "Pour limiter les risques électriques lors des cheminements, il est recommandé :",
    answers: [
      "De ne pas toucher les supports caténaires, même avec un objet métallique",
      "De s’appuyer contre les poteaux caténaires",
      "De déposer du matériel contre les supports",
      "De vérifier les supports en les frappant",
    ],
    correct: [0],
    explanation:
      "Il ne faut pas toucher les supports caténaires, même avec un objet métallique.",
  },

  // ==========================================================
  // CA2P — SÉCURITÉ
  // ==========================================================

  {
    id: 23,
    difficulty: "medium",
    trap: true,
    trapNote:
      "Lis chaque proposition comme un comportement réel : certaines sont interdites même si elles semblent anodines.",
    theme: "CA2P — Sécurité",
    type: "multiple",
    question:
      "Lors des déplacements dans les emprises ferroviaires, quels éléments sont à éviter ?",
    answers: [
      "Les vêtements flottants",
      "Les écharpes et cravates",
      "Les écouteurs et l’usage du téléphone",
      "Les chaussures fermées",
    ],
    correct: [0, 1, 2],
    explanation:
      "les vêtements flottants, écharpes, cravates, écouteurs et téléphone parmi les éléments à éviter. Les chaussures fermées sont au contraire recommandées.",
  },

  {
    id: 24,
    difficulty: "medium",
    theme: "CA2P — Sécurité",
    type: "single",
    question: "Quelle procédure doit être appliquée en cas d’accident ?",
    answers: [
      "PAS : Protéger – Alerter – Secourir",
      "SAP : Secourir – Alerter – Protéger",
      "PRA : Protéger – Réparer – Alerter",
      "APS : Alerter – Protéger – Secourir",
    ],
    correct: [0],
    explanation: "La procédure indiquée est PAS : Protéger, Alerter, Secourir.",
  },

  // ==========================================================
  // CA2P — RISQUE ÉLECTRIQUE
  // ==========================================================

  {
    id: 25,
    difficulty: "hard",
    theme: "CA2P — Risque électrique",
    type: "single",
    question:
      "Dans quelle zone peut entrer un conducteur avec une habilitation C0 ?",
    answers: ["Zone 2", "Zone 0", "Zone 1", "Zone 3"],
    correct: [0],
    explanation: "L’habilitation C0 permet l’entrée en zone 2.",
  },

  {
    id: 26,
    difficulty: "hard",
    theme: "CA2P — Risque électrique",
    type: "single",
    question: "Que faut-il pour entrer en zone 3 ?",
    answers: [
      "Une attestation de mise hors tension de la caténaire remise en main propre",
      "Un simple gilet haute visibilité",
      "Une autorisation verbale d’un collègue",
      "La présence d’un train à l’arrêt",
    ],
    correct: [0],
    explanation:
      "Une attestation de mise hors tension de la caténaire remise en main propre est nécessaire.",
  },

  {
    id: 27,
    difficulty: "hard",
    theme: "CA2P — Risque électrique",
    type: "multiple",
    question:
      "Quelles informations doivent impérativement figurer dans un ordre de coupure d’urgence ?",
    answers: [
      "La mention « coupure d’urgence »",
      "Les indications permettant de localiser la zone",
      "Le motif de la coupure",
      "L’identification du demandeur",
    ],
    correct: [0, 1, 2, 3],
    explanation:
      "Un ordre de coupure d’urgence doit comporter la mention de la coupure, les indications permettant de localiser la zone, le motif de la coupure et l’identification du demandeur.",
  },

  // ==========================================================
  // CA2P — SIGNALISATION
  // ==========================================================

  {
    id: 28,
    difficulty: "easy",
    theme: "CA2P — Signalisation",
    type: "single",
    question: "En double voie, de quel côté roule normalement un train ?",
    answers: [
      "À gauche",
      "À droite",
      "Au centre",
      "Cela dépend toujours de la gare",
    ],
    correct: [0],
    explanation: "En double voie, un train roule normalement à gauche.",
  },

  // ==========================================================
  // CA2P — CANTONNEMENT
  // ==========================================================

  {
    id: 29,
    difficulty: "easy",
    theme: "CA2P — Cantonnement",
    type: "multiple",
    question: "Quels sont les types de cantonnement ?",
    answers: ["BAL", "BAPR", "BM", "Cantonnement téléphonique"],
    correct: [0, 1, 2, 3],
    explanation: "BAL, BAPR, BM et cantonnement téléphonique.",
  },

  {
    id: 30,
    difficulty: "medium",
    theme: "CA2P — Cantonnement",
    type: "single",
    question:
      "Pourquoi le cantonnement est-il nécessaire dans le transport ferroviaire ?",
    answers: [
      "La faible adhérence augmente les distances de freinage",
      "Les trains peuvent toujours freiner instantanément",
      "Les voies sont toujours en pente",
      "Les trains circulent uniquement en gare",
    ],
    correct: [0],
    explanation:
      "La faible adhérence augmente les distances de freinage et nécessite donc un cantonnement.",
  },

  {
    id: 31,
    difficulty: "medium",
    trap: true,
    trapNote:
      "La valeur demandée est une valeur de référence, pas une valeur maximale universelle.",
    theme: "CA2P — Cantonnement",
    type: "single",
    question:
      "Quelle est, en principe, la longueur maximale d’un canton en BAL ?",
    answers: ["2 800 m", "1 500 m", "3 500 m", "5 000 m"],
    correct: [0],
    explanation:
      "2 800 m en principe, avec une possibilité exceptionnelle d’atteindre 3 000 m.",
  },

  // ==========================================================
  // CA2P — SIGNALISATION
  // ==========================================================

  {
    id: 32,
    difficulty: "easy",
    theme: "CA2P — Signalisation",
    type: "single",
    question:
      "Comment repère-t-on un signal qui n’est pas en service ou qui est annulé ?",
    answers: [
      "Avec une croix de Saint-André",
      "Avec une flèche rouge",
      "Avec une bande bleue",
      "Avec une plaque F",
    ],
    correct: [0],
    explanation:
      "Une croix de Saint-André permet de repérer un signal qui n’est pas en service ou qui est annulé.",
  },

  // ==========================================================
  // CA2P — FREIN
  // ==========================================================

  {
    id: 33,
    difficulty: "medium",
    theme: "CA2P — Frein",
    type: "multiple",
    question: "Quels sont les essais de frein ?",
    answers: [
      "Essai complet",
      "Essai partiel",
      "Essai de continuité",
      "Essai de raccordement",
    ],
    correct: [0, 1, 2, 3],
    explanation:
      "Les essais concernés sont l’essai complet, l’essai partiel, l’essai de continuité et l’essai de raccordement.",
  },

  {
    id: 34,
    difficulty: "hard",
    theme: "CA2P — Frein",
    type: "single",
    question: "Que vérifie notamment un essai complet des freins ?",
    answers: [
      "L’étanchéité et la continuité de la CG ainsi que le serrage et le desserrage des véhicules normalement freinés",
      "Uniquement l’éclairage de la locomotive",
      "Uniquement la pression des pantographes",
      "Uniquement le fonctionnement de la radio",
    ],
    correct: [0],
    explanation:
      "Un essai complet vérifie notamment l’étanchéité et la continuité de la CG et le bon fonctionnement des freins au serrage et au desserrage.",
  },

  {
    id: 35,
    difficulty: "easy",
    theme: "CA2P — Frein",
    type: "single",
    question:
      "À quelle pression de régime la conduite générale (CG) est-elle indiquée comme étant normalement remplie ?",
    answers: ["5 bars", "3 bars", "7 bars", "9 bars"],
    correct: [0],
    explanation: "La pression de régime de la CG est de 5 bars.",
  },

  // ==========================================================
  // CA2P — KVB
  // ==========================================================

  {
    id: 36,
    difficulty: "medium",
    theme: "CA2P — KVB",
    type: "single",
    question:
      "Quels sont les quatre paramètres à saisir avant de valider le KVB ?",
    answers: [
      "Vitesse maxi, longueur du train, coefficient de décélération et classe du train",
      "Vitesse maxi, masse totale, température extérieure et numéro de voie",
      "Longueur du train, tension caténaire, PK et numéro de locomotive",
      "Classe du train, pression CG, pression CP et vitesse du vent",
    ],
    correct: [0],
    explanation:
      "Les paramètres sont la vitesse maximale, la longueur du train, le coefficient de décélération et la classe du train.",
  },

  // ==========================================================
  // CA2P — VACMA
  // ==========================================================

  {
    id: 37,
    difficulty: "easy",
    theme: "CA2P — VACMA",
    type: "single",
    question: "Que contrôle la VACMA ?",
    answers: [
      "L’état de conscience du conducteur",
      "La tension de la caténaire",
      "La pression de la conduite générale",
      "La vitesse maximale de la ligne",
    ],
    correct: [0],
    explanation: "La VACMA contrôle l’état de conscience du conducteur.",
  },

  {
    id: 38,
    difficulty: "hard",
    theme: "CA2P — VACMA",
    type: "single",
    question:
      "Que se produit-il environ 2,5 secondes après le relâchement de tous les appuis VA ?",
    answers: [
      "Le son RA retentit",
      "Le train repart automatiquement",
      "Le pantographe descend immédiatement",
      "La radio s’éteint",
    ],
    correct: [0],
    explanation:
      "Après environ 2,5 secondes, le son RA retentit ; sans réaction du conducteur, une nouvelle temporisation conduit aux opérations d’arrêt.",
  },

  // ==========================================================
  // CA2P — ARRÊTS
  // ==========================================================

  {
    id: 39,
    difficulty: "easy",
    theme: "CA2P — Arrêts",
    type: "single",
    question: "Quels sont les trois grands types d’arrêt ?",
    answers: [
      "Arrêts prévus, arrêts par signaux d’un poste et arrêts accidentels",
      "Arrêts commerciaux, arrêts techniques et arrêts électriques",
      "Arrêts en gare, arrêts en ligne et arrêts au dépôt",
      "Arrêts normaux, arrêts d’urgence et arrêts de service",
    ],
    correct: [0],
    explanation:
      "Les trois types sont les arrêts prévus, les arrêts par signaux d’un poste et les arrêts accidentels.",
  },

  {
    id: 40,
    difficulty: "medium",
    theme: "CA2P — Arrêts",
    type: "single",
    question: "Quels signaux correspondent à un arrêt par signaux d’un poste ?",
    answers: [
      "Un carré ou un sémaphore",
      "Un TIV ou une pancarte Z",
      "Une croix de Saint-André ou une flèche rouge",
      "Un panneau de quai ou un repère kilométrique",
    ],
    correct: [0],
    explanation:
      "Un arrêt par signaux d’un poste peut être donné par un carré ou un sémaphore.",
  },

  // ==========================================================
  // EC11 — HISTOIRE DU RAIL
  // ==========================================================

  {
    id: 41,
    difficulty: "medium",
    theme: "EC11 — Histoire du rail",
    type: "single",
    question:
      "Selon le cours, quelle succession décrit l’évolution présentée des chemins de guidage vers le rail ?",
    answers: [
      "Ornières → bois → fer → rails",
      "Bois → béton → acier → vapeur",
      "Pierre → plastique → cuivre → rail",
      "Fer → bois → pierre → acier",
    ],
    correct: [0],
    explanation:
      "Le cours « Introduction — le rail » présente des ornières, puis des pierres, du bois et enfin du fer pour répondre notamment au problème d’usure.",
  },

  {
    id: 42,
    difficulty: "hard",
    theme: "EC11 — Histoire du rail",
    type: "single",
    question:
      "Quelle année est associée dans le cours à l’ouverture de la première ligne française de chemin de fer de marchandises entre Saint-Étienne et Andrézieux ?",
    answers: ["1822", "1825", "1878", "1893"],
    correct: [0],
    explanation:
      "Le repère à retenir est 1822 pour cette première ligne française de marchandises.",
  },

  {
    id: 43,
    difficulty: "easy",
    theme: "EC11 — Histoire du rail",
    type: "single",
    question: "Que prévoit le plan Freycinet de 1878 dans le cours ?",
    answers: [
      "Un réseau de 16 000 km, dont 8 700 km de lignes d’intérêt local",
      "Un réseau de 8 700 km, dont 16 000 km d’intérêt local",
      "La première LGV française",
      "La création de la SNCF",
    ],
    correct: [0],
    explanation:
      "Le plan Freycinet est associé à un réseau de 16 000 km, dont 8 700 km de lignes d’intérêt local.",
  },

  {
    id: 44,
    difficulty: "medium",
    theme: "EC11 — Histoire du rail",
    type: "single",
    question:
      "Quelles sont les trois grandes parties d’une locomotive à vapeur présentées dans le cours ?",
    answers: [
      "Véhicule roulant, foyer/chaudière et mécanisme ou moteur à vapeur",
      "Bogie, pantographe et convertisseur",
      "Moteur diesel, alternateur et radiateur",
      "Tender, bogie et caténaire",
    ],
    correct: [0],
    explanation:
      "Une locomotive à vapeur associe le véhicule roulant, le foyer/chaudière et le mécanisme ou moteur à vapeur.",
  },

  {
    id: 45,
    difficulty: "easy",
    trap: true,
    trapNote: "Attention à ne pas inverser continu et alternatif.",
    theme: "EC11 — Histoire du rail",
    type: "single",
    question:
      "Quelles tensions du réseau ferroviaire français sont principalement citées dans le cours ?",
    answers: [
      "1 500 V continu et 25 kV alternatif",
      "750 V continu et 15 000 V triphasé",
      "3 000 V continu et 50 000 V continu",
      "25 kV continu et 1 500 V alternatif",
    ],
    correct: [0],
    explanation:
      "Le réseau français utilise principalement deux systèmes : 1 500 V continu et 25 kV alternatif.",
  },

  {
    id: 46,
    difficulty: "medium",
    theme: "EC11 — Histoire du rail",
    type: "single",
    question: "Quel rôle des rails est explicitement présenté dans le cours ?",
    answers: [
      "Ils participent à la transmission des signaux des circuits de voie et au retour des courants",
      "Ils alimentent directement tous les moteurs des locomotives",
      "Ils remplacent les caténaires sur toutes les lignes",
      "Ils servent uniquement à guider les roues",
    ],
    correct: [0],
    explanation:
      "Les rails peuvent aussi participer aux circuits de voie et au retour des courants électriques de traction et auxiliaires.",
  },

  {
    id: 47,
    difficulty: "easy",
    theme: "EC11 — Histoire du rail",
    type: "single",
    question: "Comment le cours définit-elle un bogie ?",
    answers: [
      "Un chariot sous un véhicule ferroviaire, portant les essieux et pouvant s’orienter dans les courbes",
      "Une barre d’acier profilée formant le rail",
      "Un dispositif de signalisation placé au sol",
      "Un réservoir de combustible de locomotive à vapeur",
    ],
    correct: [0],
    explanation:
      "Un bogie est un chariot situé sous le véhicule, portant les essieux et permettant au véhicule de mieux négocier les courbes.",
  },

  {
    id: 48,
    difficulty: "hard",
    theme: "EC11 — Histoire du rail",
    type: "multiple",
    question:
      "Quelles dates ou événements font partie des « grandes dates » visibles dans le cours ?",
    answers: [
      "31 août 1937 : décret de création de la SNCF",
      "28–29 mars 1955 : record à 331 km/h",
      "1er décembre 1975 : début de la mise en service des voitures Corail",
      "26 février 1981 : record à 380 km/h",
    ],
    correct: [0, 1, 2, 3],
    explanation:
      "Ces quatre repères font partie des grandes dates ferroviaires à connaître.",
  },

  {
    id: 49,
    difficulty: "easy",
    theme: "EC11 — Histoire du rail",
    type: "single",
    question: "Quel événement est associé au 14 novembre 1994 dans le cours ?",
    answers: [
      "La mise en service commercial du TGV Eurostar entre Paris et Londres",
      "La création de la SNCF",
      "Le record de 331 km/h des BB 9004 et CC 7107",
      "La mise en service des voitures Corail",
    ],
    correct: [0],
    explanation:
      "Le 14 novembre 1994 correspond à la mise en service commercial du TGV Eurostar entre Paris et Londres.",
  },

  // ==========================================================
  // QUESTIONS COMPLÉMENTAIRES
  // ==========================================================

  {
    id: 50,
    difficulty: "medium",
    theme: "EC21-1 — Sécurité générale",
    type: "multiple",
    question:
      "Quels facteurs aggravants sont explicitement cités dans le cours EC21-1 ?",
    answers: [
      "Manque d’expérience",
      "Fatigue",
      "Excès de confiance",
      "Conditions atmosphériques",
    ],
    correct: [0, 1, 2, 3],
    explanation:
      "Parmi les facteurs aggravants figurent notamment le manque d’expérience, la fatigue, l’excès de confiance, l’état de santé et les conditions atmosphériques.",
  },

  {
    id: 51,
    difficulty: "medium",
    theme: "EC21-2 — Cheminement",
    type: "multiple",
    question:
      "Quels délais de visibilité sont indiqués dans le cours pour traverser les voies ?",
    answers: [
      "10 secondes pour 1 ou 2 voies",
      "15 secondes pour 3 ou 4 voies",
      "20 secondes pour 5 ou 6 voies",
      "5 secondes pour 1 ou 2 voies",
    ],
    correct: [0, 1, 2],
    explanation:
      "Les délais de visibilité à retenir sont de 10 s pour 1–2 voies, 15 s pour 3–4 voies et 20 s pour 5–6 voies.",
  },

  {
    id: 52,
    difficulty: "medium",
    theme: "EC21-2 — Risques électriques",
    type: "multiple",
    question:
      "Que faut-il faire devant un conducteur électrique tombé à terre dans le cours ?",
    answers: [
      "Ne pas le toucher",
      "S’écarter sans précipitation",
      "Empêcher d’autres personnes de s’approcher",
      "Aviser rapidement le responsable de l’installation",
    ],
    correct: [0, 1, 2, 3],
    explanation:
      "Face à un conducteur tombé à terre, il faut éviter tout contact, s’éloigner sans précipitation, empêcher l’approche d’autres personnes et aviser rapidement le responsable de l’installation. S’il engage le gabarit, il doit être considéré comme un obstacle inopiné.",
  },
];