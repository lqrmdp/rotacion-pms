/* vista-turno.js — tarjeta del viernes en curso: fecha, chip de estado,
   nombre del PM, botones de acción y nota de confirmación. */

import { el } from "./dom.js";
import { fmtLarga, fmtHora } from "./fechas.js";
import { marcarRealizada, deshacerUltima, registrarSinSesion, proponerCesion } from "./acciones.js";

export function pintarTurno({ yo, viernes, pmActual, pmSiguiente, propuestaActiva, checkDeHoy, skipDeHoy, ultimaCheck }){
  el.fechaGrande.textContent = fmtLarga(viernes);
  el.pmNombre.textContent = pmActual;

  const chip = el.chipEstado;
  chip.textContent = checkDeHoy ? "✅ Realizada" : "⏳ Pendiente";
  chip.className = "chip " + (checkDeHoy ? "chip-verde" : "chip-ambar");

  const acciones = el.acciones;
  acciones.innerHTML = "";
  const notaCheck = el.notaCheck;
  notaCheck.textContent = "";

  if (!checkDeHoy && !skipDeHoy){
    const bMarcar = document.createElement("button");
    bMarcar.className="btn-primario"; bMarcar.textContent="Marcar presentación como realizada";
    bMarcar.onclick = () => marcarRealizada(viernes);
    acciones.appendChild(bMarcar);

    if (yo === pmActual && !propuestaActiva){
      const bCeder = document.createElement("button");
      bCeder.className="btn-secundario"; bCeder.textContent=`Ceder mi turno a ${pmSiguiente}`;
      bCeder.onclick = proponerCesion;
      acciones.appendChild(bCeder);
    }
    const bSkip = document.createElement("button");
    bSkip.className="btn-terciario"; bSkip.textContent="✖️ Registrar viernes sin sesión (feriado)";
    bSkip.onclick = () => registrarSinSesion(viernes);
    acciones.appendChild(bSkip);
  }

  if (checkDeHoy){
    notaCheck.innerHTML = `Marcada por ${checkDeHoy.by||"—"} · ${fmtHora(checkDeHoy.at)}`;
    if (ultimaCheck === checkDeHoy){
      const btn = document.createElement("button");
      btn.className="link-deshacer"; btn.textContent="deshacer"; btn.style.marginLeft="6px";
      btn.onclick = deshacerUltima;
      notaCheck.appendChild(btn);
    }
  } else if (skipDeHoy){
    notaCheck.textContent = `✖️ Registrado sin sesión por ${skipDeHoy.by||"—"}. El turno de ${pmActual} se traslada al siguiente viernes.`;
  }
}
