import { useEffect, useMemo, useState } from "react";
import Translator from "./components/Translator";

export default function App() {
  const [dark, setDark] = useState(true);

  // Kenbe chwa a menm si w refresh
  useEffect(() => {
    const saved = localStorage.getItem("theme_dark");
    if (saved !== null) setDark(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme_dark", dark ? "1" : "0");
  }, [dark]);

  const theme = useMemo(() => {
    // Drapo Ayiti: ble + rouj
    const flagBlue = "#00209F";
    const flagRed = "#D21034";

    if (dark) {
      return {
        pageBg: `linear-gradient(135deg, ${flagBlue} 0%, #031a6b 40%, ${flagRed
