import { useState } from 'react';

interface ItemCompra {
  id: number;
  texto: string;
}

export default function Ej5() {
  const [texto, setTexto] = useState('');
  const [items, setItems] = useState<ItemCompra[]>([]);

  const agregarItem = () => {
    const limpio = texto.trim();
    if (!limpio) return;

    const nuevo: ItemCompra = { id: Date.now(), texto: limpio };
    setItems([...items, nuevo]);
    setTexto('');
  };

  const eliminarItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Ej: yerba"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && agregarItem()}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
        <button onClick={agregarItem}>Agregar</button>
      </div>

      {items.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No hay nada para comprar</p>
      ) : (
        <ul style={{ paddingLeft: '20px' }}>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: '8px' }}>
              <span style={{ marginRight: '12px' }}>{item.texto}</span>
              <button onClick={() => eliminarItem(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}