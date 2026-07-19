/* vista-riel.js — lista de los próximos 8 turnos. */

import { el } from "./dom.js";
import { fmtCorta } from "./fechas.js";
import { proximosTurnos } from "./rotacion.js";

export function pintarRiel(state){
  const riel = el.riel;
  riel.innerHTML = "";
  proximosTurnos(state, 8).forEach((t, i) => {
    const fila = document.createElement("div");
    fila.className = "riel-fila" + (i===0 ? " activo" : "");
    fila.innerHTML = `
      <div class="riel-punto"></div>
      <span class="riel-fecha">${fmtCorta(t.fecha)}</span>
      <span class="riel-nombre">${state.pms[t.idx]}</span>
      ${state.overrides[String(t.turn)]!==undefined ? '<span class="riel-swap">↔ cambio</span>' : ''}
    `;
    riel.appendChild(fila);
  });
}
