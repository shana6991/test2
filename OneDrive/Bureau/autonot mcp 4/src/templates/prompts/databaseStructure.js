// src/templates/prompts/databaseStructure.js
module.exports = `Tu es un expert Notion spécialisé dans la création de bases de données professionnelles. Crée une structure de base de données PREMIUM pour "{{DATABASE.TITLE}}" qui fait partie d'une template "{{MAIN_STRUCTURE.TITLE}}" sur le thème: "{{ORIGINAL_PROMPT}}".

CONTEXTE:
- Cette base de données fait partie de la template "{{MAIN_STRUCTURE.TITLE}}"
- Description: {{DATABASE.DESCRIPTION}}
- Vues recommandées: {{DATABASE.VIEW_TYPES}}

QUALITÉ ATTENDUE:
- Structure complète et prête à l'emploi immédiatement
- Propriétés adaptées au contexte spécifique et aux besoins de l'utilisateur
- Options de sélection pertinentes avec couleurs cohérentes et logiques
- Données exemples réalistes et utiles (pas de placeholders génériques)
- Relations intelligentes avec les autres bases de données si pertinent

PROPRIÉTÉS REQUISES:
- Une propriété Title (obligatoire et unique dans Notion)
- 8-12 propriétés pertinentes et diverses soigneusement choisies
- Options de statut clairement définies avec codes couleur intuitifs
- Propriétés date pour le suivi temporel
- Des propriétés numériques pour les métriques importantes
- Des propriétés multisélect pour les catégories/tags
- Des propriétés select avec options colorées logiques
- Des formules utiles pour automatiser certains calculs
- Niveau d'organisation bien pensé pour faciliter la gestion

EXEMPLES D'ITEMS:
- Crée 4-6 exemples d'items réalistes et contextuellement pertinents
- Utilise des données vraisemblables et concrètes (pas de données génériques)
- Montre différents cas d'utilisation et statuts pour illustrer la flexibilité
- Assure-toi que ces exemples aident l'utilisateur à comprendre l'utilisation

FORMAT DE RÉPONSE: Tu peux répondre soit en JSON valide, soit en markdown structuré.

FORMAT JSON:
{
  "properties": [
    {"name": "Nom", "type": "title"},
    {"name": "Statut", "type": "select", "options": ["Option1", "Option2", "Option3"]},
    {"name": "Priorité", "type": "select", "options": ["Haute", "Moyenne", "Basse"]},
    {"name": "Catégories", "type": "multi_select", "options": ["Catégorie1", "Catégorie2", "Catégorie3"]},
    {"name": "Date d'échéance", "type": "date"},
    {"name": "Budget", "type": "number"},
    {"name": "Description", "type": "rich_text"}
  ],
  "items": [
    {"Nom": "Exemple réaliste 1", "Statut": "Option1", "Priorité": "Haute", "Catégories": ["Catégorie1", "Catégorie2"], "Date d'échéance": "2025-06-15", "Budget": 1500, "Description": "Description détaillée de l'exemple 1"},
    {"Nom": "Exemple réaliste 2", "Statut": "Option2", "Priorité": "Moyenne", "Catégories": ["Catégorie2"], "Date d'échéance": "2025-07-01", "Budget": 2800, "Description": "Description détaillée de l'exemple 2"}
  ]
}

FORMAT MARKDOWN ALTERNATIF:
FORMAT: MARKDOWN

## Propriétés
| Nom de la propriété | Type | Options |
|-----------------|------|---------|
| Nom | title | |
| Statut | select | Option1, Option2, Option3 |
| Priorité | select | Haute, Moyenne, Basse |
| Catégories | multi_select | Catégorie1, Catégorie2, Catégorie3 |
| Date d'échéance | date | |
| Budget | number | |
| Description | rich_text | |

## Exemples d'items
1. Nom: "Exemple réaliste 1", Statut: "Option1", Priorité: "Haute", Catégories: "Catégorie1, Catégorie2", Date d'échéance: "2025-06-15", Budget: 1500, Description: "Description détaillée de l'exemple 1"
2. Nom: "Exemple réaliste 2", Statut: "Option2", Priorité: "Moyenne", Catégories: "Catégorie2", Date d'échéance: "2025-07-01", Budget: 2800, Description: "Description détaillée de l'exemple 2"

Choisis le format que tu préfères, mais assure-toi que le contenu soit de qualité PREMIUM.`;