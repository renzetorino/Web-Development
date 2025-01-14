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

// Function to normalize content
function normalizeContent(rawContent) {
  // Trim whitespace and split content into individual lines
  const lines = rawContent.trim().split("\n");

  // Prepare sections
  let paragraphs = []; // To hold general paragraphs
  let numberedList = []; // To hold numbered steps

  lines.forEach((line) => {
    line = line.trim(); // Remove extra spaces

    if (/^\d+\.\s/.test(line)) {
      // If the line starts with a number (e.g., "1. "), add to the numbered list
      numberedList.push(line);
    } else if (line) {
      // Otherwise, treat it as a paragraph
      paragraphs.push(line);
    }
  });

  // Build HTML output
  let formattedContent = "";

  // Add paragraphs
  paragraphs.forEach((para) => {
    formattedContent += `<p>${para}</p>`;
  });

  // Add numbered list (if present)
  if (numberedList.length > 0) {
    formattedContent += "<ol>";
    numberedList.forEach((item) => {
      formattedContent += `<li>${item}</li>`;
    });
    formattedContent += "</ol>";
  }

  return formattedContent;
}

// Fetch article details based on URL ID
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
