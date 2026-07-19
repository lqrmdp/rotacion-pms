/* rotacion.js — lógica pura de la rotación: quién presenta y cuándo. */

import { proximoViernes } from "./fechas.js";

/** Índice del PM asignado a un turno, respetando los intercambios aceptados. */
export function asignadoIdx(s, turn){
  const ov = s.overrides[String(turn)];
  return ov !== undefined ? ov : turn % s.pms.length;
}

/** Los próximos `n` turnos a partir del turno actual, un viernes cada uno. */
export function proximosTurnos(s, n=8){
  const out = [];
  let fecha = proximoViernes();
  for (let t = s.turn; t < s.turn + n; t++){
    out.push({turn:t, idx:asignadoIdx(s,t), fecha:new Date(fecha)});
    fecha = new Date(fecha); fecha.setDate(fecha.getDate()+7);
  }
  return out;
}
