// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, doc, updateDoc, arrayUnion, collection, getDocs, query, where, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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
const auth = getAuth(app);

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    currentUser = null;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mealType = urlParams.get('mealType');

  const recipeQuery = mealType 
    ? query(collection(db, "recipes"), where("mealType", "==", mealType)) 
    : collection(db, "recipes");

  getDocs(recipeQuery).then((querySnapshot) => {
    const recipes = [];
    querySnapshot.forEach((doc) => {
      const recipe = doc.data();
      recipe.id = doc.id;
      recipes.push(recipe);
    });
    renderRecipes(recipes);
  }).catch((error) => console.error('Error loading recipes:', error));
});

function renderRecipes(recipes) {
  const recipeCardsContainer = document.querySelector('.recipe-cards-meals');
  recipeCardsContainer.innerHTML = '';

  recipes.forEach(recipe => {
    const recipeCardHTML = `
      <div class="recipe-card-meals">
        <img src="${recipe.imageUrl}" alt="${recipe.title}">
        <div class="recipe-info-meals">
          <h3>${recipe.title}</h3>
          <button class="like-btn" data-recipe-id="${recipe.id}">
            <img src="CSS/Assets/like.png" style="width:30px;" class="user-icon">
          </button>
          <p class="like-count">Likes: <span>${recipe.likes?.length || 0}</span></p>
          <button class="favorite-btn" data-recipe-id="${recipe.id}">
            <svg
              class="favorite-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon
                class="star"
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              />
            </svg>
          </button>
          <p class="favorite-status">Favorite: <span>${recipe.favorites?.length || 0}</span></p>
        </div>
      </div>
    `;

    recipeCardsContainer.insertAdjacentHTML('beforeend', recipeCardHTML);

    const likeButton = document.querySelector(`.like-btn[data-recipe-id="${recipe.id}"]`);
    const favoriteButton = document.querySelector(`.favorite-btn[data-recipe-id="${recipe.id}"]`);

    likeButton.addEventListener('click', () => handleRecipeLike(recipe.id));
    favoriteButton.addEventListener('click', () => handleRecipeFavorite(recipe.id, favoriteButton));
  });
}

async function handleRecipeLike(recipeId) {
  if (!currentUser) {
    alert("Please log in to like this recipe.");
    return;
  }

  const userId = currentUser.uid;
  const recipeRef = doc(db, "recipes", recipeId);

  try {
    const recipeDoc = await getDoc(recipeRef);
    const recipeData = recipeDoc.data();
    const likedBy = recipeData.likedBy || [];

    if (likedBy.includes(userId)) {
      alert("You have already liked this recipe.");
      return;
    }

    await updateDoc(recipeRef, {
      likes: arrayUnion(userId),
      likedBy: arrayUnion(userId),
    });

    const updatedRecipeDoc = await getDoc(recipeRef);
    const updatedLikes = updatedRecipeDoc.data().likes.length;
    const likeButton = document.querySelector(`.like-btn[data-recipe-id="${recipeId}"]`);
    const likeCount = likeButton.nextElementSibling.querySelector('span');
    likeCount.textContent = updatedLikes;

    likeButton.classList.add('liked');
    alert("Recipe liked successfully!");
  } catch (error) {
    console.error("Error handling like:", error);
    alert("Failed to like the recipe.");
  }
}

async function handleRecipeFavorite(recipeId, favoriteButton) {
  if (!currentUser) {
    alert("Please log in to favorite this recipe.");
    return;
  }

  const userId = currentUser.uid;
  const recipeRef = doc(db, "recipes", recipeId);

  try {
    const recipeDoc = await getDoc(recipeRef);
    const recipeData = recipeDoc.data();
    const favoritedBy = recipeData.favoritedBy || [];

    if (favoritedBy.includes(userId)) {
      await updateDoc(recipeRef, {
        favorites: arrayRemove(userId),
        favoritedBy: arrayRemove(userId),
      });
      alert("You have unfavorited this recipe.");
    } else {
      await updateDoc(recipeRef, {
        favorites: arrayUnion(userId),
        favoritedBy: arrayUnion(userId),
      });
      alert("You have favorited this recipe.");
    }

    const updatedRecipeDoc = await getDoc(recipeRef);
    const updatedFavorites = updatedRecipeDoc.data().favorites.length;
    const favoriteStatus = favoriteButton.nextElementSibling.querySelector('span');
    favoriteStatus.textContent = updatedFavorites;

    favoriteButton.classList.toggle('favorited');
  } catch (error) {
    console.error("Error handling favorite:", error);
    alert("Failed to favorite the recipe.");
  }
}