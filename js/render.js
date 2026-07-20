/* render.js — deriva los datos de la vista desde el estado y reparte
   el pintado entre las cuatro vistas. */

import { getState, getYo } from "./store.js";
import { proximoViernes, isoDate } from "./fechas.js";
import { asignadoIdx, viernesEfectivo } from "./rotacion.js";
import { pintarPropuesta } from "./vista-propuesta.js";
import { pintarTurno } from "./vista-turno.js";
import { pintarRiel } from "./vista-riel.js";
import { pintarHistorial } from "./vista-historial.js";

export function render(){
  const state = getState();
  if (!state) return;
  const yo = getYo();

  // El viernes que toca de verdad: el primero que no esté marcado como feriado.
  const viernes = viernesEfectivo(state);
  const idxActual = asignadoIdx(state, state.turn);
  const pmActual = state.pms[idxActual];
  const idxSiguiente = (idxActual+1) % state.pms.length;
  const pmSiguiente = state.pms[idxSiguiente];
  const propuestaActiva = state.proposals.find(p => p.turn===state.turn && p.status==="pendiente");
  const checkDeHoy = state.history.find(h => h.type==="check" && h.date===isoDate(viernes));

  // Feriados que aún están por delante: son los que se pueden deshacer.
  const desde = isoDate(proximoViernes());
  const saltosVigentes = state.history.filter(h => h.type==="skip" && h.date >= desde);
  const ultimoSalto = saltosVigentes[saltosVigentes.length-1];
  const ultimaEntrada = state.history[state.history.length-1];

  pintarTurno({ yo, viernes, pmActual, pmSiguiente, propuestaActiva, checkDeHoy, ultimoSalto, ultimaEntrada });
  pintarPropuesta({ state, yo, propuestaActiva, viernes });
  pintarRiel(state);
  pintarHistorial(state);
}
