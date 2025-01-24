import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration (Replace with yours)
const firebaseConfig = {
  // ... your Firebase configuration
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const recipeCardsContainer = document.querySelector('.recipe-cards-container');

async function fetchRecipes() {
  try {
    const recipesRef = collection(db, "recipes"); 
    const querySnapshot = await getDocs(recipesRef); 

    querySnapshot.forEach((doc) => {
      const recipeData = doc.data();

      const recipeCard = document.createElement('div');
      recipeCard.classList.add('recipe-card');
      recipeCard.innerHTML = `
        <a href="recipe-details.html?id=${doc.id}"> 
          <img src="${recipeData.imageUrl || 'default_image.jpg'}" alt="${recipeData.title}">
          <div class="recipe-info">
            <h3>${recipeData.title || 'No Title'}</h3>
            <p>${recipeData.description || 'No Description'}</p>
          </div>
        </a>
      `;
      recipeCardsContainer.appendChild(recipeCard);
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    // Handle error, e.g., display an error message to the user
  }
}

// Call the function to fetch and display recipes
fetchRecipes();