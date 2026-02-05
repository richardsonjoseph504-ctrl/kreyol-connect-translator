import { useRef } from "react";

export default function App() {
  const testRef = useRef<HTMLDivElement | null>(null);

  return (
    <div style={{ padding: 20 }}>
      <h1>Kreyòl Connect Translator</h1>
      <p>Si ou wè mesaj sa a, App.tsx mache byen ✅</p>

      <div ref={testRef}>
        Test useRef OK
      </div>
    </div>
  );
}
