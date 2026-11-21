import { useState } from 'react';

export default function Ej4() {
  const [celsius, setCelsius] = useState('');

  const valorNumerico = Number(celsius);
  const fahrenheit = valorNumerico * (9 / 5) + 32;

  return (
    <div>
      <input
        type="number"
        placeholder="Grados Celsius"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
      />
      {celsius !== '' && (
        <div style={{ marginTop: '12px' }}>
          <h3 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>
            {fahrenheit.toFixed(1)} °F
          </h3>
          {valorNumerico > 30 && <p style={{ margin: 0 }}>Hace calor</p>}
        </div>
      )}
    </div>
  );
}