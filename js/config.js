/* ═══════════════════════════════════════════════════════════════
   config.js — único archivo que necesitas tocar para poner
   la app en marcha.

   CONFIGURACIÓN DE FIREBASE — reemplaza con los valores de TU proyecto
   Firebase console → ⚙️ Configuración del proyecto → tus apps → Config
   ═══════════════════════════════════════════════════════════════ */

export const firebaseConfig = {
  apiKey: "AIzaSyD4KXrxpb50E40mmhTmRD9W91GM-ArlUo0",
  authDomain: "rotacion-pms.firebaseapp.com",
  projectId: "rotacion-pms",
  storageBucket: "rotacion-pms.firebasestorage.app",
  messagingSenderId: "530450614450",
  appId: "1:530450614450:web:22960a4bc00792eaee61ab"
};

/** Colección y documento donde vive el estado compartido. */
export const COLECCION = "rotacion-pms";
export const DOCUMENTO = "estado";

// ─── Configuración de la rotación ───────────────────────────────────
export const PMS = ["Jorge García","Facundo Stiefkens","Maricielo Pereyra","Alejandro Gutiérrez","Cristian Medina","Soporte"];
export const ANCHOR = "2026-07-24"; // viernes en que inicia Jorge García

export const ESTADO_INICIAL = {
  pms: PMS, anchor: ANCHOR, turn: 0, overrides: {}, history: [], proposals: []
};
