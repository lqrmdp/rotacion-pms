/* main.js — punto de entrada: cablea los eventos fijos de la UI
   y arranca la conexión con la base de datos. */

import { PMS } from "./config.js";
import { el } from "./dom.js";
import { setYo, setState, subscribe } from "./store.js";
import { render } from "./render.js";
import { asegurarDocumento, escucharCambios, leerUnaVez, marcarSincronizado } from "./repo.js";
import { mostrarError } from "./errores.js";

// La vista se repinta ante cualquier cambio de estado.
subscribe(render);

// ─── Eventos de UI fijos ─────────────────────────────────────────────
PMS.forEach(p => { const o=document.createElement("option"); o.value=p; o.textContent=p; el.selYo.appendChild(o); });
el.selYo.addEventListener("change", e => setYo(e.target.value));

el.toggleHist.addEventListener("click", () => {
  const abierto = !el.histLista.classList.contains("oculto");
  el.histLista.classList.toggle("oculto");
  el.toggleHist.textContent = "Historial " + (abierto ? "▾" : "▴");
});

// Los datos ya llegan solos por onSnapshot, así que este botón rara vez
// cambia nada. Damos señal visible para que no parezca que está muerto.
el.btnRefrescar.addEventListener("click", async () => {
  const original = el.btnRefrescar.textContent;
  el.btnRefrescar.disabled = true;
  el.btnRefrescar.textContent = "⟳ Actualizando…";
  try {
    const datos = await leerUnaVez();
    if (datos) setState(datos);
    marcarSincronizado();
  } finally {
    el.btnRefrescar.disabled = false;
    el.btnRefrescar.textContent = original;
  }
});

// ─── Arranque ────────────────────────────────────────────────────────
asegurarDocumento().then(escucharCambios).catch(e => {
  mostrarError("No se pudo conectar con Firebase. Verifica el firebaseConfig en el archivo.");
  console.error(e);
});
