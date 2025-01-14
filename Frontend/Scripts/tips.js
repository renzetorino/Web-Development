import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
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
    currentUser = user; // User is logged in
  } else {
    currentUser = null; // User is logged out
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
      `;

      // Add event listener to handle like
      const likeButton = articleElement.querySelector(".like-btn");
      const likeCount = articleElement.querySelector(".like-count span");

      likeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        handleLikeClick(article.id, likeCount);
      });

      // Add event listener for redirecting to the article details page
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

async function handleLikeClick(articleId, likeCountElement) {
  try {
    // Check if the user is logged in
    if (!currentUser) {
      alert("Please log in to like this article.");
      return;
    }

    const userId = currentUser.uid; // Get logged-in user ID

    const articleRef = doc(db, "articles", articleId);
    const articleDoc = await getDoc(articleRef);

    if (!articleDoc.exists()) {
      alert("Article not found.");
      return;
    }

    const articleData = articleDoc.data();
    const likes = articleData.likes || 0;
    const likedBy = articleData.likedBy || [];

    // Check if the user has already liked the article
    if (likedBy.includes(userId)) {
      alert("You have already liked this article.");
      return;
    }

    // Update likes and likedBy array
    await updateDoc(articleRef, {
      likes: likes + 1,
      likedBy: arrayUnion(userId), // Add the user to the likedBy array
    });

    // Update the displayed like count
    likeCountElement.textContent = likes + 1;
  } catch (error) {
    console.error("Error handling like:", error);
    alert("Failed to like the article. Please try again later.");
  }
}

window.onload = fetchArticles;

