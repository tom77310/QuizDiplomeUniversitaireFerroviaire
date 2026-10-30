let quizQuestions=[],currentIndex=0,score=0,answered=false,shuffleAnswersEnabled=true,mode='revision',errors=[],examSeconds=0,timer=null,sessionStart=null,sessionElapsed=0,targetedMode=false;
const MARKED_KEY='quizMarkedQuestions', STATS_RESET_KEY='quizStatsResetAt';
// Retourne la date du dernier reset des statistiques. Cette fonction est utilisée
// par le suivi des questions et le mélange intelligent des quiz.
function getStatsResetAt(){return Number(localStorage.getItem(STATS_RESET_KEY)||0)}
function resetStats(){if(!confirm('Réinitialiser les statistiques ? L’historique des sessions restera conservé.'))return;localStorage.setItem(STATS_RESET_KEY,String(Date.now()));renderBadges();showHistory();updateTargetInfo()}
const difficultyLabels={easy:'Facile',medium:'Intermédiaire',hard:'Difficile'};
const $=s=>document.querySelector(s);
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function getMarked(){try{return JSON.parse(localStorage.getItem(MARKED_KEY)||'[]').map(String)}catch(e){return []}}
function isMarked(id){return getMarked().includes(String(id))}
function toggleMarked(id){let a=getMarked();const key=String(id);if(a.includes(key))a=a.filter(x=>x!==key);else a.unshift(key);localStorage.setItem(MARKED_KEY,JSON.stringify(a));if($('#markQuestionBtn')){const marked=a.includes(key);$('#markQuestionBtn').textContent=marked?'★ Marquée':'☆ À revoir';$('#markQuestionBtn').className=`btn btn-sm ${marked?'btn-warning':'btn-outline-secondary'} ms-auto`;}renderMarkedList()}
function getExplanationDetail(q){if(q.theme.includes('Sécurité générale'))return 'Le bon réflexe est de réduire l’exposition au danger avant même de penser à la rapidité d’exécution.';if(q.theme.includes('Cheminement'))return 'La logique de sécurité est d’éviter la zone dangereuse et de vérifier les conditions nécessaires avant tout déplacement ou franchissement.';if(q.theme.includes('Risques électriques'))return 'Le risque électrique ne se limite pas au contact direct : la proximité, un conducteur tombé ou un élément métallique peuvent également créer une situation dangereuse.';if(q.theme.includes('VACMA'))return 'Cette notion est à retenir comme un élément de surveillance de la vigilance et de la réaction du conducteur.';if(q.theme.includes('Arrêts'))return 'La bonne réponse correspond à une catégorie précise d’arrêt ; les autres propositions mélangent des lieux, des fonctions ou des situations.';if(q.theme.includes('Histoire'))return 'Ce repère permet de replacer la notion dans l’évolution du chemin de fer et de mieux distinguer les grandes étapes techniques ou historiques.';return ''}
function renderMarkedList(){const box=$('#markedList');if(!box)return;const ids=getMarked();const qs=ids.map(id=>QUESTIONS.find(q=>String(q.id)===id)).filter(Boolean);box.innerHTML=qs.length?qs.map(q=>`<div class=\"list-group-item d-flex justify-content-between align-items-start gap-3\"><div><div class=\"fw-semibold\">${escapeHtml(q.question)}</div><div class=\"small text-secondary mt-1\">${escapeHtml(q.theme)} · ${difficultyLabels[q.difficulty]||'Intermédiaire'}</div></div><button class=\"btn btn-sm btn-outline-danger unmark-btn\" data-id=\"${q.id}\">Retirer</button></div>`).join(''):'<div class=\"text-secondary py-4 text-center\">Aucune question marquée pour le moment.</div>';box.querySelectorAll('.unmark-btn').forEach(b=>b.onclick=()=>toggleMarked(b.dataset.id));$('#startMarkedBtn').disabled=!qs.length}
function showMarked(){clearInterval(timer);targetedMode=false;$('#setup').classList.add('d-none');$('#quiz').classList.add('d-none');$('#result').classList.add('d-none');$('#targeted').classList.add('d-none');$('#history').classList.add('d-none');$('#marked').classList.remove('d-none');renderMarkedList()}
function startMarkedQuiz(){const qs=getMarked().map(id=>QUESTIONS.find(q=>String(q.id)===id)).filter(Boolean);if(!qs.length){alert('Aucune question marquée.');return}quizQuestions=shuffle(qs);currentIndex=0;score=0;answered=false;errors=[];mode='revision';targetedMode=true;sessionStart=Date.now();sessionElapsed=0;$('#marked').classList.add('d-none');$('#quiz').classList.remove('d-none');showQuestion()}
// Regroupement des thèmes affichés dans les menus.
// Les questions conservent leurs thèmes d'origine : un groupe ne fait que
// réunir plusieurs thèmes proches pour rendre le choix du quiz plus lisible.
const THEME_GROUPS=[
  {value:'security',label:'Sécurité générale & cheminement',themes:['EC21-1 — Sécurité générale','EC 21-1 — Sécurité générale','EC21-2 — Cheminement','EC 21-2 — Cheminement','CA2P — Sécurité']},
  {value:'electrical',label:'Risques électriques',themes:['EC21-2 — Risques électriques','EC 21-2 — Risques électriques','CA2P — Risque électrique']},
  {value:'railway-risks',label:'Risques ferroviaires',themes:['EC 31 — Risques ferroviaires']},
  {value:'operations',label:'Exploitation ferroviaire & cantonnement',themes:['EC 31.1 — Régime d’exploitation','EC 31 — Exploitation ferroviaire','EC 31 — Cantonnement','CA2P — Cantonnement']},
  {value:'signalling',label:'Signalisation',themes:['EC 32 — Signalisation','CA2P — Signalisation']},
  {value:'driving-systems',label:'Conduite & systèmes',themes:['CA2P — Frein','CA2P — KVB','CA2P — VACMA','CA2P — Arrêts']},
  {value:'history',label:'Histoire du rail',themes:['EC11 — Histoire du rail']}
];

