import React, { useState, useEffect } from 'react';

/**
 * Formulario para crear o editar un detalle de venta.
 * Incluye selección de venta, producto, cantidad y precio unitario.
 * También muestra el stock actual del producto seleccionado.
 */
function FormularioDetalleVenta_Disabled({
  detalleVenta,
  onDetalleVentaCreadoOEditado,
  onCancelar,
  productos,
  ventas,
}) {
  const [ventaId, setVentaId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [error, setError] = useState(null);
  const [stockProductoSeleccionado, setStockProductoSeleccionado] = useState(null);

  useEffect(() => {
    if (detalleVenta) {
      setVentaId(detalleVenta.venta?.id || detalleVenta.venta || '');
      setProductoId(detalleVenta.producto?.id || detalleVenta.producto || '');
      setCantidad(detalleVenta.cantidad ? String(detalleVenta.cantidad) : '');
      setPrecioUnitario(detalleVenta.precio_unitario ? String(detalleVenta.precio_unitario) : '');
    } else {
      setVentaId('');
      setProductoId('');
      setCantidad('');
      setPrecioUnitario('');
    }
    setError(null);
  }, [detalleVenta]);

  useEffect(() => {
    if (productoId) {
      const p = productos.find(p => p.id === parseInt(productoId));
      setStockProductoSeleccionado(p?.stock ?? null);
    } else {
      setStockProductoSeleccionado(null);
    }
  }, [productoId, productos]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ventaId || !productoId || !cantidad || !precioUnitario) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const data = {
      venta: ventaId,
      producto: productoId,
      cantidad: Number(cantidad),
      precio_unitario: parseFloat(precioUnitario),
    };

    let url = 'http://localhost:8000/api/detalles-venta/';
    let method = 'POST';

    if (detalleVenta?.id) {
      url += `${detalleVenta.id}/`;
      method = 'PUT';
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Debes iniciar sesión.');
      return;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Error en la petición');
      }

      const json = await res.json();
      setError(null);
      onDetalleVentaCreadoOEditado(json);
    } catch (err) {
      setError(err.message || 'Error al guardar el detalle de venta.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>{detalleVenta ? 'Editar Detalle Venta' : 'Nuevo Detalle Venta'}</h4>

      <label>
        Venta:
        <select value={ventaId} onChange={(e) => setVentaId(e.target.value)} required>
          <option value="">-- Selecciona una venta --</option>
          {ventas.map(v => (
            <option key={v.id} value={v.id}>
              {v.cliente_nombre} - {new Date(v.fecha).toLocaleDateString()}
            </option>
          ))}
        </select>
      </label>

      <label>
        Producto:
        <select value={productoId} onChange={(e) => setProductoId(e.target.value)} required>
          <option value="">-- Selecciona un producto --</option>
          {productos.map(p => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </label>

      {stockProductoSeleccionado !== null && (
        <p>Stock actual del producto: <strong>{stockProductoSeleccionado}</strong></p>
      )}

      <label>
        Cantidad:
        <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
      </label>

      <label>
        Precio unitario (€):
        <input type="number" step="0.01" min="0" value={precioUnitario} onChange={(e) => setPrecioUnitario(e.target.value)} required />
      </label>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">{detalleVenta ? 'Actualizar' : 'Crear'}</button>
      {onCancelar && <button type="button" onClick={onCancelar}>Cancelar</button>}
    </form>
  );
}

export default () => <div style={{ color: 'gray' }}>FormularioDetalleVenta desactivado</div>;
