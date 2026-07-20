/* vista-turno.js — tarjeta del próximo turno pendiente: fecha, PM,
   botones de acción y nota del último viernes resuelto.

   La tarjeta siempre muestra un viernes sin resolver, así que el chip
   siempre está pendiente: lo ya hecho se ve en el riel y en la nota. */

import { el } from "./dom.js";
import { fmtLarga, fmtCorta, fmtHora } from "./fechas.js";
import { marcarRealizada, deshacerUltima, registrarSinSesion, proponerCesion } from "./acciones.js";

/** Enlace «deshacer», solo para el último registro del historial. */
function enlaceDeshacer(){
  const btn = document.createElement("button");
  btn.className = "link-deshacer";
  btn.textContent = "deshacer";
  btn.style.marginLeft = "6px";
  btn.onclick = deshacerUltima;
  return btn;
}

/** Las fechas se guardan como AAAA-MM-DD; al mediodía para esquivar husos. */
const aFecha = (iso) => new Date(iso + "T12:00:00");

export function pintarTurno({ state, yo, viernes, pmActual, pmSiguiente, propuestaActiva, ultimoResuelto, ultimaEntrada }){
  el.fechaGrande.textContent = fmtLarga(viernes);
  el.pmNombre.textContent = pmActual;

  const chip = el.chipEstado;
  chip.textContent = "⏳ Pendiente";
  chip.className = "chip chip-ambar";

  const acciones = el.acciones;
  acciones.innerHTML = "";
  const notaCheck = el.notaCheck;
  notaCheck.textContent = "";

  // Sin nombre seleccionado no se registra nada: quedaría sin autor.
  const identificado = !!yo;

  const bMarcar = document.createElement("button");
  bMarcar.className = "btn-primario";
  bMarcar.textContent = "Marcar presentación como realizada";
  bMarcar.disabled = !identificado;
  bMarcar.onclick = () => marcarRealizada(viernes);
  acciones.appendChild(bMarcar);

  if (identificado && yo === pmActual && !propuestaActiva){
    const bCeder = document.createElement("button");
    bCeder.className = "btn-secundario";
    bCeder.textContent = `Ceder mi turno a ${pmSiguiente}`;
    bCeder.onclick = proponerCesion;
    acciones.appendChild(bCeder);
  }

  const bSkip = document.createElement("button");
  bSkip.className = "btn-terciario";
  bSkip.textContent = "✖️ Registrar viernes sin sesión (feriado)";
  bSkip.disabled = !identificado;
  bSkip.onclick = () => registrarSinSesion(viernes);
  acciones.appendChild(bSkip);

  if (!identificado){
    notaCheck.textContent = "Selecciona tu nombre arriba para poder registrar.";
    return;
  }

  if (ultimoResuelto){
    const dia = fmtCorta(aFecha(ultimoResuelto.date));
    notaCheck.innerHTML = ultimoResuelto.type === "check"
      ? `✅ El ${dia} presentó ${state.pms[ultimoResuelto.pmIndex]} · marcado por ${ultimoResuelto.by||"—"}, ${fmtHora(ultimoResuelto.at)}`
      : `✖️ El ${dia} se registró sin sesión por ${ultimoResuelto.by||"—"}. El turno se corrió a este viernes.`;
    if (ultimaEntrada === ultimoResuelto) notaCheck.appendChild(enlaceDeshacer());
  }
}
