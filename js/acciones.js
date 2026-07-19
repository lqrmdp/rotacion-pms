/* acciones.js — las cinco operaciones que el equipo puede ejecutar
   sobre el estado compartido. Todas pasan por `mutar`. */

import { mutar } from "./repo.js";
import { getYo } from "./store.js";
import { isoDate } from "./fechas.js";
import { asignadoIdx } from "./rotacion.js";

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

export function proponerCesion(){
  mutar(s => {
    const fromIdx = asignadoIdx(s, s.turn);
    const toIdx = (fromIdx+1) % s.pms.length;
    s.proposals.push({id:Date.now().toString(36), turn:s.turn, fromIdx, toIdx, by:getYo(), at:new Date().toISOString(), status:"pendiente"});
    return s;
  });
}

export function resolverPropuesta(id, aceptar){
  mutar(s => {
    const p = s.proposals.find(x=>x.id===id);
    if (!p || p.status!=="pendiente") return s;
    p.status = aceptar ? "aceptada" : "rechazada";
    p.resolvedBy = getYo(); p.resolvedAt = new Date().toISOString();
    if (aceptar){
      s.overrides[String(p.turn)] = p.toIdx;
      s.overrides[String(p.turn+1)] = p.fromIdx;
    }
    return s;
  });
}
