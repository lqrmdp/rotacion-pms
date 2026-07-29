/**
 * aviso-martes.gs — recordatorio semanal en Google Chat.
 *
 * Lee el estado de la rotación desde Firestore, calcula a quién le toca
 * y lo publica en el espacio del equipo. Si ese turno ya venció (nadie
 * lo marcó a tiempo), lo avisa igual pero con otro texto, en vez de
 * quedarse callado — eso fue justo lo que falló la primera vez.
 *
 * NO se ejecuta desde la web: vive en Google Apps Script, con un
 * disparador por tiempo. Por eso funciona aunque nadie abra la app.
 *
 * ── Instalación ────────────────────────────────────────────────────
 *  1. script.google.com → Nuevo proyecto → pega este archivo entero.
 *  2. Ajusta las constantes de abajo.
 *  3. Configuración del proyecto → zona horaria → America/Mexico_City.
 *  4. Ejecuta `avisoSemanal` a mano una vez para autorizar permisos
 *     y comprobar que llega el mensaje.
 *  5. Disparadores (⏰) → Añadir disparador:
 *       función: avisoSemanal
 *       origen: Basado en el tiempo
 *       tipo: Temporizador por semana
 *       día: Todos los martes
 *       hora: la que prefieras
 */

// ─── Configuración ──────────────────────────────────────────────────
const WEBHOOK   = 'PEGA_AQUI_EL_WEBHOOK_DEL_ESPACIO';
const PROYECTO  = 'rotacion-pms';
const API_KEY   = 'AIzaSyD4KXrxpb50E40mmhTmRD9W91GM-ArlUo0';
const COLECCION = 'rotacion-pms';
const DOCUMENTO = 'estado';
const APP_URL   = 'https://lqrmdp.github.io/rotacion-pms/';

const MESES = ['enero','febrero','marzo','abril','mayo','junio',
               'julio','agosto','septiembre','octubre','noviembre','diciembre'];

// ─── Punto de entrada (el que dispara el temporizador) ──────────────
function avisoSemanal() {
  const estado = leerEstado();
  const activo = fechaTurnoActivo(estado);
  const pm     = estado.pms[asignadoIdx(estado, estado.turn)];
  const fecha  = activo.getDate() + ' de ' + MESES[activo.getMonth()];

  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const vencido = activo < hoy;

  const texto = vencido
    ? '⚠️ *Pendiente de una semana anterior:* ' + pm + '\n' +
      'Viernes ' + fecha + ' · nadie lo registró todavía. Si ya se presentó, ' +
      'márquenlo en la app para que la rotación se ponga al día.\n' +
      '<' + APP_URL + '|Abrir la rotación>'
    : '📅 *Próximo PM a presentar:* ' + pm + '\n' +
      'Viernes ' + fecha + ' · estatus de proyectos ante dirección.\n' +
      '<' + APP_URL + '|Abrir la rotación>';

  enviar(texto);
}

// ─── Firestore (lectura vía API REST) ───────────────────────────────
function leerEstado() {
  const url = 'https://firestore.googleapis.com/v1/projects/' + PROYECTO +
              '/databases/(default)/documents/' + COLECCION + '/' + DOCUMENTO +
              '?key=' + API_KEY;

  const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (resp.getResponseCode() !== 200) {
    throw new Error('Firestore respondió ' + resp.getResponseCode() + ': ' + resp.getContentText());
  }

  const f = JSON.parse(resp.getContentText()).fields;
  return {
    anchor:    f.anchor.stringValue,
    pms:       (f.pms.arrayValue.values || []).map(function (v) { return v.stringValue; }),
    turn:      Number(f.turn.integerValue || 0),
    overrides: (f.overrides.mapValue && f.overrides.mapValue.fields) || {},
    history:   (f.history.arrayValue && f.history.arrayValue.values) || []
  };
}

/** Mismo criterio que rotacion.js en la web: el override manda. */
function asignadoIdx(s, turn) {
  const ov = s.overrides[String(turn)];
  return ov !== undefined ? Number(ov.integerValue) : turn % s.pms.length;
}

/** Mismo criterio que rotacion.js en la web: ancla + una semana por
    cada viernes ya resuelto. No depende de la fecha de hoy: por eso
    un viernes sin marcar no se pierde ni hace que el aviso se calle. */
function fechaTurnoActivo(s) {
  var d = new Date(s.anchor + 'T12:00:00');
  d.setDate(d.getDate() + 7 * s.history.length);
  return d;
}

// ─── Google Chat ────────────────────────────────────────────────────
function enviar(texto) {
  const resp = UrlFetchApp.fetch(WEBHOOK, {
    method: 'post',
    contentType: 'application/json; charset=UTF-8',
    payload: JSON.stringify({ text: texto }),
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() !== 200) {
    throw new Error('Chat respondió ' + resp.getResponseCode() + ': ' + resp.getContentText());
  }
}
