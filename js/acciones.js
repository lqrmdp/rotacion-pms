/* acciones.js — las cinco operaciones que el equipo puede ejecutar
   sobre el estado compartido. Todas pasan por `mutar`. */

import { mutar } from "./repo.js";
import { getYo } from "./store.js";
import { isoDate } from "./fechas.js";
import { asignadoIdx } from "./rotacion.js";
import { avisarPropuesta, avisarResolucion } from "./notificaciones.js";

export function marcarRealizada(viernes){
  mutar(s => {
    s.history.push({type:"check", turn:s.turn, date:isoDate(viernes), pmIndex:asignadoIdx(s,s.turn), by:getYo(), at:new Date().toISOString()});
    s.turn += 1;
    return s;
  });
}

export function deshacerUltima(){
  mutar(s => {
    const i = s.history.map(h=>h.type).lastIndexOf("check");
    if (i>=0){ s.history.splice(i,1); s.turn = Math.max(0, s.turn-1); }
    return s;
  });
}

export function registrarSinSesion(viernes){
  mutar(s => {
    s.history.push({type:"skip", date:isoDate(viernes), by:getYo(), at:new Date().toISOString()});
    return s;
  });
}

export async function proponerCesion(){
  let aviso = null;
  const ok = await mutar(s => {
    const fromIdx = asignadoIdx(s, s.turn);
    const toIdx = (fromIdx+1) % s.pms.length;
    s.proposals.push({id:Date.now().toString(36), turn:s.turn, fromIdx, toIdx, by:getYo(), at:new Date().toISOString(), status:"pendiente"});
    aviso = { de: s.pms[fromIdx], para: s.pms[toIdx] };
    return s;
  });
  if (ok && aviso) avisarPropuesta(aviso);
}

export async function resolverPropuesta(id, aceptar){
  let aviso = null;
  const ok = await mutar(s => {
    const p = s.proposals.find(x=>x.id===id);
    if (!p || p.status!=="pendiente") return s;
    p.status = aceptar ? "aceptada" : "rechazada";
    p.resolvedBy = getYo(); p.resolvedAt = new Date().toISOString();
    if (aceptar){
      s.overrides[String(p.turn)] = p.toIdx;
      s.overrides[String(p.turn+1)] = p.fromIdx;
    }
    aviso = { de: s.pms[p.fromIdx], para: s.pms[p.toIdx], aceptada: aceptar, por: getYo() };
    return s;
  });
  if (ok && aviso) avisarResolucion(aviso);
}
