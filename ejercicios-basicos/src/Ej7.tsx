interface ProductoProps {
  nombre: string;
  precio: number;
  stock: number;
  oferta?: boolean;
}

function Producto({ nombre, precio, stock, oferta }: ProductoProps) {
  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '16px', width: '180px' }}>
      <h3 style={{ margin: '0 0 8px 0' }}>{nombre}</h3>
      {oferta && (
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>¡Oferta!</p>
      )}
      <p style={{ margin: '0 0 12px 0' }}>${precio}</p>
      <p style={{ margin: 0, color: stock === 0 ? '#6b7280' : 'inherit' }}>
        {stock === 0 ? 'Sin stock' : `Stock: ${stock}`}
      </p>
    </div>
  );
}

export default function Ej7() {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Producto nombre="Teclado" precio={45000} stock={12} oferta={true} />
      <Producto nombre="Mouse" precio={18000} stock={0} />
    </div>
  );
}