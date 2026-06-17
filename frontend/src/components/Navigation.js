import { useState } from "react";

export default function Navigation() {
  const [active, setActive] = useState("oversikt");

  const buttonStyle = (isActive) => ({
    background: isActive ? "#E5E2FF" : "transparent",
    color: "#000000",
    border: "none",
    borderRadius: "8px",
    fontSize: "30px",
    fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
    cursor: "pointer",
    padding: "0px 12px",
    transition: "all 0.2s ease",
  });

  return (
    <header
      style={{
        padding: "10px",
        height: "55px",
        display: "flex",
        alignItems: "center",
        gap: "30px",
        borderBottom: "1px solid #000000",
      }}
    >
      <button
        onClick={() => setActive("oversikt")}
        style={buttonStyle(active === "oversikt")}
      >
        Oversikt
      </button>

      <button
        onClick={() => setActive("kategorier")}
        style={buttonStyle(active === "kategorier")}
      >
        Kategorier
      </button>
    </header>
  );
}