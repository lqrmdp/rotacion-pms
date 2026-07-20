# Rotación de viernes · Equipo PM

App de una sola pantalla para llevar el turno de quién presenta el estatus de proyectos ante dirección cada viernes. HTML/CSS/JS vanilla, sin build step ni frameworks. El estado es compartido y en vivo: lo que marca una persona lo ven las demás al instante.

Refactorización del artefacto original `../rotacion-pms.html` — misma salida visual y mismo comportamiento, repartido en archivos.

## Arrancar en local

Hace falta un servidor: el JS usa módulos ES (`type="module"`), y los módulos no cargan desde `file://`.

En esta máquina no hay Node ni Python instalados, así que el camino corto es el servidor incluido, que solo necesita Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File servidor.ps1
```

Si algún día instalas Node o Python, cualquiera de estos vale igual:

```bash
python -m http.server 5173
npx serve .
```

En los tres casos, abre <http://localhost:5173>.

## Configuración

Todo lo editable vive en `js/config.js`:

- `firebaseConfig` — pega aquí los valores de tu proyecto (Firebase console → ⚙️ Configuración del proyecto → tus apps → Config). **Mientras siga en `TU_API_KEY` la app carga y se ve bien, pero muestra el error de conexión y no guarda nada.**
- `PMS` — la lista de personas en la rotación.
- `ANCHOR` — viernes en que arranca la rotación (dato de referencia).

Los datos se guardan en un único documento: colección `rotacion-pms`, documento `estado`.

## Estructura

### Raíz

| Archivo | Qué es |
|---|---|
| `index.html` | Solo markup semántico: cabecera, selector de identidad, tarjeta del viernes, riel de próximos turnos, historial y pie. Sin estilos ni scripts inline. |
| `servidor.ps1` | Servidor estático de desarrollo en PowerShell puro, para no depender de Node ni Python. No hace falta desplegarlo. |
| `README.md` | Este archivo. |

### `css/` — cargados en este orden

| Archivo | Qué contiene |
|---|---|
| `base.css` | Reset, variables en `:root` (color, tipografía, espaciado, radios, sombras) y tipografía global. |
| `layout.css` | Contenedor `.wrap`, separación entre secciones y la utilidad `.oculto`. |
| `buttons.css` | Los seis botones compartidos (primario, secundario, terciario, aceptar, rechazar, enlace deshacer). |
| `header.css` | Antetítulo, título y fila «¿Quién eres?» con su `select`. |
| `alertas.css` | Caja de error roja y caja ámbar de propuesta de cesión. |
| `tarjeta-turno.css` | Tarjeta blanca del viernes en curso: chip de estado, nombre del PM y acciones. |
| `riel.css` | Lista de próximos turnos, con la fila activa resaltada. |
| `historial.css` | Bloque plegable de registros pasados. |
| `footer.css` | Botón «Actualizar» y sello de última sincronización. |

### `js/` — un archivo por responsabilidad

| Archivo | Qué hace |
|---|---|
| `config.js` | Credenciales de Firebase, lista de PMs, ancla de la rotación y estado inicial. Lo único que se toca al desplegar. |
| `firebase.js` | Inicializa el SDK y expone la referencia al documento único. |
| `repo.js` | Capa de datos: lectura inicial, suscripción en tiempo real, lectura puntual y mutaciones transaccionales. |
| `store.js` | Estado en memoria (documento remoto + «quién soy yo») y aviso a la vista cuando cambia. |
| `acciones.js` | Las cinco operaciones del equipo: marcar realizada, deshacer, registrar feriado, proponer cesión y resolverla. |
| `rotacion.js` | Lógica pura: a quién le toca cada turno y los próximos ocho viernes. |
| `fechas.js` | Próximo viernes y formateo de fechas/horas en es-MX. |
| `dom.js` | Referencias a los nodos fijos del documento, en un solo sitio. |
| `errores.js` | Mostrar y ocultar la caja de error. |
| `notificaciones.js` | Publica en el espacio de Google Chat cuando alguien propone una cesión o la resuelve. |
| `render.js` | Deriva los datos de vista desde el estado y reparte el pintado. |
| `vista-turno.js` | Pinta la tarjeta del viernes en curso y sus botones. |
| `vista-propuesta.js` | Pinta la propuesta de cesión pendiente. |
| `vista-riel.js` | Pinta los próximos ocho turnos. |
| `vista-historial.js` | Pinta el historial de presentaciones, feriados y cesiones. |

## Avisos en Google Chat

Hay dos tipos, y viven en sitios distintos:

**Inmediatos, desde la app.** Al proponer una cesión y al aceptarla o rechazarla, `js/notificaciones.js` publica en el espacio del equipo. El webhook está en `CHAT_WEBHOOK` (`js/config.js`) y los eventos se activan o desactivan en `NOTIFICAR`. Si el aviso falla, la app no se entera: el cambio ya está guardado en Firestore y el error solo va a la consola.

**Semanal, desde Google Apps Script.** `apps-script/aviso-martes.gs` publica cada martes quién presenta el viernes. No puede vivir en la web —una página estática solo se ejecuta cuando alguien la abre—, así que corre en Google con un disparador por tiempo. Las instrucciones de instalación están en la cabecera del propio archivo.

⚠️ El `.gs` se guarda aquí con el marcador `PEGA_AQUI_EL_WEBHOOK_DEL_ESPACIO`: la URL real solo se escribe dentro de Apps Script, para no publicarla en el repositorio. Si cambias de webhook, hay que actualizarlo en los **dos** sitios.

## Publicar

Es un sitio estático: sirve la carpeta tal cual en Netlify, Vercel, GitHub Pages o cualquier hosting. No hay build.

Restringe la API key de Firebase por dominio en la consola de Google Cloud y define reglas de Firestore antes de compartir el enlace: la config de cliente es pública por definición.

## Migrar a Supabase (pendiente)

El backend actual es Firestore. Toda la dependencia está aislada en `repo.js` y `firebase.js`; el resto de la app solo habla con `store.js`. La migración es reescribir esos dos archivos respetando la interfaz pública de `repo.js`:

```
asegurarDocumento()  → crea la fila si no existe
escucharCambios()    → suscripción en vivo; llama a setState() y actualiza el sello de sync
leerUnaVez()         → devuelve el estado o null
mutar(fn)            → aplica fn al estado y lo guarda de forma atómica
```

Equivalencias:

| Hoy (Firestore) | Con Supabase |
|---|---|
| Documento `rotacion-pms/estado` | Tabla `rotacion` con una fila (`id = 'estado'`, columna `estado jsonb`) |
| `onSnapshot` | Realtime: `supabase.channel(...).on('postgres_changes', …)` |
| `runTransaction` | Función RPC en Postgres, o `update … where estado->>'version' = …` para bloqueo optimista |
| Reglas de Firestore | Row Level Security + Supabase Auth |

Dos cosas a decidir antes de migrar: si se añade login real (hoy la identidad es un `select`, sin autenticación) y cómo se resuelven las escrituras simultáneas, porque `runTransaction` no tiene equivalente directo en el cliente de Supabase.
