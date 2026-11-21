import Ej1 from './Ej1';
import Ej2 from './Ej2';
import Ej3 from './Ej3';
import Ej4 from './Ej4';
import Ej5 from './Ej5';
import Ej6 from './Ej6';
import Ej7 from './Ej7';

const EJERCICIOS = [
  { id: 'ej1', num: '01', tag: 'Props', titulo: 'Tarjetas de producto', span: 'span-2', componente: <Ej1 /> },
  { id: 'ej2', num: '02', tag: 'useState', titulo: 'Contador con límites', span: 'span-1', componente: <Ej2 /> },
  { id: 'ej3', num: '03', tag: 'Condicionales', titulo: 'Mostrar y ocultar', span: 'span-1', componente: <Ej3 /> },
  { id: 'ej4', num: '04', tag: 'Inputs controlados', titulo: 'Conversor de temperatura', span: 'span-1', componente: <Ej4 /> },
  { id: 'ej5', num: '05', tag: 'Listas y estado', titulo: 'Lista de compras', span: 'span-1', componente: <Ej5 /> },
  { id: 'ej6', num: '06', tag: 'Filtrado', titulo: 'Buscador de lenguajes', span: 'span-1', componente: <Ej6 /> },
  { id: 'ej7', num: '07', tag: 'TypeScript', titulo: 'Tipar con TypeScript', span: 'span-2', componente: <Ej7 /> },
];

export default function App() {
  return (
    <div className="app-shell">
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />
      <div className="grid-overlay" />

      <main className="dashboard">
        <header className="hero">
          <div className="status-pill">
            <span className="pulse-dot" />
            REACT + TYPESCRIPT // SHOWCASE INTERACTIVO
          </div>
          <h1>React desde cero</h1>
          <p className="hero-sub">
            Colección interactiva de componentes, estado, renderizado condicional, filtrado y tipado estricto.
          </p>

          <nav className="quick-nav" aria-label="Navegación de ejercicios">
            {EJERCICIOS.map((ej) => (
              <a key={ej.id} href={`#${ej.id}`} className="nav-chip">
                <span>{ej.num}</span> {ej.tag}
              </a>
            ))}
          </nav>
        </header>

        <div className="bento-grid">
          {EJERCICIOS.map((ej) => (
            <section key={ej.id} id={ej.id} className={`bento-card ${ej.span} card-${ej.id}`}>
              <div className="card-header">
                <div className="card-meta">
                  <span className="card-index">{ej.num}</span>
                  <span className="card-badge">{ej.tag}</span>
                </div>
                <h2>Ejercicio {Number(ej.num)}: {ej.titulo}</h2>
              </div>
              <div className="card-body">
                {ej.componente}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}