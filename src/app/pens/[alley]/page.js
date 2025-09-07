"use client";

import Link from "next/link";
import { useInventory } from "@/context/InventoryContext";

export default function AlleyPage({ params }) {
    const alley = Number(params.alley); // ej: 100
    const penStart = alley + 1; // 101
    const penEnd = alley + 18;  // 118
    const penNumbers = Array.from({ length: penEnd - penStart + 1 }, (_, i) => penStart + i);

    const { getBales, getStrawQty, assignBales, resetPen } = useInventory();

    const strawLeft = getStrawQty();

    function resetAlley() {
        // Devuelve todas las pacas de cada corral del pasillo al inventario
        penNumbers.forEach((pn) => resetPen(pn));
    }

    return (
        <section>
            <h1 className="page-title">Alley {alley}</h1>

            {/* Resumen de inventario + acciones del pasillo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 16px" }}>
                <strong>Straw Bale en inventario: {strawLeft}</strong>
                <button onClick={resetAlley} className="alley-reset-btn">Reset Alley</button>
            </div>

            <div className="pens-grid">
                {penNumbers.map((pn) => (
                    <div key={pn} className="pen-card">
                        <div className="pen-card-header">
                            <strong>Pen {pn}</strong>
                            <span>{getBales(pn)} bales</span>
                        </div>

                        <div className="pen-actions">
                            <button onClick={() => assignBales(pn, 1)}>+1</button>
                            <button onClick={() => assignBales(pn, 5)}>+5</button>
                            <button onClick={() => assignBales(pn, 10)}>+10</button>

                            <button
                                className="minus"
                                onClick={() => assignBales(pn, -1)}
                                disabled={getBales(pn) <= 0}
                            >
                                -1
                            </button>
                            <button
                                className="minus"
                                onClick={() => assignBales(pn, -5)}
                                disabled={getBales(pn) <= 0}
                            >
                                -5
                            </button>
                            <button
                                className="minus"
                                onClick={() => assignBales(pn, -10)}
                                disabled={getBales(pn) <= 0}
                            >
                                -10
                            </button>
                        </div>

                        {/* Reset por corral */}
                        <div className="pen-actions" style={{ marginTop: 6 }}>
                            <button className="pen-reset-btn" onClick={() => resetPen(pn)}>
                                Reset pen
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <p style={{ marginTop: "1rem" }}>
                ← <Link href="/pens">Back to alleys</Link>
            </p>
        </section>
    );
}
