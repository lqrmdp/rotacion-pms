/* vista-turno.js — tarjeta del viernes en curso: fecha, chip de estado,
   nombre del PM, botones de acción y nota de confirmación. */

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

export function pintarTurno({ yo, viernes, pmActual, pmSiguiente, propuestaActiva, checkDeHoy, ultimoSalto, ultimaEntrada }){
  el.fechaGrande.textContent = fmtLarga(viernes);
  el.pmNombre.textContent = pmActual;

  const chip = el.chipEstado;
  chip.textContent = checkDeHoy ? "✅ Realizada" : "⏳ Pendiente";
  chip.className = "chip " + (checkDeHoy ? "chip-verde" : "chip-ambar");

  const acciones = el.acciones;
  acciones.innerHTML = "";
  const notaCheck = el.notaCheck;
  notaCheck.textContent = "";

  // Sin nombre seleccionado no se registra nada: todo queda anónimo si no.
  const identificado = !!yo;

  if (!checkDeHoy){
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
  }

  if (!identificado){
    notaCheck.textContent = "Selecciona tu nombre arriba para poder registrar.";
  } else if (checkDeHoy){
    notaCheck.innerHTML = `Marcada por ${checkDeHoy.by||"—"} · ${fmtHora(checkDeHoy.at)}`;
    if (ultimaEntrada === checkDeHoy) notaCheck.appendChild(enlaceDeshacer());
  } else if (ultimoSalto){
    notaCheck.innerHTML = `✖️ El ${fmtCorta(new Date(ultimoSalto.date + "T12:00:00"))} se registró sin sesión por ${ultimoSalto.by||"—"}. El turno se corrió a este viernes.`;
    if (ultimaEntrada === ultimoSalto) notaCheck.appendChild(enlaceDeshacer());
  }
}
