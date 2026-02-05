import React from "react";

type HeaderProps = {
  activeTab: "translator" | "haiti";
  onChangeTab: (tab: "translator" | "haiti") => void;
};

export default function Header({ activeTab, onChangeTab }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold leading-tight">
            Kreyòl Connect – Translator
          </h1>
          <p className="text-sm text-slate-600">
            Tradiksyon + vwa (Kreyòl ↔ Anglè) + enfòmasyon sou Ayiti
          </p>
        </div>

        <nav className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeTab("translator")}
            className={
              "px-3 py-2 rounded-lg border text-sm font-medium " +
              (activeTab === "translator"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50")
            }
          >
            Translator
          </button>

          <button
            type="button"
            onClick={() => onChangeTab("haiti")}
            className={
              "px-3 py-2 rounded-lg border text-sm font-medium " +
              (activeTab === "haiti"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50")
            }
          >
            Ayiti
          </button>
        </nav>
      </div>
    </header>
  );
}
