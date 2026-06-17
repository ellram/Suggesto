import Header from "./Header";
import Sidebar from "./Sidebar";
import Navigation from "./Navigation";

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <div style={{ display: "flex"}}>
        <Sidebar style={{ width: "150px" }} />
        <main style={{ flex: 1, padding: "50px" }}>
          <div style={{ maxWidth: "1200px" }}>
            <Navigation />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}