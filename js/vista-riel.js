/* vista-riel.js — los próximos 8 viernes. Los ya resueltos se muestran
   apagados: presentados con ✅, feriados tachados. */

import { el } from "./dom.js";
import { fmtCorta } from "./fechas.js";
import { proximosTurnos } from "./rotacion.js";

export function pintarRiel(state){
  const riel = el.riel;
  riel.innerHTML = "";
  let primeroPendiente = true;

  proximosTurnos(state, 8).forEach(t => {
    const fila = document.createElement("div");
    const fecha = fmtCorta(t.fecha);

    if (t.tipo === "salto"){
      fila.className = "riel-fila riel-fila--resuelto riel-fila--salto";
      fila.innerHTML = `
        <div class="riel-punto"></div>
        <span class="riel-fecha">${fecha}</span>
        <span class="riel-nombre">Sin sesión · feriado</span>
      `;
    } else if (t.tipo === "hecho"){
      fila.className = "riel-fila riel-fila--resuelto";
      fila.innerHTML = `
        <div class="riel-punto"></div>
        <span class="riel-fecha">${fecha}</span>
        <span class="riel-nombre">${state.pms[t.idx]}</span>
        <span class="riel-hecho">✅ presentada</span>
      `;
    } else {
      const activo = primeroPendiente;
      primeroPendiente = false;
      fila.className = "riel-fila" + (activo ? " activo" : "");
      fila.innerHTML = `
        <div class="riel-punto"></div>
        <span class="riel-fecha">${fecha}</span>
        <span class="riel-nombre">${state.pms[t.idx]}</span>
        ${state.overrides[String(t.turn)]!==undefined ? '<span class="riel-swap">↔ cambio</span>' : ''}
      `;
    }

    riel.appendChild(fila);
  });
}
