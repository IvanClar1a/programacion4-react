import { useState } from 'react';

export default function Ej2() {
  const [valor, setValor] = useState(0);

  const restar = () => {
    if (valor > 0) setValor(valor - 1);
  };

  const sumar = () => {
    if (valor < 10) setValor(valor + 1);
  };

  return (
    <div>
      <h3 style={{ fontSize: '2rem', margin: '0 0 12px 0' }}>{valor}</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <button onClick={restar} disabled={valor === 0}>-</button>
        <button onClick={sumar} disabled={valor === 10}>+</button>
        <button onClick={() => setValor(0)}>Reiniciar</button>
      </div>
      {valor === 10 && <p style={{ margin: 0, color: '#6b7280' }}>Llegaste al máximo</p>}
      {valor === 0 && <p style={{ margin: 0, color: '#6b7280' }}>Llegaste al mínimo</p>}
    </div>
  );
}