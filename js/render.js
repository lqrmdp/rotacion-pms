/* render.js — deriva los datos de la vista desde el estado y reparte
   el pintado entre las cuatro vistas. */

import { getState, getYo } from "./store.js";
import { asignadoIdx, fechaTurnoActivo, turnoVencido } from "./rotacion.js";
import { pintarPropuesta } from "./vista-propuesta.js";
import { pintarTurno } from "./vista-turno.js";
import { pintarRiel } from "./vista-riel.js";
import { pintarHistorial } from "./vista-historial.js";

export function render(){
  const state = getState();
  if (!state) return;
  const yo = getYo();

  // El viernes del turno activo: ancla + una semana por cada viernes ya
  // resuelto. No depende de la fecha de hoy, así que nunca se pierde
  // uno por no haberlo marcado a tiempo.
  const viernes = fechaTurnoActivo(state);
  const vencido = turnoVencido(state);
  const idxActual = asignadoIdx(state, state.turn);
  const pmActual = state.pms[idxActual];
  const idxSiguiente = (idxActual+1) % state.pms.length;
  const pmSiguiente = state.pms[idxSiguiente];
  const propuestaActiva = state.proposals.find(p => p.turn===state.turn && p.status==="pendiente");

  // El historial es siempre secuencial: el último elemento es, por
  // definición, el viernes resuelto más reciente y el único que se
  // puede deshacer.
  const ultimoResuelto = state.history[state.history.length-1];

  pintarTurno({ state, yo, viernes, vencido, pmActual, pmSiguiente, propuestaActiva, ultimoResuelto });
  pintarPropuesta({ state, yo, propuestaActiva, viernes });
  pintarRiel(state);
  pintarHistorial(state);
}
