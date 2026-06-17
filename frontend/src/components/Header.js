import suggestoLogo from "../images/suggesto.png";
export default function Header() {
  return (
    <header style={{ background: "#CCC5FF", color: "white", padding: "10px" }}>
        <img src={suggestoLogo} alt="Suggesto Logo" style={{ height: "80px" }} />
        <button
          style={{
            position: "absolute",
            right: "20px",
            top: "30px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#9f92ff",
            borderRadius: "8px",
            cursor: "pointer", 
            border: "none",
            color: "#000000",
            fontFamily: "Lora, serif",
          }}
        >
          Logg inn
        </button>
    </header>
  );
}