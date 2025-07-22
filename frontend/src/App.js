// src/App.js
import React, { useState, useEffect } from 'react';
import FormularioOnLogin from './components/FormularioLogin';
import FormularioProducto from './components/FormularioProducto';
import FormularioCliente from './components/FormularioCliente';
import FormularioProveedor from './components/FormularioProveedor';
import FormularioVenta from './components/FormularioVenta';
import FormularioCompra from './components/FormularioCompra';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  // --- Autenticación ---
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  useEffect(() => {
  if (!token) return;

  // Validamos el token con un ping al backend
  fetch('http://localhost:8000/api/productos/', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error();
    })
    .catch(() => {
      // Si falla, eliminamos token y forzamos login
      setToken(null);
      localStorage.removeItem('token');
    });
}, []);


  // --- Navegación de secciones ---
  const [seccion, setSeccion] = useState('Productos');

  // --- Estados de datos ---
  const [productos, setProductos] = useState([]);
  const [errorProductos, setErrorProductos] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [compras, setCompras] = useState([]);

  // --- Entidades en edición ---
  const [productoEditando, setProductoEditando] = useState(null);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [ventaEditando, setVentaEditando] = useState(null);
  const [compraEditando, setCompraEditando] = useState(null);

  // --- Función genérica para fetch con token ---
  const fetchConToken = (url, setter, fallback = []) => {
    if (!token) return;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setter(data.results || data))
      .catch(() => setter(fallback));
  };

  // --- Cargar productos con control de error ---
  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/api/productos/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setProductos(data.results || data);
        setErrorProductos(false);
      })
      .catch(() => setErrorProductos(true));
  }, [token]);

  // --- Carga simple para el resto ---
  useEffect(() => { fetchConToken('http://localhost:8000/api/clientes/', setClientes); }, [token]);
  useEffect(() => { fetchConToken('http://localhost:8000/api/proveedores/', setProveedores); }, [token]);
  useEffect(() => { fetchConToken('http://localhost:8000/api/ventas/', setVentas); }, [token]);
  useEffect(() => { fetchConToken('http://localhost:8000/api/compras/', setCompras); }, [token]);

  // --- Login / Logout ---
  const handleLoginExitoso = nuevoToken => {
    setToken(nuevoToken);
    localStorage.setItem('token', nuevoToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setProductos([]); setClientes([]); setProveedores([]);
    setVentas([]); setCompras([]);
    setProductoEditando(null); setClienteEditando(null); setProveedorEditando(null);
    setVentaEditando(null); setCompraEditando(null);
  };

  // --- CRUD genéricos ---
  const handleEliminar = (tipo, id, setter) => {
    if (!id || !token) {
      console.error(`❌ ID no definido o no autorizado al eliminar ${tipo}`);
      return;
    }
    fetch(`http://localhost:8000/api/${tipo}/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => setter(prev => prev.filter(item => item.id !== id)));
  };

  const handleGuardado = (nuevo, lista, setter, clearFn) => {
    if (!nuevo || !nuevo.id) {
      console.error('❌ Error: objeto guardado sin ID', nuevo);
      return;
    }
    setter(prev =>
      prev.some(p => p.id === nuevo.id)
        ? prev.map(p => (p.id === nuevo.id ? nuevo : p))
        : [...prev, nuevo]
    );
    clearFn(null);
  };

  // --- Cargar detalles para edición de venta y compra ---
  const cargarVentaConDetalles = async id => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/ventas/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setVentaEditando({ ...data, detalle: data.detalles });
    } catch {
      alert('Error al cargar la venta para edición');
    }
  };

  const cargarCompraConDetalles = async id => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/compras/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCompraEditando({ ...data, detalle: data.detalles });
    } catch {
      alert('Error al cargar la compra para edición');
    }
  };

  // --- Mostrar login si no hay token ---
  if (!token) {
    return (
      <div className="container my-4">
        <h2 className="mb-4">Iniciar Sesión</h2>
        <FormularioOnLogin onLogin={handleLoginExitoso} />
      </div>
    );
  }

  // --- Render principal ---
  return (
    <>

      <Navbar setSeccion={setSeccion} handleLogout={handleLogout} />
      <div className="container my-4">
        {/* Sección Productos */}
        {seccion === 'Productos' && (
          <>
            <h2>Productos</h2>
            {errorProductos && (
              <div className="alert alert-danger">Error al cargar productos.</div>
            )}
            <FormularioProducto
              productoEditando={productoEditando}
              onProductoCreadoOEditado={p =>
                handleGuardado(p, productos, setProductos, setProductoEditando)
              }
              onCancelar={() => setProductoEditando(null)}
            />
            <ul className="list-group mt-3">
              {productos.map(p => (
                <li key={p.id} className="list-group-item d-flex justify-content-between">
                  <div>
                    <strong>{p.nombre}</strong> — {p.descripcion} — Stock: {p.stock}
                  </div>
                  <div>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => setProductoEditando(p)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleEliminar('productos', p.id, setProductos)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Sección Clientes */}
        {seccion === 'Clientes' && (
          <>
            <h2>Clientes</h2>
            <FormularioCliente
              cliente={clienteEditando}
              onClienteCreadoOEditado={c =>
                handleGuardado(c, clientes, setClientes, setClienteEditando)
              }
              onCancelar={() => setClienteEditando(null)}
            />
            <ul className="list-group mt-3">
              {clientes.map(c => (
                <li key={c.id} className="list-group-item d-flex justify-content-between">
                  <div>{c.nombre} — {c.email}</div>
                  <div>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => setClienteEditando(c)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleEliminar('clientes', c.id, setClientes)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Sección Proveedores */}
        {seccion === 'Proveedores' && (
          <>
            <h2>Proveedores</h2>
            <FormularioProveedor
              proveedor={proveedorEditando}
              onProveedorCreadoOEditado={p =>
                handleGuardado(p, proveedores, setProveedores, setProveedorEditando)
              }
              onCancelar={() => setProveedorEditando(null)}
            />
            <ul className="list-group mt-3">
              {proveedores.map(p => (
                <li key={p.id} className="list-group-item d-flex justify-content-between">
                  <div>{p.nombre} — {p.telefono}</div>
                  <div>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => setProveedorEditando(p)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleEliminar('proveedores', p.id, setProveedores)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

      {/* Sección Ventas con detalle de productos */}
{seccion === 'Ventas' && (
  <>
    <h2>Ventas</h2>
    <FormularioVenta
      ventaEditando={ventaEditando}
      onVentaGuardada={v => handleGuardado(v, ventas, setVentas, setVentaEditando)}
      onCancelarEdicion={() => setVentaEditando(null)}
      clientes={clientes}
      productos={productos}
    />
    <ul className="list-group mt-3">
      {ventas.map(v => {
        const cli = clientes.find(c => c.id === v.cliente);
        return (
          <li key={v.id} className="list-group-item">
            <div className="d-flex justify-content-between">
              <div>
                Cliente: {cli?.nombre || 'N/A'} — Fecha: {new Date(v.fecha).toLocaleDateString()} — Total: €{parseFloat(v.total).toFixed(2)}
              </div>
              <div>
                <button className="btn btn-sm btn-primary me-2" onClick={() => cargarVentaConDetalles(v.id)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleEliminar('ventas', v.id, setVentas)}>Eliminar</button>
              </div>
            </div>

            {/* 👇 Mostrar productos y cantidades vendidas */}
            {v.detalles?.length > 0 && (
              <ul className="mt-2 mb-0 ps-3">
                {v.detalles.map((det, idx) => {
                  const prod = productos.find(p => p.id === det.producto);
                  return (
                    <li key={`${det.producto}-${idx}`}>
                      {prod?.nombre || 'Producto'} — {det.cantidad} ud{det.cantidad > 1 ? 's' : ''}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  </>
)}

   {seccion === 'Compras' && (
  <>
    <h2>Compras</h2>
    <FormularioCompra
      compra={compraEditando}
      onCompraCreadaOEditada={c =>
        handleGuardado(c, compras, setCompras, setCompraEditando)
      }
      onCancelar={() => setCompraEditando(null)}
      proveedores={proveedores}
      productos={productos}
    />
    <ul className="list-group mt-3">
      {compras.map(c => {
        const prov = proveedores.find(p => p.id === c.proveedor);
        return (
          <li key={c.id} className="list-group-item">
            <div className="d-flex justify-content-between">
              <div>
                Proveedor: {prov?.nombre || 'N/A'} — Fecha: {new Date(c.fecha).toLocaleDateString()} — Total: €{parseFloat(c.total).toFixed(2)}
              </div>
              <div>
                <button className="btn btn-sm btn-primary me-2" onClick={() => cargarCompraConDetalles(c.id)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleEliminar('compras', c.id, setCompras)}>Eliminar</button>
              </div>
            </div>

            {/* 👇 Mostrar productos comprados si existen */}
            {c.detalles?.length > 0 && (
              <ul className="mt-2 mb-0 ps-3">
                {c.detalles.map((det, idx) => {
                  const prod = productos.find(p => p.id === det.producto);
                  return (
                    <li key={`${det.producto}-${idx}`}>
                      {prod?.nombre || 'Producto'} — {det.cantidad} ud{det.cantidad > 1 ? 's' : ''}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  </>
)}

      </div>
    </>
  );
}

export default App;
