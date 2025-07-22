// src/components/FormularioCliente.jsx
import React, { useState, useEffect } from 'react';

/**
 * FormularioCliente.jsx
 * Componente que permite crear o editar un cliente.
 *
 * Props:
 * - cliente: Objeto con los datos del cliente a editar (o null si es nuevo)
 * - onClienteCreadoOEditado: Función callback que se ejecuta al guardar
 * - onCancelar: Función callback para cancelar la edición
 */
export default function FormularioCliente({ cliente = null, onClienteCreadoOEditado, onCancelar }) {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState(null);

  // Si se recibe un cliente, precargamos sus datos en el formulario
  useEffect(() => {
    if (cliente) {
      setNombre(cliente.nombre || '');
      setEmail(cliente.email || '');
      setTelefono(cliente.telefono || '');
    } else {
      // Si no hay cliente (modo nuevo), limpiamos el formulario
      setNombre('');
      setEmail('');
      setTelefono('');
    }
    setError(null); // Limpiar posibles errores anteriores
  }, [cliente]);

  // Función que maneja el envío del formulario
  const handleSubmit = async e => {
    e.preventDefault();

    // 1) Obtenemos el token JWT guardado en localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión.');
      return;
    }

    // 2) Validaciones básicas antes de enviar
    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Introduce un email válido.');
      return;
    }
    if (telefono && (!/^\d{9,10}$/.test(telefono))) {
      setError('Teléfono: 9–10 dígitos numéricos.');
      return;
    }

    // 3) Construimos el cuerpo (payload) que se enviará al backend
    const payload = {
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
    };

    // 4) Definimos si es una creación (POST) o edición (PUT)
    const url = cliente
      ? `http://localhost:8000/api/clientes/${cliente.id}/`
      : 'http://localhost:8000/api/clientes/';
    const method = cliente ? 'PUT' : 'POST';

    try {
      // 5) Enviamos los datos al backend con fetch y token JWT
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
        throw new Error(errData.detail || 'Error guardando cliente.');
      }

      const data = await res.json();
      setError(null); // Limpiamos errores

      // Si es un cliente nuevo, limpiamos el formulario
      if (!cliente) {
        setNombre('');
        setEmail('');
        setTelefono('');
      }

      // Avisamos al componente padre con los datos actualizados
      onClienteCreadoOEditado(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Si el usuario no ha iniciado sesión, no mostramos el formulario
  if (!localStorage.getItem('token')) {
    return (
      <div className="alert alert-warning">
        Debes iniciar sesión para gestionar clientes.
      </div>
    );
  }

  // Render del formulario usando estilos Bootstrap
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">
          {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Campo: Nombre */}
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Nombre completo"
              required
            />
          </div>

          {/* Campo: Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>

          {/* Campo: Teléfono */}
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              className="form-control"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              placeholder="Solo números, 9–10 dígitos"
            />
          </div>

          {/* Botones */}
          <div className="d-flex">
            <button type="submit" className="btn btn-primary me-2">
              {cliente ? 'Guardar cambios' : 'Crear cliente'}
            </button>
            {cliente && (
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
