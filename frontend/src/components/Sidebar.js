import { useState } from "react";

export default function Sidebar() {
  const [query, setQuery] = useState("");

  const [availableUsers] = useState([
    "ellecr",
    "tiriljga",
    "rmknudse",
    "teshinas",
    "nl",
    "jardarfo",
    "emmasbu"
  ]);

  const [existingUsers, setExistingUsers] = useState([]);

  function addUser(user) {
    setExistingUsers((prev) => [...prev, user]);
  }

  // tilgjengelige = alle minus eksisterende
  const selectableUsers = availableUsers.filter(
    (u) => !existingUsers.includes(u)
  );

  // filtrert søk
  const filteredUsers = selectableUsers.filter((u) =>
    u.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside
      style={{
        background: "#E5E2FF",
        color: "white",
        width: "200px",
        height: "200vh",
        padding: "10px",
        fontFamily: "Lora, serif",
      }}
    >
      {/* SØK + TILFØY */}
      <div style={{ marginTop: "50px", padding: "0 10px"}}>
        <div style={{ color: "black", marginBottom: "5px"}}>
          Legg til personer
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #999",
            margin: "10px 0",
          }}
        />

        <input
          type="text"
          placeholder="Søk bruker..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "6px",
            boxSizing: "border-box",
            borderRadius: "5px",
            border: "1px solid #E5E2FF",
            marginBottom: "10px",
            fontSize: "12px",
          }}
        />

        <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
          {filteredUsers.map((user) => (
            <li
                key={user}
                onClick={() => addUser(user)}
                style={{
                    padding: "8px",
                    marginBottom: "6px",
                    color: "black",
                    cursor: "pointer",
                    backgroundColor: "#D9D9D9",
                    borderRadius: "6px",
                    fontSize: "12px",
                }}
                >
              {user}
            </li>
          ))}
        </ul>
      </div>

      {/* EKSISTERENDE BRUKERE */}
      <div style={{ marginTop: "30px", padding: "0 10px" }}>
        <div style={{ color: "black", marginBottom: "5px" }}>
          Eksisterende brukere
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #999",
            margin: "10px 0",
          }}
        />

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {existingUsers.map((user) => (
            <li 
                key={user} 
                style={{
                    padding: "8px",
                    marginBottom: "6px",
                    color: "black",
                    cursor: "pointer",
                    backgroundColor: "#D9D9D9",
                    borderRadius: "6px",
                    fontSize: "12px",
                }}
                >
              {user}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}