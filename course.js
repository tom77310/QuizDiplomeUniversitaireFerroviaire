const COURSE = [
  {
    id:'securite', icon:'🦺', title:'EC 21-1 — Généralités de la sécurité du personnel',
    subtitle:'Les principes de base de la sécurité du personnel et les règles essentielles à connaître.',
    
    sections:[
      {title:'1. Les 5 risques majeurs', bullets:[
        'Risque de heurt / souffle.',
        'Risque électrique.',
        'Risque de chute.',
        'Risque lié aux matières dangereuses.',
        'Risque électromagnétique.'
      ], key:'À mémoriser dans cet ordre : heurt/souffle — électrique — chute — matières dangereuses — électromagnétique.'},
      {title:'2. Les facteurs aggravants', bullets:[
        'Des facteurs aggravants peuvent augmenter la fréquence ou la gravité des risques.',
        'Les facteurs aggravants comprennent notamment le manque d’expérience, la fatigue, l’excès de confiance, l’état de santé et les conditions atmosphériques.'
      ], key:'La fatigue n’est donc pas un risque majeur en elle-même dans cette liste : c’est un facteur aggravant.'},
      {title:'3. Principes à respecter', bullets:[
        'Toute voie est réputée parcourue par des véhicules de transport ferroviaire.',
        'Sur une ligne à double voie ou à voies multiples, il faut garder à l’esprit qu’une circulation peut se faire à contre-voie ou à contresens et que la circulation normale peut être rétablie inopinément.',
        'Dans les zones de gare, les circulations peuvent survenir à tout moment et dans l’un ou l’autre sens.'
      ], key:'Une voie ne doit jamais être considérée comme sûre parce qu’aucun train n’est visible.'},
      {title:'4. Obligations, interdictions et tenue', bullets:[
        'Parmi les obligations : appliquer les principes de prévention, porter les EPI, porter secours aux victimes d’accident et appliquer les soins prévus en cas de blessure.',
        'Il est interdit de se déplacer ou de stationner dans l’enceinte du SFN sauf nécessité de service ou obligation.',
        'Ne pas porter de vêtements flottants, de short, pantacourt, jupe, etc.',
        'Ne pas utiliser de ceintures ou certains objets en bandoulière qui ne permettent pas un dégagement rapide en cas d’accrochage.',
        'Porter les chaussures de sécurité fermées et antidérapantes mises à disposition par l’entreprise.',
        'Ne pas se couvrir les oreilles et ne pas gêner sa vision.',
        'Ne pas tenter de rattraper sa coiffure lorsqu’elle est enlevée par le déplacement d’air d’une circulation.',
        'Ne pas utiliser de parapluie.'
      ], key:'La tenue et le comportement doivent éviter tout risque d’accrochage, de perte de visibilité ou de gêne lors du passage d’une circulation.'}
    ]
  },
  {
    id:'cheminement', icon:'🚶', title:'EC 21-2 — Cheminement et traversées des voies',
    subtitle:'Les règles essentielles pour cheminer et traverser les voies en sécurité.',
    
    sections:[
      {title:'1. Principe fondamental', bullets:[
        'Pour ne pas être exposé aux risques d’être heurté, accroché ou de subir l’effet de souffle, il est impératif de ne pas engager la zone dangereuse.',
        'Si l’engagement est absolument nécessaire, notamment pour une traversée obligatoire, il faut respecter la règle prévue à cet effet.'
      ], key:'Premier réflexe : ne pas engager la zone dangereuse.'},
      {title:'2. Qu’est-ce que la zone dangereuse ?', bullets:[
        'La zone dangereuse (ZD) est la zone dans laquelle une personne est exposée aux risques de heurt, d’accrochage ou d’effet de souffle.',
        'Elle est définie voie par voie avec ses limites.',
        'Il est interdit de stationner dans la zone dangereuse.',
        'Sur les voies où la vitesse limite est inférieure ou égale à 40 km/h, la distance indiquée est de 1,25 m.'
      ], key:'≤ 40 km/h → 1,25 m de distance à respecter par rapport à la zone dangereuse.'},
      {title:'3. Cheminer sur les pistes', bullets:[
        'Le tracé des pistes prend en compte les limites de la zone dangereuse.',
        'L’emprunt des pistes garantit de ne pas engager la zone dangereuse.',
        'L’opérateur doit suivre les pistes et les itinéraires figurant sur les schémas affichés aux principaux accès.',
        'Utiliser les chemins publics chaque fois que possible.',
        'Ne se déplacer dans les emprises du chemin de fer qu’en cas de nécessité de service.'
      ], key:'Piste aménagée = itinéraire prévu pour rester hors de la zone dangereuse.'},
      {title:'4. Délai de visibilité pour traverser', bullets:[
        'Avant tout engagement de la zone dangereuse, il est impératif de disposer d’un délai de visibilité.',
        'Le délai doit être suffisant pour chaque sens de circulation.',
        'Plateforme à 1 ou 2 voies : au moins 10 secondes.',
        'Plateforme à 3 ou 4 voies : au moins 15 secondes.',
        'Plateforme à 5 ou 6 voies : au moins 20 secondes.'
      ], key:'10 s → 1–2 voies ; 15 s → 3–4 voies ; 20 s → 5–6 voies.'},
      {title:'5. Traverser une voie occupée', bullets:[
        'Pour traverser une voie occupée par une rame en stationnement, avoir l’assurance que la rame restera immobile.',
        'Utiliser une passerelle, une plateforme ou les marchepieds de franchissement lorsque les prescriptions le prévoient.',
        'Ne pas traverser la voie sous un véhicule ou entre deux véhicules accouplés.',
        'Pour monter ou descendre d’un véhicule, appliquer les prescriptions correspondantes.',
        'Entre des obstacles hauts de la voie et des véhicules en stationnement, avoir également l’assurance que les véhicules resteront immobiles.'
      ], key:'Jamais sous un véhicule ni entre deux véhicules accouplés.'}
    ]
  },
  {
    id:'electrique', icon:'⚡', title:'EC 21-2 — Risques électriques',
    subtitle:'Les principaux dangers et comportements à respecter face aux risques électriques.',
    
    sections:[
      {title:'1. Pourquoi le conducteur est concerné ?', bullets:[
        'Les opérateurs se déplacent et travaillent dans un environnement électrique : engins moteurs, emprises ferroviaires, passerelles, wagons, installations de chauffage/conditionnement et opérations de branchement ou raccordement.',
        'Les conducteurs doivent être formés et sensibilisés aux dangers du courant électrique.',
        'L’habilitation C0 doit être renouvelée tous les trois ans.'
      ], key:'C0 → renouvellement tous les 3 ans.'},
      {title:'2. Contact et électrisation', bullets:[
        'Tout contact du corps humain avec un conducteur électrique nu ou une pièce nue sous tension peut entraîner la mort par électrocution ou des effets traumatiques plus ou moins graves par électrisation.',
        'Le contact peut être direct ou s’établir par l’intermédiaire d’un objet, d’un jet continu de liquide, de gaz ou d’une flamme.',
        'Pour des tensions élevées, un risque existe même sans contact par amorçage d’arc.',
        'Le risque d’amorçage augmente lorsqu’on s’approche trop près d’un conducteur ou d’une pièce sous tension ; la distance de risque augmente avec la tension et peut être aggravée par certaines conditions d’environnement.'
      ], key:'Pas besoin de toucher : à haute tension, un amorçage d’arc peut se produire à distance.'},
      {title:'3. Zones à risques électriques', bullets:[
        'Les zones à risques électriques ferroviaires sont délimitées selon les distances mesurées en ligne droite autour des pièces nues sous tension.',
        'Les zones 0, 1, 2 et 3 sont distinguées.',
        'Les distances et limites d’accès aux zones doivent être connues avec précision.'
      ], key:'Pour les valeurs de distances et les conditions d’accès aux zones, se référer au tableau exact présenté dans le cours.'},
      {title:'4. Interdictions et prévention', bullets:[
        'Il est interdit d’approcher des supports ou ouvrages sur lesquels se produisent des phénomènes anormaux tels que grésillements ou étincelles.',
        'Il est interdit de pénétrer dans les locaux ou enceintes électriques sauf habilitation.',
        'Il est interdit de monter aux poteaux supportant les conducteurs électriques.',
        'Devant un conducteur électrique tombé à terre : ne pas le toucher, s’écarter sans précipitation, empêcher d’autres personnes de s’approcher et faire aviser rapidement le responsable de l’installation afin de faire effectuer la coupure de l’alimentation.',
        'Si le conducteur tombé engage le gabarit de la voie, le considérer comme un obstacle inopiné.',
        'Ne pas toucher sans nécessité les supports caténaires, directement ou avec un objet métallique.',
        'Éviter de s’appuyer contre les supports ou d’y déposer des objets.'
      ], key:'Conducteur tombé = ne pas toucher + s’éloigner + empêcher l’approche + aviser ; dans le gabarit = obstacle inopiné.'},
      {title:'5. Autres précautions présentées', bullets:[
        'Le support rappelle une défense absolue de toucher aux fils électriques.',
        'Dans le cadre du cheminement, ne pas toucher simultanément à mains nues, directement ou par objet métallique, certaines parties électriques/ferroviaires séparées ou présentant un risque de différence de potentiel.'
      ], key:'Le comportement attendu est de rester à distance et de ne jamais manipuler un conducteur ou une installation électrique.'}
    ]
  },
  {
    id:'bases-ca2p', icon:'🚂', title:'CA2P — Bases techniques',
    subtitle:'Les principales notions techniques à connaître : frein, KVB, VACMA, signalisation et cantonnement.',
    
    sections:[
      {title:'Frein — valeurs et essais', bullets:[
        'Pression normale de la conduite générale (CG) : 5 bars.',
        'Les essais de frein comprennent : complet, partiel, continuité et raccordement.',
        'Un essai complet vérifie notamment l’étanchéité et la continuité de la CG ainsi que le serrage et le desserrage des véhicules normalement freinés.',
        'Fonctions du robinet du mécanicien : Marche, serrage gradué, desserrage gradué, Neutre, Surcharge, Grand débit et freinage d’urgence.',
        'Sensibilité du dispositif de verrouillage du RC : 0,2 bar.',
        'Remplissage du RC : 5 à 10 minutes.',
        'Surcharge : 5,4 bars.'
      ], key:'Valeurs à retenir : CG = 5 bar ; surcharge = 5,4 bar ; verrouillage RC = 0,2 bar.'},
      {title:'KVB et VACMA', bullets:[
        'Paramètres KVB : vitesse maximale, longueur du train, coefficient de décélération et classe du train.',
        'La VACMA contrôle l’état de conscience du conducteur.'
      ], key:'KVB = paramètres du train ; VACMA = contrôle de la vigilance/conscience du conducteur.'},
      {title:'Signalisation et cantonnement', bullets:[
        'Un signal non en service ou annulé est repéré par une croix de Saint-André.',
        'Les cantonnements comprennent notamment BAL, BAPR, BM et cantonnement téléphonique.',
        'En double voie, un train roule normalement à gauche.',
        'La longueur maximale d’un canton en BAL est de 2 800 m en principe, avec possibilité exceptionnelle de 3 000 m.'
      ], key:'À retenir : ces notions sont à connaître comme les autres bases techniques du cours.'}
    ]
  },
  {
    id:'histoire', icon:'📜', title:'EC 11 — Histoire du Rail',
    subtitle:'Les grandes étapes de l’histoire du rail, de la vapeur à l’électrification et au TGV.',
    
    sections:[
      {title:'1. Introduction — le rail', bullets:[
        'Dès l’Antiquité, il existe des chemins de guidage creusés avec de profondes ornières.',
        'Le principe est ensuite employé dans les mines de charbon en Grande-Bretagne : pierres plates au fond des ornières, puis bois, puis fer pour réduire l’usure.',
        'L’usage de voies avec rails de bois et chariots hippomobiles est attesté en Alsace dans les années 1540 puis se répand en Europe.',
        'Au début du XVIIIe siècle, le fer est employé pour les roues comme pour les rails ; ces systèmes prennent le nom de tramways.',
        'Le rail apparaît ainsi notamment pour répondre au problème d’usure à la fin du XVIIIe siècle.'
      ], key:'Évolution : ornières → bois → fer → rails.'},
      {title:'2. Premiers chemins de fer et moteur', bullets:[
        'L’histoire des chemins de fer commence en Grande-Bretagne à la fin du XVIIIe siècle.',
        'Le chemin de fer associe une voie ferrée et des véhicules spécifiques tractés par un engin à moteur.',
        'James Watt apporte en 1769 des améliorations à la machine à vapeur qui permettent d’en généraliser l’usage.',
        'La locomotive de Trevithick de 1804 est présentée comme un premier succès de locomotive à vapeur.',
        'Oliver Evans publie en 1812 une vision d’un développement du chemin de fer à vapeur avec un réseau de lignes à longue distance.'
      ], key:'James Watt → amélioration de la vapeur ; Trevithick 1804 → premier succès présenté ; Evans 1812 → vision d’un réseau longue distance.'},
      {title:'3. Les débuts en France et les gains de temps', bullets:[
        'En 1822 est ouverte la première ligne française de chemin de fer de marchandises entre Saint-Étienne et Andrézieux.',
        'Le 27 septembre 1825, Stockton–Darlington est présentée comme la première ligne passagers ; Stephenson conduisait lui-même sa machine.',
        'Les temps de trajet en 1814, 1834 et 1893 montrent une très forte accélération des déplacements.',
        'Exemple affiché : Paris–Lille passe de 34 h (1814) à 22 h (1834), puis 3 h 45 (1893).',
        'Le plan Freycinet de 1878 prévoit un réseau de 16 000 km, dont 8 700 km de lignes d’intérêt local.'
      ], key:'À retenir : 1822 Saint-Étienne–Andrézieux ; 1825 Stockton–Darlington ; 1878 plan Freycinet.'},
      {title:'4. Les rails', bullets:[
        'Un rail est une barre d’acier profilée.',
        'Deux files parallèles de rails mises bout à bout forment une voie ferrée.',
        'Les rails reposent généralement sur des traverses afin de conserver un écartement constant.',
        'Les rails sont conducteurs électriques : ils permettent notamment la transmission des signaux des circuits de voie et le retour des courants de traction et des auxiliaires du train.',
        'L’adhérence roue/rail est présentée comme un phénomène complexe ; le sablage est présenté comme un recours pour maintenir l’adhérence.',
        'Un homme seul peut déplacer un wagon de 15 tonnes sur une voie plane.'
      ], key:'Rail = barre d’acier profilée ; deux files + traverses = voie ferrée.'},
      {title:'5. Traction à vapeur', bullets:[
        'La traction à vapeur se répand rapidement dans le monde et connaît son essor maximal avant les années 1950.',
        'Un record de vitesse de 203 km/h est atteint en 1938.',
        'Une locomotive à vapeur est présentée en trois grandes parties : véhicule roulant, foyer/chaudière et mécanisme ou moteur à vapeur.',
        'Un tender peut transporter les réserves d’eau et de combustible.',
        'Les machines à vapeur ont été utilisées en service commercial en France jusqu’en 1974.'
      ], key:'Locomotive à vapeur : véhicule roulant + foyer/chaudière + mécanisme à vapeur ; tender pour eau et combustible.'},
      {title:'6. Traction électrique', bullets:[
        'Le premier train électrique construit par le Baron W. von Siemens est présenté à l’exposition universelle de Berlin en 1879.',
        'Le développement de la traction électrique pose notamment les questions du transport de l’électricité, du courant continu ou alternatif et du niveau de tension.',
        'Aujourd’hui, le réseau ferroviaire français est principalement équipé en 1 500 V continu et 25 000 V monophasé.',
        'Près de 16 000 km de lignes ferroviaires sont présentés comme électrifiés en France, dont environ 6 000 km en 1 500 V continu et 10 000 km en 25 kV alternatif, avec 1 884 km de LGV dans ce dernier ensemble.',
        '1920–1945 : équipement de certaines lignes en 1 500 V continu ; 1945–1960 : expérimentation poussée du 25 kV 50 Hz ; 1960 et après : poursuite de l’électrification en 25 kV alternatif ; à partir de 1980 : électrifications permettant au TGV de desservir certaines zones.'
      ], key:'Deux grandes valeurs à connaître dans cette vidéo : 1 500 V continu et 25 kV alternatif.'},
      {title:'7. Caténaire et matériel roulant', bullets:[
        'La vidéo présente des schémas de caténaires 25 kV et 1 500 V continu avec notamment support, console, hauban, antibalançant, bras de rappel, pendule, fil de contact, porteur et isolateurs.',
        'Le matériel automoteur comprend notamment les automotrices.',
        'La traction diesel est illustrée avec un locotracteur et un autorail.',
        'Un essieu ferroviaire regroupe des roues solidaires ; la conicité des roues et des rails permet de compenser le comportement en courbe.',
        'Un bogie est un chariot situé sous un véhicule ferroviaire, portant les essieux et pouvant s’orienter par rapport au châssis pour suivre les courbes.'
      ], key:'Essieu = roues solidaires ; bogie = chariot portant les essieux et s’orientant dans les courbes.'},
      {title:'8. Quelques grandes dates affichées', bullets:[
        '31 août 1937 : décret de création de la Société nationale des chemins de fer français ; création effective le 1er janvier 1938.',
        '28–29 mars 1955 : record du monde de vitesse à 331 km/h sur la ligne des Landes par les BB 9004 et CC 7107.',
        '1er décembre 1975 : début de la mise en service des 4 000 voitures dites « Corail ».',
        '26 février 1981 : record du monde de vitesse à 380 km/h par une rame TGV Sud-Est.',
        '27 septembre 1981 : mise en exploitation de la partie sud de la LGV Paris–Sud-Est entre Saint-Florentin et Sathonay.'
      ], key:'À retenir : 1937/1938, 1955, 1975 et 1981.'},
      {title:'9. Grandes dates — accidents et évolution', bullets:[
        '3 août 1985 : accident ferroviaire de Flaujac, nez à nez sur voie unique ; 35 morts et 120 blessés.',
        '27 juin 1988 : accident ferroviaire à Paris, gare de Lyon ; collision dans la gare souterraine ; 56 morts.',
        '14 novembre 1994 : mise en service commercial du TGV Eurostar reliant Paris à Londres en 3 heures par le tunnel sous la Manche.',
        '13 décembre 2000 : promulgation de la loi SRU, avec un rôle d’autorité organisatrice confié aux Régions pour les transports collectifs d’intérêt régional.'
      ], key:'Ces dates complètent la chronologie jusqu’à 2000.'},
      {title:'10. La sécurité', bullets:[
        'La sécurité est présentée comme l’un des atouts du transport ferroviaire, mais elle n’est pas un acquis.',
        'Elle repose sur une stricte application des procédures en matière de sécurité du personnel et de sécurité des circulations.',
        'Un graphique présente le nombre de décès par type de transport en France entre 2015 et 2022.'
      ], key:'À retenir : la sécurité dépend de l’application stricte des procédures.'}
    ]
  }
];

