import React, { useEffect, useState } from 'react';

/**
 * Componente que muestra una lista paginada de ventas con opción de eliminación.
 */
const VentaList = () => {
  const [ventas, setVentas] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState('http://localhost:8000/api/ventas/');

  const token = localStorage.getItem('token');

  // Si el usuario no está autenticado, no mostramos la lista
  if (!token) {
    return <p>Debes iniciar sesión para ver las ventas.</p>;
  }

  // Función para obtener las ventas desde la API
  const fetchVentas = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Error al cargar las ventas');

      const data = await res.json();
      setVentas(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar ventas al montar componente o cambiar página
  useEffect(() => {
    fetchVentas(url);
  }, [url]);

  // Eliminar una venta específica
  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta venta?');

    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:8000/api/ventas/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) {
        // Venta eliminada exitosamente, actualizamos la lista
        fetchVentas(url);
      } else {
        throw new Error('No se pudo eliminar la venta');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Lista de Ventas</h2>

      {loading && <p>Cargando ventas...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && ventas.length === 0 && <p>No hay ventas disponibles.</p>}

      {!loading && ventas.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {ventas.map((venta) => (
            <li
              key={venta.id}
              style={{
                marginBottom: 15,
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '6px',
              }}
            >
              <strong>Cliente:</strong> {venta.cliente_nombre || venta.cliente} <br />
              <strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()} <br />
              <strong>Total:</strong> ${venta.total.toFixed(2)}

              <div style={{ marginTop: 8 }}>
                <button
                  onClick={() => handleEliminar(venta.id)}
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
              </div>
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

export default VentaList;