// Indices et points clés spécifiques à chaque question.
// Ils sont séparés de la banque pour garder les questions lisibles et faciles à maintenir.
const QUESTION_GUIDANCE = {
  1: { hint: 'Compte cinq familles de risques et vérifie qu’elles couvrent les circulations, l’électricité, les chutes, les marchandises et les phénomènes électromagnétiques.', takeaway: 'Les 5 risques majeurs : heurt/souffle, électrique, chute, matières dangereuses et électromagnétique.' },
  2: { hint: 'Cherche ce qui peut diminuer la vigilance ou les capacités de réaction, plutôt que ce qui prépare correctement l’intervention.', takeaway: 'La fatigue augmente le risque en diminuant la vigilance et les capacités de réaction.' },
  3: { hint: 'Une voie n’est jamais considérée comme sûre simplement parce qu’aucun véhicule n’est visible.', takeaway: 'Toute voie doit être considérée comme pouvant être parcourue par des véhicules ferroviaires.' },
  4: { hint: 'En gare, raisonne sur les deux sens de circulation et sur la possibilité d’une arrivée à tout moment.', takeaway: 'En gare, une circulation peut survenir à tout moment et dans l’un ou l’autre sens.' },
  5: { hint: 'La règle de base vise d’abord les personnes : pense à celui qui agit et à ceux qui l’entourent.', takeaway: 'La sécurité protège à la fois l’agent et les autres personnes présentes.' },
  6: { hint: 'Les EPI ne sont pas une simple recommandation : cherche le niveau d’obligation prévu par les règles de sécurité.', takeaway: 'Le port des EPI est obligatoire.' },
  7: { hint: 'Repère les comportements qui augmentent l’exposition au danger ou diminuent la perception de l’environnement ; un équipement de protection autorisé n’est pas à retenir.', takeaway: 'Dans les emprises, évite les comportements qui réduisent la vigilance, gênent la visibilité ou exposent inutilement à la circulation.' },
  8: { hint: 'Écarte le vêtement qui peut s’accrocher ou gêner les mouvements dans les emprises.', takeaway: 'Les tenues amples sont interdites car elles peuvent s’accrocher.' },
  9: { hint: 'Les chaussures doivent protéger contre les chutes et les risques liés au déplacement : vérifie les trois caractéristiques attendues.', takeaway: 'Les chaussures doivent être fermées, antidérapantes et de sécurité.' },
  10: { hint: 'Avant de penser à traverser ou à longer une voie, demande-toi quelle zone il faut absolument éviter.', takeaway: 'Le premier principe de cheminement est de ne pas engager la zone dangereuse.' },
  11: { hint: 'La zone dangereuse n’est pas définie par un seul danger : pense aux effets d’une circulation qui passe à proximité.', takeaway: 'La zone dangereuse expose notamment au heurt, à l’accrochage et à l’effet de souffle.' },
  12: { hint: 'Le stationnement augmente inutilement le temps d’exposition au danger : cherche la règle applicable à cette situation.', takeaway: 'Le stationnement dans la zone dangereuse est interdit.' },
  13: { hint: 'Ici, la vitesse de la voie fixe directement la distance minimale à conserver : retiens la valeur associée à ≤ 40 km/h.', takeaway: 'Pour une voie à ≤ 40 km/h, la distance minimale de la zone dangereuse est de 1,25 m.' },
  14: { hint: 'L’absence de train visible ne change pas le principe de sécurité applicable à une voie.', takeaway: 'Ne jamais considérer une voie comme sûre simplement parce qu’aucun train n’est visible.' },
  15: { hint: 'Le conducteur n’a pas besoin d’intervenir sur une installation électrique pour être exposé à son environnement.', takeaway: 'Le conducteur évolue quotidiennement dans un environnement électrique et doit connaître ce risque.' },
  16: { hint: 'Il s’agit d’une périodicité de renouvellement : compare trois ans, un an et cinq ans.', takeaway: 'L’habilitation électrique C0 est renouvelée tous les 3 ans.' },
  17: { hint: 'Distingue les deux conséquences électriques graves possibles d’un contact avec une partie nue sous tension.', takeaway: 'Un contact avec une pièce nue sous tension peut provoquer une électrisation ou une électrocution.' },
  18: { hint: 'L’amorçage est précisément le cas où l’électricité peut créer un arc sans contact physique direct.', takeaway: 'Un amorçage peut se produire sans contact direct lorsqu’on s’approche trop près d’une partie sous tension.' },
  19: { hint: 'Cherche le comportement qui rapproche volontairement une personne des conducteurs électriques ou la fait monter en hauteur.', takeaway: 'Il est interdit de monter sur un poteau supportant des conducteurs électriques.' },
  20: { hint: 'Un conducteur tombé au sol reste potentiellement dangereux : priorité à l’éloignement et à l’interdiction d’approcher.', takeaway: 'Un conducteur tombé au sol ne doit pas être touché ; il faut empêcher toute personne de s’en approcher.' },
  21: { hint: 'Si le conducteur tombe dans le gabarit, pense à la conséquence pour la circulation : il devient un obstacle.', takeaway: 'Un conducteur tombé qui engage le gabarit est un obstacle inopiné.' },
  22: { hint: 'Même sans toucher directement le conducteur, un support caténaire peut transmettre un danger : évite tout contact.', takeaway: 'Ne pas toucher les supports caténaires, même avec un objet métallique.' },
  23: { hint: 'Écarte ce qui peut s’accrocher, gêner l’audition ou détourner l’attention ; les chaussures fermées sont au contraire adaptées.', takeaway: 'Éviter vêtements flottants, écharpes/cravates, écouteurs et téléphone lors des déplacements.' },
  24: { hint: 'Retrouve l’ordre des trois actions de secours : d’abord sécuriser la situation, puis donner l’alerte, puis intervenir auprès de la victime.', takeaway: 'PAS = Protéger – Alerter – Secourir.' },
  25: { hint: 'Associe l’habilitation C0 à la zone où le conducteur peut évoluer dans le cadre prévu.', takeaway: 'L’habilitation C0 permet d’entrer en zone 2 dans les conditions prévues.' },
  26: { hint: 'Pour entrer plus près de la caténaire, il faut une garantie formelle de mise hors tension : cherche laquelle.', takeaway: 'L’entrée en zone 3 nécessite une attestation de mise hors tension de la caténaire remise en main propre.' },
  27: { hint: 'Un ordre de coupure doit permettre de savoir exactement quelle coupure est demandée, où, pourquoi et par qui.', takeaway: 'Un ordre de coupure doit mentionner la coupure d’urgence, la localisation, le motif et l’identification du demandeur.' },
  28: { hint: 'Sur une double voie classique, distingue le côté normalement associé au sens de circulation du côté opposé.', takeaway: 'En double voie, un train roule normalement à gauche.' },
  29: { hint: 'Mémorise les quatre appellations de cantonnement et ne les confonds pas avec les systèmes de signalisation ou de conduite.', takeaway: 'Les principaux cantonnements sont BAL, BAPR, BM et cantonnement téléphonique.' },
  30: { hint: 'Le cantonnement devient nécessaire notamment parce qu’un train ne peut pas s’arrêter sur une très courte distance.', takeaway: 'Le cantonnement est nécessaire notamment parce que la faible adhérence allonge les distances de freinage.' },
  31: { hint: 'Retrouve la valeur de référence du canton BAL, sans confondre la valeur habituelle et l’exception.', takeaway: 'Un canton BAL mesure en principe au maximum 2 800 m.' },
  32: { hint: 'Cherche le repère visuel qui indique qu’un signal ne doit plus être pris en compte.', takeaway: 'Une croix de Saint-André indique qu’un signal n’est pas en service ou est annulé.' },
  33: { hint: 'Un essai de frein peut être complet, partiel ou lié à la continuité ou au raccordement : retrouve les quatre appellations.', takeaway: 'Les essais de frein comprennent notamment l’essai complet, partiel, de continuité et de raccordement.' },
  34: { hint: 'Un essai complet porte sur le fonctionnement du frein à plusieurs niveaux : conduite générale, étanchéité, serrage et desserrage.', takeaway: 'L’essai complet vérifie notamment l’étanchéité et la continuité de la CG ainsi que le serrage et le desserrage des véhicules normalement freinés.' },
  35: { hint: 'La pression de régime de la conduite générale est une valeur de référence à connaître par cœur.', takeaway: 'La conduite générale est normalement remplie à 5 bars en pression de régime.' },
  36: { hint: 'Le KVB a besoin de données qui décrivent le train et sa capacité de freinage : vitesse, longueur, décélération et catégorie.', takeaway: 'Les 4 paramètres KVB : vitesse maximale, longueur du train, coefficient de décélération et classe du train.' },
  37: { hint: 'La VACMA surveille l’état de conscience du conducteur, pas la vitesse du train ni le frein lui-même.', takeaway: 'La VACMA contrôle l’état de conscience du conducteur.' },
  38: { hint: 'Observe la chronologie : après le relâchement des appuis VA, un signal sonore apparaît avant l’étape suivante.', takeaway: 'Environ 2,5 s après le relâchement de tous les appuis VA, le son RA retentit.' },
  39: { hint: 'Classe les arrêts selon leur origine : arrêt prévu, arrêt commandé par un signal ou arrêt dû à un événement accidentel.', takeaway: 'Les trois grands types d’arrêt : prévus, par signaux d’un poste et accidentels.' },
  40: { hint: 'Pour un arrêt commandé depuis un poste, pense aux principaux signaux d’arrêt rencontrés par le conducteur.', takeaway: 'Les signaux d’arrêt d’un poste comprennent notamment le carré et le sémaphore.' },
  41: { hint: 'Suis l’évolution des dispositifs de guidage en partant des premières solutions de roulement jusqu’au rail métallique.', takeaway: 'L’évolution présentée va des ornières aux pierres, puis au bois et enfin au fer.' },
  42: { hint: 'Associe Saint-Étienne–Andrézieux au premier grand repère chronologique de cette série : 1822, 1825, 1878 ou 1893.', takeaway: '1822 correspond à l’ouverture de la première ligne française de marchandises Saint-Étienne–Andrézieux.' },
  43: { hint: 'Le plan Freycinet correspond à un vaste programme kilométrique : compare le réseau total et la part d’intérêt local.', takeaway: 'Le plan Freycinet de 1878 prévoit un réseau de 16 000 km, dont 8 700 km de lignes d’intérêt local.' },
  44: { hint: 'Une locomotive à vapeur réunit une partie roulante, une partie qui produit la vapeur et un mécanisme qui transforme cette énergie en mouvement.', takeaway: 'Une locomotive à vapeur comprend le véhicule roulant, le foyer/chaudière et le mécanisme ou moteur à vapeur.' },
  45: { hint: 'Ne mélange pas les deux systèmes français : l’un est en continu, l’autre en alternatif.', takeaway: 'Les deux tensions principalement utilisées sont 1 500 V continu et 25 kV alternatif.' },
  46: { hint: 'Les rails ne servent pas uniquement au guidage : pense à leur rôle dans les circuits de voie et dans le retour du courant.', takeaway: 'Les rails participent aux circuits de voie et au retour des courants électriques, en plus du guidage.' },
  47: { hint: 'Un bogie est un ensemble roulant situé sous le véhicule : pense aux essieux et à sa capacité à suivre les courbes.', takeaway: 'Un bogie est un chariot sous le véhicule qui porte les essieux et permet de mieux négocier les courbes.' },
  48: { hint: 'Les quatre propositions correspondent à quatre repères historiques distincts : création de la SNCF, record de 1955, Corail et record de 1981.', takeaway: 'Repères : 1937 création de la SNCF, 1955 record à 331 km/h, 1975 début Corail, 1981 record à 380 km/h.' },
  49: { hint: 'Le 14 novembre 1994 est un repère lié au trafic international à grande vitesse entre la France et le Royaume-Uni.', takeaway: 'Le 14 novembre 1994 correspond à la mise en service commercial de l’Eurostar entre Paris et Londres.' },
  50: { hint: 'Cherche des facteurs humains et environnementaux qui peuvent dégrader la sécurité : expérience, vigilance, confiance excessive et conditions extérieures.', takeaway: 'Parmi les facteurs aggravants : manque d’expérience, fatigue, excès de confiance et conditions atmosphériques.' },
  51: { hint: 'Le délai dépend du nombre de voies : 1–2, puis 3–4, puis 5–6 voies. Associe chaque groupe à son temps.', takeaway: 'Visibilité : 10 s pour 1–2 voies, 15 s pour 3–4 voies, 20 s pour 5–6 voies.' },
  52: { hint: 'Face à un conducteur tombé, pense à quatre priorités : ne pas toucher, s’éloigner, empêcher l’approche et prévenir le responsable.', takeaway: 'Face à un conducteur tombé : ne pas toucher, s’éloigner, empêcher l’approche et aviser rapidement le responsable.' },
  53: { hint: 'Les quatre barrières couvrent la personne, les règles, l’organisation et les moyens techniques.', takeaway: 'Les 4 barrières de défense : l’homme, la réglementation, l’organisation et la technologie.' },
  54: { hint: 'Ici, distingue les risques directement liés au passage ou au voisinage d’une circulation et ceux liés à l’électricité ou aux phénomènes électromagnétiques.', takeaway: 'Les risques cités sont le heurt, la projection, la chute, l’électrique et l’électromagnétique.' },
  55: { hint: 'L’autorisation d’accès est identifiée par un sigle de quatre lettres : retrouve celui utilisé pour l’accès aux emprises.', takeaway: 'L’autorisation d’accès aux emprises ferroviaires est l’AAEF.' },
  56: { hint: 'Il s’agit d’une largeur minimale d’un emplacement où l’on peut se garer : compare les quatre valeurs proposées.', takeaway: 'La largeur minimale d’un emplacement de garage est de 0,70 m.' },
  57: { hint: 'À 160 km/h, convertis la vitesse en distance parcourue pendant 10 secondes puis compare aux propositions.', takeaway: 'À 160 km/h, le délai de visibilité de 10 s correspond à 450 m.' },
  58: { hint: 'Au-delà de 160 km/h, engager la zone dangereuse nécessite à la fois une protection et une réduction de la vitesse de référence.', takeaway: 'Au-delà de 160 km/h, engager la zone dangereuse nécessite une PERS et l’assurance de l’abaissement à 160 km/h.' },
  59: { hint: 'Avant de traverser, il faut d’abord arrêter le déplacement, vérifier les deux directions et s’assurer que l’on pourra dégager la zone.', takeaway: 'Avant une traversée nécessaire : marquer l’arrêt, regarder dans les deux directions et vérifier que la zone pourra être dégagée.' },
  60: { hint: 'Pour 3 ou 4 voies, retrouve le deuxième délai de la série 10 / 15 / 20 secondes.', takeaway: 'Pour 3 ou 4 voies, le délai minimal de visibilité est de 15 s.' },
  61: { hint: 'Lorsqu’une circulation arrive sur une voie voisine, la priorité est de s’arrêter, se protéger et observer le convoi avant de reprendre le déplacement.', takeaway: 'À l’arrivée d’une circulation sur une voie contiguë : s’arrêter, se tenir à la lisse si elle existe, observer et rechercher les anomalies dangereuses.' },
  62: { hint: 'Dans le tunnel, la protection recherchée est contre le souffle et le passage de la circulation : utilise le piédroit et oriente-toi correctement.', takeaway: 'Dans le tunnel sans niche, se coucher à plat-ventre le long du piédroit, tête du côté d’où vient la circulation.' },
  63: { hint: 'La durée de validité de C0 correspond à la même périodicité que son renouvellement.', takeaway: 'La validité de l’habilitation C0 est de 3 ans.' },
  64: { hint: 'Cherche la personne responsable de l’autorisation, pas le conducteur ni l’agent de circulation.', takeaway: 'L’habilitation C0 est délivrée par le responsable de site.' },
  65: { hint: 'La zone 3 correspond à la bande la plus proche de la caténaire : repère sa limite à partir de la distance au conducteur.', takeaway: 'La zone 3 commence à moins de 1 m de la caténaire.' },
  66: { hint: 'C0 permet de travailler dans une zone définie : situe-la par rapport aux zones 3, 2, 1 et 0.', takeaway: 'Un conducteur habilité C0 peut stationner, se déplacer et travailler en zone 2.' },
  67: { hint: 'La hauteur générale des fils de contact se situe autour de cinq mètres et demi au-dessus du plan de roulement.', takeaway: 'Les fils de contact sont généralement placés à 5,50 m au-dessus du plan de roulement.' },
  68: { hint: 'Une caténaire exceptionnellement basse doit être repérée visuellement sur ses supports : cherche la combinaison de couleurs.', takeaway: 'Une caténaire à moins de 5 m est repérée par une bande bleue avec liserés blancs sur les supports.' },
  69: { hint: 'Les zones sont classées par distance croissante à la caténaire : 3 est la plus proche, puis 2, 1 et enfin 0.', takeaway: 'Limites : zone 3 < 1 m ; zone 2 de 1 à < 2 m ; zone 1 de 2 à < 3 m ; zone 0 ≥ 3 m.' },
  70: { hint: 'Un fil tombé au sol impose d’abord l’éloignement et l’interdiction d’approcher, puis la protection des gabarits et l’alerte du responsable.', takeaway: 'Face à un fil tombé : s’écarter sans précipitation, protéger les gabarits si nécessaire, empêcher l’approche et aviser le responsable.' },
  71: { hint: 'Une coupure d’urgence sert lorsqu’une situation crée un danger immédiat lié à la caténaire : personne, incendie, objet ou matériel.', takeaway: 'Une coupure d’urgence peut être nécessaire pour un sauvetage, un incendie, un objet en contact ou un risque de contact avec la caténaire.' },
  72: { hint: 'Sur les supports des voies principales, cherche le symbole directionnel de couleur rouge qui indique le téléphone d’alarme le plus proche.', takeaway: 'Une flèche rouge sur un support indique la direction du téléphone d’alarme le plus proche.' },
  73: { hint: 'Comme pour tout ordre de coupure, il faut identifier la nature de l’ordre, sa localisation, son motif et son demandeur.', takeaway: 'Un ordre de coupure précise la nature de l’ordre, la localisation, le motif et l’identité du demandeur.' },
  74: { hint: 'PAS est un moyen mnémotechnique : retrouve les trois verbes dans l’ordre d’action après un accident.', takeaway: 'PAS = Protéger – Alerter – Secourir.' },
  75: { hint: 'Les SNOP servent à empêcher qu’une installation redevienne dangereuse pendant le sauvetage, notamment par réalimentation ou tension induite.', takeaway: 'Les SNOP évitent une réalimentation intempestive et les phénomènes de tensions induites pendant le sauvetage.' },
  76: { hint: 'Le dispositif d’urgence agit à distance sur l’alimentation : pense à l’interrupteur qui alimente les caténaires secondaires.', takeaway: 'Le DU permet l’ouverture à distance de l’interrupteur alimentant les caténaires secondaires.' },
  77: { hint: 'En l’absence de preuve contraire, adopte le niveau de prudence maximal : une installation électrique est considérée comme sous tension.', takeaway: 'Sans assurance du contraire, une installation électrique doit être considérée comme sous tension.' },
  78: { hint: 'La masse et la vitesse d’un train rendent son freinage long : c’est incompatible avec une conduite fondée sur la seule vue immédiate de la voie.', takeaway: 'La masse et la distance de freinage importante rendent la conduite à vue impossible pour un train.' },
  79: { hint: 'La signalisation suit une logique en deux temps : le conducteur reçoit une information puis doit appliquer l’action correspondante.', takeaway: 'Principe de signalisation : ANNONCE → EXÉCUTION.' },
  80: { hint: 'Un rattrapage se produit lorsqu’un train rejoint celui qui le précède : pense à la collision par l’arrière.', takeaway: 'Un rattrapage est une collision par l’arrière entre deux trains.' },
  81: { hint: 'Pour éviter qu’une circulation ne coupe la trajectoire d’une autre, pense aux protections d’itinéraires et aux zones où le gabarit doit rester libre.', takeaway: 'Les garages francs et les dispositifs des postes d’aiguillage contribuent à prévenir la prise en écharpe.' },
  82: { hint: 'Le régime d’exploitation est une caractéristique de la ligne : cherche le document de référence consulté par le conducteur.', takeaway: 'Le régime d’exploitation d’une ligne se connaît notamment grâce au Livret de Ligne (LiLi).' },
  83: { hint: 'Dans ce régime, les trains des deux sens partagent la même voie : c’est le principe à retenir.', takeaway: 'En voie unique, les trains des deux sens circulent sur la même voie.' },
  84: { hint: 'Distingue les quatre configurations d’infrastructure : voie unique, voie banalisée, double voie et double voie avec contresens.', takeaway: 'Les quatre types cités : voie unique, voie banalisée, double voie, double voie avec installation de contresens.' },
  85: { hint: 'Une IPCS permet temporairement de faire circuler un train à contresens sur une double voie, avec les protections nécessaires.', takeaway: 'Une IPCS permet une circulation à contresens sur une double voie avec les protections adaptées.' },
  86: { hint: 'L’écartement standard français correspond à la valeur de 1,435 m, à distinguer des autres valeurs proposées.', takeaway: 'L’écartement entre les deux files de rails est de 1,435 m.' },
  87: { hint: 'Les appareils de voie servent à modifier l’itinéraire d’une circulation en la faisant passer d’une voie à une autre.', takeaway: 'Les appareils de voie permettent à une circulation de passer d’une voie sur une autre.' },
  88: { hint: 'Après un talonnage, cherche l’aiguille qui revient automatiquement à sa position d’origine.', takeaway: 'La TNR reprend sa position d’origine après le talonnage.' },
  89: { hint: 'Dans les livrets de lignes, la représentation graphique permet de distinguer les voies principales des voies de service.', takeaway: 'Dans les livrets de lignes, les voies principales sont en trait épais et les voies de service en trait fin.' },
  90: { hint: 'Une gare n’est pas seulement un lieu d’arrêt : pense à son ouverture au service de la circulation et aux opérations de sécurité.', takeaway: 'Une gare est une installation ouverte au service de la circulation où des opérations de sécurité peuvent être effectuées.' },
  91: { hint: 'Le cantonnement organise l’espacement entre les trains afin d’éviter qu’un train ne rejoigne celui qui le précède.', takeaway: 'Le cantonnement maintient une distance de sécurité entre les trains et évite notamment les rattrapages.' },
  92: { hint: 'Mémorise les quatre modes : deux sont des formes de block et les autres correspondent au cantonnement téléphonique et au BAL.', takeaway: 'Les quatre modes principaux : CT, BM, BAPR et BAL.' },
  93: { hint: 'Le canton BAL a une valeur maximale habituelle et une exception : retiens d’abord 2 800 m, puis la possibilité exceptionnelle de 3 000 m.', takeaway: 'Un canton BAL mesure en principe 2 800 m au maximum, avec une possibilité exceptionnelle de 3 000 m.' },
  94: { hint: 'Un circuit de voie associe une source, une liaison constituée notamment des rails et un récepteur qui permet de détecter l’état de la voie.', takeaway: 'Un circuit de voie comprend un générateur/émetteur, une ligne de transmission et un récepteur/relais de voie.' },
  95: { hint: 'Pour une implantation normale, regarde le côté du conducteur et la possibilité d’un signal placé au-dessus de la voie.', takeaway: 'Les signaux sont normalement implantés à gauche ou au-dessus de la voie à laquelle ils s’adressent.' },
  96: { hint: 'La croix de Saint-André ne donne pas un aspect de signal : elle indique que le signal est annulé.', takeaway: 'La croix de Saint-André signifie que le signal est annulé.' },
  97: { hint: 'La méthode comporte cinq étapes successives : cherche son nom imagé associé à la forme et aux différents éléments du signal.', takeaway: 'La méthode d’identification en cinq étapes est la « méthode de l’escargot ».' },
  98: { hint: 'Les cinq étapes couvrent l’aspect du signal puis plusieurs plaques et repères permettant de l’identifier sans ambiguïté.', takeaway: 'La méthode de l’escargot examine la forme et le feu, puis la plaque d’identification, l’œilleton, la plaque de cantonnement et la plaque de repérage.' },
  99: { hint: 'Le carré est un signal d’arrêt : la réponse doit exprimer l’action à effectuer avant le signal.', takeaway: 'Le carré commande l’arrêt avant le signal.' },
  100: { hint: 'Le carré violet est lié aux voies de service et à certaines protections d’itinéraires de refoulement, pas à la pleine ligne en général.', takeaway: 'Le carré violet se rencontre sur les voies de service ou pour protéger l’origine d’itinéraires de refoulement.' },
  101: { hint: 'Ne confonds pas le rouge clignotant avec la vitesse générale de la marche à vue : ici, la question porte sur son franchissement.', takeaway: 'Le franchissement d’un rouge clignotant se fait à ≤ 15 km/h avant d’appliquer les prescriptions de la marche à vue.' },
  102: { hint: 'La marche à vue impose une limite de vitesse générale : distingue-la de la valeur spécifique du rouge clignotant.', takeaway: 'En marche à vue, il ne faut pas dépasser 30 km/h.' },
  103: { hint: 'L’avertissement prépare le conducteur à un signal d’arrêt ou à un rouge clignotant : pense à la capacité de s’arrêter ou d’observer.', takeaway: 'L’avertissement impose d’être en mesure de s’arrêter avant le signal d’arrêt annoncé ou d’observer un rouge clignotant.' },
  104: { hint: 'VISA est un acronyme directement lié à la maîtrise de la vitesse avant un signal d’arrêt : retrouve les quatre mots.', takeaway: 'VISA = Vitesse Sécuritaire d’Approche.' },
  105: { hint: 'La VISA suit une progression : changement de comportement, réduction de vitesse, approche maîtrisée, puis arrêt si le signal reste fermé.', takeaway: 'Les 4 phases de la VISA : mémorisation/changement de comportement, réduction de vitesse, approche maîtrisée, arrêt si nécessaire.' },
  106: { hint: 'En début de zone d’approche, la vitesse doit déjà être suffisamment réduite : retiens la limite de 30 km/h sans la confondre avec une vitesse à atteindre exactement.', takeaway: 'Au début de la zone d’approche, la vitesse doit être inférieure à 30 km/h.' },
  107: { hint: 'Au-delà de 160 km/h, un signal supplémentaire prépare l’avertissement : cherche l’aspect clignotant correspondant.', takeaway: 'Au-delà de 160 km/h, un feu vert clignotant précède l’avertissement ou le jaune clignotant.' },
  108: { hint: 'Le jaune clignotant sert lorsque l’avertissement suivant est à distance réduite : il faut pouvoir s’arrêter avant le signal annoncé.', takeaway: 'Le jaune clignotant annonce à distance réduite l’avertissement suivant et impose de pouvoir s’arrêter avant le signal d’arrêt annoncé.' },
  109: { hint: 'Il faut combiner deux critères : une distance courte entre le signal d’arrêt et son avertissement, et une vitesse maximale limitée.', takeaway: 'Double annonce par avertissement : distance < 500 m (exceptionnellement 400 m) et vitesse maximale ≤ 40 km/h.' },
};
function normalizeTheme(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[—–-]/g,'-').replace(/\s+/g,' ').trim().toLocaleLowerCase('fr-FR')}
function getThemeGroup(value){return THEME_GROUPS.find(group=>group.value===value)}
function questionMatchesTheme(q,value){
  if(value==='all'||!value)return true;
  const group=getThemeGroup(value);
  const theme=normalizeTheme(q.theme);
  // Compatibilité : si une ancienne valeur de thème est encore présente
  // dans un favori, une reprise de session ou une donnée locale, on la traite
  // directement au lieu de produire une sélection vide.
  if(!group)return normalizeTheme(value)===theme;
  return group.themes.some(item=>normalizeTheme(item)===theme);
}
function populateThemes(){
  const s=$("#theme");
  if(!s)return;
  // Les options principales sont présentes directement dans quiz.html.
  // On ne vide donc plus le menu au chargement : même si une amélioration
  // secondaire rencontre une erreur, les thèmes restent immédiatement accessibles.
  const validValues=['all',...THEME_GROUPS.map(group=>group.value)];
  if(!validValues.includes(s.value))s.value='all';
  updateCountOptions();
}
function updateCountOptions(){
  const s=$("#theme"),c=$("#count");
  if(!s||!c||typeof QUESTIONS==='undefined')return;
  const theme=s.value;
  const available=QUESTIONS.filter(q=>questionMatchesTheme(q,theme)).length;
  const previous=c.value;
  [...c.options].forEach(o=>{
    if(o.value==='all'){
      o.textContent=`Toutes les questions (${available})`;
      o.disabled=false;
    }else{
      const n=Number(o.value);
      o.disabled=n>available;
      o.textContent=`${n} question${n>1?'s':''}${n>available?' — indisponible pour ce thème':''}`;
    }
  });
  if(previous!=='all'&&Number(previous)>available)c.value='all';
}
function updateModeUI(){const m=$("#mode");mode=m.value;const simulation=mode==='simulation';$("#modeDescription").textContent=mode==='revision'?'Correction immédiate avec explication après chaque question.':simulation?'Simulation proche d’un examen : questions mélangées, aucune correction ni indication de matière pendant le test, chronomètre et bilan uniquement à la fin.':'Pas de correction pendant le test : bilan complet uniquement à la fin.';$("#timerWrap").classList.toggle('d-none',mode==='revision');$("#themeWrap").classList.toggle('d-none',simulation);if(simulation){$("#theme").value='all';updateCountOptions();} }
function smartShuffle(a){const stats=typeof getQuestionStats==='function'?getQuestionStats():{};return shuffle(a).sort((a,b)=>{const sa=stats[String(a.id)],sb=stats[String(b.id)];const ta=sa?.lastDate?new Date(sa.lastDate).getTime():0,tb=sb?.lastDate?new Date(sb.lastDate).getTime():0;if(ta!==tb)return ta-tb;return 0})}
function startQuiz(){clearInterval(timer);targetedMode=false;mode=$("#mode").value;shuffleAnswersEnabled=$("#shuffleAnswers").checked;let t=$("#theme").value,c=$("#count").value;let pool=mode==='simulation'?[...QUESTIONS]:QUESTIONS.filter(q=>questionMatchesTheme(q,t));pool=smartShuffle(pool);quizQuestions=c==='all'?pool:pool.slice(0,Number(c));if(!quizQuestions.length){alert('Aucune question disponible pour cette sélection.');return}currentIndex=0;score=0;answered=false;errors=[];sessionStart=Date.now();sessionElapsed=0;$("#setup").classList.add('d-none');$("#history").classList.add('d-none');$("#targeted").classList.add('d-none');$("#result").classList.add('d-none');$("#marked")?.classList.add('d-none');$("#quiz").classList.remove('d-none');examSeconds=(mode==='exam'||mode==='simulation')?Number($("#duration").value)*60:0;updateTimer();if(mode==='exam'||mode==='simulation')timer=setInterval(()=>{examSeconds--;updateTimer();if(examSeconds<=0){clearInterval(timer);finish(true)}},1000);showQuestion()}
function startTargetedQuiz(){const theme=$("#targetTheme").value,scope=$("#targetScope").value,count=$("#targetCount").value;const stats=getQuestionStats();let pool=QUESTIONS.filter(q=>questionMatchesTheme(q,theme)).filter(q=>{const st=stats[String(q.id)];return scope==='errors'?!!(st&&st.wrong>0):isNeedsReview(st)});if(!pool.length){alert(scope==='errors'?'Aucune question déjà ratée ne correspond à cette sélection.':'Aucune question à revoir ne correspond à cette sélection.');return}pool=shuffle(pool);quizQuestions=count==='all'?pool:pool.slice(0,Number(count));currentIndex=0;score=0;answered=false;errors=[];mode='revision';targetedMode=true;sessionStart=Date.now();sessionElapsed=0;clearInterval(timer);$("#targeted").classList.add('d-none');$("#history").classList.add('d-none');$("#result").classList.add('d-none');$("#setup").classList.add('d-none');$("#quiz").classList.remove('d-none');$("#timer").textContent='';showQuestion()}
function updateTimer(){const el=$("#timer");if(mode!=='exam'&&mode!=='simulation'){el.textContent='';return}const m=Math.floor(Math.max(0,examSeconds)/60),sec=Math.max(0,examSeconds)%60;el.textContent=`⏱ ${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;el.className='badge '+(examSeconds<=30?'text-bg-danger':'text-bg-warning')}
function showQuestion(){
  answered=false;
  const q=quizQuestions[currentIndex];
  const simulation=mode==='simulation';
  const isLast=currentIndex===quizQuestions.length-1;
  const diff=q.difficulty||'medium';

  $('#progressText').textContent=`Question ${currentIndex+1} / ${quizQuestions.length}`;
  $('#scoreLive').textContent=`Score : ${score}`;
  $('#scoreLive').classList.toggle('d-none',mode==='exam'||simulation);
  $('#progressBar').style.width=`${((currentIndex+1)/quizQuestions.length)*100}%`;
  $('#themeBadge').textContent=q.theme;
  $('#themeBadge').classList.toggle('d-none',simulation);
  $('#difficultyBadge').textContent=difficultyLabels[diff]||'Intermédiaire';
  $('#difficultyBadge').className=`badge ${diff==='easy'?'text-bg-success':diff==='hard'?'text-bg-danger':'text-bg-secondary'}`;
  $('#trapBadge').classList.add('d-none');
  $('#question').textContent=q.question;
  $('#instruction').textContent=q.type==='multiple'?'Plusieurs réponses peuvent être correctes.':q.type==='truefalse'?'Indique si l’affirmation est vraie ou fausse.':'Une seule réponse est correcte.';
  $('#markQuestionBtn').textContent=isMarked(q.id)?'★ Marquée':'☆ À revoir';
  $('#markQuestionBtn').className=`btn btn-sm ${isMarked(q.id)?'btn-warning':'btn-outline-secondary'} ms-auto`;
  $('#keyboardHelp').classList.toggle('d-none',simulation||mode==='exam');

  let ans=q.answers.map((text,index)=>({text,index}));
  if(shuffleAnswersEnabled)ans=shuffle(ans);
  const box=$('#answers');
  box.innerHTML='';
  ans.forEach((a,n)=>{
    const b=document.createElement('button');
    b.className='btn btn-outline-secondary answer-btn';
    b.textContent=`${n+1}. ${a.text}`;
    b.dataset.index=a.index;
    b.dataset.shortcut=n+1;
    b.onclick=()=>toggle(b,q);
    box.appendChild(b);
  });

  $('#hint').className='alert alert-warning mt-2 d-none';
  $('#hint').textContent=getHint(q);
  $('#hintBtn').classList.toggle('d-none',mode!=='revision');
  $('#feedback').className='alert mt-4 d-none';
  $('#validateBtn').classList.remove('d-none');
  $('#nextBtn').classList.add('d-none');
  $('#finishBtn').classList.add('d-none');
  $('#finishBtn').textContent='Terminer le quiz';

  // En examen/simulation, la dernière question se termine directement sans bouton « Question suivante ».
  if((mode==='exam'||mode==='simulation')&&isLast){
    $('#validateBtn').classList.add('d-none');
    $('#finishBtn').classList.remove('d-none');
  }
}

function toggle(b,q){if(answered)return;if(q.type!=='multiple')document.querySelectorAll('.answer-btn').forEach(x=>x.classList.remove('selected'));b.classList.toggle('selected')}
function selected(){return[...document.querySelectorAll('.answer-btn.selected')].map(b=>Number(b.dataset.index))}
function same(a,b){a=[...a].sort();b=[...b].sort();return a.length===b.length&&a.every((v,i)=>v===b[i])}
function validate(){
  if(answered)return;
  const q=quizQuestions[currentIndex],sel=selected();
  if(!sel.length){alert('Sélectionne au moins une réponse.');return}

  answered=true;
  const ok=same(sel,q.correct);
  if(ok)score++;else errors.push({q,selected:sel});

  document.querySelectorAll('.answer-btn').forEach(b=>{
    const i=Number(b.dataset.index);
    if(mode==='revision'){
      if(q.correct.includes(i))b.classList.add('correct');
      else if(sel.includes(i))b.classList.add('wrong');
    }
    b.disabled=true;
  });

  $('#hintBtn').classList.add('d-none');

  if(mode==='revision'){
    const f=$('#feedback');
    const takeaway=getTakeaway(q);
    f.className=`alert mt-4 ${ok?'alert-success':'alert-danger'}`;
    f.innerHTML=`
      <strong>${ok?'Bonne réponse !':'À revoir.'}</strong>
      <div class="mt-2"><strong>Explication :</strong> ${escapeHtml(q.explanation||'La réponse correcte correspond à la règle testée dans cette question.')}</div>
      <div class="enhanced-feedback mt-3 pt-3 border-top">
        <strong>📌 À retenir</strong>
        <p class="mb-0 mt-1">${escapeHtml(takeaway)}</p>
      </div>
      ${q.trap?`<div class="mt-2 text-warning-emphasis"><strong>⚠️ Attention au piège :</strong> ${escapeHtml(q.trapNote||'Attention à la formulation des propositions.')}</div>`:''}`;
    if(q.trap)$('#trapBadge').classList.remove('d-none');
    $('#validateBtn').classList.add('d-none');
    if(currentIndex===quizQuestions.length-1){
      $('#finishBtn').classList.remove('d-none');
      $('#finishBtn').textContent='Terminer le quiz';
    }else{
      $('#nextBtn').classList.remove('d-none');
    }
  }else{
    next();
  }
}
function next(){
  if(currentIndex<quizQuestions.length-1){
    currentIndex++;
    showQuestion();
  }else{
    finish(false);
  }
}
function finishCurrentQuiz(){
  if(!answered){
    const sel=selected();
    if(!sel.length){alert('Sélectionne au moins une réponse.');return}
    validate();
    // En révision, la correction reste visible avant de terminer.
    // En examen/simulation, validate() termine déjà la dernière question.
    return;
  }
  finish(false);
}

function saveSession(timeUp=false){const now=Date.now();sessionElapsed=Math.max(0,Math.round((now-(sessionStart||now))/1000));const sessions=JSON.parse(localStorage.getItem('quizSessions')||'[]');const theme=targetedMode?'Entraînement ciblé':mode==='simulation'?'Tous les thèmes (simulation)':$("#theme").value==='all'?'Tous les thèmes':$("#theme").value;const p=Math.round(score/quizQuestions.length*100);const outcomes=[];quizQuestions.forEach((q,i)=>{let outcome='unanswered';if(i<currentIndex)outcome=errors.some(e=>String(e.q.id)===String(q.id))?'wrong':'correct';else if(i===currentIndex&&answered)outcome=errors.some(e=>String(e.q.id)===String(q.id))?'wrong':'correct';outcomes.push({questionId:q.id,outcome})});sessions.unshift({id:Date.now(),date:new Date().toISOString(),mode,theme,count:quizQuestions.length,score,percent:p,errors:errors.length,duration:sessionElapsed,timeUp,outcomes});localStorage.setItem('quizSessions',JSON.stringify(sessions.slice(0,100)));renderBadges()}
function finish(timeUp=false){clearInterval(timer);saveSession(timeUp);if($('#resultDuration'))$('#resultDuration').textContent=`Temps passé : ${formatDuration(sessionElapsed)}`;$("#quiz").classList.add('d-none');$("#result").classList.remove('d-none');const p=Math.round(score/quizQuestions.length*100);$("#resultScore").textContent=`${score} / ${quizQuestions.length} — ${p} %`;$("#resultMessage").textContent=(timeUp?'Temps écoulé. ':'')+(p>=90?'Excellent.':p>=75?'Très bon résultat.':p>=60?'Bonne base, mais certains points sont à consolider.':'Il faut encore réviser.');$("#resultMode").textContent=targetedMode?'Entraînement ciblé':mode==='simulation'?'Simulation examen':mode==='exam'?'Mode examen':'Mode révision';$("#errorCount").textContent=`${errors.length} question${errors.length>1?'s':''} à revoir`;const list=$("#errorList");list.innerHTML='';if(errors.length){errors.forEach((e,n)=>{const li=document.createElement('li');li.innerHTML=`<strong>${n+1}. ${e.q.question}</strong><br><span class="text-secondary">Réponse correcte : ${e.q.correct.map(i=>e.q.answers[i]).join(' / ')}</span>`;list.appendChild(li)});$("#errorsCard").classList.remove('d-none');localStorage.setItem('quizLastErrors',JSON.stringify(errors.map(e=>e.q.id)))}else{$("#errorsCard").classList.add('d-none');localStorage.removeItem('quizLastErrors')}}
function reviewErrors(){const ids=JSON.parse(localStorage.getItem('quizLastErrors')||'[]');if(!ids.length){alert('Aucune erreur enregistrée.');return}const pool=QUESTIONS.filter(q=>ids.includes(q.id)||ids.includes(String(q.id)));quizQuestions=shuffle(pool);mode='revision';targetedMode=true;currentIndex=0;score=0;errors=[];sessionStart=Date.now();$("#setup").classList.add('d-none');$("#result").classList.add('d-none');$("#targeted").classList.add('d-none');$("#quiz").classList.remove('d-none');showQuestion()}
function back(){$('#result').classList.add('d-none');$('#quiz').classList.add('d-none');$('#history').classList.add('d-none');$('#targeted').classList.add('d-none');$('#marked')?.classList.add('d-none');$('#setup').classList.remove('d-none');clearInterval(timer);targetedMode=false}
function quitQuiz(){if(!confirm('Quitter ce quiz ? La progression de cette session ne sera pas enregistrée.'))return;clearInterval(timer);timer=null;quizQuestions=[];currentIndex=0;score=0;answered=false;errors=[];sessionStart=null;sessionElapsed=0;targetedMode=false;$('#quiz').classList.add('d-none');$('#result').classList.add('d-none');$('#history').classList.add('d-none');$('#targeted').classList.add('d-none');$('#setup').classList.remove('d-none');updateModeUI();updateCountOptions()}
function formatDuration(sec){if(sec<60)return `${sec}s`;const m=Math.floor(sec/60),s=sec%60;return `${m} min${s?` ${s}s`:''}`}
function formatDate(iso){return new Date(iso).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'})}
function getQuestionStats(){const resetAt=getStatsResetAt();const sessions=JSON.parse(localStorage.getItem('quizSessions')||'[]').filter(s=>!resetAt||new Date(s.date).getTime()>resetAt),stats={};sessions.forEach(s=>{(s.outcomes||[]).forEach(o=>{const id=String(o.questionId);if(!stats[id])stats[id]={attempts:0,correct:0,wrong:0,last:null,lastDate:null};if(o.outcome==='correct'||o.outcome==='wrong'){stats[id].attempts++;stats[id][o.outcome]++;stats[id].last=o.outcome;stats[id].lastDate=s.date}})});return stats}
function isNeedsReview(st){if(!st||!st.attempts)return false;const rate=st.correct/st.attempts*100;return st.last==='wrong'||rate<80||st.attempts<3}
function masteryStatus(st){if(!st||!st.attempts)return {label:'Non évaluée',class:'text-secondary'};const rate=st.correct/st.attempts*100;const resetAt=getStatsResetAt();const sessions=JSON.parse(localStorage.getItem('quizSessions')||'[]').filter(s=>!resetAt||new Date(s.date).getTime()>resetAt);let recent=[];sessions.forEach(s=>(s.outcomes||[]).forEach(o=>{if(String(o.questionId)===String(st.questionId)&&(o.outcome==='correct'||o.outcome==='wrong'))recent.push(o.outcome)}));const lastTwo=recent.slice(0,2);if(st.attempts>=3&&rate>=80&&lastTwo.length===2&&lastTwo.every(x=>x==='correct'))return {label:'🟢 Maîtrisée',class:'mastery-green'};if(st.last==='wrong'||rate<50)return {label:'🔴 À revoir',class:'mastery-red'};return {label:'🟠 En cours',class:'mastery-orange'}}
function populateTargetThemes(){
  const s=$("#targetTheme");
  if(!s)return;
  s.innerHTML='<option value="all">Toutes les matières</option>';
  THEME_GROUPS.forEach(group=>{
    const o=document.createElement('option');
    o.value=group.value;
    o.textContent=group.label;
    s.appendChild(o);
  });
  updateTargetInfo();
}
function updateTargetInfo(){const theme=$("#targetTheme").value,scope=$("#targetScope").value,stats=getQuestionStats();const pool=QUESTIONS.filter(q=>questionMatchesTheme(q,theme)).filter(q=>{const st=stats[String(q.id)];return scope==='errors'?!!(st&&st.wrong>0):isNeedsReview(st)});$("#targetInfo").innerHTML=`<span class="targeted-count">${pool.length}</span> question${pool.length>1?'s':''} disponible${pool.length>1?'s':''} pour cet entraînement.`;const c=$("#targetCount");[...c.options].forEach(o=>{if(o.value==='all')return;const n=Number(o.value);o.disabled=n>pool.length;o.textContent=`${n} question${n>1?'s':''}${n>pool.length?' — indisponible':''}`});if(c.value!=='all'&&Number(c.value)>pool.length)c.value='all'}

function applyTheme(){const dark=localStorage.getItem('quizDarkMode')==='1';const root=document.documentElement;root.setAttribute('data-bs-theme',dark?'dark':'light');root.classList.toggle('dark-mode',dark);if(document.body)document.body.classList.toggle('dark-mode',dark);const b=$('#themeToggle');if(b){b.textContent=dark?'☀️':'🌙';b.title=dark?'Désactiver le mode sombre':'Activer le mode sombre';b.setAttribute('aria-label',b.title)}}
function toggleDarkMode(){const dark=localStorage.getItem('quizDarkMode')==='1';localStorage.setItem('quizDarkMode',dark?'0':'1');applyTheme()}
document.addEventListener('keydown',e=>{if($('#quiz').classList.contains('d-none'))return;if(e.target.matches('input,textarea,select'))return;const q=quizQuestions[currentIndex];if(!q)return;if(/^[1-9]$/.test(e.key)){const n=Number(e.key)-1;const btn=[...document.querySelectorAll('.answer-btn')][n];if(btn){toggle(btn,q);e.preventDefault()}}else if(e.key==='Enter'){e.preventDefault();if(!answered)validate();else next()}else if(e.key.toLowerCase()==='m'){toggleMarked(q.id)}else if(e.key.toLowerCase()==='i'&&mode==='revision'&&!answered){$('#hintBtn').click()}});

function getHint(q){return QUESTION_GUIDANCE[String(q.id)]?.hint||q.hint||'Identifie précisément la règle, la valeur ou la situation demandée avant de comparer les propositions.'}
function getTakeaway(q){return QUESTION_GUIDANCE[String(q.id)]?.takeaway||q.takeaway||q.explanation||''}

function getFilteredSessions(){const sessions=JSON.parse(localStorage.getItem('quizSessions')||'[]');const mf=$("#historyModeFilter")?.value||'all',tf=$("#historyThemeFilter")?.value||'all',pf=$("#historyPeriodFilter")?.value||'all';const now=Date.now();return sessions.filter(s=>{if(mf!=='all'&&s.mode!==mf)return false;if(tf!=='all'&&s.theme!==tf)return false;if(pf!=='all'&&now-new Date(s.date).getTime()>Number(pf)*86400000)return false;return true})}
function populateHistoryThemeFilter(sessions){const sel=$("#historyThemeFilter");if(!sel)return;const current=sel.value;const themes=[...new Set(sessions.map(s=>s.theme))].sort((a,b)=>a.localeCompare(b));sel.innerHTML='<option value="all">Toutes les matières</option>'+themes.map(t=>`<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');sel.value=themes.includes(current)?current:'all'}
function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function showHistory(){clearInterval(timer);targetedMode=false;$("#setup").classList.add('d-none');$("#quiz").classList.add('d-none');$("#result").classList.add('d-none');$("#targeted").classList.add('d-none');$("#history").classList.remove('d-none');const allSessions=JSON.parse(localStorage.getItem('quizSessions')||'[]');populateHistoryThemeFilter(allSessions);const resetAt=getStatsResetAt();const sessions=getFilteredSessions().filter(s=>!resetAt||new Date(s.date).getTime()>resetAt);const displaySessions=getFilteredSessions();const body=$("#historyBody"),progressBody=$("#progressBody"),masteryBody=$("#masteryBody");body.innerHTML='';progressBody.innerHTML='';masteryBody.innerHTML='';let total=0,best=0,sum=0;const modeCounts={},byTheme={};sessions.forEach(s=>{total++;best=Math.max(best,s.percent);sum+=s.percent;modeCounts[s.mode]=(modeCounts[s.mode]||0)+1;const tr=document.createElement('tr');tr.innerHTML=`<td>${formatDate(s.date)}</td><td>${s.mode==='simulation'?'<span class="badge text-bg-success">Simulation</span>':s.mode==='exam'?'<span class="badge text-bg-dark">Examen</span>':'<span class="badge text-bg-primary">Révision</span>'}</td><td>${escapeHtml(s.theme)}</td><td class="fw-semibold">${s.score}/${s.count} (${s.percent}%)</td><td>${formatDuration(s.duration)}${s.timeUp?' ⏱':''}</td><td>${s.errors}</td><td><button class="btn btn-sm btn-outline-danger delete-session-btn" data-session-id="${s.id}" type="button">Supprimer</button></td>`;body.appendChild(tr);if(s.theme!=='Tous les thèmes'&&s.theme!=='Tous les thèmes (simulation)'&&s.theme!=='Entraînement ciblé'){if(!byTheme[s.theme])byTheme[s.theme]=[];byTheme[s.theme].push(s)}});Object.entries(byTheme).forEach(([theme,list])=>{list.sort((a,b)=>new Date(a.date)-new Date(b.date));const avg=Math.round(list.reduce((sum,s)=>sum+s.percent,0)/list.length);const bestTheme=Math.max(...list.map(s=>s.percent));const last=list[list.length-1],previous=list.length>1?list[list.length-2]:null;const evolution=previous?last.percent-previous.percent:null;const evolutionHtml=evolution===null?'<span class="text-secondary">—</span>':`<span class="fw-semibold ${evolution>0?'text-success':evolution<0?'text-danger':'text-secondary'}">${evolution>0?'+':''}${evolution} pts</span>`;const tr=document.createElement('tr');tr.innerHTML=`<td class="fw-semibold">${escapeHtml(theme)}</td><td>${list.length}</td><td>${avg}%</td><td>${bestTheme}%</td><td class="fw-semibold">${last.percent}% <span class="text-secondary fw-normal">(${last.score}/${last.count})</span></td><td>${evolutionHtml}</td><td>${formatDate(last.date)}</td>`;progressBody.appendChild(tr)});const stats=getQuestionStats();const questionsById={};QUESTIONS.forEach(q=>questionsById[String(q.id)]=q);const masteryRows=Object.entries(stats).map(([id,st])=>{st.questionId=id;return {q:questionsById[id],st,status:masteryStatus(st)}}).filter(x=>x.q).sort((a,b)=>{const rank={"mastery-red":0,"mastery-orange":1,"mastery-green":2,"text-secondary":3};return rank[a.status.class]-rank[b.status.class]||a.q.theme.localeCompare(b.q.theme)||a.q.id-b.q.id});masteryRows.forEach(({q,st,status})=>{const rate=Math.round(st.correct/st.attempts*100);const tr=document.createElement('tr');tr.innerHTML=`<td>${escapeHtml(q.question)}</td><td>${escapeHtml(q.theme)}</td><td>${st.attempts}</td><td>${rate}%</td><td>${st.last==='correct'?'<span class="text-success">Réussie</span>':'<span class="text-danger">Ratée</span>'}</td><td class="${status.class}">${status.label}</td>`;masteryBody.appendChild(tr)});const masterySummary=$("#masterySummary"),masteryDetails=$("#masteryDetails"),toggleMasteryBtn=$("#toggleMasteryBtn");if(masterySummary){const counts={red:0,orange:0,green:0};masteryRows.forEach(x=>{if(x.status.class==='mastery-red')counts.red++;else if(x.status.class==='mastery-orange')counts.orange++;else if(x.status.class==='mastery-green')counts.green++});masterySummary.innerHTML=`<div class="col-4"><div class="mastery-summary-card mastery-summary-red"><strong>${counts.red}</strong><span>À revoir</span></div></div><div class="col-4"><div class="mastery-summary-card mastery-summary-orange"><strong>${counts.orange}</strong><span>En cours</span></div></div><div class="col-4"><div class="mastery-summary-card mastery-summary-green"><strong>${counts.green}</strong><span>Maîtrisées</span></div></div>`}if(masteryDetails&&toggleMasteryBtn){masteryDetails.classList.add('d-none');toggleMasteryBtn.setAttribute('aria-expanded','false');toggleMasteryBtn.textContent='Afficher le détail'}renderProgressChart(sessions);$("#historySummary").innerHTML=`<div class="col-6 col-md-3"><div class="border rounded p-2 text-center"><div class="small text-secondary">Sessions</div><strong>${total}</strong></div></div><div class="col-6 col-md-3"><div class="border rounded p-2 text-center"><div class="small text-secondary">Moyenne</div><strong>${total?Math.round(sum/total):0}%</strong></div></div><div class="col-6 col-md-3"><div class="border rounded p-2 text-center"><div class="small text-secondary">Meilleur score</div><strong>${best}%</strong></div></div><div class="col-6 col-md-3"><div class="border rounded p-2 text-center"><div class="small text-secondary">Examens</div><strong>${(modeCounts.exam||0)+(modeCounts.simulation||0)}</strong></div></div>`;if(!sessions.length){body.innerHTML='<tr><td colspan="7" class="text-center text-secondary py-4">Aucune session ne correspond aux filtres sélectionnés.</td></tr>';progressBody.innerHTML='<tr><td colspan="7" class="text-center text-secondary py-4">Aucune progression disponible pour cette sélection.</td></tr>';masteryBody.innerHTML='<tr><td colspan="6" class="text-center text-secondary py-4">Aucune donnée de maîtrise à afficher.</td></tr>'}else if(!Object.keys(byTheme).length){progressBody.innerHTML='<tr><td colspan="7" class="text-center text-secondary py-4">Fais au moins un quiz avec un thème précis pour afficher ta progression par matière.</td></tr>'}else if(!masteryRows.length){masteryBody.innerHTML='<tr><td colspan="6" class="text-center text-secondary py-4">Le suivi de maîtrise apparaîtra avec les nouvelles sessions.</td></tr>'}}

function renderProgressChart(sessions){const el=$("#progressChart");if(!sessions.length){el.innerHTML='<div class="text-secondary py-5 text-center">Le graphique apparaîtra après tes premières sessions.</div>';return}const data=[...sessions].reverse().slice(-20);const w=Math.max(620,data.length*65),h=240,pad={l:42,r:20,t:20,b:48};const innerW=w-pad.l-pad.r,innerH=h-pad.t-pad.b;const x=i=>data.length===1?pad.l+innerW/2:pad.l+(i/(data.length-1))*innerW;const y=v=>pad.t+(100-v)/100*innerH;let svg=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Évolution des scores des dernières sessions">`;[0,25,50,75,100].forEach(v=>{svg+=`<line class="chart-grid" x1="${pad.l}" y1="${y(v)}" x2="${w-pad.r}" y2="${y(v)}"></line><text x="${pad.l-8}" y="${y(v)+4}" text-anchor="end">${v}%</text>`});const points=data.map((s,i)=>`${x(i)},${y(s.percent)}`).join(' ');svg+=`<polyline class="chart-line" points="${points}"></polyline>`;data.forEach((s,i)=>{const label=formatDate(s.date).split(' ')[0];svg+=`<circle class="chart-point" cx="${x(i)}" cy="${y(s.percent)}" r="4"><title>${formatDate(s.date)} — ${s.percent}% — ${s.theme}</title></circle><text x="${x(i)}" y="${h-18}" text-anchor="middle">${label}</text>`});svg+='</svg>';el.innerHTML=svg}
function deleteSession(id){const sessions=JSON.parse(localStorage.getItem('quizSessions')||'[]');const next=sessions.filter(s=>String(s.id)!==String(id));if(next.length===sessions.length)return;if(confirm('Supprimer cette session de l’historique ?')){localStorage.setItem('quizSessions',JSON.stringify(next));showHistory();updateTargetInfo()}}
function clearHistory(){if(confirm('Effacer tout l’historique des sessions ?')){localStorage.removeItem('quizSessions');localStorage.removeItem('quizLastErrors');showHistory();updateTargetInfo()}}
function initQuizPage(){
  // Les boutons sont reliés avant le remplissage des menus afin qu'une erreur secondaire
  // ne puisse plus empêcher le lancement du quiz.
  const bind=(selector,event,handler)=>{const el=$(selector);if(el)el[event]=handler};
  bind('#markQuestionBtn','onclick',()=>{const q=quizQuestions[currentIndex];if(q)toggleMarked(q.id)});
  bind('#markedBtn','onclick',showMarked);
  bind('#closeMarkedBtn','onclick',back);
  bind('#startMarkedBtn','onclick',startMarkedQuiz);
  bind('#resetStatsBtn','onclick',resetStats);
  bind('#themeToggle','onclick',toggleDarkMode);
  bind('#toggleMasteryBtn','onclick',()=>{const d=$("#masteryDetails"),b=$("#toggleMasteryBtn");if(!d||!b)return;const hidden=d.classList.toggle('d-none');b.setAttribute('aria-expanded',String(!hidden));b.textContent=hidden?'Afficher le détail':'Masquer le détail'});
  bind('#courseBtn','onclick',()=>{window.location.href="cours.html"});
  bind('#closeCourseBtn','onclick',back);
  bind('#mode','onchange',updateModeUI);
  bind('#theme','onchange',updateCountOptions);
  bind('#startBtn','onclick',startQuiz);
  bind('#homeHistoryBtn','onclick',showHistory);
  bind('#targetedBtn','onclick',()=>{$('#setup').classList.add('d-none');$('#history').classList.add('d-none');$('#quiz').classList.add('d-none');$('#result').classList.add('d-none');$('#targeted').classList.remove('d-none');populateTargetThemes();updateTargetInfo()});
  bind('#targetTheme','onchange',updateTargetInfo);
  bind('#targetScope','onchange',updateTargetInfo);
  bind('#startTargetBtn','onclick',startTargetedQuiz);
  bind('#closeTargetBtn','onclick',back);
  bind('#quitQuizBtn','onclick',quitQuiz);
  bind('#hintBtn','onclick',()=>{$('#hint').classList.remove('d-none');$('#hintBtn').classList.add('d-none')});
  bind('#validateBtn','onclick',validate);
  bind('#nextBtn','onclick',next);
  bind('#finishBtn','onclick',finishCurrentQuiz);
  bind('#restartBtn','onclick',startQuiz);
  bind('#backBtn','onclick',back);
  bind('#reviewErrorsBtn','onclick',reviewErrors);
  bind('#historyBtn','onclick',showHistory);
  bind('#closeHistoryBtn','onclick',back);
  bind('#clearHistoryBtn','onclick',clearHistory);
  bind('#historyModeFilter','onchange',showHistory);
  bind('#historyThemeFilter','onchange',showHistory);
  bind('#historyPeriodFilter','onchange',showHistory);
  const historyBody=$('#historyBody');
  if(historyBody)historyBody.onclick=e=>{const btn=e.target.closest('.delete-session-btn');if(btn)deleteSession(btn.dataset.sessionId)};

  // Le menu principal des thèmes est déjà disponible dans le HTML.
  // Les fonctions de confort sont isolées pour ne jamais bloquer le lancement du quiz.
  try{populateThemes()}catch(e){console.warn('Thèmes indisponibles:',e)}
  try{populateTargetThemes()}catch(e){console.warn('Entraînement ciblé indisponible:',e)}
  try{updateModeUI()}catch(e){console.warn('Mode du quiz indisponible:',e)}
  try{applyTheme()}catch(e){console.warn('Thème visuel indisponible:',e)}
  try{renderBadges()}catch(e){console.warn('Badges indisponibles:',e)}
  try{renderMarkedList()}catch(e){console.warn('Liste des questions marquées indisponible:',e)}
}

// Exposition explicite des actions principales : le lancement et le thème restent
// accessibles même si une amélioration secondaire rencontre une erreur.
window.startQuiz=startQuiz;
window.toggleDarkMode=toggleDarkMode;
window.applyTheme=applyTheme;
window.updateModeUI=updateModeUI;

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initQuizPage,{once:true});else initQuizPage();

