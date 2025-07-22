import React, { useState, useEffect } from 'react';

/**
 * Formulario para crear o editar un detalle de compra.
 * Permite seleccionar una compra y un producto, definir cantidad y precio unitario,
 * mostrar el stock actual del producto seleccionado, y enviar los datos al backend autenticado.
 */
function FormularioDetalleCompra_Disabled({
  detalleCompra,
  onDetalleCompraCreadoOEditado,
  onCancelar,
  productos,
  compras,
}) {
  const [compraId, setCompraId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [error, setError] = useState(null);
  const [stockActual, setStockActual] = useState(null);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (detalleCompra) {
      setCompraId(detalleCompra.compra?.id || detalleCompra.compra || '');
      setProductoId(detalleCompra.producto?.id || detalleCompra.producto || '');
      setCantidad(detalleCompra.cantidad !== undefined ? String(detalleCompra.cantidad) : '');
      setPrecioUnitario(detalleCompra.precio_unitario !== undefined ? String(detalleCompra.precio_unitario) : '');
    } else {
      setCompraId('');
      setProductoId('');
      setCantidad('');
      setPrecioUnitario('');
    }
    setError(null);
  }, [detalleCompra]);

  // Mostrar stock actual del producto seleccionado
  useEffect(() => {
    if (productoId) {
      const productoSeleccionado = productos.find(p => p.id === parseInt(productoId));
      setStockActual(productoSeleccionado?.stock ?? null);
    } else {
      setStockActual(null);
    }
  }, [productoId, productos]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones mínimas
    if (!compraId || !productoId || !cantidad || !precioUnitario) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const data = {
      compra: compraId,
      producto: productoId,
      cantidad: Number(cantidad),
      precio_unitario: parseFloat(precioUnitario),
    };

    let url = 'http://localhost:8000/api/detalles-compra/';
    let method = 'POST';

    if (detalleCompra?.id) {
      url += `${detalleCompra.id}/`;
      method = 'PUT';
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Debes iniciar sesión para realizar esta acción.');
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
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Error en la petición');
      }

      const json = await res.json();
      setError(null);
      onDetalleCompraCreadoOEditado(json);
    } catch (err) {
      setError(err.message || 'Error al guardar el detalle de compra');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h4>{detalleCompra ? 'Editar Detalle Compra' : 'Nuevo Detalle Compra'}</h4>

      {/* Selector de compra */}
      <label>
        Compra:
        <select value={compraId} onChange={(e) => setCompraId(e.target.value)} required>
          <option value="">-- Selecciona una compra --</option>
          {compras.map(c => (
            <option key={c.id} value={c.id}>
              {c.proveedor_nombre} - {new Date(c.fecha).toLocaleDateString()}
            </option>
          ))}
        </select>
      </label>

      {/* Selector de producto */}
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

      {/* Mostrar stock actual del producto */}
      {stockActual !== null && (
        <p style={{ marginTop: 5, color: 'gray' }}>
          Stock actual del producto: <strong>{stockActual}</strong>
        </p>
      )}

      {/* Campo de cantidad */}
      <label>
        Cantidad:
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />
      </label>

      {/* Campo de precio unitario */}
      <label>
        Precio unitario (€):
        <input
          type="number"
          step="0.01"
          min="0"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(e.target.value)}
          required
        />
      </label>

      {/* Mostrar errores */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Botones */}
      <button type="submit">{detalleCompra ? 'Actualizar' : 'Crear'}</button>
      {onCancelar && (
        <button type="button" onClick={onCancelar} style={{ marginLeft: '10px' }}>
          Cancelar
        </button>
      )}
    </form>
  );
}

export default () => <div style={{ color: 'gray' }}>FormularioDetalleCompra desactivado</div>;
