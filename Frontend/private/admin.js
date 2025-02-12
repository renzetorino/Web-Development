import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBlXaECsscf-6rra015vOeOTfDrSBcCMi0",
  authDomain: "web-development-8a585.firebaseapp.com",
  projectId: "web-development-8a585",
  storageBucket: "web-development-8a585.firebasestorage.app",
  messagingSenderId: "791490853736",
  appId: "1:791490853736:web:2006c9f35478bd83dbb4dd",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = getFirestore(app); 

// Inputs
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Submit button
const submit = document.getElementById("submit");
submit.addEventListener("click", async function (event) {
  event.preventDefault();

  // Get input values on form submission
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("All fields are required.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    
    const userDoc = doc(db, "users", user.uid); 
    const docSnapshot = await getDoc(userDoc);

    if (docSnapshot.exists() && docSnapshot.data().role === "admin") {
      alert("Admin login successful.");
      window.location.href = "recipeadmin.html"; 
    } else {
      alert("Access denied. You are not an admin.");
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(`Error: ${errorMessage}`);
  }
});
