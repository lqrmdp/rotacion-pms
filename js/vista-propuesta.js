/* vista-propuesta.js — caja ámbar de propuesta de cesión pendiente. */

import { el } from "./dom.js";
import { fmtCorta, fmtHora } from "./fechas.js";
import { resolverPropuesta } from "./acciones.js";

export function pintarPropuesta({ state, yo, propuestaActiva, viernes }){
  if (!propuestaActiva){
    el.cajaPropuesta.style.display = "none";
    return;
  }

  el.cajaPropuesta.style.display = "block";
  el.propuestaTexto.innerHTML =
    `<b>${state.pms[propuestaActiva.fromIdx]}</b> propone ceder su turno del ${fmtCorta(viernes)} a <b>${state.pms[propuestaActiva.toIdx]}</b>. A cambio, tomará el turno del siguiente viernes.`;
  el.propuestaMeta.textContent = "Propuesto: " + fmtHora(propuestaActiva.at);

  const btns = el.propuestaBtns;
  if (yo === state.pms[propuestaActiva.toIdx]){
    btns.innerHTML = "";
    const bA = document.createElement("button"); bA.className="btn-aceptar"; bA.textContent="Aceptar el cambio";
    bA.onclick = () => resolverPropuesta(propuestaActiva.id, true);
    const bR = document.createElement("button"); bR.className="btn-rechazar"; bR.textContent="Rechazar";
    bR.onclick = () => resolverPropuesta(propuestaActiva.id, false);
    btns.append(bA,bR);
  } else {
    btns.innerHTML = `<p class="propuesta-meta">Esperando respuesta de ${state.pms[propuestaActiva.toIdx]}.</p>`;
  }
}
