import React, { createContext, useContext, useState } from "react";
import { en } from "./en";
import { hi } from "./hi";
import { kn } from "./kn";

const translations = { en, hi, kn };

const LocaleContext = createContext();

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState("en");

  const t = (key) => {
    return translations[lang]?.[key] || translations.en?.[key] || key;
  };

  return (
    <LocaleContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
