/* notificaciones.js — avisos al espacio de Google Chat del equipo.
   Los fallos aquí no interrumpen la app: la propuesta ya quedó
   guardada en Firestore y eso es lo que importa. Si el aviso no sale,
   se registra en la consola y punto. */

import { CHAT_WEBHOOK, NOTIFICAR, APP_URL } from "./config.js";
import { proximoViernes, fmtCorta } from "./fechas.js";

/** Google Chat acepta *negrita*, _cursiva_ y <url|texto> en el campo text. */
async function enviar(texto){
  if (!CHAT_WEBHOOK) return;
  try{
    const r = await fetch(CHAT_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ text: texto })
    });
    if (!r.ok) console.warn("Google Chat rechazó el aviso:", r.status, await r.text());
  } catch(e){
    console.warn("No se pudo avisar a Google Chat:", e.message);
  }
}

const enlace = () => `\n\n<${APP_URL}|Abrir la rotación>`;

export function avisarPropuesta({ de, para }){
  if (!NOTIFICAR.propuesta) return;
  enviar(
    `🔁 *${de}* propone ceder su turno del viernes ${fmtCorta(proximoViernes())} a *${para}*.\n` +
    `A cambio tomará el turno del siguiente viernes.\n` +
    `_${para} tiene que aceptarlo o rechazarlo._` + enlace()
  );
}

export function avisarResolucion({ de, para, aceptada, por }){
  if (!NOTIFICAR.resolucion) return;
  const viernes = fmtCorta(proximoViernes());
  enviar(aceptada
    ? `✅ *${por}* aceptó el cambio: el viernes ${viernes} presenta *${para}* en lugar de *${de}*.` + enlace()
    : `🚫 *${por}* rechazó el cambio: el viernes ${viernes} sigue presentando *${de}*.` + enlace()
  );
}
