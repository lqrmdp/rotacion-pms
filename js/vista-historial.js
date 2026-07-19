/* vista-historial.js — registros pasados: presentaciones, viernes sin
   sesión y cesiones ya resueltas. */

import { el } from "./dom.js";
import { fmtHora } from "./fechas.js";

export function pintarHistorial(state){
  const hist = el.histLista;
  hist.innerHTML = "";
  const filas = [];

  [...state.history].reverse().forEach(h => {
    if (h.type==="check"){
      filas.push(`<div class="hist-fila">✅ <b>${state.pms[h.pmIndex]}</b> presentó el ${h.date}<span class="hist-meta"> · marcado por ${h.by||"—"}, ${fmtHora(h.at)}</span></div>`);
    } else {
      filas.push(`<div class="hist-fila">✖️ Sin sesión el ${h.date}<span class="hist-meta"> · registrado por ${h.by||"—"}, ${fmtHora(h.at)}</span></div>`);
    }
  });

  [...state.proposals].filter(p=>p.status!=="pendiente").reverse().forEach(p => {
    const icono = p.status==="aceptada" ? "🔁" : "🚫";
    filas.push(`<div class="hist-fila">${icono} Cesión <b>${state.pms[p.fromIdx]} ↔ ${state.pms[p.toIdx]}</b> ${p.status}<span class="hist-meta"> · por ${p.resolvedBy||"—"}, ${fmtHora(p.resolvedAt||p.at)}</span></div>`);
  });

  hist.innerHTML = filas.length ? filas.join("") : '<p class="vacio">Aún no hay registros. El primer viernes aparecerá aquí.</p>';
}
