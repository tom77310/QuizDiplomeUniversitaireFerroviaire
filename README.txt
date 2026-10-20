QUIZ FERROVIAIRE — RÉVISIONS DU FERROVIAIRE
=============================================

Version actuelle : V15

Projet local de révision destiné à accompagner la préparation du DU ferroviaire.
Le site fonctionne côté navigateur, sans serveur ni base de données.


1. STRUCTURE DU PROJET
----------------------

index.html
  Page d'accueil du site. Présente le projet et donne accès au quiz, aux cours
  et aux fiches de révision.

quiz.html
  Page principale du quiz : configuration, questions, résultats, historique,
  entraînement ciblé, questions marquées, reprise de session et outils de
  sauvegarde.

cours.html
  Page dédiée aux cours structurés par thème, avec recherche et navigation
  rapide entre les thèmes.

fiches.html
  Page dédiée aux fiches de révision express, avec possibilité d'impression
  ou d'enregistrement en PDF depuis la fonction d'impression du navigateur.

questions.js
  Banque des 52 questions du quiz et leurs réponses.

course.js
  Contenu des cours, des fiches de révision et des badges.

script.js
  Logique principale du quiz : configuration, affichage des questions,
  réponses, correction, score, historique, progression, marquage, etc.

enhancements.js
  Fonctionnalités complémentaires : reprise de session, série quotidienne,
  révision automatique des points faibles, enrichissement des corrections,
  recherche des cours, export/import des données, bilan détaillé et impression.

style.css
  Feuille de style principale : interface, responsive, mode sombre,
  boutons, cartes, historique, cours et styles d'impression.


2. FONCTIONNALITÉS ACTUELLES
----------------------------

PAGE D'ACCUEIL
  - Accueil séparé de la page de configuration du quiz.
  - Présentation du projet de révision.
  - Accès direct au quiz, aux cours et aux fiches.
  - Mode clair / sombre partagé avec les autres pages.
  - Navigation cohérente entre les différentes pages.

CONFIGURATION DU QUIZ
  - Mode Révision.
  - Mode Examen.
  - Mode Simulation examen.
  - Sélection d'un thème.
  - Choix du nombre de questions : 10, 20 ou toutes.
  - Durée configurable pour les examens.
  - Mélange des réponses activable/désactivable.
  - Actions regroupées par fonction pour éviter une interface trop chargée.

REPRISE D'UNE SESSION
  - Une session commencée est sauvegardée automatiquement dans le navigateur.
  - La page de configuration propose « Reprendre ma session » si une session
    interrompue existe.
  - La question courante, le score, les erreurs et les paramètres essentiels
    sont conservés.
  - Une session peut être abandonnée depuis la carte de reprise.

SÉRIE DU JOUR
  - Série quotidienne de 5 questions.
  - Les questions sont déterminées à partir de la date afin de rester stables
    pendant la journée.
  - La série peut être refaite, même après avoir été terminée.

QUESTIONS À REVOIR AUTOMATIQUEMENT
  - Les statistiques question par question servent à repérer les points faibles.
  - Les questions régulièrement ratées, récemment ratées ou insuffisamment
    maîtrisées peuvent être proposées automatiquement.
  - Un accès direct « Réviser mes points faibles » permet de lancer une session
    dédiée sans devoir configurer manuellement un thème.

QUESTIONS
  - 52 questions actuellement intégrées.
  - Questions organisées par thèmes ferroviaires.
  - Correction immédiate en mode Révision.
  - Feedback associé aux réponses.
  - Explications complémentaires lorsque disponibles.
  - Indices disponibles sur les questions.
  - Questions pièges signalées lorsqu'elles sont prévues comme telles.
  - Raccourcis clavier pour accélérer les sessions.
  - Possibilité de marquer une question « À revoir ».

CORRECTIONS ENRICHIES
  - La correction rappelle la réponse attendue.
  - Une explication pédagogique est affichée.
  - Une section « À retenir » apporte un rappel complémentaire.
  - Lorsqu'une question est liée à un thème de cours connu, un bouton permet
    d'ouvrir directement le cours associé.
  - Les erreurs affichées dans le bilan contiennent également le lien vers la
    notion à revoir dans le cours.

MODES DE JEU
  - Révision : entraînement classique avec correction.
  - Examen : durée limitée et fonctionnement spécifique de fin d'épreuve.
  - Simulation examen : entraînement dans des conditions proches de l'examen.
  - Sur la dernière question d'un examen, « Terminer l'examen » remplace
    « Valider ».
  - Si la dernière réponse n'est pas encore validée, le bouton final valide
    d'abord la réponse avant de terminer la session.

RÉSULTATS
  - Score final et pourcentage de réussite.
  - Nombre d'erreurs.
  - Possibilité de revoir les erreurs.
  - Bilan détaillé des points forts et des thèmes à retravailler.
  - Accès direct au cours associé aux erreurs.
  - Possibilité de recommencer ou de modifier les paramètres.

