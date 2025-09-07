"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const linkClass = (path) =>
        `nav-link ${pathname === path ? "active" : ""}`;

    return (
        <aside className="sidebar">
            <h2>Straw Bale</h2>
            <nav>
                <ul>
                    <li>
                        <Link href="/" className={linkClass("/")}>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/pens" className={linkClass("/pens")}>
                            Pens
                        </Link>
                    </li>
                    <li>
                        <Link href="/inventory" className={linkClass("/inventory")}>
                            Inventory
                        </Link>
                    </li>
                    <li>
                        <Link href="/reports" className={linkClass("/reports")}>
                            Reports
                        </Link>
                    </li>
                    <li>
                        <Link href="/settings" className={linkClass("/settings")}>
                            Settings
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
