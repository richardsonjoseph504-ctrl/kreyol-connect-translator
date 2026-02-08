import { translateText } from "./services/TextTranslateService";
import { translateVoice } from "./services/VoiceTranslateService";import React from "react";

export default function Haiti() {
  return (
    <div style={{ padding: 20, lineHeight: 1.6 }}>
      <h2>Ayiti (Haiti)</h2>

      <h3>1) Enfòmasyon Jeneral</h3>
      <ul>
        <li><b>Kapital:</b> Pòtoprens</li>
        <li><b>Sifas:</b> ~27,750 km²</li>
        <li><b>Drapo:</b> Ble + Wouj (ak anblèm nan mitan an sou vèsyon ofisyèl)</li>
        <li><b>Deviz:</b> “L’Union fait la force” (Inyon fè fòs)</li>
      </ul>

      <h3>2) Istwa Ayiti (rezime kout)</h3>
      <p>
        Ayiti se premye repiblik nwa endepandan nan mond lan, apre Revolisyon Ayisyen an.
        Endepandans lan te pwoklame 1ye janvye 1804.
      </p>

      <h3>3) Im Nasyonal</h3>
      <p><b>Non:</b> La Dessalinienne</p>

      <h3>4) Plaj & kote touris</h3>
      <ul>
        <li>Labadee</li>
        <li>Île-à-Vache</li>
        <li>Jacmel</li>
        <li>Cap-Haïtien / Cormier</li>
      </ul>

      <h3>5) Pèp / Abitan</h3>
      <p>
        Pifò moun pale Kreyòl Ayisyen. Fransè se lang ofisyèl tou.
      </p>
    </div>
  );
}
