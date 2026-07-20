/* rotacion.js — lógica pura de la rotación: quién presenta y cuándo.

   Los viernes registrados como feriado no consumen turno: se saltan y
   todo lo que viene detrás se desplaza una semana. */

import { proximoViernes, isoDate } from "./fechas.js";

/** Índice del PM asignado a un turno, respetando los intercambios aceptados. */
export function asignadoIdx(s, turn){
  const ov = s.overrides[String(turn)];
  return ov !== undefined ? ov : turn % s.pms.length;
}

/** Fechas marcadas como «sin sesión». */
export function viernesSaltados(s){
  return new Set((s.history || []).filter(h => h.type === "skip").map(h => h.date));
}

/** El primer viernes que sí tiene sesión: el que toca de verdad. */
export function viernesEfectivo(s){
  const saltados = viernesSaltados(s);
  const d = proximoViernes();
  let guardia = 0;
  while (saltados.has(isoDate(d)) && guardia++ < 260){
    d.setDate(d.getDate() + 7);
  }
  return d;
}

/** Los próximos `n` viernes. Los feriados aparecen como filas sin turno. */
export function proximosTurnos(s, n = 8){
  const saltados = viernesSaltados(s);
  const out = [];
  let fecha = proximoViernes();
  let t = s.turn;
  let guardia = 0;

  while (out.length < n && guardia++ < 260){
    if (saltados.has(isoDate(fecha))){
      out.push({ tipo: "salto", fecha: new Date(fecha) });
    } else {
      out.push({ tipo: "turno", turn: t, idx: asignadoIdx(s, t), fecha: new Date(fecha) });
      t++;
    }
    fecha = new Date(fecha);
    fecha.setDate(fecha.getDate() + 7);
  }
  return out;
}
