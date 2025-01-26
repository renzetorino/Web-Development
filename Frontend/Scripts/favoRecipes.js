import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBlXaECsscf-6rra015vOeOTfDrSBcCMi0",
  authDomain: "web-development-8a585.firebaseapp.com",
  projectId: "web-development-8a585",
  storageBucket: "web-development-8a585.appspot.com",
  messagingSenderId: "791490853736",
  appId: "1:791490853736:web:2006c9f35478bd83dbb4dd",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    fetchFavoritedRecipes();
  } else {
    currentUser = null;
    alert("Please log in to view your favorited recipes.");
    window.location.href = "login.html";
  }
});

async function fetchFavoritedRecipes() {
  try {
    if (!currentUser) return;

    const userId = currentUser.uid;
    const recipesRef = collection(db, "recipes");
    const q = query(recipesRef, where("favoritedBy", "array-contains", userId));

    const snapshot = await getDocs(q);
    const favoritedRecipes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const recipesContainer = document.querySelector(".recipe-details-container");
    recipesContainer.innerHTML = "";

    if (favoritedRecipes.length === 0) {
      recipesContainer.innerHTML = "<p>You have no favorited recipes yet.</p>";
    } else {
      favoritedRecipes.forEach((recipe) => {
        const recipeElement = document.createElement("div");
        recipeElement.classList.add("recipe");
        recipeElement.setAttribute("data-id", recipe.id);

        recipeElement.innerHTML = `
          <div class="recipe-card">
            <img src="${recipe.imageUrl || 'default_image.jpg'}" alt="Recipe Image">
            <h2>${recipe.title || 'No Title'}</h2>
            <p style="display:none";>${recipe.mealType || 'No Meal Type'}</p>
          </div>
        `;

        recipeElement.addEventListener("click", () => {
          window.location.href = `recipes.html?id=${recipe.id}`;
        });

        recipesContainer.appendChild(recipeElement);
      });
    }
  } catch (error) {
    console.error("Error fetching favorited recipes:", error);
    alert("Failed to fetch favorited recipes. Please try again later.");
  }
}
