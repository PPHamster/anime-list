import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCUlaBMIiMiknL0BnPp805RoOK9R6k5Tj4",
    authDomain: "pp-anilist.firebaseapp.com",
    projectId: "pp-anilist",
    storageBucket: "pp-anilist.appspot.com",
    messagingSenderId: "517902885677",
    appId: "1:517902885677:web:f536ba59098e199647a9a4",
    measurementId: "G-KSBG77QEBK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth can check and manage user
export const auth = getAuth(app);

// Custom type of Login with Google Popup
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

// Function Login with Google and Save User to Database
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const { uid: id, displayName: name, email, photoURL: image } = result.user;

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ id, name, email, image })
        })

    } catch (error) {
        console.log(error)
    }
};   