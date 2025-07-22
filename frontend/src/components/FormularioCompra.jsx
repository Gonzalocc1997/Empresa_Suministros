// src/components/FormularioCompra.jsx

import React, { useState, useEffect } from 'react';

/**
 * Formulario para crear o editar una compra con productos.
 * - Calcula el total automáticamente.
 * - Envía la petición al backend incluyendo el JWT en el header Authorization.
 * - Permite seleccionar proveedor, fecha y lista de productos (con cantidad y precio unitario).
 *
 * Props:
 * - compra: el objeto a editar (o null para nueva compra)
 * - onCompraCreadaOEditada: callback que recibe la compra creada/actualizada
 * - onCancelar: callback para cancelar la edición
 * - proveedores: lista de proveedores [{ id, nombre, ... }]
 * - productos: lista de productos [{ id, nombre, stock, ... }]
 */
function FormularioCompra({
  compra = null,
  onCompraCreadaOEditada,
  onCancelar,
  proveedores = [],
  productos = [],
}) {
  // Estados de los campos del formulario
  const [proveedorId, setProveedorId] = useState('');
  const [fecha, setFecha] = useState('');
  const [detalleCompra, setDetalleCompra] = useState([]); // [{ producto, cantidad, precio_unitario }]
  const [error, setError] = useState(null);

  // Al cargar o cambiar `compra`, precargamos los campos
  useEffect(() => {
    if (compra) {
      setProveedorId(compra.proveedor?.id || compra.proveedor || '');
      setFecha(compra.fecha?.slice(0, 10) || '');
      // asumimos que la API devuelve `detalles`, y renombramos a `detalle`
      setDetalleCompra(compra.detalles || []);
    } else {
      setProveedorId('');
      setFecha('');
      setDetalleCompra([]);
    }
    setError(null);
  }, [compra]);

  // Añade una fila vacía al detalle
  const agregarProducto = () => {
    setDetalleCompra([
      ...detalleCompra,
      { producto: '', cantidad: 1, precio_unitario: 0 },
    ]);
  };

  // Elimina una fila de detalle por índice
  const eliminarProducto = index => {
    const arr = [...detalleCompra];
    arr.splice(index, 1);
    setDetalleCompra(arr);
  };

  // Actualiza campo de detalle en la posición `index`
  const actualizarDetalle = (index, campo, valor) => {
    const arr = [...detalleCompra];
    arr[index][campo] =
      campo === 'cantidad' || campo === 'precio_unitario'
        ? Number(valor)
        : valor;
    setDetalleCompra(arr);
  };

  // Subtotal de una fila
  const calcularSubtotal = item => item.cantidad * item.precio_unitario;

  // Total de la compra
  const calcularTotal = () =>
    detalleCompra.reduce((sum, item) => sum + calcularSubtotal(item), 0);

  // Envía la petición al backend
  const handleSubmit = async e => {
    e.preventDefault();

    // 1) Leemos el JWT guardado en localStorage por App.js
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión para continuar.');
      return;
    }

    // 2) Validaciones previas
    if (!proveedorId || !fecha || detalleCompra.length === 0) {
      setError('Completa todos los campos obligatorios.');
      return;
    }
    for (const item of detalleCompra) {
      if (!item.producto || item.cantidad <= 0 || item.precio_unitario < 0) {
        setError('Revisa cantidad y precio de cada producto.');
        return;
      }
    }

    // 3) Construimos el payload que acepta el serializer:
    //    { proveedor, fecha, total, detalles: [ { producto, cantidad, precio_unitario } ] }
    const payload = {
      proveedor: proveedorId,
      fecha,
      total: calcularTotal(),
      detalles: detalleCompra.map(item => ({
        producto: item.producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      })),
    };

    console.log('📦 Enviando al backend:', payload);

    // 4) Definimos URL y método según creación o edición
    const url = compra
      ? `http://localhost:8000/api/compras/${compra.id}/`
      : 'http://localhost:8000/api/compras/';
    const method = compra ? 'PUT' : 'POST';

    try {
      // 5) Fetch con header Authorization
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // extraemos detalle de error si existe
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Error guardando la compra.');
      }

      const data = await res.json();
      setError(null);
      // 6) Limpiamos campos si es nueva
      if (!compra) {
        setProveedorId('');
        setFecha('');
        setDetalleCompra([]);
      }
      // 7) Notificamos al padre
      onCompraCreadaOEditada(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Si no hay JWT, pedimos login
  if (!localStorage.getItem('token')) {
    return <p className="text-danger">Debes iniciar sesión para usar este formulario.</p>;
  }

  // Render del formulario
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">
          {compra ? 'Editar Compra' : 'Nueva Compra'}
        </h5>

        {/* Mensaje de error */}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Selección de proveedor */}
          <div className="mb-3">
            <label className="form-label">Proveedor</label>
            <select
              className="form-select"
              value={proveedorId}
              onChange={e => setProveedorId(e.target.value)}
              required
            >
              <option value="">-- Selecciona uno --</option>
              {proveedores.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
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

          {/* Detalle de productos */}
          <fieldset className="mb-3">
            <legend className="col-form-label">Productos</legend>
            {detalleCompra.map((item, idx) => (
              <div
                key={idx}
                className="d-flex align-items-center mb-2"
              >
                {/* Selector de producto */}
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

                {/* Cantidad */}
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

                {/* Precio unitario */}
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

                {/* Subtotal */}
                <span className="me-2">
                  €{calcularSubtotal(item).toFixed(2)}
                </span>

                {/* Botón eliminar fila */}
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => eliminarProducto(idx)}
                >
                  ×
                </button>
              </div>
            ))}

            {/* Botón agregar fila */}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={agregarProducto}
            >
              + Agregar producto
            </button>
          </fieldset>

          {/* Total general */}
          <div className="mb-3">
            <strong>Total: €{calcularTotal().toFixed(2)}</strong>
          </div>

          {/* Botones de acción */}
          <div className="d-flex">
            <button type="submit" className="btn btn-success me-2">
              {compra ? 'Actualizar' : 'Crear'}
            </button>
            {compra && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancelar}
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

export default FormularioCompra;
