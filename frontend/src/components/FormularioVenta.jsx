import React, { useState, useEffect } from 'react';

/**
 * Formulario para crear o editar una venta completa.
 * - Selección de cliente, fecha y lista de productos (con cantidad y precio unitario).
 * - Calcula subtotal por línea y total dinámicamente.
 * - Valida stock antes de enviar.
 * - Envía al backend incluyendo JWT en el header Authorization.
 *
 * Props esperadas:
 * - ventaEditando: objeto de la venta a editar (si es null, se crea nueva)
 * - onVentaGuardada: función que recibe la venta guardada
 * - onCancelarEdicion: función para cancelar edición
 * - clientes: listado de clientes [{ id, nombre }]
 * - productos: listado de productos [{ id, nombre, stock }]
 */
export default function FormularioVenta({
  ventaEditando = null,
  onVentaGuardada,
  onCancelarEdicion,
  clientes = [],
  productos = [],
}) {
  // ————————————————
  // Estados locales
  // ————————————————
  const [clienteId, setClienteId] = useState('');
  const [fecha, setFecha] = useState('');
  const [detalleVenta, setDetalleVenta] = useState([]); // Array de líneas de venta
  const [error, setError] = useState(null);

  // ————————————————————————————
  // Precarga de datos si estamos editando una venta existente
  // ————————————————————————————
  useEffect(() => {
    if (ventaEditando) {
      setClienteId(ventaEditando.cliente?.id || ventaEditando.cliente || '');
      setFecha(ventaEditando.fecha?.slice(0, 10) || '');
      setDetalleVenta(ventaEditando.detalles || []);
    } else {
      setClienteId('');
      setFecha('');
      setDetalleVenta([]);
    }
    setError(null);
  }, [ventaEditando]);

  // ————————————————————————————
  // Funciones para manejar el array de productos
  // ————————————————————————————
  const agregarProducto = () => {
    setDetalleVenta([
      ...detalleVenta,
      { producto: '', cantidad: 1, precio_unitario: 0 },
    ]);
  };

  const eliminarProducto = index => {
    const copia = [...detalleVenta];
    copia.splice(index, 1);
    setDetalleVenta(copia);
  };

  const actualizarDetalle = (index, campo, valor) => {
    const copia = [...detalleVenta];
    copia[index][campo] =
      campo === 'cantidad' || campo === 'precio_unitario'
        ? Number(valor)
        : valor;
    setDetalleVenta(copia);
  };

  // ———————————
  // Cálculos
  // ———————————
  const calcularSubtotal = item => item.cantidad * item.precio_unitario;

  const calcularTotal = () =>
    detalleVenta.reduce((sum, item) => sum + calcularSubtotal(item), 0);

  const stockSuficiente = () => {
    for (const item of detalleVenta) {
      const prod = productos.find(p => p.id === Number(item.producto));
      if (!prod || item.cantidad > prod.stock) {
        return false;
      }
    }
    return true;
  };

  // ————————————————————————————
  // Envío al backend
  // ————————————————————————————
  const handleSubmit = async e => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión para continuar.');
      return;
    }

    // Validaciones básicas
    if (!clienteId || !fecha || detalleVenta.length === 0) {
      setError('Completa todos los campos.');
      return;
    }

    for (const item of detalleVenta) {
      if (!item.producto || item.cantidad <= 0 || item.precio_unitario < 0) {
        setError('Revisa cantidad y precio de cada producto.');
        return;
      }
    }

    if (!stockSuficiente()) {
      setError('Uno o más productos no tienen suficiente stock.');
      return;
    }

    // Payload
    const payload = {
      cliente: clienteId,
      fecha,
      total: calcularTotal(),
      detalles: detalleVenta.map(item => ({
        producto: item.producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      })),
    };

    console.log('🧾 Enviando datos al backend (VENTA):', payload);

    const url = ventaEditando
      ? `http://localhost:8000/api/ventas/${ventaEditando.id}/`
      : 'http://localhost:8000/api/ventas/';
    const method = ventaEditando ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Error al guardar la venta.');
      }

      const data = await res.json();
      setError(null);

      // Limpiar si era nueva venta
      if (!ventaEditando) {
        setClienteId('');
        setFecha('');
        setDetalleVenta([]);
      }

      onVentaGuardada(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Si no hay token, mostramos aviso
  if (!localStorage.getItem('token')) {
    return <p className="text-danger">Debes iniciar sesión para usar este formulario.</p>;
  }

  // ————————————————————————————
  // Render del formulario con Bootstrap
  // ————————————————————————————
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">
          {ventaEditando ? 'Editar Venta' : 'Nueva Venta'}
        </h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Cliente */}
          <div className="mb-3">
            <label className="form-label">Cliente</label>
            <select
              className="form-select"
              value={clienteId}
              onChange={e => setClienteId(e.target.value)}
              required
            >
              <option value="">-- Selecciona un cliente --</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="mb-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              required
            />
          </div>

          {/* Lista de productos */}
          <fieldset className="mb-3">
            <legend className="col-form-label">Productos</legend>
            {detalleVenta.map((item, idx) => (
              <div key={idx} className="d-flex align-items-center mb-2">
                <select
                  className="form-select me-2"
                  style={{ maxWidth: '40%' }}
                  value={item.producto}
                  onChange={e =>
                    actualizarDetalle(idx, 'producto', e.target.value)
                  }
                  required
                >
                  <option value="">-- Producto --</option>
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} (Stock: {p.stock})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  className="form-control me-2"
                  style={{ maxWidth: 80 }}
                  min="1"
                  value={item.cantidad}
                  onChange={e =>
                    actualizarDetalle(idx, 'cantidad', e.target.value)
                  }
                  required
                />

                <input
                  type="number"
                  step="0.01"
                  className="form-control me-2"
                  style={{ maxWidth: 100 }}
                  min="0"
                  value={item.precio_unitario}
                  onChange={e =>
                    actualizarDetalle(idx, 'precio_unitario', e.target.value)
                  }
                  required
                />

                <span className="me-2">
                  €{calcularSubtotal(item).toFixed(2)}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => eliminarProducto(idx)}
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={agregarProducto}
            >
              + Agregar producto
            </button>
          </fieldset>

          {/* Total */}
          <div className="mb-3">
            <strong>Total: €{calcularTotal().toFixed(2)}</strong>
          </div>

          {/* Botones */}
          <div className="d-flex">
            <button type="submit" className="btn btn-success me-2">
              {ventaEditando ? 'Actualizar' : 'Crear'}
            </button>
            {ventaEditando && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancelarEdicion}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
