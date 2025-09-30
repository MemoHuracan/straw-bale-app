"use client";
import { createContext, useContext, useState } from "react";

const InventoryContext = createContext();

function todayStr() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export function InventoryProvider({ children }) {
    const [inventory, setInventory] = useState([
        { id: 1, item: "Straw Bale", qty: 200, location: "Main", updated: todayStr() },

    ]);

    // bales por número de corral
    const [penBales, setPenBales] = useState({});

    /** Cantidad de pacas en un corral */
    const getBales = (penNumber) => penBales[penNumber] ?? 0;

    /** Cantidad de Straw Bale disponible en inventario (suma todas las filas) */
    const getStrawQty = () => {
        const N = (s) => String(s).trim().toLowerCase();
        return inventory
            .filter((i) => N(i.item) === "straw bale")
            .reduce((acc, i) => acc + Number(i.qty || 0), 0);
    };

    /** Obtener ambas cosas juntas (para pintar en la tarjeta) */
    const getPenInfo = (penNumber) => ({
        inPen: getBales(penNumber),
        strawLeft: getStrawQty(),
    });

    /**
     * Asigna (o quita) pacas a un corral.
     * delta > 0  -> agrega al corral y descuenta del inventario
     * delta < 0  -> quita del corral (sin bajar de 0) y regresa al inventario
     */
    function assignBales(penNumber, delta) {
        delta = Number(delta);
        if (!Number.isFinite(delta) || delta === 0) return;

        const strawIdx = inventory.findIndex(
            (i) => String(i.item).trim().toLowerCase() === "straw bale"
        );
        const strawQty = getStrawQty(); // usa el total real (suma todas las filas)

        const currentPen = getBales(penNumber);

        if (delta > 0) {
            // Agregar al corral (hasta donde alcance el inventario)
            const add = Math.min(delta, strawQty);
            if (add <= 0) {
                alert("No hay suficiente Straw Bale en inventario.");
                return;
            }

            setInventory((prev) =>
                prev.map((i, idx) =>
                    idx === strawIdx
                        ? { ...i, qty: i.qty - add, updated: todayStr() } // 🔹 marca actualizado
                        : i
                )
            );

            setPenBales((prev) => ({
                ...prev,
                [penNumber]: (prev[penNumber] ?? 0) + add,
            }));

            if (add < delta) {
                alert(`Solo se pudieron asignar ${add} pacas por falta de inventario.`);
            }
        } else {
            // Quitar del corral (sin bajar de 0) y devolver a inventario
            const wanted = Math.abs(delta);
            const remove = Math.min(wanted, currentPen);
            if (remove <= 0) return;

            setPenBales((prev) => ({
                ...prev,
                [penNumber]: (prev[penNumber] ?? 0) - remove,
            }));

            setInventory((prev) =>
                prev.map((i, idx) =>
                    idx === strawIdx
                        ? { ...i, qty: i.qty + remove, updated: todayStr() } // 🔹 marca actualizado
                        : i
                )
            );
        }
    }

    // Resetear un corral (devuelve todo al inventario)
    function resetPen(penNumber) {
        const amount = getBales(penNumber);
        if (amount <= 0) return;

        const strawIdx = inventory.findIndex((i) => String(i.item).trim().toLowerCase() === "straw bale");

        setPenBales((prev) => ({ ...prev, [penNumber]: 0 }));
        setInventory((prev) =>
            prev.map((i, idx) =>
                idx === strawIdx ? { ...i, qty: i.qty + amount, updated: todayStr() } : i
            )
        );
    }

    // 🔹 Nuevo: agregar ítems al inventario desde /inventory
    // 🔹 Nuevo: agregar ítems al inventario desde /inventory
    function addInventoryItem({ item, qty, location }) {
        const N = (s) => String(s).trim().toLowerCase();
        const canonicalItem = String(item).trim();
        const amount = Number(qty) || 0;
        const loc = String(location ?? "").trim();

        setInventory((prev) => {
            // Si es "Straw Bale", intenta sumar a una fila existente (case-insensitive)
            if (N(canonicalItem) === "straw bale") {
                const idx = prev.findIndex((x) => N(x.item) === "straw bale");
                if (idx >= 0) {
                    // suma a la fila existente
                    const next = [...prev];
                    next[idx] = {
                        ...next[idx],
                        qty: Number(next[idx].qty || 0) + amount,
                        // si quieres, puedes actualizar location; si no, deja la original:
                        location: next[idx].location || loc,
                        updated: todayStr(),
                    };
                    return next;
                }
                // si no existe, crea la fila canónica
                const nextId = prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1;
                return [
                    {
                        id: nextId,
                        item: "Straw Bale",     // ← nombre canónico
                        qty: amount,
                        location: loc,
                        updated: todayStr(),
                    },
                    ...prev,
                ];
            }

            // Para otros ítems, deja tu comportamiento actual (crea fila nueva)
            const nextId = prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1;
            return [
                {
                    id: nextId,
                    item: canonicalItem,
                    qty: amount,
                    location: loc,
                    updated: todayStr(),
                },
                ...prev,
            ];
        });
    }


    return (
        <InventoryContext.Provider
            value={{
                inventory,
                penBales,
                getBales,
                getStrawQty,
                getPenInfo,
                assignBales,
                resetPen,
                addInventoryItem, // 🔹 exportado
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
}

export const useInventory = () => useContext(InventoryContext);
