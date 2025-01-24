// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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

// Extract recipe ID from URL
const queryParams = new URLSearchParams(window.location.search);
const recipeId = queryParams.get("id");

if (recipeId) {
  fetchRecipe(recipeId);
} else {
  alert("No recipe ID provided!");
  window.location.href = "recipes-list.html";
}

async function fetchRecipe(id) {
  try {
    const recipeRef = doc(db, "recipes", id);
    const recipeSnap = await getDoc(recipeRef);

    if (recipeSnap.exists()) {
      const recipeData = recipeSnap.data();

      document.getElementById("recipe-title").textContent = recipeData.title;
      document.getElementById("recipe-image").src = recipeData.imageUrl;
      document.getElementById("recipe-mealType").textContent = `Meal Type: ${recipeData.mealType}`;
      document.getElementById("recipe-ingredients").innerHTML = `
        <h2>Ingredients:</h2>
        <ul>${recipeData.ingredients.map((item) => `<li>${item}</li>`).join("")}</ul>`;
      document.getElementById("recipe-marketPrices").innerHTML = `
        <h2>Market Prices:</h2>
        <ul>${recipeData.marketPrices.map((item) => `<li>${item}</li>`).join("")}</ul>`;
      document.getElementById("recipe-instructions").innerHTML = `
        <h2>Instructions:</h2>
        <p>${recipeData.instructions}</p>`;
      document.getElementById("recipe-healthBenefits").innerHTML = `
        <h2>Health Benefits:</h2>
        <p>${recipeData.healthBenefits}</p>`;
    } else {
      alert("Recipe not found!");
      window.location.href = "recipes-list.html"; // Redirect if recipe doesn't exist
    }
  } catch (e) {
    console.error("Error fetching recipe:", e);
    alert("Failed to fetch recipe details.");
  }
}
