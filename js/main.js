/* main.js — punto de entrada: cablea los eventos fijos de la UI
   y arranca la conexión con la base de datos. */

import { PMS } from "./config.js";
import { el } from "./dom.js";
import { setYo, setState, subscribe } from "./store.js";
import { render } from "./render.js";
import { asegurarDocumento, escucharCambios, leerUnaVez } from "./repo.js";
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

el.btnRefrescar.addEventListener("click", async () => {
  const datos = await leerUnaVez();
  if (datos) setState(datos);
});

// ─── Arranque ────────────────────────────────────────────────────────
asegurarDocumento().then(escucharCambios).catch(e => {
  mostrarError("No se pudo conectar con Firebase. Verifica el firebaseConfig en el archivo.");
  console.error(e);
});
