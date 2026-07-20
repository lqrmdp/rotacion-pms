# Matriz de pruebas · antes de liberar a producción

Prueba de humo, no exhaustiva: valida que el ciclo esencial funciona y que nada
se rompe cuando dos personas usan la app a la vez.

**Dónde:** siempre sobre <https://lqrmdp.github.io/rotacion-pms/>, no en local.
Es lo que va a usar el equipo.

**Antes de empezar**
- La base debe estar limpia: `turn: 0`, Jorge García el 24-jul, sin marcas «↔ cambio».
- Necesitas **dos navegadores** (o uno normal y otro en incógnito) para simular dos personas.
- Ten a mano el espacio de Chat y el móvil.

**Al terminar**: borra el documento `estado` en Firestore y recarga, o los datos de
prueba quedarán a la vista del equipo. También borra los mensajes de prueba del Chat.

Prioridades: **P1** = si falla, no se libera · **P2** = deseable, no bloqueante.

---

## A · Arranque

| # | Qué valida | Cómo | Resultado esperado | Pri |
|---|---|---|---|---|
| A1 | Carga y conexión | Abre la URL | Sin recuadro rojo. Abajo a la derecha, «Sincronizado hh:mm» | P1 |
| A2 | Datos correctos | Mira la tarjeta | Viernes 24 de julio · Jorge García · ⏳ Pendiente | P1 |
| A3 | Móvil | Abre la URL en el teléfono | Todo legible, sin desplazamiento horizontal, botones pulsables | P1 |
| A4 | Riel completo | Mira «Próximos turnos» | 8 viernes seguidos, los 6 PMs en orden y repitiendo | P2 |

## B · Ciclo semanal (el núcleo)

| # | Qué valida | Cómo | Resultado esperado | Pri |
|---|---|---|---|---|
| B1 | Marcar realizada | Elige tu nombre → «Marcar presentación como realizada» | Chip pasa a ✅ Realizada. El riel avanza: el 24-jul pasa a Facundo | P1 |
| B2 | Trazabilidad | Mira bajo la tarjeta | «Marcada por *tu nombre* · fecha y hora» | P1 |
| B3 | Deshacer | Pulsa «deshacer» | Vuelve a Jorge García y a ⏳ Pendiente | P1 |
| B4 | Feriado | «✖️ Registrar viernes sin sesión» | Desaparecen los botones. Dice que el turno de Jorge se traslada al siguiente viernes | P1 |
| B5 | El feriado no consume turno | Tras B4, mira el riel | Jorge sigue siendo el próximo: un feriado no le hace perder su turno | P1 |
| B6 | Historial | Abre «Historial ▾» | Aparecen las acciones anteriores, la más reciente arriba, con quién y cuándo | P2 |

## C · Cesión de turno

| # | Qué valida | Cómo | Resultado esperado | Pri |
|---|---|---|---|---|
| C1 | Solo cede quien tiene el turno | Navegador A: elige Jorge. Navegador B: elige Maricielo | El botón «Ceder mi turno» solo aparece en A | P1 |
| C2 | Proponer | En A pulsa «Ceder mi turno a Facundo» | Caja ámbar en ambos. A dice «Esperando respuesta de Facundo» | P1 |
| C3 | Solo responde el destinatario | En B cambia a Facundo | Solo con Facundo seleccionado salen Aceptar / Rechazar | P1 |
| C4 | Aceptar | Pulsa «Aceptar el cambio» | Riel: 24-jul → Facundo y 31-jul → Jorge, ambos con «↔ cambio» | P1 |
| C5 | Rechazar | Repite C2 y pulsa «Rechazar» | La caja desaparece, el riel NO cambia, queda registrado en el historial | P2 |

## D · Varias personas a la vez

| # | Qué valida | Cómo | Resultado esperado | Pri |
|---|---|---|---|---|
| D1 | Tiempo real | Con A y B abiertos, actúa en A | B se actualiza solo en menos de 2 s, sin recargar | P1 |
| D2 | Escrituras simultáneas | Pulsa «Marcar realizada» en A y B casi a la vez | El turno avanza **una sola vez**, no dos | P1 |
| D3 | Botón Actualizar | Pulsa «⟳ Actualizar» | Los datos se refrescan sin errores | P2 |

## E · Avisos

| # | Qué valida | Cómo | Resultado esperado | Pri |
|---|---|---|---|---|
| E1 | Aviso de propuesta | Tras C2, mira el espacio de Chat | Llega el mensaje 🔁 con quién cede y a quién | P1 |
| E2 | Aviso de resolución | Tras C4 o C5 | Llega ✅ o 🚫 según corresponda | P1 |
| E3 | El enlace funciona | Pulsa «Abrir la rotación» en el mensaje | Abre la app publicada, no un 404 | P1 |
| E4 | Aviso semanal | En Apps Script, ejecuta `avisoSemanal` a mano | Llega 📅 con el PM correcto según el estado actual | P1 |
| E5 | El martes de verdad | Espera al martes 21-jul, 10-11 a. m. | Llega solo. Si no, revisa Ejecuciones en Apps Script | P2 |

## F · Que no se rompa

| # | Qué valida | Cómo | Resultado esperado | Pri |
|---|---|---|---|---|
| F1 | Sin conexión | Activa el modo avión y recarga | Recuadro rojo explicando el fallo, la página no se queda en blanco | P2 |
| F2 | Vuelta de la conexión | Desactiva el modo avión | Se reconecta y vuelve a sincronizar | P2 |
| F3 | Sin identidad | Recarga sin elegir nombre | Se ve todo, pero no aparecen «Ceder» ni Aceptar/Rechazar | P2 |

---

## Lo que esta matriz NO cubre, y conviene que sepas

- **Cualquiera puede marcar cualquier cosa.** No hay autenticación: el desplegable
  es una declaración de intenciones, no una identidad. Cualquiera puede decir que es
  otra persona. Fue una decisión consciente, no un fallo.
- **El cambio de año y los cambios de horario** no están probados. La rotación se
  apoya en `proximoViernes()`, que usa la fecha del navegador de cada persona.
- **Qué pasa si se editan los datos a mano** en la consola de Firestore. Si alguien
  toca `turn` u `overrides` sin cuidado, la rotación puede descuadrarse.
- **Volumen**: con un año de uso el historial tendrá unas 50 entradas y se pinta
  entero cada vez. No es problema ahora; a los tres o cuatro años, quizá.
