/* repo.js — capa de datos: lectura inicial, tiempo real y mutaciones.
   Es el único módulo que conoce Firestore; el resto de la app solo
   habla con el store. Cambiar de backend (Supabase, etc.) significa
   reescribir este archivo respetando su interfaz pública. */

import { getDoc, setDoc, onSnapshot, runTransaction } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db, docRef } from "./firebase.js";
import { ESTADO_INICIAL } from "./config.js";
import { setState } from "./store.js";
import { mostrarError, ocultarError } from "./errores.js";
import { el } from "./dom.js";

/** Crea el documento la primera vez que alguien abre la app. */
export async function asegurarDocumento(){
  const snap = await getDoc(docRef);
  if (!snap.exists()){
    await setDoc(docRef, ESTADO_INICIAL);
  }
}

/** Suscripción en vivo: cualquier cambio de cualquier persona repinta. */
export function escucharCambios(){
  onSnapshot(docRef, (snap) => {
    if (snap.exists()){
      // Firestore no soporta objetos con llaves numéricas anidadas de forma nativa en todos los SDKs;
      // se guardan como mapas normales, así que basta con leer directo.
      setState(snap.data());
      el.syncMeta.textContent =
        "Sincronizado " + new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"});
    }
  }, (err) => {
    mostrarError("No se pudo conectar con la base de datos. Revisa la configuración de Firebase.");
    console.error(err);
  });
}

/** Lectura puntual, para el botón «Actualizar». */
export async function leerUnaVez(){
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
}

/** Aplica `fn(estado)` dentro de una transacción y guarda el resultado. */
export async function mutar(fn){
  try{
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(docRef);
      const actual = snap.exists() ? snap.data() : structuredClone(ESTADO_INICIAL);
      const nuevo = fn(structuredClone(actual));
      tx.set(docRef, nuevo);
    });
    ocultarError();
  } catch(e){
    mostrarError("No se pudo guardar el cambio. Intenta de nuevo.");
    console.error(e);
  }
}
