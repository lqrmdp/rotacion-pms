/* vista-riel.js — lista de los próximos 8 viernes. Los feriados se
   muestran como filas apagadas, sin PM asignado. */

import { el } from "./dom.js";
import { fmtCorta } from "./fechas.js";
import { proximosTurnos } from "./rotacion.js";

export function pintarRiel(state){
  const riel = el.riel;
  riel.innerHTML = "";
  let primeroConTurno = true;

  proximosTurnos(state, 8).forEach(t => {
    const fila = document.createElement("div");

    if (t.tipo === "salto"){
      fila.className = "riel-fila riel-fila--salto";
      fila.innerHTML = `
        <div class="riel-punto"></div>
        <span class="riel-fecha">${fmtCorta(t.fecha)}</span>
        <span class="riel-nombre">Sin sesión · feriado</span>
      `;
    } else {
      const activo = primeroConTurno;
      primeroConTurno = false;
      fila.className = "riel-fila" + (activo ? " activo" : "");
      fila.innerHTML = `
        <div class="riel-punto"></div>
        <span class="riel-fecha">${fmtCorta(t.fecha)}</span>
        <span class="riel-nombre">${state.pms[t.idx]}</span>
        ${state.overrides[String(t.turn)]!==undefined ? '<span class="riel-swap">↔ cambio</span>' : ''}
      `;
    }

    riel.appendChild(fila);
  });
}
