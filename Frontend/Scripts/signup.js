import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile,signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";


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

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");


const submit = document.getElementById("submit");
submit.addEventListener("click", function (event) {
  event.preventDefault();

  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!name || !email || !password) {
    alert("All fields are required.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      
      const user = userCredential.user;

      
      updateProfile(user, { displayName: name })
        .then(() => {
          alert(`Account created successfully! Welcome, ${name}.`);
          
         
          signOut(auth).then(() => {
            
            window.location.href = "login.html";
          }).catch((error) => {
            alert(`Error signing out: ${error.message}`);
          });
        })
        .catch((error) => {
          console.error("Error updating profile:", error.message);
          alert("Failed to set display name. Account created, but please update your profile later.");
        });
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(`Error: ${errorMessage}`);
    });
});
