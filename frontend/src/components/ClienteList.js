import React, { useEffect, useState } from 'react';

const ClienteList = () => {
  // Estados para manejar la lista de clientes y la paginación
  const [clientes, setClientes] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  // Estados para controlar carga y errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL de la API actual (permite paginar)
  const [url, setUrl] = useState('http://localhost:8000/api/clientes/');

  // Función que construye los headers para las peticiones fetch
  // Obtiene el token dinámicamente en cada llamada para evitar problemas
  const getHeaders = () => {
    const token = localStorage.getItem('token'); // Obtener token actualizado
    return {
      'Content-Type': 'application/json', // Siempre enviamos JSON
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Añadir Authorization solo si hay token
    };
  };

  // Función que carga la lista de clientes desde la API
  const fetchClientes = (url) => {
    setLoading(true);
    setError(null);

    fetch(url, {
      headers: getHeaders(), // Usamos la función para añadir headers con token
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar clientes');
        return res.json();
      })
      .then((data) => {
        setClientes(data.results);      // Guardamos la lista de clientes
        setNextPage(data.next);         // Guardamos URL de siguiente página (si existe)
        setPrevPage(data.previous);     // Guardamos URL de página anterior (si existe)
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);           // Guardamos mensaje de error
        setLoading(false);
      });
  };

  // useEffect para cargar los clientes al montar el componente y cuando cambie la URL
  useEffect(() => {
    fetchClientes(url);
  }, [url]);

  // Función para eliminar un cliente dado su id
  const handleEliminar = (id) => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este cliente?');

    if (confirmar) {
      fetch(`http://localhost:8000/api/clientes/${id}/`, {
        method: 'DELETE',
        headers: getHeaders(), // También usamos getHeaders para añadir token aquí
      })
        .then((res) => {
          if (res.status === 204) {
            fetchClientes(url); // Recarga la lista al eliminar
          } else {
            throw new Error('Error al eliminar el cliente');
          }
        })
        .catch((err) => {
          setError(err.message);  // Mostrar error si ocurre
        });
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Lista de Clientes</h2>

      {/* Mostrar estado de carga o errores */}
      {loading && <p>Cargando clientes...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Mostrar la lista de clientes cuando no esté cargando y haya clientes */}
      {!loading && clientes.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {clientes.map((cliente) => (
            <li
              key={cliente.id}
              style={{
                marginBottom: 10,
                borderBottom: '1px solid #ccc',
                paddingBottom: 5,
              }}
            >
              <strong>{cliente.nombre}</strong> - Email: {cliente.email} - Teléfono: {cliente.telefono}
              <div style={{ marginTop: 5 }}>
                {/* Botón para eliminar cliente */}
                <button
                  onClick={() => handleEliminar(cliente.id)}
                  style={{ backgroundColor: 'red', color: 'white' }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Botones de paginación */}
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

export default ClienteList;
