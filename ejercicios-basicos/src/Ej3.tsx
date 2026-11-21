import { useState } from 'react';

export default function Ej3() {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '16px', maxWidth: '420px' }}>
      <h3 style={{ margin: '0 0 12px 0' }}>¿Qué es JSX?</h3>
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'Ocultar respuesta' : 'Mostrar respuesta'}
      </button>
      {visible && (
        <p style={{ marginTop: '12px', marginBottom: 0 }}>
          Una sintaxis que permite escribir estructura parecida a HTML dentro de JavaScript. Se transforma en llamadas a funciones de React.
        </p>
      )}
    </div>
  );
}