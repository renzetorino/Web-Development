// Import Firebase modules
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBlXaECsscf-6rra015vOeOTfDrSBcCMi0",
    authDomain: "web-development-8a585.firebaseapp.com",
    projectId: "web-development-8a585",
    storageBucket: "web-development-8a585.appspot.com",
    messagingSenderId: "791490853736",
    appId: "1:791490853736:web:2006c9f35478bd83dbb4dd",
};


const auth = getAuth();
const db = getFirestore();

const contactForm = document.getElementById("contact-form");
const emailInput = document.getElementById("email");
const nameInput = document.getElementById("name");

// Pre-fill email field with logged-in user's email
onAuthStateChanged(auth, (user) => {
    if (user) {
        emailInput.value = user.email;
        nameInput.value = user.displayName || ""; // Optional: Autofill name if available
    } else {
        alert("You must be logged in to contact us.");
        window.location.href = "login.html";
    }
});

// Handle form submission
contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
        alert("All fields are required.");
        return;
    }

    try {
        // Save form data to Firestore
        await addDoc(collection(db, "contactMessages"), {
            name,
            email,
            subject,
            message,
            timestamp: new Date(), // Add timestamp for sorting
        });

        alert("Your message has been sent successfully!");
        contactForm.reset(); // Reset the form after submission
    } catch (error) {
        console.error("Error saving contact message:", error);
        alert("An error occurred while sending your message. Please try again.");
    }
});
