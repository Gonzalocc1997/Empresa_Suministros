import React, { useState } from 'react';

// Componente de formulario de login
export default function FormularioOnLogin({ onLogin }) {
  // Estados locales para usuario, contraseña y errores
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();        // Previene recarga de la página
    setError(null);            // Reinicia el mensaje de error

    try {
      // 1) Enviamos credenciales al backend para obtener el token JWT
      const res = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usuario,
          password: contrasena,
        }),
      });

      // 2) Si el login falla, capturamos el mensaje de error
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Credenciales inválidas');
      }

      // 3) Extraemos el token del backend y lo almacenamos
      const data = await res.json();
      const jwt = data.access || data.token; // JWT corto de acceso
      localStorage.setItem('token', jwt);   // Guardamos en localStorage

      // 4) Llamamos a la función que avisa al padre que el login fue exitoso
      onLogin(jwt);
    } catch (err) {
      setError(err.message); // Mostramos error si ocurre
    }
  };

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center bg-light">
      <div className="card shadow-sm" style={{ maxWidth: 380, width: '100%' }}>
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>

          {/* Mostramos mensaje de error si ocurre */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Formulario controlado con React */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">Usuario</label>
              <input
                id="usuario"
                type="text"
                className="form-control"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                placeholder="Tu usuario"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="contrasena" className="form-label">Contraseña</label>
              <input
                id="contrasena"
                type="password"
                className="form-control"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                placeholder="Tu contraseña"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
