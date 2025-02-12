import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


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


async function addArticle(title, imageUrl, date, content) {
    console.log("Adding document with:", { title, imageUrl, date, content });
    try {
      const docRef = await addDoc(collection(db, "articles"), {
        title: title,
        image: imageUrl,
        date: date,
        content: content,
      });
      console.log("Document written with ID: ", docRef.id);
      alert("Article added successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to add article.");
    }
  }
  


const form = document.getElementById("add-article-form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); 

  
  const title = document.getElementById("title").value.trim();
  const imageUrl = document.getElementById("imageUrl").value.trim();
  const date = document.getElementById("date").value;
  const content = document.getElementById("content").value.trim();

  
  if (!title || !imageUrl || !date || !content) {
    alert("All fields are required.");
    return;
  }

  
  addArticle(title, imageUrl, date, content);

  
  form.reset();
});

