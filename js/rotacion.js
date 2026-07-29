/* rotacion.js — lógica pura de la rotación: quién presenta y cuándo.

   El calendario avanza por cada viernes resuelto (presentado o feriado),
   nunca por la fecha de hoy. Si nadie abre la app el viernes que toca,
   ese viernes se queda ahí, pendiente y marcado como vencido — no
   desaparece ni se lo salta el sistema solo. */

/** Índice del PM asignado a un turno, respetando los intercambios aceptados. */
export function asignadoIdx(s, turn){
  const ov = s.overrides[String(turn)];
  return ov !== undefined ? ov : turn % s.pms.length;
}

/** El viernes calendario del turno activo: ancla + 7 días por cada
    viernes ya resuelto. No mira la fecha de hoy para nada. */
export function fechaTurnoActivo(s){
  const d = new Date(s.anchor + "T12:00:00");
  d.setDate(d.getDate() + 7 * (s.history || []).length);
  return d;
}

/** ¿El turno activo ya debería haberse resuelto? Solo informa a la
    vista; no cambia ningún cálculo de la rotación. */
export function turnoVencido(s){
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  return fechaTurnoActivo(s) < hoy;
}

/** Los próximos `n` viernes: primero se recorre el historial en orden
    (ya resueltos), y al agotarse se generan turnos futuros. */
export function proximosTurnos(s, n = 8){
  const hist = s.history || [];
  const out = [];
  let fecha = new Date(s.anchor + "T12:00:00");
  let turno = 0;

  for (let i = 0; out.length < n; i++){
    const h = hist[i];

    if (h){
      out.push({
        tipo: h.type === "skip" ? "salto" : "hecho",
        fecha: new Date(fecha),
        idx: h.pmIndex
      });
      if (h.type === "check") turno++;
    } else {
      out.push({ tipo: "turno", turn: turno, idx: asignadoIdx(s, turno), fecha: new Date(fecha) });
      turno++;
    }

    fecha.setDate(fecha.getDate() + 7);
  }
  return out;
}
