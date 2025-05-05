// src/templates/prompts/mainStructure.js
module.exports = `Tu es un designer expert en templates Notion premium, connu pour créer des templates exceptionnellement bien organisées, esthétiques et immédiatement utilisables.
          
Je souhaite une template Notion basée sur ce prompt: "{{USER_PROMPT}}"

QUALITÉ ATTENDUE:
- Structure ultra-professionnelle comparable aux templates Notion vendues 50-100€
- Design épuré et efficace suivant les meilleures pratiques UX de Notion
- Contenu prêt à l'emploi, pas de placeholders génériques
- Expérience utilisateur fluide et intuitive

PRINCIPES DE CONCEPTION À SUIVRE:
1. FONCTIONNALITÉ AVANT TOUT: Chaque élément doit servir un objectif précis
2. NAVIGATION INTUITIVE: Structure hiérarchique logique et claire
3. ESTHÉTIQUE COHÉRENTE: Système visuel unifié (couleurs, icônes, espacements)
4. AUTOMATISATION: Inclure des formules et relations entre bases de données
5. NIVEAU DE DÉTAIL ÉLEVÉ: Propriétés personnalisées adaptées au contexte

FORMAT JSON EXACT À SUIVRE:
{
  "title": "Titre principal impactant et descriptif",
  "icon": "🚀", 
  "coverImage": "gradient blue", // Ou URL d'image de qualité
  "colorTheme": "blue", // une des couleurs Notion standard
  "subPages": [
    {
      "title": "Nom de sous-page spécifique",
      "icon": "📝",
      "description": "Description précise de l'utilité de cette sous-page",
      "visualElements": ["callouts", "toggles", "tables", "tableaux"] 
    },
    // 5-6 sous-pages stratégiques
  ],
  "databases": [
    {
      "title": "Nom de base de données spécifique",
      "description": "Description de l'utilité et structure de cette base",
      "viewTypes": ["table", "board", "calendar", "gallery", "timeline"],
      "properties": [
        {"name": "Nom", "type": "title"},
        {"name": "Statut", "type": "select", "options": ["À faire", "En cours", "Terminé"]}
        // 6-8 propriétés utiles et spécifiques
      ],
      "items": [
        {"Nom": "Exemple réaliste 1", "Statut": "À faire"},
        {"Nom": "Exemple réaliste 2", "Statut": "En cours"}
        // 3-5 exemples réalistes
      ]
    },
    // 3-4 bases de données complémentaires
  ]
}`;// src/templates/prompts/pageContent.js
module.exports = `Tu es un designer Notion expert. Crée une page d'accueil EXCEPTIONNELLE de qualité premium pour "{{TITLE}}" qui soit digne d'une template professionnelle vendue 30-50€.

CONTEXTE:
- Template: "{{TITLE}}" avec icône {{ICON}}
- Thème couleur: {{COLOR_THEME}}
- Sous-pages: {{SUB_PAGES}}
- Description: {{DESCRIPTION}}

ATTENTES:
1. Contenu DIRECTEMENT UTILISABLE, pas de placeholders ou de "lorem ipsum"
2. Structure claire avec hiérarchie visuelle logique (titres, sous-titres, sections)
3. Instructions détaillées pour l'utilisateur avec exemples concrets
4. Éléments visuels variés pour une expérience riche (callouts, toggles, listes, tableaux)
5. Ton professionnel mais accessible

CONTENU À INCLURE (OBLIGATOIRE):
- Introduction claire expliquant la valeur et l'utilité de cette section (1-2 paragraphes)
- 3-5 sections principales avec contenu détaillé et prêt à l'emploi
- Minimum 3 callouts avec conseils pratiques et astuces
- 2-3 exemples concrets préremplis que l'utilisateur peut suivre
- Des toggles pour organiser l'information complexe sans surcharger visuellement
- Une checklist ou des étapes séquentielles pour guider l'utilisateur
- Relations avec les autres sous-pages et bases de données

FORMAT JSON POUR LA RÉPONSE:
{
  "content": [
    {"type": "heading_1", "content": "Titre de la page"},
    {"type": "paragraph", "content": "Texte d'introduction expliquant la valeur de cette section..."},
    {"type": "callout", "content": "Conseil important pour l'utilisation", "icon": "💡", "color": "blue"},
    {"type": "heading_2", "content": "Première section importante"},
    {"type": "paragraph", "content": "Contenu détaillé de la première section..."},
    {"type": "toggle", "content": "Détails supplémentaires (cliquez pour développer)", "children": [
      {"type": "paragraph", "content": "Contenu détaillé caché dans le toggle..."}
    ]},
    {"type": "divider", "content": ""},
    {"type": "heading_2", "content": "Deuxième section importante"},
    {"type": "bulleted_list_item", "content": "Premier point important..."},
    {"type": "bulleted_list_item", "content": "Deuxième point important..."},
    {"type": "to_do", "content": "Première action à réaliser", "checked": false},
    {"type": "to_do", "content": "Deuxième action à réaliser", "checked": false}
  ]
}

ALTERNATIVE EN MARKDOWN:
FORMAT: MARKDOWN

# Titre de la page

Introduction détaillée expliquant la valeur et l'utilité de cette section...

> [💡] (blue): Conseil important pour maximiser l'utilisation de cette section.

## Première section importante

Contenu détaillé avec explications pratiques et concrètes...

▼ Détails supplémentaires (cliquez pour développer)
- Point important caché 1
- Point important caché 2

---

## Deuxième section importante

- Premier point important...
- Deuxième point important...

### Actions à réaliser

- [ ] Première action à réaliser
- [ ] Deuxième action à réaliser

Crée un contenu exceptionnellement utile et détaillé qui rendra cette template immédiatement utilisable et apportera une valeur réelle à l'utilisateur.`;
