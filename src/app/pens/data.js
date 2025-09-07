// Cambia estos valores según tu feedlot
export const ALLEYS = {
    "100": 10,
    "200": 9,
    "300": 8,
    "400": 10,
    "500": 8,
    "600": 8,
    "700": 8,
    "800": 8,
    "900": 8,
    "1000": 8,
    "1600": 8,
    "1700": 8,
    "1800": 8,
    "1900": 8,
    "2000": 8,
};

export function getPensForAlley(alleyId) {
    const count = ALLEYS[alleyId];
    if (!count) return [];
    return Array.from({ length: count }, (_, i) => i + 1); // [1..count]
}