const REVISION_SHEETS = [
  {id:'essentiels-securite', icon:'🦺', title:'Fiche express — Sécurité', points:['5 risques : heurt/souffle, électrique, chute, matières dangereuses, électromagnétique.','Facteurs aggravants cités : manque d’expérience, fatigue, excès de confiance, état de santé, conditions atmosphériques.','Toute voie est réputée parcourue par des véhicules ferroviaires.','EPI obligatoires ; tenue adaptée ; ne pas gêner sa vision.']},
  {id:'essentiels-voies', icon:'🚶', title:'Fiche express — Voies & traversées', points:['Ne pas engager la zone dangereuse.','≤ 40 km/h : 1,25 m.','Visibilité : 10 s pour 1–2 voies ; 15 s pour 3–4 ; 20 s pour 5–6.','Jamais sous un véhicule ni entre deux véhicules accouplés.']},
  {id:'essentiels-electrique', icon:'⚡', title:'Fiche express — Risque électrique', points:['C0 : renouvellement tous les 3 ans.','Un amorçage d’arc peut se produire sans contact direct.','Conducteur tombé : ne pas toucher, s’écarter, empêcher l’approche et aviser.','Dans le gabarit de la voie = obstacle inopiné.','Ne pas toucher les supports caténaires inutilement, même avec un objet métallique.']},
  {id:'essentiels-technique', icon:'🚂', title:'Fiche express — Technique CA2P', points:['CG normale : 5 bar.','Surcharge : 5,4 bar.','Verrouillage RC : 0,2 bar.','KVB : vitesse max, longueur, décélération, classe du train.','VACMA : état de conscience du conducteur.']},
  {id:'essentiels-histoire', icon:'📜', title:'Fiche express — Histoire du rail', points:['1822 : première ligne française de marchandises Saint-Étienne–Andrézieux.','1825 : Stockton–Darlington, première ligne passagers.','1878 : plan Freycinet, 16 000 km dont 8 700 km d’intérêt local.','1879 : train électrique de Siemens présenté à Berlin.','1 500 V continu et 25 kV alternatif : principales tensions françaises.','1937/1938 : création de la SNCF ; 1955 : 331 km/h ; 1981 : 380 km/h puis mise en service de la LGV Paris–Sud-Est.']}
];

