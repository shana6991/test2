// src/services/transformerService.js
const logger = require('../config/logger');
const { TransformerError } = require('../utils/errorTypes');

class TransformerService {
  /**
   * Transforme le contenu structuré en blocs au format Notion
   * @param {Array|Object} content - Contenu structuré à transformer
   * @param {string} theme - Thème de couleur (optionnel)
   * @returns {Array} - Blocs formatés pour l'API Notion
   */
  transformContentToBlocks(content, theme = 'default') {
    try {
      // Gérer différents formats d'entrée
      if (content && content.format === 'markdown') {
        return this.convertMarkdownToBlocks(content.content);
      }
      
      if (!Array.isArray(content)) {
        logger.warn("Le contenu n'est pas un tableau, création d'un bloc paragraphe par défaut");
        return [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: typeof content === 'string' ? content : 'Contenu non disponible'
                  }
                }
              ]
            }
          }
        ];
      }
      
      const blocks = [];
      
      for (const item of content) {
        // Si l'élément est une chaîne de caractères
        if (typeof item === 'string') {
          blocks.push({
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: item
                  }
                }
              ]
            }
          });
          continue;
        }
        
        // Si l'élément est un objet avec un type et un contenu
        if (item && typeof item === 'object' && item.type) {
          switch (item.type) {
            case 'paragraph':
              blocks.push({
                object: 'block',
                type: 'paragraph',
                paragraph: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: item.content || ''
                      }
                    }
                  ]
                }
              });
              break;
              
            case 'heading_1':
            case 'heading1':
              blocks.push({
                object: 'block',
                type: 'heading_1',
                heading_1: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: item.content || ''
                      }
                    }
                  ]
                }
              });
              break;
              
            case 'heading_2':
            case 'heading2':
              blocks.push({
                object: 'block',
                type: 'heading_2',
                heading_2: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: item.content || ''
                      }
                    }
                  ]
                }
              });
              break;
              
            case 'heading_3':
            case 'heading3':
              blocks.push({
                object: 'block',
                type: 'heading_3',
                heading_3: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: item.content || ''
                      }
                    }
                  ]
                }
              });
              break;
              
            case 'bulleted_list_item':
            case 'bullet':
              blocks.push({
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: item.content || ''
                      }
                    }
                  ]
                }
              });
              break;
              
            case 'numbered_list_item':
            case 'number':
              blocks.push({
                object: 'block',
                type: 'numbered_list_item',
                numbered_list_item: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: item.content || ''
                      }
                    }
                  ]
                }
              });
              break;
              
            case 'to_do':
            case 'todo':
              blocks.push({
                object: 'block',
                type: 'to_do',
                to_do: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: item.content || ''
                      }
                    }
                  ],
                  checked: item.checked === true
                }
              });
              break;
              
            case 'toggle':
              const toggleBlock = {
                object: 'block',
                type: 'toggle',
                toggle: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: item.content || ''
                      }
                    }
                  ]
                }
              };
              
              // Ajouter les enfants du toggle s'ils existent
              if (item.children && Array.isArray(item.children)) {
                toggleBlock.toggle.children = this.transformContentToBlocks(item.children, theme);
              }
              
              blocks.push(toggleBlock);
              break;
              
            case 'callout':
              blocks.push({
                object: 'block',
                type: 'callout',
                callout: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: item.content || ''
                      }
                    }
                  ],
                  icon: {
                    type: 'emoji',
                    emoji: item.icon || '💡'
                  },
                  color: item.color || this.getThemeColor(theme, 'callout')
                }
              });
              break;
              
            case 'divider':
              blocks.push({
                object: 'block',
                type: 'divider',
                divider: {}
              });
              break;
              
            case 'code':
              blocks.push({
                object: 'block',
                type: 'code',
                code: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: item.content || ''
                      }
                    }
                  ],
                  language: item.language || 'plain text'
                }
              });
              break;
              
            default:
              logger.warn(`Type de bloc non reconnu: ${item.type}`);
              
              // Fallback sur un paragraphe
              blocks.push({
                object: 'block',
                type: 'paragraph',
                paragraph: {
                  rich_text: [
                    {
                      type: 'text',
                      text: {
                        content: item.content || ''
                      }
                    }
                  ]
                }
              });
          }
        } else if (item) {
          logger.warn("Élément de contenu non valide ignoré:", 
            typeof item === 'object' ? JSON.stringify(item).substring(0, 100) : item);
        }
      }
      
      return blocks;
    } catch (error) {
      logger.error('Erreur lors de la transformation en blocs Notion:', error);
      throw new TransformerError(`Erreur lors de la transformation en blocs Notion: ${error.message}`);
    }
  }
  
  /**
   * Convertit du texte markdown en blocs Notion
   * @param {string} markdownText - Texte au format markdown
   * @returns {Array} - Tableau de blocs au format Notion
   */
  convertMarkdownToBlocks(markdownText) {
    try {
      const blocks = [];
      const lines = markdownText.split('\n');
      
      let currentList = null;
      let currentListType = null;
      let inCodeBlock = false;
      let codeBlockContent = '';
      let codeLanguage = '';
      let inToggle = false;
      let toggleChildren = [];
      let currentToggleTitle = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Ignorer les lignes vides (sauf si dans un bloc de code)
        if (line === '' && !inCodeBlock) {
          // Terminer la liste actuelle si elle existe
          if (currentList) {
            blocks.push(...currentList);
            currentList = null;
            currentListType = null;
          }
          
          // Terminer le toggle si on est dedans
          if (inToggle && toggleChildren.length > 0) {
            blocks.push({
              object: 'block',
              type: 'toggle',
              toggle: {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: currentToggleTitle
                    }
                  }
                ],
                children: toggleChildren
              }
            });
            inToggle = false;
            toggleChildren = [];
            currentToggleTitle = '';
          }
          
          continue;
        }
        
        // Gestion des blocs de code
      // src/services/transformerService.js (suite)

        // Gestion des blocs de code
        if (line.startsWith('```')) {
          if (!inCodeBlock) {
            // Début d'un bloc de code
            inCodeBlock = true;
            codeLanguage = line.slice(3).trim() || 'plain text';
            codeBlockContent = '';
          } else {
            // Fin d'un bloc de code
            inCodeBlock = false;
            
            const codeBlock = {
              object: 'block',
              type: 'code',
              code: {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: codeBlockContent
                    }
                  }
                ],
                language: codeLanguage
              }
            };
            
            // Ajouter au bloc parent approprié
            if (inToggle) {
              toggleChildren.push(codeBlock);
            } else {
              blocks.push(codeBlock);
            }
          }
          continue;
        }
        
        if (inCodeBlock) {
          codeBlockContent += line + '\n';
          continue;
        }
        
        // Détection et gestion des toggles
        if (line.match(/^>\s*\[.*?\]\s*Toggle:\s*(.*)/) || line.match(/^▼\s*(.*)/) || line.match(/^<details>.*<summary>(.*)<\/summary>/)) {
          // Fermer le toggle précédent s'il y en a un
          if (inToggle && toggleChildren.length > 0) {
            blocks.push({
              object: 'block',
              type: 'toggle',
              toggle: {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: currentToggleTitle
                    }
                  }
                ],
                children: toggleChildren
              }
            });
            toggleChildren = [];
          }
          
          // Commencer un nouveau toggle
          inToggle = true;
          
          // Extraire le titre du toggle
          let toggleMatch;
          if (line.match(/^>\s*\[.*?\]\s*Toggle:\s*(.*)/)) {
            toggleMatch = line.match(/^>\s*\[.*?\]\s*Toggle:\s*(.*)/);
          } else if (line.match(/^▼\s*(.*)/)) {
            toggleMatch = line.match(/^▼\s*(.*)/);
          } else {
            toggleMatch = line.match(/^<details>.*<summary>(.*)<\/summary>/);
          }
          
          currentToggleTitle = toggleMatch ? toggleMatch[1] : "Détails";
          continue;
        }
        
        // Titres
        if (line.startsWith('# ')) {
          if (currentList) {
            blocks.push(...currentList);
            currentList = null;
            currentListType = null;
          }
          
          const headingBlock = {
            object: 'block',
            type: 'heading_1',
            heading_1: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: line.slice(2)
                  }
                }
              ]
            }
          };
          
          if (inToggle) {
            toggleChildren.push(headingBlock);
          } else {
            blocks.push(headingBlock);
          }
          continue;
        } 
        
        if (line.startsWith('## ')) {
          if (currentList) {
            blocks.push(...currentList);
            currentList = null;
            currentListType = null;
          }
          
          const headingBlock = {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: line.slice(3)
                  }
                }
              ]
            }
          };
          
          if (inToggle) {
            toggleChildren.push(headingBlock);
          } else {
            blocks.push(headingBlock);
          }
          continue;
        }
        
        if (line.startsWith('### ')) {
          if (currentList) {
            blocks.push(...currentList);
            currentList = null;
            currentListType = null;
          }
          
          const headingBlock = {
            object: 'block',
            type: 'heading_3',
            heading_3: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: line.slice(4)
                  }
                }
              ]
            }
          };
          
          if (inToggle) {
            toggleChildren.push(headingBlock);
          } else {
            blocks.push(headingBlock);
          }
          continue;
        }
        
        // Liste à puces
        if (line.startsWith('- ') || line.startsWith('* ')) {
          const bulletItem = {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: line.slice(2)
                  }
                }
              ]
            }
          };
          
          if (inToggle) {
            toggleChildren.push(bulletItem);
          } else {
            if (currentListType !== 'bulleted_list_item') {
              if (currentList) {
                blocks.push(...currentList);
              }
              currentList = [];
              currentListType = 'bulleted_list_item';
            }
            
            currentList.push(bulletItem);
          }
          continue;
        }
        
        // Liste numérotée
        if (/^\d+\.\s/.test(line)) {
          const numberItem = {
            object: 'block',
            type: 'numbered_list_item',
            numbered_list_item: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: line.slice(line.indexOf('.') + 1).trim()
                  }
                }
              ]
            }
          };
          
          if (inToggle) {
            toggleChildren.push(numberItem);
          } else {
            if (currentListType !== 'numbered_list_item') {
              if (currentList) {
                blocks.push(...currentList);
              }
              currentList = [];
              currentListType = 'numbered_list_item';
            }
            
            currentList.push(numberItem);
          }
          continue;
        }
        
        // To-do (case non cochée)
        if (line.startsWith('- [ ] ')) {
          const todoItem = {
            object: 'block',
            type: 'to_do',
            to_do: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: line.slice(6)
                  }
                }
              ],
              checked: false
            }
          };
          
          if (inToggle) {
            toggleChildren.push(todoItem);
          } else {
            blocks.push(todoItem);
          }
          continue;
        }
        
        // To-do (case cochée)
        if (line.startsWith('- [x] ') || line.startsWith('- [X] ')) {
          const todoItem = {
            object: 'block',
            type: 'to_do',
            to_do: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: line.slice(6)
                  }
                }
              ],
              checked: true
            }
          };
          
          if (inToggle) {
            toggleChildren.push(todoItem);
          } else {
            blocks.push(todoItem);
          }
          continue;
        }
        
        // Callout
        if (line.startsWith('> ') && !line.match(/^>\s*\[.*?\]\s*Toggle:/)) {
          let calloutContent = line.slice(2);
          let icon = '💡';
          let color = 'blue';
          
          // Extraction d'icône et couleur si format spécial
          if (calloutContent.startsWith('[')) {
            const match = calloutContent.match(/\[(.*?)\]\s*\((.*?)\)\s*:(.*)/);
            if (match) {
              icon = match[1] || icon;
              color = match[2] || color;
              calloutContent = match[3].trim();
            } else {
              calloutContent = calloutContent.replace(/^\[(.*?)\]:?\s*/, (_, emoji) => {
                icon = emoji || icon;
                return '';
              });
            }
          }
          
          const calloutBlock = {
            object: 'block',
            type: 'callout',
            callout: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: calloutContent
                  }
                }
              ],
              icon: {
                type: 'emoji',
                emoji: icon
              },
              color: color
            }
          };
          
          if (inToggle) {
            toggleChildren.push(calloutBlock);
          } else {
            blocks.push(calloutBlock);
          }
          continue;
        }
        
        // Séparateur
        if (line === '---') {
          const dividerBlock = {
            object: 'block',
            type: 'divider',
            divider: {}
          };
          
          if (inToggle) {
            toggleChildren.push(dividerBlock);
          } else {
            blocks.push(dividerBlock);
          }
          continue;
        }
        
        // Paragraphe par défaut
        const paragraphBlock = {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: line
                }
              }
            ]
          }
        };
        
        if (inToggle) {
          toggleChildren.push(paragraphBlock);
        } else {
          blocks.push(paragraphBlock);
        }
      }
      
      // Ajouter la dernière liste s'il y en a une
      if (currentList) {
        blocks.push(...currentList);
      }
      
      // Ajouter le dernier toggle s'il y en a un
      if (inToggle && toggleChildren.length > 0) {
        blocks.push({
          object: 'block',
          type: 'toggle',
          toggle: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: currentToggleTitle
                }
              }
            ],
            children: toggleChildren
          }
        });
      }
      
      return blocks;
    } catch (error) {
      logger.error('Erreur lors de la conversion du markdown en blocs Notion:', error);
      throw new TransformerError(`Erreur lors de la conversion du markdown: ${error.message}`);
    }
  }
  
  /**
   * Obtient une couleur en fonction du thème
   * @param {string} theme - Nom du thème
   * @param {string} element - Type d'élément
   * @returns {string} - Couleur au format Notion
   */
  getThemeColor(theme, element) {
    const themeColors = {
      'default': {
        'callout': 'gray_background',
        'highlight': 'yellow_background',
        'primary': 'blue'
      },
      'blue': {
        'callout': 'blue_background',
        'highlight': 'blue_background',
        'primary': 'blue'
      },
      'green': {
        'callout': 'green_background',
        'highlight': 'green_background',
        'primary': 'green'
      },
      'red': {
        'callout': 'red_background',
        'highlight': 'red_background',
        'primary': 'red'
      },
      'purple': {
        'callout': 'purple_background',
        'highlight': 'purple_background',
        'primary': 'purple'
      },
      'pink': {
        'callout': 'pink_background',
        'highlight': 'pink_background',
        'primary': 'pink'
      },
      'yellow': {
        'callout': 'yellow_background',
        'highlight': 'yellow_background',
        'primary': 'yellow'
      },
      'orange': {
        'callout': 'orange_background',
        'highlight': 'orange_background',
        'primary': 'orange'
      },
      'brown': {
        'callout': 'brown_background',
        'highlight': 'brown_background',
        'primary': 'brown'
      },
      'gray': {
        'callout': 'gray_background',
        'highlight': 'gray_background',
        'primary': 'gray'
      }
    };
    
    const themeObj = themeColors[theme] || themeColors['default'];
    return themeObj[element] || themeColors['default'][element];
  }
  
  /**
   * Normalise les options de select pour les bases de données
   * @param {Array} options - Options à normaliser
   * @returns {Array} - Options normalisées
   */
  normalizeSelectOptions(options) {
    if (!Array.isArray(options)) return [];
    
    return options.map(opt => {
      // Si l'option est une chaîne
      if (typeof opt === 'string') {
        return { name: opt, color: 'default' };
      }
      
      // Si l'option est un objet
      if (typeof opt === 'object') {
        if (opt.name && typeof opt.name === 'object') {
          return {
            name: opt.name.name || 'Option',
            color: opt.name.color || 'default'
          };
        }
        
        if (opt.name && typeof opt.name === 'string') {
          return {
            name: opt.name,
            color: opt.color || 'default'
          };
        }
        
        return { name: JSON.stringify(opt).slice(0, 30), color: 'default' };
      }
      
      return { name: String(opt).slice(0, 30), color: 'default' };
    });
  }
}

module.exports = new TransformerService();