/* errores.js — caja de error de la parte superior. */

import { el } from "./dom.js";

export function mostrarError(msg){
  el.cajaError.textContent = msg;
  el.cajaError.style.display = "block";
}

export function ocultarError(){
  el.cajaError.style.display = "none";
}
