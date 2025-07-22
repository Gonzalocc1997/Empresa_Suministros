import React, { useState, useEffect } from 'react';

/**
 * Formulario para crear o editar un proveedor.
 * - Valida nombre, email y teléfono.
 * - Envía JWT en header Authorization.
 * - Usa Bootstrap.
 *
 * Props:
 * - proveedor: objeto a editar (o null para nuevo)
 * - onProveedorCreadoOEditado: callback al guardar (creación o edición)
 * - onCancelar: callback para cancelar edición
 */
export default function FormularioProveedor({
  proveedor = null,
  onProveedorCreadoOEditado,
  onCancelar,
}) {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState(null);

  /**
   * useEffect se ejecuta cuando el componente se monta o cambia la prop `proveedor`.
   * Si estamos editando, precarga los datos en el formulario.
   */
  useEffect(() => {
    if (proveedor) {
      setNombre(proveedor.nombre || '');
      setEmail(proveedor.email || '');
      setTelefono(proveedor.telefono || '');
    } else {
      setNombre('');
      setEmail('');
      setTelefono('');
    }
    setError(null); // Limpia errores anteriores al cambiar de proveedor
  }, [proveedor]);

  // Maneja el envío del formulario
  const handleSubmit = async e => {
    e.preventDefault(); // Evita recarga del formulario
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión.');
      return;
    }

    // === Validaciones ===
    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Email inválido.');
      return;
    }
    if (telefono && !/^\d{9,10}$/.test(telefono)) {
      setError('Teléfono: 9–10 dígitos numéricos.');
      return;
    }

    // Cuerpo de datos a enviar
    const payload = {
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
    };

    console.log('📤 Enviando proveedor:', payload);

    // URL y método HTTP dependiendo si es creación o edición
    const url = proveedor
      ? `http://localhost:8000/api/proveedores/${proveedor.id}/`
      : 'http://localhost:8000/api/proveedores/';
    const method = proveedor ? 'PUT' : 'POST';

    try {
      // Envío de datos al backend
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Añade token JWT
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Error guardando proveedor.');
      }

      const data = await res.json(); // Respuesta del backend
      setError(null);

      // Si era nuevo, limpia el formulario
      if (!proveedor) {
        setNombre(''); setEmail(''); setTelefono('');
      }

      // Llama al callback del padre para actualizar la lista
      onProveedorCreadoOEditado(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Si no hay token, avisamos al usuario
  if (!localStorage.getItem('token')) {
    return (
      <div className="alert alert-warning">
        Inicia sesión para gestionar proveedores.
      </div>
    );
  }

  // Render del formulario con Bootstrap
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">
          {proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        </h5>

        {/* Mensaje de error si lo hay */}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Razón social"
              required
            />
          </div>

          {/* Campo Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="contacto@proveedor.com"
              required
            />
          </div>

          {/* Campo Teléfono */}
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

          {/* Botones de enviar y cancelar */}
          <div className="d-flex">
            <button type="submit" className="btn btn-primary me-2">
              {proveedor ? 'Guardar cambios' : 'Crear proveedor'}
            </button>
            {proveedor && (
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
