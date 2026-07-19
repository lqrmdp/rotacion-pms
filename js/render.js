/* render.js — deriva los datos de la vista desde el estado y reparte
   el pintado entre las cuatro vistas. */

import { getState, getYo } from "./store.js";
import { proximoViernes, isoDate } from "./fechas.js";
import { asignadoIdx } from "./rotacion.js";
import { pintarPropuesta } from "./vista-propuesta.js";
import { pintarTurno } from "./vista-turno.js";
import { pintarRiel } from "./vista-riel.js";
import { pintarHistorial } from "./vista-historial.js";

export function render(){
  const state = getState();
  if (!state) return;
  const yo = getYo();

  const viernes = proximoViernes();
  const idxActual = asignadoIdx(state, state.turn);
  const pmActual = state.pms[idxActual];
  const idxSiguiente = (idxActual+1) % state.pms.length;
  const pmSiguiente = state.pms[idxSiguiente];
  const propuestaActiva = state.proposals.find(p => p.turn===state.turn && p.status==="pendiente");
  const checkDeHoy = state.history.find(h => h.type==="check" && h.date===isoDate(viernes));
  const skipDeHoy = state.history.find(h => h.type==="skip" && h.date===isoDate(viernes));
  const historyChecks = state.history.filter(h=>h.type==="check");
  const ultimaCheck = historyChecks[historyChecks.length-1];

  pintarTurno({ yo, viernes, pmActual, pmSiguiente, propuestaActiva, checkDeHoy, skipDeHoy, ultimaCheck });
  pintarPropuesta({ state, yo, propuestaActiva, viernes });
  pintarRiel(state);
  pintarHistorial(state);
}
