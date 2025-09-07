import Link from "next/link";

export default function PensHome() {
    const alleys = [100,200,300,400,500,600,700,800,900,1000,1600,1700,1800,1900,2000];

    return (
        <section>
            <h1 className="page-title">Pens</h1>
            <div className="alley-grid">
                {alleys.map(a => (
                    <Link key={a} href={`/pens/${a}`} className="alley-card">
                        Alley {a}
                    </Link>
                ))}
            </div>
        </section>
    );
}
