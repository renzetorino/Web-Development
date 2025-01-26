// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlXaECsscf-6rra015vOeOTfDrSBcCMi0",
  authDomain: "web-development-8a585.firebaseapp.com",
  projectId: "web-development-8a585",
  storageBucket: "web-development-8a585.appspot.com",
  messagingSenderId: "791490853736",
  appId: "1:791490853736:web:2006c9f35478bd83dbb4dd",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    // Get the mealType from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const mealType = urlParams.get('mealType');
  
    console.log(mealType)
  
    // Load recipes from Firebase
    const q = query(collection(db, "recipes"), where("mealType", "==", mealType));
    getDocs(q).then((querySnapshot) => {
      const recipes = {};
      querySnapshot.forEach((doc) => {
        recipes[doc.id] = doc.data();
      });
      renderRecipes(recipes);
    }).catch((error) => console.error('Error loading recipes:', error));
});

// Function to render the recipes in the HTML template
function renderRecipes(recipes) {
  const recipeCardsContainer = document.querySelector('.recipe-cards-meals');

  // Loop through the recipes and create a card for each one
  for (const recipeId in recipes) {
    const recipe = recipes[recipeId];
    const recipeCardHTML = `
      <a href="recipes.html?id=${recipeId}">
        <div class="recipe-card-meals">
          <img src="${recipe.imageUrl}" alt="${recipe.title}">
          <div class="recipe-info-meals">
            <h3>${recipe.title}</h3>
          </div>
        </div>
      </a>
    `;

    // Append the recipe card HTML to the container
    recipeCardsContainer.insertAdjacentHTML('beforeend', recipeCardHTML);
  }
}