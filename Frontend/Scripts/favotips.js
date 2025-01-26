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
    fetchFavoritedArticles(); 
  } else {
    currentUser = null; 
    alert("Please log in to view your favorited articles.");
    window.location.href = "login.html"; 
  }
});

async function fetchFavoritedArticles() {
  try {
    if (!currentUser) return; 

    const userId = currentUser.uid;
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, where("favoritedBy", "array-contains", userId));

    const snapshot = await getDocs(q);
    const favoritedArticles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const articlesContainer = document.querySelector(".article-details-container");
    articlesContainer.innerHTML = "";

    if (favoritedArticles.length === 0) {
      articlesContainer.innerHTML = "<p>You have no favorited articles yet.</p>";
    } else {
      favoritedArticles.forEach((article) => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("article");
        articleElement.setAttribute("data-id", article.id);

        articleElement.innerHTML = `
          <div class="article-card">
            <img src="${article.image || 'default_image.jpg'}" alt="Article Image">
            <h2>${article.title || 'No Title'}</h2>
            <p>${article.date || 'No Date Available'}</p>
          </div>
        `;

        
        articleElement.addEventListener("click", () => {
          window.location.href = `contents.html?id=${article.id}`;
        });

        articlesContainer.appendChild(articleElement);
      });
    }
  } catch (error) {
    console.error("Error fetching favorited articles:", error);
    alert("Failed to fetch favorited articles. Please try again later.");
  }
}
