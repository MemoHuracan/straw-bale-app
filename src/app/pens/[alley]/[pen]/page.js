import Link from "next/link";

export default function PenPage({ params }) {
    const { alley, pen } = params;

    return (
        <section>
            <h1>Corral {pen} del Pasillo {alley}</h1>
            <p>Here goes the pen info.</p>
            <Link href={`/pens/${alley}`}>← Back to the alley {alley}</Link>
        </section>
    );
}
