import { useState } from 'react';

const LENGUAJES = [
  'JavaScript',
  'TypeScript',
  'Java',
  'Python',
  'C#',
  'Go',
  'Rust',
  'PHP',
];

export default function Ej6() {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = LENGUAJES.filter((l) =>
    l.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar lenguaje..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '12px' }}
      />
      <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>
        {filtrados.length} {filtrados.length === 1 ? 'resultado' : 'resultados'}
      </p>
      <ul style={{ paddingLeft: '20px', margin: 0 }}>
        {filtrados.map((lenguaje) => (
          <li key={lenguaje}>{lenguaje}</li>
        ))}
      </ul>
    </div>
  );
}