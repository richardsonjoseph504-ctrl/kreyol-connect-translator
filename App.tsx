import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Translator from "./components/Translator";
import History from "./components/History";
import Footer from "./components/Footer";
import Haiti from "./Haiti";
import { TranslationRecord } from "./types";

type TabKey = "translator" | "haiti";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("translator");
  const [history, setHistory] = useState<TranslationRecord[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("translation_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        // ignore bad JSON
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("translation_history", JSON.stringify(history));
  }, [history]);

  const handleNewTranslation = (record: TranslationRecord) => {
    setHistory((prev) => [record, ...prev]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      {/* HEADER AVEK ACTIVE TAB */}
      <Header activeTab={activeTab} onChangeTab={setActiveTab} />

      <main style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
        {/* TRANSLATOR TAB */}
        {activeTab === "translator" && (
          <>
            <Translator onNewTranslation={handleNewTranslation} />
            <div style={{ height: 16 }} />
            <History history={history} />
          </>
        )}

        {/* HAITI TAB */}
        {activeTab === "haiti" && <Haiti />}
      </main>

      <Footer />
    </div>
  );
};

export default App;
