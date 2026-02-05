import { useEffect, useState } from "react";
import Translator from "./components/Translator";

export default function App() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) setDark(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", String(dark));
  }, [dark]);

  return (
    <div className={dark ? "app app--dark" : "app app--light"}>
      {/* Global styles (pa bezwen lòt file) */}
      <style>{`
        :root{
          --haiti-blue:#00209F;
          --haiti-red:#D21034;
          --card-dark:#0f172a;
          --card-light:#ffffff;
          --text-dark:#ffffff;
          --text-light:#0b1220;
          --muted-dark:rgba(255,255,255,.7);
          --muted-light:rgba(0,0,0,.6);
          --shadow: 0 18px 45px rgba(0,0,0,.28);
          --radius: 16px;
        }

        /* Background */
        .app{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:18px;
          overflow:hidden;
        }
        .app--dark{
          color:var(--text-dark);
          background: radial-gradient(1200px 700px at 10% 10%, rgba(0,32,159,.55), transparent 60%),
                      radial-gradient(900px 700px at 90% 20%, rgba(210,16,52,.45), transparent 55%),
                      linear-gradient(135deg, #060b1a, #0b1023);
        }
        .app--light{
          color:var(--text-light);
          background: radial-gradient(1100px 650px at 10% 10%, rgba(0,32,159,.18), transparent 60%),
                      radial-gradient(900px 650px at 90% 20%, rgba(210,16,52,.15), transparent 55%),
                      linear-gradient(135deg, #f4f7ff, #ffffff);
        }

        /* Floating glow blobs */
        .blob{
          position:absolute;
          width:420px;
          height:420px;
          filter: blur(50px);
          opacity:.35;
          border-radius:50%;
          animation: floaty 8s ease-in-out infinite;
          pointer-events:none;
        }
        .blob--blue{ background: var(--haiti-blue); left:-120px; top:-140px; }
        .blob--red{ background: var(--haiti-red); right:-140px; top:-110px; animation-delay: 1.2s; }
        .blob--mix{ background: linear-gradient(135deg,var(--haiti-blue),var(--haiti-red)); left:20%; bottom:-180px; width:520px; height:520px; animation-delay: .6s; }

        @keyframes floaty{
          0%,100%{ transform: translateY(0) translateX(0) scale(1); }
          50%{ transform: translateY(18px) translateX(10px) scale(1.03); }
        }

        /* Card */
        .card{
          width:100%;
          max-width:820px;
          background: var(--card-light);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 18px;
          transform: translateY(6px);
          animation: popIn .45s ease-out forwards;
          position:relative;
          z-index:2;
        }
        .app--dark .card{
          background: rgba(15,23,42,.92);
          border: 1px solid rgba(255,255,255,.08);
        }
        .app--light .card{
          border: 1px solid rgba(0,0,0,.06);
        }
        @keyframes popIn{
          from { opacity:0; transform: translateY(16px) scale(.99); }
          to { opacity:1; transform: translateY(0) scale(1); }
        }

        /* Header */
        .topbar{
          display:flex;
          gap:12px;
          align-items:center;
          justify-content:space-between;
          flex-wrap:wrap;
        }
        .titleRow{
          display:flex;
          gap:10px;
          align-items:center;
        }
        .title{
          font-size: clamp(20px, 2.4vw, 28px);
          margin:0;
          letter-spacing:.2px;
        }
        .subtitle{
          margin:4px 0 0 0;
          font-size: 13px;
          opacity:.85;
        }

        /* Haiti badge */
        .badge{
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 12px;
          border-radius: 14px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.10);
        }
        .app--light .badge{
          background: rgba(0,0,0,.03);
          border: 1px solid rgba(0,0,0,.06);
        }
        .flag{
          width:40px;
          height:26px;
          border-radius:6px;
          overflow:hidden;
          box-shadow: 0 6px 16px rgba(0,0,0,.18);
          border: 1px solid rgba(255,255,255,.18);
        }
        .app--light .flag{ border: 1px solid rgba(0,0,0,.08); }

        /* Toggle */
        .toggle{
          border:none;
          cursor:pointer;
          padding:10px 12px;
          border-radius: 12px;
          font-weight: 800;
          color:#fff;
          background: linear-gradient(135deg, var(--haiti-red), #ff4c6f);
          box-shadow: 0 10px 22px rgba(210,16,52,.28);
          transition: transform .12s ease, opacity .12s ease;
        }
        .toggle:hover{ transform: translateY(-1px); }
        .toggle:active{ transform: translateY(0px) scale(.99); }

        .toggle--light{
          background: linear-gradient(135deg, var(--haiti-blue), #2b6cff);
          box-shadow: 0 10px 22px rgba(0,32,159,.22);
        }

        .divider{
          height:1px;
          border:none;
          margin:14px 0;
          background: rgba(255,255,255,.10);
        }
        .app--light .divider{ background: rgba(0,0,0,.08); }

        /* Translator UI helpers (si ou mete className yo nan Translator.tsx) */
        .voiceBar{
          display:flex;
          flex-wrap:wrap;
          gap:10px;
          margin: 8px 0 12px 0;
        }
        .btn{
          border:none;
          cursor:pointer;
          padding:10px 12px;
          border-radius: 12px;
          font-weight: 700;
          transition: transform .12s ease, opacity .12s ease;
        }
        .btn:hover{ transform: translateY(-1px); }
        .btn:active{ transform: translateY(0px) scale(.99); }
        .btnBlue{ background: rgba(0,32,159,.95); color:#fff; }
        .btnRed{ background: rgba(210,16,52,.95); color:#fff; }
        .btnGhost{
          background: rgba(255,255,255,.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,.12);
        }
        .app--light .btnGhost{
          background: rgba(0,0,0,.04);
          color: #0b1220;
          border: 1px solid rgba(0,0,0,.08);
        }

        .textArea{
          width:100%;
          min-height:140px;
          border-radius: 14px;
          padding: 12px;
          outline:none;
          resize: vertical;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.06);
          color:#fff;
        }
        .app--light .textArea{
          background: rgba(0,0,0,.03);
          border: 1px solid rgba(0,0,0,.10);
          color:#0b1220;
        }

        /* Mobile polish */
        @media (max-width:520px){
          .card{ padding: 14px; }
          .badge{ width:100%; justify-content:space-between; }
        }
      `}</style>

      {/* background blobs */}
      <div className="blob blob--blue" />
      <div className="blob blob--red" />
      <div className="blob blob--mix" />

      <div className="card">
        <div className="topbar">
          <div className="titleRow">
            <div className="badge">
              <div className="flag" aria-label="Haiti Flag">
                <svg viewBox="0 0 120 78" width="100%" height="100%">
                  <rect width="120" height="39" fill="#00209F" />
                  <rect y="39" width="120" height="39" fill="#D21034" />
                  <rect x="42" y="25" width="36" height="28" rx="4" fill="#ffffff" opacity="0.95"/>
                </svg>
              </div>
              <div>
                <h1 className="title">Kreyòl Connect Translator</h1>
                <p className="subtitle">
                  Mode {dark ? "Nuit 🌙" : "Jou ☀️"} • Koulè drapo Ayiti 🇭🇹
                </p>
              </div>
            </div>
          </div>

          <button
            className={dark ? "toggle" : "toggle toggle--light"}
            onClick={() => setDark((v) => !v)}
          >
            {dark ? "☀️ Mode Jou" : "🌙 Mode Nuit"}
          </button>
        </div>

        <hr className="divider" />

        <Translator />
      </div>
    </div>
  );
}
