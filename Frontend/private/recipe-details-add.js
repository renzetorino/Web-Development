// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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

async function addRecipe(title, imageUrl, ingredients, marketPrices, instructions, healthBenefits, mealType) {
  console.log("Adding recipe with:", { title, imageUrl, ingredients, marketPrices, instructions, healthBenefits, mealType });
  try {
    const docRef = await addDoc(collection(db, "recipes"), {
      title,
      imageUrl,
      ingredients,
      marketPrices,
      instructions,
      healthBenefits,
      mealType,
    });
    console.log("Recipe added with ID:", docRef.id);
    alert("Recipe added successfully!");
  } catch (e) {
    console.error("Error adding recipe:", e);
    alert("Failed to add recipe.");
  }
}

// Handle form submission (assuming you have a form with these IDs)
const form = document.getElementById("add-recipe-form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); 

  // Get form values
  const title = document.getElementById("title").value.trim();
  const imageUrl = document.getElementById("imageUrl").value.trim();
  const ingredients = document.getElementById("ingredients").value.trim().split("\n");
  const marketPrices = document.getElementById("marketPrices").value.trim().split("\n");
  const instructions = document.getElementById("instructions").value.trim();
  const healthBenefits = document.getElementById("healthBenefits").value.trim();
  const mealType = document.getElementById("mealType").value; 

  // Validate inputs (add your own validation logic here)
  if (!title || !imageUrl || !ingredients.length || !marketPrices.length || !instructions || !healthBenefits || !mealType) {
    alert("All fields are required.");
    return;
  }

  // Add recipe to Firestore
  addRecipe(title, imageUrl, ingredients, marketPrices, instructions, healthBenefits, mealType);

  // Clear form fields (optional)
  form.reset();
});