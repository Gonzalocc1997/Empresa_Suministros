import React, { useEffect, useState } from 'react';

/**
 * Componente para listar productos desde la API con paginación y opción de eliminación.
 */
const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [url, setUrl] = useState('http://localhost:8000/api/productos/');

  const token = localStorage.getItem('token');

  // Si no hay token, no renderizamos el componente
  if (!token) {
    return <p>Debes iniciar sesión para ver los productos.</p>;
  }

  // Función para obtener los productos desde la API
  const fetchProductos = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar productos');

      const data = await response.json();
      setProductos(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Efecto que se ejecuta cuando cambia la URL de paginación
  useEffect(() => {
    fetchProductos(url);
  }, [url]);

  // Función para eliminar un producto
  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este producto?');

    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:8000/api/productos/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        // Recargamos productos tras eliminar
        fetchProductos(url);
      } else {
        throw new Error('No se pudo eliminar el producto');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Lista de Productos</h2>

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && productos.length === 0 && <p>No hay productos disponibles.</p>}

      {!loading && productos.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {productos.map((producto) => (
            <li
              key={producto.id}
              style={{
                marginBottom: 15,
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '6px',
              }}
            >
              <strong>{producto.nombre}</strong>
              <p>Precio: ${producto.precio}</p>

              <button
                onClick={() => handleEliminar(producto.id)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Paginación */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button
          onClick={() => prevPage && setUrl(prevPage)}
          disabled={!prevPage}
          style={{
            padding: '8px 16px',
            backgroundColor: prevPage ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: prevPage ? 'pointer' : 'not-allowed',
          }}
        >
          Anterior
        </button>

        <button
          onClick={() => nextPage && setUrl(nextPage)}
          disabled={!nextPage}
          style={{
            padding: '8px 16px',
            backgroundColor: nextPage ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: nextPage ? 'pointer' : 'not-allowed',
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProductoList;
