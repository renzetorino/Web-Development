import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";


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

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user; 
  } else {
    currentUser = null; 
  }
});


async function fetchArticles() {
  try {
    const articlesRef = collection(db, "articles");
    const snapshot = await getDocs(articlesRef);
    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const articlesContainer = document.querySelector(".article-details-container");
    articles.forEach((article) => {
      const articleElement = document.createElement("div");
      articleElement.classList.add("article");
      articleElement.setAttribute("data-id", article.id);

      articleElement.innerHTML = `
        <img src="${article.image || 'default_image.jpg'}" alt="Article Image">
        <h2>${article.title || 'No Title'}</h2>
        <p>${article.date || 'No Date Available'}</p>
        <button class="like-btn"><img src="CSS/Assets/like.png" style="width:40px; cursor:pointer;" class="user-icon"></button>
        <p class="like-count">Likes: <span>${article.likes || 0}</span></p>
        <button class="favorite-btn">
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
        <p class="favorite-status">Favorite: <span>${article.favorites || 0}</span></p>
      `;

      
      const likeButton = articleElement.querySelector(".like-btn");
      const likeCount = articleElement.querySelector(".like-count span");

      likeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        handleLikeClick(article.id, likeCount);
      });

      
      const favoriteButton = articleElement.querySelector(".favorite-btn");
      const favoriteStatus = articleElement.querySelector(".favorite-status span");

      favoriteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        handleFavoriteClick(article.id, favoriteStatus, favoriteButton);
        favoriteButton.classList.toggle("active");
      });

      
      checkFavoriteStatus(article.id, favoriteButton);

      articleElement.addEventListener("click", () => {
        window.location.href = `contents.html?id=${article.id}`;
      });

      articlesContainer.appendChild(articleElement);
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    alert("Failed to fetch articles. Please try again later.");
  }
}


// Handle like click
async function handleLikeClick(articleId, likeCountElement) {
  try {
    if (!currentUser) {
      alert("Please log in to like this article.");
      return;
    }

    const userId = currentUser.uid;
    const articleRef = doc(db, "articles", articleId);
    const articleDoc = await getDoc(articleRef);

    if (!articleDoc.exists()) {
      alert("Article not found.");
      return;
    }

    const articleData = articleDoc.data();
    const likes = articleData.likes || 0;
    const likedBy = articleData.likedBy || [];

    if (likedBy.includes(userId)) {
      alert("You have already liked this article.");
      return;
    }

    await updateDoc(articleRef, {
      likes: likes + 1,
      likedBy: arrayUnion(userId),
    });

    likeCountElement.textContent = likes + 1;
  } catch (error) {
    console.error("Error handling like:", error);
    alert("Failed to like the article. Please try again later.");
  }
}

// Handle favorite click (with the arrayRemove fix)
async function handleFavoriteClick(articleId, favoriteStatusElement) {
  try {
    if (!currentUser) {
      alert("Please log in to favorite this article.");
      return;
    }

    const userId = currentUser.uid;
    const articleRef = doc(db, "articles", articleId);
    const articleDoc = await getDoc(articleRef);

    if (!articleDoc.exists()) {
      alert("Article not found.");
      return;
    }

    const articleData = articleDoc.data();
    const favorites = articleData.favorites || 0;
    const favoritedBy = articleData.favoritedBy || [];

    if (favoritedBy.includes(userId)) {
      await updateDoc(articleRef, {
        favorites: favorites - 1,
        favoritedBy: arrayRemove(userId), 
      });

      favoriteStatusElement.textContent = favorites - 1;
      alert("You have unfavorited this article.");
    } else {
      await updateDoc(articleRef, {
        favorites: favorites + 1,
        favoritedBy: arrayUnion(userId),
      });

      favoriteStatusElement.textContent = favorites + 1;
      alert("You have favorited this article.");
    }
  } catch (error) {
    console.error("Error handling favorite/unfavorite:", error);
    alert(`Failed to favorite/unfavorite the article. Error: ${error.message}`);
  }
}


async function checkFavoriteStatus(articleId, favoriteButton) {
  try {
    if (!currentUser) return;

    const userId = currentUser.uid;
    const articleRef = doc(db, "articles", articleId);
    const articleDoc = await getDoc(articleRef);

    if (!articleDoc.exists()) {
      console.log("Article not found.");
      return;
    }

    const articleData = articleDoc.data();
    const favoritedBy = articleData.favoritedBy || [];

    
    if (favoritedBy.includes(userId)) {
      favoriteButton.classList.add("active");
    } else {
      favoriteButton.classList.remove("active");
    }
  } catch (error) {
    console.error("Error checking favorite status:", error);
  }
}


window.onload = fetchArticles;
