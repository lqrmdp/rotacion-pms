/* dom.js — referencias a los nodos fijos del documento.
   Se resuelven al cargar el módulo: type="module" ya se ejecuta
   con el DOM construido. */

const byId = (id) => document.getElementById(id);

export const el = {
  selYo:          byId("selYo"),
  cajaError:      byId("cajaError"),
  cajaPropuesta:  byId("cajaPropuesta"),
  propuestaTexto: byId("propuestaTexto"),
  propuestaMeta:  byId("propuestaMeta"),
  propuestaBtns:  byId("propuestaBtns"),
  fechaGrande:    byId("fechaGrande"),
  chipEstado:     byId("chipEstado"),
  pmNombre:       byId("pmNombre"),
  acciones:       byId("acciones"),
  notaCheck:      byId("notaCheck"),
  riel:           byId("riel"),
  toggleHist:     byId("toggleHist"),
  histLista:      byId("histLista"),
  btnRefrescar:   byId("btnRefrescar"),
  syncMeta:       byId("syncMeta")
};
