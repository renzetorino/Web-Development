// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";


// Firebase configuration
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
const auth = getAuth(app);


  
  // Function to highlight the active link
  function highlightActiveLink() {
    const currentPage = window.location.pathname.split("/").pop(); // Get the current page name
  
    const navLinks = document.querySelectorAll(".nav-link");
  
    navLinks.forEach((link) => {
      const linkHref = link.getAttribute("href").split("/").pop(); // Get the href from each link and get the last part (the page name)
  
      // If the link matches the current page, add 'active', otherwise remove it
      if (linkHref === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
  
  // Call the function to highlight the active link on page load
  highlightActiveLink();

// Detect Auth State
onAuthStateChanged(auth, (user) => {
  const navbar = document.querySelector(".navbar");
  const loginBtn = document.querySelector(".login-btn");

  if (user) {
    loginBtn.style.display = "none"; // Hide Login button

    const userIcon = document.createElement("div");
    const userName = user.displayName || user.email;

    userIcon.innerHTML = `
      <img src="../CSS/Assets/user-icon.png" alt="User Icon" style="width:40px; cursor:pointer;" class="user-icon">
      <div class="dropdown" style="position:absolute; background:#fff; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); padding:10px; border-radius:5px;">
        <h4 style="margin:5px 0; font-weight:bold; text-align:center; color:#333; cursor:default;">Hello, ${userName}!</h4>
        <hr style="margin:10px 0; border:none; border-top:1px solid #eee;">
        <p id="sign-out" style="margin:5px 0; cursor:pointer;">Sign Out</p>
      </div>
    `;
    userIcon.style.position = "relative";
    userIcon.style.display = "inline-block";

    // Add to navbar
    navbar.appendChild(userIcon);

    // Handle Dropdown Menu
    const dropdown = userIcon.querySelector(".dropdown");
    const icon = userIcon.querySelector(".user-icon");
    icon.addEventListener("click", () => {
      dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    });

    // Handle Sign-Out
    const signOutButton = dropdown.querySelector("#sign-out");
    signOutButton.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          alert("Signed out successfully.");
          window.location.href = "admin-signin.html";
        })
        .catch((error) => {
          alert(`Error signing out: ${error.message}`);
        });
    });
  } else {
    // User is not logged in: Ensure Login button is visible
    loginBtn.style.display = "block";
  }
});