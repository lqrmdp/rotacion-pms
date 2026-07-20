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

// ─── Avisos a Google Chat ───────────────────────────────────────────
// Webhook del espacio donde se publican las propuestas de cambio.
// Espacio → nombre del espacio → Aplicaciones e integraciones → Webhooks.
//
// ⚠️ Esta URL viaja en el JS de un repositorio público: quien la
// encuentre puede publicar en el espacio. Si algún día molesta,
// bórrala y crea otra desde el mismo menú.
//
// AHORA MISMO APUNTA AL ESPACIO DE PRUEBAS. Cambia esta línea por el
// webhook del espacio del equipo cuando termines de validar.
export const CHAT_WEBHOOK = "https://chat.googleapis.com/v1/spaces/AAQAK99bdbg/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=IY3HT5csEbVwLL9vIiRwdHq39XZBvtKm9pAuCuVCuTY";

/** Qué eventos se avisan. Pon en false lo que sobre. */
export const NOTIFICAR = {
  propuesta: true,   // alguien propone ceder su turno
  resolucion: true   // la propuesta se acepta o se rechaza
};

/** Enlace que se incluye en los avisos. */
export const APP_URL = "https://lqrmdp.github.io/rotacion-pms/";

// ─── Configuración de la rotación ───────────────────────────────────
export const PMS = ["Jorge García","Facundo Stiefkens","Maricielo Pereyra","Alejandro Gutiérrez","Cristian Medina","Soporte"];
export const ANCHOR = "2026-07-24"; // viernes en que inicia Jorge García

export const ESTADO_INICIAL = {
  pms: PMS, anchor: ANCHOR, turn: 0, overrides: {}, history: [], proposals: []
};
