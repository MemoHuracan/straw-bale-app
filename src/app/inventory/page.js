"use client";
import { useMemo, useState } from "react";
import { useInventory } from "@/context/InventoryContext";

export default function InventoryPage() {
    const { inventory, addInventoryItem, getStrawQty } = useInventory();

    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ item: "", qty: "", location: "" });
    const [errors, setErrors] = useState({});

    const filtered = useMemo(() => {
        const needle = q.toLowerCase();
        return inventory.filter(r => `${r.item} ${r.location ?? ""}`.toLowerCase().includes(needle));
    }, [q, inventory]);

    const resetForm = () => {
        setForm({ item: "", qty: "", location: "" });
        setErrors({});
    };

    const validate = () => {
        const e = {};
        if (!form.item.trim()) e.item = "Required";
        if (form.qty === "" || isNaN(Number(form.qty)) || Number(form.qty) < 0) e.qty = "Invalid";
        if (!form.location.trim()) e.location = "Required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        addInventoryItem({
            item: form.item,
            qty: Number(form.qty),
            location: form.location,
        });
        setOpen(false);
        resetForm();
    };

    return (
        <section id="inventory-view">
            <h1 className="page-title">Inventory</h1>

            <div className="inv-toolbar">
                <input
                    className="inv-search"
                    placeholder="Search item or location…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <button className="inv-btn" onClick={() => setOpen(true)}>
                    + Add Item
                </button>
            </div>

            <p style={{ margin: "6px 0 12px" }}>
                <strong>Straw Bale disponible:</strong> {getStrawQty()}
            </p>

            <div className="inv-table-wrap">
                <table className="inv-table">
                    <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Location</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(row => (
                        <tr key={row.id}>
                            <td>{row.item}</td>
                            <td>{row.qty}</td>
                            <td>{row.location}</td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={3} className="inv-empty">No results</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal Add Item */}
            {open && (
                <div className="modal-backdrop" onClick={() => setOpen(false)}>
                    <div
                        className="modal"
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>Add Item</h2>
                            <button className="modal-close" aria-label="Close" onClick={() => setOpen(false)}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="form-grid">
                            <label>
                                <span>Item</span>
                                <input
                                    type="text"
                                    value={form.item}
                                    onChange={(e) => setForm({ ...form, item: e.target.value })}
                                    autoFocus
                                />
                                {errors.item && <small className="err">{errors.item}</small>}
                            </label>

                            <label>
                                <span>Quantity</span>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min="0"
                                    value={form.qty}
                                    onChange={(e) => setForm({ ...form, qty: e.target.value })}
                                />
                                {errors.qty && <small className="err">{errors.qty}</small>}
                            </label>

                            <label>
                                <span>Location</span>
                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                />
                                {errors.location && <small className="err">{errors.location}</small>}
                            </label>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => { setOpen(false); resetForm(); }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
