// Navbar.jsx — Componente de navegación superior

import React from 'react';

// Componente funcional que recibe props para cambiar de sección y cerrar sesión
export default function Navbar({ setSeccion, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        {/* Título o logo del sistema */}
        <a className="navbar-brand" href="#">Suministros</a>

        {/* Botón hamburguesa (visible en móviles) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Contenedor colapsable de enlaces */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Menú lateral con botones de navegación entre secciones */}
          <ul className="navbar-nav me-auto">
            {['Productos', 'Clientes', 'Proveedores', 'Ventas', 'Compras'].map(section => (
              <li className="nav-item" key={section}>
                <button
                  className="nav-link btn btn-link"
                  onClick={() => setSeccion(section)} // Cambia el estado global de sección
                >
                  {section}
                </button>
              </li>
            ))}
          </ul>

          {/* Botón de cerrar sesión (logout) a la derecha */}
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
