import suggestoLogo from "../images/suggesto.png";
export default function Header() {
  return (
    <header style={{ background: "#CCC5FF", color: "white", padding: "10px" }}>
        <img src={suggestoLogo} alt="Suggesto Logo" style={{ height: "60px" }} />
    </header>
  );
}