function renderCourse(){
  const cards=document.getElementById('courseCards');
  const sheets=document.getElementById('revisionSheetCards');
  if(!cards||!sheets)return;
  cards.innerHTML=COURSE.map(c=>`
    <div class="col-12 col-lg-6">
      <div class="card h-100 course-card">
        <div class="card-body">
          <div class="d-flex gap-3 align-items-start">
            <div class="course-icon">${c.icon}</div>
            <div class="flex-grow-1"><h3 class="h5 mb-1">${escapeHtml(c.title)}</h3><p class="text-secondary small mb-2">${escapeHtml(c.subtitle)}</p></div>
          </div>
          <div class="mt-3">${c.sections.map(s=>`<div class="course-section"><h4 class="h6">${escapeHtml(s.title)}</h4><ul>${s.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join('')}</ul><div class="course-key"><strong>🎯 ${escapeHtml(s.key)}</strong></div></div>`).join('')}</div>
        </div>
      </div>
    </div>`).join('');
  sheets.innerHTML=REVISION_SHEETS.map(s=>`<div class="col-12 col-md-6"><div class="revision-sheet"><div class="d-flex align-items-center gap-2 mb-2"><span class="course-icon small">${s.icon}</span><h4 class="h6 mb-0">${escapeHtml(s.title)}</h4></div><ul class="mb-0">${s.points.map(p=>`<li>${escapeHtml(p)}</li>`).join('')}</ul></div></div>`).join('');
}

