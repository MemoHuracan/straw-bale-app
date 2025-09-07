"use client";
import { useState } from "react";

export default function MapCard() {
    const [showPopup, setShowPopup] = useState(true);

    return (
        <div className="map-card">
            <div className="map-controls left">
                <button title="Layers">🗺️</button>
                <button title="Zoom in">＋</button>
                <button title="Zoom out">－</button>
                <button title="Center">🎯</button>
                <button title="Measure">🔍</button>
            </div>

            <div className="map-controls right">
                <button title="Fullscreen">⤢</button>
            </div>

            <div className="map-surface" role="img" aria-label="Map preview" />

            {showPopup && (
                <article className="map-popup">
                    <header>
                        <h3>East Bay</h3>
                        <button aria-label="Close" onClick={() => setShowPopup(false)}>×</button>
                    </header>
                    <div className="popup-body">
                        <div className="row">
                            <button className="primary small">View assets in this location ▾</button>
                        </div>
                        <dl className="meta">
                            <div><dt>Asset type:</dt><dd>Land</dd></div>
                            <div><dt>Land type:</dt><dd>Field</dd></div>
                        </dl>
                    </div>
                </article>
            )}
        </div>
    );
}
