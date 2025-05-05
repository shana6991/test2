// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const templateForm = document.getElementById('templateForm');
    const promptInput = document.getElementById('promptInput');
    const loading
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultContainer = document.getElementById('resultContainer');
    const templateLink = document.getElementById('templateLink');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
  
  // Gestion des exemples
  const exampleBoxes = document.querySelectorAll('.example-box');
  exampleBoxes.forEach(box => {
    box.addEventListener('click', () => {
      promptInput.value = box.dataset.prompt;
      promptInput.focus();
    });
  });
  
  // Soumission du formulaire
  templateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert('Veuillez entrer une description pour votre template.');
      return;
    }
    
    // Afficher l'état de chargement
    loadingSpinner.classList.remove('d-none');
    resultContainer.classList.add('d-none');
    errorContainer.classList.add('d-none');
    
    try {
      const response = await fetch('/api/templates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Afficher le résultat
        templateLink.href = data.url;
        templateLink.textContent = data.title || 'Ouvrir la template dans Notion';
        resultContainer.classList.remove('d-none');
      } else {
        // Afficher l'erreur
        errorMessage.textContent = data.error || 'Une erreur est survenue lors de la génération.';
        errorContainer.classList.remove('d-none');
      }
    } catch (error) {
      console.error('Erreur:', error);
      errorMessage.textContent = 'Erreur de connexion au serveur.';
      errorContainer.classList.remove('d-none');
    } finally {
      loadingSpinner.classList.add('d-none');
    }
  });
});