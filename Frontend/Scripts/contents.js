import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBlXaECsscf-6rra015vOeOTfDrSBcCMi0",
  authDomain: "web-development-8a585.firebaseapp.com",
  projectId: "web-development-8a585",
  storageBucket: "web-development-8a585.appspot.com",
  messagingSenderId: "791490853736",
  appId: "1:791490853736:web:2006c9f35478bd83dbb4dd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function normalizeContent(rawContent) {
  if (!rawContent) return "<p>No content available.</p>";

  
  const lines = rawContent.trim().split("\n").filter((line) => line.trim().length > 0);

  let content = "";
  let currentNumber = ""; 
  let paragraphBuffer = ""; 

  lines.forEach((line) => {
    const match = line.match(/^(\d+)\.\s(.*)/); 
    if (match) {
      
      if (paragraphBuffer.trim()) {
        content += `<p style="margin-bottom: 1.5em;">${paragraphBuffer.trim()}</p>`;
        paragraphBuffer = "";
      }
      
      currentNumber = match[1]; 
      paragraphBuffer = `${match[1]}. ${match[2]}`; 
    } else {
      paragraphBuffer += ` ${line.trim()}`;
    }
  });

  
  if (paragraphBuffer.trim()) {
    content += `<p style="margin-bottom: 1.5em;">${paragraphBuffer.trim()}</p>`;
  }
  return content || "<p>No content available.</p>";
}





async function fetchArticleDetails() {
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get("id");

  console.log("Article ID:", articleId); // Debugging

  if (!articleId) {
    alert("No article ID provided!");
    return;
  }

  try {
    const articleRef = doc(db, "articles", articleId);
    const articleSnap = await getDoc(articleRef);

    if (articleSnap.exists()) {
      const article = articleSnap.data();
      console.log("Fetched article data:", article); // Debugging

      // Normalize the content before displaying
      const formattedContent = normalizeContent(article.content);

      // Update HTML elements with article data
      document.getElementById("article-title").textContent = article.title || "No Title";
      document.getElementById("article-image").src = article.image || "default_image.jpg";
      document.getElementById("article-date").textContent = article.date || "No Date Available";
      document.getElementById("article-content").innerHTML = formattedContent; // Set normalized content

    } else {
      console.warn("Article not found in Firestore.");
      alert("Article not found!");
    }
  } catch (error) {
    console.error("Error fetching article details:", error);
    alert("Failed to fetch article details. Please try again later.");
  }
}

// Fetch article details when the page loads
window.onload = fetchArticleDetails;
