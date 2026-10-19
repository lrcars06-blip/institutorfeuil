// Soins offrables en carte cadeau (prix fixe, hors prestations « par téléphone »).
// Clé = catégorie|nom|durée, identique à CARTE dans index.html.
// Si vous modifiez un prix dans index.html, modifiez-le aussi ici : sinon le paiement est refusé (sécurité anti-fraude).
export const SOINS = {
  "visage|Soin découverte du visage|30 min": {
    "label": "Visage",
    "name": "Soin découverte du visage",
    "duration": "30 min",
    "price": 46
  },
  "visage|Soin du visage vitamine C Yonka|30 min": {
    "label": "Visage",
    "name": "Soin du visage vitamine C Yonka",
    "duration": "30 min",
    "price": 48
  },
  "visage|Soin du visage aux pierres chaudes|30 min": {
    "label": "Visage",
    "name": "Soin du visage aux pierres chaudes",
    "duration": "30 min",
    "price": 51
  },
  "visage|Soin saisonnier Printemps/Été ou Automne/Hiver|45 min": {
    "label": "Visage",
    "name": "Soin saisonnier Printemps/Été ou Automne/Hiver",
    "duration": "45 min",
    "price": 68
  },
  "visage|Age Défense — Hydratation|1h": {
    "label": "Visage",
    "name": "Age Défense — Hydratation",
    "duration": "1h",
    "price": 75
  },
  "visage|Double peeling éclat Sothys|1h": {
    "label": "Visage",
    "name": "Double peeling éclat Sothys",
    "duration": "1h",
    "price": 79
  },
  "visage|Anti-âge repulpant, fermeté, affinant|1h": {
    "label": "Visage",
    "name": "Anti-âge repulpant, fermeté, affinant",
    "duration": "1h",
    "price": 82
  },
  "visage|Soin du visage aux pierres chaudes|1h": {
    "label": "Visage",
    "name": "Soin du visage aux pierres chaudes",
    "duration": "1h",
    "price": 82
  },
  "visage|Soin du visage vitamine C Yonka|1h": {
    "label": "Visage",
    "name": "Soin du visage vitamine C Yonka",
    "duration": "1h",
    "price": 82
  },
  "visage|La Référence|1h15": {
    "label": "Visage",
    "name": "La Référence",
    "duration": "1h15",
    "price": 87
  },
  "visage|Age Correction — Anti-rides|1h15": {
    "label": "Visage",
    "name": "Age Correction — Anti-rides",
    "duration": "1h15",
    "price": 95
  },
  "visage|Age Exception — Anti-âge global|1h15": {
    "label": "Visage",
    "name": "Age Exception — Anti-âge global",
    "duration": "1h15",
    "price": 95
  },
  "visage|Soin du visage aux pierres chaudes|1h15": {
    "label": "Visage",
    "name": "Soin du visage aux pierres chaudes",
    "duration": "1h15",
    "price": 95
  },
  "visage|Soin du visage vitamine C Yonka|1h15": {
    "label": "Visage",
    "name": "Soin du visage vitamine C Yonka",
    "duration": "1h15",
    "price": 95
  },
  "visage|Traitement intensif Sothys|1h15": {
    "label": "Visage",
    "name": "Traitement intensif Sothys",
    "duration": "1h15",
    "price": 96
  },
  "visage|Yonka Pro Retinol Like|1h15": {
    "label": "Visage",
    "name": "Yonka Pro Retinol Like",
    "duration": "1h15",
    "price": 96
  },
  "visage|Traitement intensif Sothys + double peeling|1h30": {
    "label": "Visage",
    "name": "Traitement intensif Sothys + double peeling",
    "duration": "1h30",
    "price": 135
  },
  "visage|Excellence « Secret » lissant raffermissant|1h15": {
    "label": "Visage",
    "name": "Excellence « Secret » lissant raffermissant",
    "duration": "1h15",
    "price": 135
  },
  "corps|Aroma relax dos|30 min": {
    "label": "Corps",
    "name": "Aroma relax dos",
    "duration": "30 min",
    "price": 46
  },
  "corps|Aroma velours cuir chevelu|30 min": {
    "label": "Corps",
    "name": "Aroma velours cuir chevelu",
    "duration": "30 min",
    "price": 46
  },
  "corps|Aroma minceur|30 min": {
    "label": "Corps",
    "name": "Aroma minceur",
    "duration": "30 min",
    "price": 47
  },
  "corps|Aroma relax dos aux pierres chaudes|30 min": {
    "label": "Corps",
    "name": "Aroma relax dos aux pierres chaudes",
    "duration": "30 min",
    "price": 52
  },
  "corps|Aroma jambes légères|45 min": {
    "label": "Corps",
    "name": "Aroma jambes légères",
    "duration": "45 min",
    "price": 63
  },
  "corps|Aroma Zen corps|45 min": {
    "label": "Corps",
    "name": "Aroma Zen corps",
    "duration": "45 min",
    "price": 63
  },
  "corps|Aroma Zen corps|1h": {
    "label": "Corps",
    "name": "Aroma Zen corps",
    "duration": "1h",
    "price": 77
  },
  "corps|Duo visage & corps — Bien-être aromatique|1h": {
    "label": "Corps",
    "name": "Duo visage & corps — Bien-être aromatique",
    "duration": "1h",
    "price": 77
  },
  "corps|Aroma Zen corps aux pierres chaudes|1h": {
    "label": "Corps",
    "name": "Aroma Zen corps aux pierres chaudes",
    "duration": "1h",
    "price": 83
  },
  "corps|Aroma Zen corps|1h15": {
    "label": "Corps",
    "name": "Aroma Zen corps",
    "duration": "1h15",
    "price": 89
  },
  "corps|Aroma Zen corps aux pierres chaudes|1h15": {
    "label": "Corps",
    "name": "Aroma Zen corps aux pierres chaudes",
    "duration": "1h15",
    "price": 95
  },
  "corps|Duo visage & corps — Évasion aromatique|1h45": {
    "label": "Corps",
    "name": "Duo visage & corps — Évasion aromatique",
    "duration": "1h45",
    "price": 135
  },
  "reflexo|Réflexologie plantaire|45 min": {
    "label": "Réflexologie",
    "name": "Réflexologie plantaire",
    "duration": "45 min",
    "price": 59
  },
  "reflexo|Réflexologie crânienne|45 min": {
    "label": "Réflexologie",
    "name": "Réflexologie crânienne",
    "duration": "45 min",
    "price": 59
  },
  "regard|Teinture sourcils|15 min": {
    "label": "Regard",
    "name": "Teinture sourcils",
    "duration": "15 min",
    "price": 17
  },
  "regard|Teinture des cils|30 min": {
    "label": "Regard",
    "name": "Teinture des cils",
    "duration": "30 min",
    "price": 26
  },
  "regard|Teinture cils + sourcils|30 min": {
    "label": "Regard",
    "name": "Teinture cils + sourcils",
    "duration": "30 min",
    "price": 39
  },
  "regard|Rehaussement de cils|1h": {
    "label": "Regard",
    "name": "Rehaussement de cils",
    "duration": "1h",
    "price": 62
  },
  "regard|Rehaussement de cils + teinture|1h15": {
    "label": "Regard",
    "name": "Rehaussement de cils + teinture",
    "duration": "1h15",
    "price": 79
  },
  "mains|Beauté des pieds + soin douceur|1h": {
    "label": "Mains & pieds",
    "name": "Beauté des pieds + soin douceur",
    "duration": "1h",
    "price": 49
  },
  "cireF|Fesses|15 min": {
    "label": "Cire femme",
    "name": "Fesses",
    "duration": "15 min",
    "price": 10
  },
  "cireF|Lèvres|15 min": {
    "label": "Cire femme",
    "name": "Lèvres",
    "duration": "15 min",
    "price": 10
  },
  "cireF|Aisselles|15 min": {
    "label": "Cire femme",
    "name": "Aisselles",
    "duration": "15 min",
    "price": 14
  },
  "cireF|Maillot classique|15 min": {
    "label": "Cire femme",
    "name": "Maillot classique",
    "duration": "15 min",
    "price": 15
  },
  "cireF|1/2 bras|15 min": {
    "label": "Cire femme",
    "name": "1/2 bras",
    "duration": "15 min",
    "price": 18
  },
  "cireF|Maillot échancré|30 min": {
    "label": "Cire femme",
    "name": "Maillot échancré",
    "duration": "30 min",
    "price": 22
  },
  "cireF|1/2 jambes|30 min": {
    "label": "Cire femme",
    "name": "1/2 jambes",
    "duration": "30 min",
    "price": 23
  },
  "cireF|Bras complets|30 min": {
    "label": "Cire femme",
    "name": "Bras complets",
    "duration": "30 min",
    "price": 23
  },
  "cireF|Lèvres + menton|20 min": {
    "label": "Cire femme",
    "name": "Lèvres + menton",
    "duration": "20 min",
    "price": 23
  },
  "cireF|Sourcils + lèvres|30 min": {
    "label": "Cire femme",
    "name": "Sourcils + lèvres",
    "duration": "30 min",
    "price": 23
  },
  "cireF|3/4 jambes|30 min": {
    "label": "Cire femme",
    "name": "3/4 jambes",
    "duration": "30 min",
    "price": 26
  },
  "cireF|Maillot intermédiaire|30 min": {
    "label": "Cire femme",
    "name": "Maillot intermédiaire",
    "duration": "30 min",
    "price": 26
  },
  "cireF|Visage|30 min": {
    "label": "Cire femme",
    "name": "Visage",
    "duration": "30 min",
    "price": 27
  },
  "cireF|Jambes complètes|45 min": {
    "label": "Cire femme",
    "name": "Jambes complètes",
    "duration": "45 min",
    "price": 29
  },
  "cireF|Maillot intermédiaire + sillon inter-fessier|30 min": {
    "label": "Cire femme",
    "name": "Maillot intermédiaire + sillon inter-fessier",
    "duration": "30 min",
    "price": 29
  },
  "cireF|Maillot intégral|30 min": {
    "label": "Cire femme",
    "name": "Maillot intégral",
    "duration": "30 min",
    "price": 33
  },
  "cireF|Maillot intégral + sillon inter-fessier|30 min": {
    "label": "Cire femme",
    "name": "Maillot intégral + sillon inter-fessier",
    "duration": "30 min",
    "price": 36
  },
  "cireF|Visage + sourcils|45 min": {
    "label": "Cire femme",
    "name": "Visage + sourcils",
    "duration": "45 min",
    "price": 42
  },
  "cireH|Oreilles|15 min": {
    "label": "Cire homme",
    "name": "Oreilles",
    "duration": "15 min",
    "price": 12
  },
  "cireH|Aisselles|15 min": {
    "label": "Cire homme",
    "name": "Aisselles",
    "duration": "15 min",
    "price": 15
  },
  "cireH|1/2 bras|15 min": {
    "label": "Cire homme",
    "name": "1/2 bras",
    "duration": "15 min",
    "price": 18
  },
  "cireH|Bras complets|30 min": {
    "label": "Cire homme",
    "name": "Bras complets",
    "duration": "30 min",
    "price": 24
  },
  "cireH|1/2 jambes|30 min": {
    "label": "Cire homme",
    "name": "1/2 jambes",
    "duration": "30 min",
    "price": 26
  },
  "cireH|Dos / torse|30 min": {
    "label": "Cire homme",
    "name": "Dos / torse",
    "duration": "30 min",
    "price": 29
  },
  "cireH|Jambes complètes|45 min": {
    "label": "Cire homme",
    "name": "Jambes complètes",
    "duration": "45 min",
    "price": 32
  },
  "ados|Modelage dos parfum sucré|20 min": {
    "label": "Enfants & ados",
    "name": "Modelage dos parfum sucré",
    "duration": "20 min",
    "price": 30
  },
  "ados|Soin du visage gourmand|30 min": {
    "label": "Enfants & ados",
    "name": "Soin du visage gourmand",
    "duration": "30 min",
    "price": 35
  },
  "ados|Soin du visage purifiant / nettoyant|1h15": {
    "label": "Enfants & ados",
    "name": "Soin du visage purifiant / nettoyant",
    "duration": "1h15",
    "price": 62
  },
  "mains|Manucure traditionnelle|45 min": {
    "label": "Mains & pieds",
    "name": "Manucure traditionnelle",
    "duration": "45 min",
    "price": 42
  },
  "mains|Yumi Feet — anti-callosités|30 min": {
    "label": "Mains & pieds",
    "name": "Yumi Feet — anti-callosités",
    "duration": "30 min",
    "price": 42
  },
  "mains|Yumi Feet + beauté des pieds|1h": {
    "label": "Mains & pieds",
    "name": "Yumi Feet + beauté des pieds",
    "duration": "1h",
    "price": 72
  }
};
