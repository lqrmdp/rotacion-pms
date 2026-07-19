/* fechas.js — utilidades de fecha y formato (locale es-MX). */

export function proximoViernes(desde = new Date()) {
  const d = new Date(desde); d.setHours(0,0,0,0);
  const delta = (5 - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + delta);
  return d;
}

export function fmtLarga(d){
  return d.toLocaleDateString("es-MX",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
}

export function fmtCorta(d){
  return d.toLocaleDateString("es-MX",{day:"2-digit",month:"short"});
}

export function fmtHora(iso){
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX",{day:"2-digit",month:"short"}) + " · " + d.toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"});
}

export function isoDate(d){ return d.toISOString().slice(0,10); }
