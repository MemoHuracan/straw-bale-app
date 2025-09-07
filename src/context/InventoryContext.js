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

    /** Cantidad de Straw Bale disponible en inventario */
    const getStrawQty = () => {
        const straw = inventory.find((i) => i.item === "Straw Bale");
        return straw ? straw.qty : 0;
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

        const strawIdx = inventory.findIndex((i) => i.item === "Straw Bale");
        const strawQty = strawIdx >= 0 ? inventory[strawIdx].qty : 0;
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

        const strawIdx = inventory.findIndex((i) => i.item === "Straw Bale");

        setPenBales((prev) => ({ ...prev, [penNumber]: 0 }));
        setInventory((prev) =>
            prev.map((i, idx) =>
                idx === strawIdx ? { ...i, qty: i.qty + amount, updated: todayStr() } : i
            )
        );
    }

    // 🔹 Nuevo: agregar ítems al inventario desde /inventory
    function addInventoryItem({ item, qty, location }) {
        setInventory((prev) => {
            const nextId = prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1;
            return [
                {
                    id: nextId,
                    item: String(item).trim(),
                    qty: Number(qty) || 0,
                    location: String(location ?? "").trim(),
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
