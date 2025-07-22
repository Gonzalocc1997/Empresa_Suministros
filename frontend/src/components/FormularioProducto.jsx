
import React, { useState, useEffect } from 'react';

const FormularioProducto = ({ productoEditando, onProductoCreadoOEditado, onCancelar }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productoEditando) {
      setNombre(productoEditando.nombre || '');
      setDescripcion(productoEditando.descripcion || '');
      setPrecio(productoEditando.precio || '');
      setStock(productoEditando.stock || '');
    } else {
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
    }
    setError(null);
  }, [productoEditando]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) return setError('El nombre es obligatorio');
    if (precio === '' || isNaN(precio) || Number(precio) < 0)
      return setError('El precio debe ser un número positivo');
    if (stock === '' || isNaN(stock) || Number(stock) < 0)
      return setError('El stock debe ser un número positivo');

    const producto = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
      stock: Number(stock),
    };

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se ha iniciado sesión.');
      return;
    }

    const url = productoEditando
      ? `http://localhost:8000/api/productos/${productoEditando.id}/`
      : 'http://localhost:8000/api/productos/';
    const method = productoEditando ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(producto),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.detail || 'Error al guardar');
      }

      const nuevoProducto = await res.json();
      onProductoCreadoOEditado(nuevoProducto);
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: '500px' }}>
      <h3>{productoEditando ? 'Editar Producto' : 'Nuevo Producto'}</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            id="nombre"
            type="text"
            className="form-control"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre del producto"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            id="descripcion"
            className="form-control"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Descripción breve"
            rows="3"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="precio" className="form-label">Precio</label>
          <input
            id="precio"
            type="number"
            className="form-control"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="stock" className="form-label">Stock</label>
          <input
            id="stock"
            type="number"
            className="form-control"
            value={stock}
            onChange={e => setStock(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success">
            {productoEditando ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
          {productoEditando && (
            <button type="button" className="btn btn-secondary" onClick={onCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormularioProducto;
