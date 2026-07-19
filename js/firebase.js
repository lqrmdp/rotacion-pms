/* firebase.js — inicialización del SDK y referencia al documento único. */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig, COLECCION, DOCUMENTO } from "./config.js";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const docRef = doc(db, COLECCION, DOCUMENTO);
