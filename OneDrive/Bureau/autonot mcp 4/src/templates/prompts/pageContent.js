// src/templates/prompts/pageContent.js
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