HISTORIQUE ET PROGRESSION
  - Enregistrement local des sessions dans le navigateur.
  - Historique filtrable par mode, matière et période.
  - Moyenne et meilleur score.
  - Suivi de la progression par thème.
  - Tableau d'évolution des scores.
  - Graphique de progression.
  - Suivi de maîtrise question par question.
  - Catégories de maîtrise : à revoir, en cours, maîtrisées.
  - Possibilité de réinitialiser les statistiques ou l'historique.

ENTRAÎNEMENT CIBLÉ
  - Sélection d'une matière.
  - Travail des questions déjà ratées.
  - Travail des questions à revoir en priorité.
  - Nombre de questions configurable.
  - Complété par la révision automatique des points faibles.

QUESTIONS MARQUÉES
  - Marquage individuel d'une question pendant un quiz.
  - Liste dédiée des questions marquées.
  - Possibilité de lancer un entraînement uniquement avec ces questions.

COURS
  - Cours organisés par grands thèmes.
  - Navigation rapide entre les thèmes.
  - Recherche textuelle dans les thèmes de cours.
  - Ouverture d'un thème avec une URL dédiée.
  - Retour direct vers le quiz ou l'accueil.

FICHES
  - Fiches de révision express.
  - Accès depuis l'accueil et depuis le quiz.
  - Impression optimisée pour obtenir une version papier ou PDF.
  - Retour direct vers le quiz ou l'accueil.

SAUVEGARDE DES DONNÉES
  - Export de la progression dans un fichier JSON.
  - Import d'une sauvegarde JSON.
  - Les statistiques, questions marquées, préférences et session en cours
    peuvent ainsi être transférées vers un autre navigateur.

INTERFACE ET MOBILE
  - Design responsive pour ordinateur, tablette et téléphone.
  - Boutons suffisamment grands sur mobile.
  - Réponses faciles à sélectionner sur écran tactile.
  - Question et boutons de validation adaptés aux petits écrans.
  - Bootstrap 5 utilisé pour la base de l'interface.
  - Mode clair et mode sombre.
  - Préférence de thème conservée côté navigateur.
  - Boutons centrés verticalement et tailles harmonisées.


3. CONTENU DES QUESTIONS
------------------------

Les questions sont réparties entre plusieurs ensembles du cours, notamment :

  - EC21-1 — Généralités / sécurité
  - EC21-2 — Cheminement et traversées
  - EC21-2 — Risques électriques
  - CA2P — Bases techniques
  - CA2P — Signalisation
  - CA2P — Cantonnement
  - CA2P — Frein
  - KVB
  - VACMA
  - Arrêts
  - EC11 — Histoire du Rail
  - Compléments

Le contenu pédagogique des questions et du cours doit rester fidèle aux
supports utilisés pour le projet. Les éventuelles formulations ou coquilles
du contenu source ne doivent pas être modifiées automatiquement.


4. HISTORIQUE DES ÉVOLUTIONS — DE V1 À V15
-------------------------------------------

V1 — Base du projet
  - Création du quiz ferroviaire local.
  - Première structure HTML/CSS/JavaScript.
  - Première banque de questions.
  - Fonctionnement de base : choisir des questions, répondre et obtenir
    une correction.

V2 — Enrichissement du questionnaire
  - Enrichissement progressif de la banque de questions.
  - Organisation plus claire des questions et premières améliorations
    d'affichage.

V3 — Thèmes et sélection
  - Classement des questions par thèmes.
  - Sélection d'un thème avant de lancer une session.
  - Choix du nombre de questions.

V4 — Modes de révision et examen
  - Ajout du mode examen.
  - Gestion du temps pour les sessions chronométrées.
  - Adaptation du comportement de correction selon le mode utilisé.

V5 — Confort de réponse
  - Mélange des réponses.
  - Indices.
  - Feedbacks plus détaillés.
  - Améliorations de l'affichage du score et des résultats.

V6 — Suivi local
  - Enregistrement des sessions dans le navigateur.
  - Premières fonctions d'historique et de suivi de progression.

V7 — Entraînement personnalisé
  - Entraînement ciblé.
  - Questions marquées « À revoir ».
  - Possibilité de retravailler certaines questions en priorité.

V8 — Progression et ergonomie
  - Suivi de maîtrise question par question.
  - Progression par matière.
  - Badges de progression.
  - Raccourcis clavier.
  - Améliorations générales de l'interface et du responsive.

V9 — Cours et fiches
  - Structuration plus poussée des cours.
  - Création des fiches de révision express.
  - Cartes dédiées aux cours et aux fiches.
  - Renforcement du suivi de maîtrise et des badges.

