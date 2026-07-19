/* store.js — estado en memoria (el documento remoto + quién soy yo)
   y notificación a la vista. Sustituye a las variables globales
   `state` y `yo` del artefacto original. */

let state = null;
let yo = "";
const suscriptores = [];

export function getState(){ return state; }
export function getYo(){ return yo; }

export function setState(nuevo){
  state = nuevo;
  emitir();
}

export function setYo(nombre){
  yo = nombre;
  emitir();
}

export function subscribe(fn){
  suscriptores.push(fn);
}

function emitir(){
  if (!state) return;               // igual que el `if (!state) return` del render original
  suscriptores.forEach(fn => fn());
}
