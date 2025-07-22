import React, { useEffect, useState } from 'react';

const CompraList = () => {
  // Estado para almacenar la lista de compras
  const [compras, setCompras] = useState([]);

  // Estados para paginación: URLs de la siguiente y anterior página
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  // Estados para controlar carga y posibles errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL base para la API de compras
  const [url, setUrl] = useState('http://localhost:8000/api/compras/');

  // Función para construir los headers de la petición, incluyendo el token si existe
  const getHeaders = () => {
    const token = localStorage.getItem('access_token'); // Se obtiene el token al momento
    return {
      'Content-Type': 'application/json', // Siempre enviamos JSON
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Añadimos Authorization solo si hay token
    };
  };

  // Función que carga la lista de compras desde la API
  const fetchCompras = (url) => {
    setLoading(true);
    setError(null);

    fetch(url, {
      headers: getHeaders(), // Usamos getHeaders para incluir token y content-type
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar las compras');
        return res.json();
      })
      .then((data) => {
        setCompras(data.results);      // Guardamos la lista de compras
        setNextPage(data.next);        // URL página siguiente (si existe)
        setPrevPage(data.previous);    // URL página anterior (si existe)
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);         // Guardamos mensaje de error
        setLoading(false);
      });
  };

  // useEffect para cargar las compras al montar el componente o cambiar la URL (paginación)
  useEffect(() => {
    fetchCompras(url);
  }, [url]);

  // Función para eliminar una compra con confirmación
  const handleEliminar = (id) => {
    const confirmar = window.confirm('¿Seguro que quieres eliminar esta compra?');

    if (confirmar) {
      fetch(`http://localhost:8000/api/compras/${id}/`, {
        method: 'DELETE',
        headers: getHeaders(), // Añadimos headers con token para autenticar
      })
        .then((res) => {
          if (res.status === 204) {
            fetchCompras(url); // Recarga lista tras eliminar correctamente
          } else {
            throw new Error('Error al eliminar la compra');
          }
        })
        .catch((err) => {
          setError(err.message); // Mostrar error si hay problema al eliminar
        });
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Lista de Compras</h2>

      {/* Mensajes de carga y error */}
      {loading && <p>Cargando compras...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Lista de compras */}
      {!loading && compras.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {compras.map((compra) => (
            <li
              key={compra.id}
              style={{
                marginBottom: 10,
                borderBottom: '1px solid #ccc',
                paddingBottom: 5,
              }}
            >
              {/* Mostrar datos relevantes, ajusta según tu modelo */}
              <strong>Proveedor:</strong> {compra.proveedor_nombre || compra.proveedor} <br />
              <strong>Fecha:</strong> {new Date(compra.fecha).toLocaleDateString()} <br />
              <strong>Total:</strong> ${compra.total.toFixed(2)}

              <div style={{ marginTop: 5 }}>
                {/* Botón para eliminar compra */}
                <button
                  onClick={() => handleEliminar(compra.id)}
                  style={{ backgroundColor: 'red', color: 'white', marginTop: 5 }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Controles de paginación */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button
          onClick={() => prevPage && setUrl(prevPage)}
          disabled={!prevPage}
          style={{ padding: '8px 16px', cursor: prevPage ? 'pointer' : 'not-allowed' }}
        >
          Anterior
        </button>

        <button
          onClick={() => nextPage && setUrl(nextPage)}
          disabled={!nextPage}
          style={{ padding: '8px 16px', cursor: nextPage ? 'pointer' : 'not-allowed' }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default CompraList;