const BADGES=[
 {id:'first',icon:'🚦',title:'Premier départ',desc:'Terminer un premier quiz.',ok:s=>s.length>=1},
 {id:'perfect',icon:'⭐',title:'Sans faute',desc:'Obtenir 100 % sur une session.',ok:s=>s.some(x=>x.percent===100)},
 {id:'five',icon:'📖',title:'Régulier',desc:'Terminer 5 sessions.',ok:s=>s.length>=5},
 {id:'sim3',icon:'🚂',title:'Conducteur d’essai',desc:'Terminer 3 simulations.',ok:s=>s.filter(x=>x.mode==='simulation').length>=3},
 {id:'master10',icon:'🧠',title:'Mémoire ferroviaire',desc:'Avoir 10 questions maîtrisées.',ok:()=>{const st=getQuestionStats();return Object.values(st).filter(x=>masteryStatus(x).class==='mastery-green').length>=10}}
];
function renderBadges(){
 const el=document.getElementById('badgesHome'), count=document.getElementById('badgeCount'); if(!el)return;
 const sessions=JSON.parse(localStorage.getItem('quizSessions')||'[]'); let earned=0;
 el.innerHTML=BADGES.map(b=>{const ok=b.ok(sessions);if(ok)earned++;return `<div class="badge-progress ${ok?'earned':'locked'}"><div class="badge-symbol">${b.icon}</div><div><strong>${escapeHtml(b.title)}</strong><div class="small">${escapeHtml(b.desc)}</div></div>${ok?'<span class="badge text-bg-success ms-auto">Obtenu</span>':'<span class="badge text-bg-light border ms-auto">À débloquer</span>'}</div>`}).join('');
 if(count)count.textContent=`${earned}/${BADGES.length} obtenus`;
}
function showCourse(){
 clearInterval(timer); targetedMode=false;
 ['setup','quiz','result','targeted','history'].forEach(id=>document.getElementById(id)?.classList.add('d-none'));
 document.getElementById('course')?.classList.remove('d-none'); renderCourse();
}
