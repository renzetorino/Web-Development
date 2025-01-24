import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlXaECsscf-6rra015vOeOTfDrSBcCMi0",
  authDomain: "web-development-8a585.firebaseapp.com",
  projectId: "web-development-8a585",
  storageBucket: "web-development-8a585.appspot.com",
  messagingSenderId: "791490853736",
  appId: "1:791490853736:web:2006c9f35478bd83dbb4dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const recipeCardsContainer = document.querySelector('.recipe-cards-meals');

async function fetchVegetarianRecipes() {
  try {
    const recipesRef = collection(db, "recipes");
    const querySnapshot = await getDocs(recipesRef);

    querySnapshot.forEach((doc) => {
      const recipeData = doc.data();

      // Check if the recipe is vegetarian
      if (recipeData.mealType === "vegetarian") {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card-meals');
        recipeCard.innerHTML = `
          <a href="recipes.html?id=${doc.id}"> 
            <img src="${recipeData.imageUrl || 'default_image.jpg'}" alt="${recipeData.title}">
            <div class="recipe-info-meals">
              <p class="recipe-price">₱${recipeData.marketPrices[0] || "N/A"}</p> 
              <h3>${recipeData.title}</h3>
            </div>
          </a>
        `;
        recipeCardsContainer.appendChild(recipeCard);
      }
    });
  } catch (error) {
    console.error("Error fetching vegetarian recipes:", error);
    // Handle error, e.g., display an error message to the user
  }
}

// Call fetchVegetarianRecipes() when the window loads
window.onload = fetchVegetarianRecipes;