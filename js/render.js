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

  // El próximo viernes sin resolver: ni presentado ni marcado como feriado.
  const viernes = viernesEfectivo(state);
  const idxActual = asignadoIdx(state, state.turn);
  const pmActual = state.pms[idxActual];
  const idxSiguiente = (idxActual+1) % state.pms.length;
  const pmSiguiente = state.pms[idxSiguiente];
  const propuestaActiva = state.proposals.find(p => p.turn===state.turn && p.status==="pendiente");

  // Último viernes resuelto que todavía se ve en el riel: es el que se
  // puede deshacer, y el que explica por qué la fecha se ha corrido.
  const desde = isoDate(proximoViernes());
  const vigentes = state.history.filter(h => h.date >= desde);
  const ultimoResuelto = vigentes[vigentes.length-1];
  const ultimaEntrada = state.history[state.history.length-1];

  pintarTurno({ state, yo, viernes, pmActual, pmSiguiente, propuestaActiva, ultimoResuelto, ultimaEntrada });
  pintarPropuesta({ state, yo, propuestaActiva, viernes });
  pintarRiel(state);
  pintarHistorial(state);
}
