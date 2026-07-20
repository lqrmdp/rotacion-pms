/* rotacion.js — lógica pura de la rotación: quién presenta y cuándo.

   Un viernes con registro en el historial ya está resuelto y no vuelve a
   ofrecerse, tanto si se presentó como si fue feriado. La diferencia está
   en el turno: presentar lo consume, un feriado no. Por eso el feriado
   desplaza a todo el mundo una semana sin que nadie pierda su vez. */

import { proximoViernes, isoDate } from "./fechas.js";

/** Índice del PM asignado a un turno, respetando los intercambios aceptados. */
export function asignadoIdx(s, turn){
  const ov = s.overrides[String(turn)];
  return ov !== undefined ? ov : turn % s.pms.length;
}

/** Historial indexado por fecha: qué viernes están ya resueltos. */
export function registrosPorFecha(s){
  const m = new Map();
  (s.history || []).forEach(h => m.set(h.date, h));
  return m;
}

/** El primer viernes sin resolver: el que de verdad toca. */
export function viernesEfectivo(s){
  const resueltos = registrosPorFecha(s);
  const d = proximoViernes();
  let guardia = 0;
  while (resueltos.has(isoDate(d)) && guardia++ < 260){
    d.setDate(d.getDate() + 7);
  }
  return d;
}

/** Los próximos `n` viernes, mezclando los ya resueltos con los pendientes. */
export function proximosTurnos(s, n = 8){
  const resueltos = registrosPorFecha(s);
  const out = [];
  let fecha = proximoViernes();
  let t = s.turn;
  let guardia = 0;

  while (out.length < n && guardia++ < 260){
    const h = resueltos.get(isoDate(fecha));

    if (h){
      // Ya resuelto: el turno que consumió (si lo hizo) quedó guardado.
      out.push({
        tipo: h.type === "skip" ? "salto" : "hecho",
        fecha: new Date(fecha),
        idx: h.pmIndex
      });
    } else {
      out.push({ tipo: "turno", turn: t, idx: asignadoIdx(s, t), fecha: new Date(fecha) });
      t++;
    }

    fecha = new Date(fecha);
    fecha.setDate(fecha.getDate() + 7);
  }
  return out;
}
