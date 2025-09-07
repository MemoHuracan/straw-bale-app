import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import { InventoryProvider } from "@/context/InventoryContext";

export const metadata = {
    title: "Straw Bale App",
    description: "Dashboard",
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
        <body>
        <InventoryProvider>
            <div className="layout">
                <aside className="sidebar">
                    <Sidebar />
                </aside>

                <div className="main-area">
                    <header className="topbar">
                        <Topbar />
                    </header>

                    <main className="content">{children}</main>

                    <footer className="footer">
                        <Footer />
                    </footer>
                </div>
            </div>
        </InventoryProvider>
        </body>
        </html>
    );
}