V10 — Modes avancés et ergonomie
  - Amélioration de l'ergonomie générale.
  - Amélioration du marquage « À revoir ».
  - Affinage du suivi de maîtrise.
  - Ajout du mode sombre.
  - Améliorations responsive/mobile.
  - Gestion spécifique de la dernière question en examen :
    « Terminer l'examen » remplace « Valider » sur la dernière question.

V11 — Page d'accueil
  - Séparation de la page d'accueil et de la page de configuration du quiz.
  - index.html devient la page d'accueil.
  - quiz.html devient la page principale du quiz.
  - Ajout du hero de présentation.
  - Ajout des accès aux quiz, cours et fiches.
  - Ajout de blocs de présentation des fonctionnalités.

V12 — Navigation
  - Ajout du bouton de retour à l'accueil sur les pages concernées.
  - Correction des liens « Retour au quiz » vers quiz.html.
  - Harmonisation de la navigation entre accueil, quiz, cours et fiches.
  - Mode sombre disponible de manière cohérente sur l'accueil et les autres pages.

V13 — Organisation de la page quiz
  - Réorganisation des nombreuses actions de la page de configuration.
  - « Commencer le quiz » devient l'action principale.
  - Historique, entraînement ciblé et questions marquées regroupés sous
    « Suivi & entraînement ».
  - Cours et fiches regroupés sous « Ressources ».
  - Retour à l'accueil isolé comme action de navigation.
  - README enrichi avec la structure et l'historique du projet.

V14 — Alignement des boutons
  - Correction de l'alignement vertical des boutons d'action.
  - Harmonisation du centrage du texte et des icônes, notamment pour
    « Fiches de révision ».

V15 — Nouvelles fonctions de révision et de confort
  - Ajout de la reprise automatique d'une session interrompue.
  - Ajout d'une série quotidienne de 5 questions.
  - Ajout d'une sélection automatique des questions à revoir selon les
    statistiques individuelles.
  - Enrichissement des corrections avec rappel « À retenir » et accès direct
    au cours associé.
  - Ajout d'une recherche dans les cours.
  - Ajout d'une navigation rapide entre les thèmes de cours.
  - Ajout d'une interface mobile plus confortable pour les réponses et actions.
  - Ajout de l'export et de l'import des données locales.
  - Ajout de l'impression optimisée des fiches.
  - Ajout d'un bilan détaillé après une session avec points forts et points
    à retravailler.
  - Conservation de toutes les fonctionnalités précédentes.


5. STOCKAGE DES DONNÉES
-----------------------

Les statistiques, sessions et informations de progression sont stockées dans
le localStorage du navigateur.

Aucun serveur ni aucune base de données n'est utilisé pour le fonctionnement
normal du quiz.

Les principales données locales comprennent notamment :
  - quizSessions : historique des sessions ;
  - quizMarkedQuestions : questions marquées ;
  - quizStatsResetAt : date de réinitialisation des statistiques ;
  - quizLastErrors : dernières erreurs à revoir ;
  - quizCurrentSession : session actuellement en cours ;
  - quizDailyChallenge : état de la série du jour ;
  - quizDarkMode : préférence de thème.

L'export JSON permet de sauvegarder ces données et de les restaurer plus tard.


6. UTILISATION EN LOCAL
-----------------------

Aucune installation particulière n'est nécessaire pour utiliser le quiz.

Ouvrir simplement :

  index.html

Il est recommandé d'ouvrir l'accueil plutôt que quiz.html afin de conserver
la navigation complète du site.

Pour modifier le contenu :
  - questions.js → questions et réponses
  - course.js → cours, fiches et badges
  - script.js → logique principale du quiz
  - enhancements.js → fonctionnalités complémentaires
  - style.css → apparence et responsive
  - index.html → page d'accueil
  - quiz.html → interface du quiz
  - cours.html → page des cours
  - fiches.html → page des fiches


7. PRINCIPES À CONSERVER LORS DES MODIFICATIONS
------------------------------------------------

  - Ne pas modifier le contenu pédagogique des questions sans demande explicite.
  - Ne pas supprimer une fonctionnalité existante lors de l'ajout d'une nouvelle.
  - Vérifier les liens entre index.html, quiz.html, cours.html et fiches.html.
  - Conserver le fonctionnement du mode examen et de sa dernière question.
  - Conserver la compatibilité mobile.
  - Tester la syntaxe JavaScript après toute modification importante.
  - Préserver les données localStorage existantes autant que possible.
  - Documenter les nouvelles fonctionnalités dans ce README.


V17 — Corrections cours
- Suppression de la navigation rapide par boutons entre les thèmes dans la page des cours.
- Ajout d’un bouton « Imprimer le cours » lors de la consultation d’un cours.
- L’impression conserve le contenu du cours et masque les éléments d’interface inutiles.
- L’impression des fiches de révision reste disponible.
