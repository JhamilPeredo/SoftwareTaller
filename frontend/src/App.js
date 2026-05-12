import React, { useState, useEffect, useCallback } from 'react';
import {
  getRoles, createRol, updateRol, deleteRol,
  getUsuarios, createUsuario, updateUsuario, deleteUsuario, asignarRol
} from './api';
import './App.css';


function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ─── SECCIÓN ROLES ─── */
function Roles() {
  const [roles, setRoles] = useState([]);
  const [modal, setModal] = useState(null); // null | 'crear' | 'editar'
  const [seleccionado, setSeleccionado] = useState(null);
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const cargar = useCallback(async () => {
    const { data } = await getRoles();
    setRoles(data);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const abrirCrear = () => { setNombre(''); setError(''); setModal('crear'); };
  const abrirEditar = (rol) => { setSeleccionado(rol); setNombre(rol.nombre); setError(''); setModal('editar'); };
  const cerrar = () => { setModal(null); setError(''); };

  const guardar = async () => {
    if (!nombre.trim()) { setError('El nombre es requerido.'); return; }
    try {
      if (modal === 'crear') {
        await createRol({ nombre: nombre.trim() });
        flash('Rol creado.');
      } else {
        await updateRol(seleccionado.id, { nombre: nombre.trim() });
        flash('Rol actualizado.');
      }
      cerrar(); cargar();
    } catch (e) {
      setError(e.response?.data?.nombre?.[0] || 'Error al guardar.');
    }
  };

  const eliminar = async (rol) => {
    if (!window.confirm(`¿Eliminar el rol "${rol.nombre}"?`)) return;
    try {
      await deleteRol(rol.id);
      flash('Rol eliminado.');
      cargar();
    } catch (e) {
      alert(e.response?.data?.error || 'No se puede eliminar.');
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2>Roles</h2>
          <p className="section-sub">Gestión de roles del sistema</p>
        </div>
        <button className="btn btn-primary" onClick={abrirCrear}>+ Nuevo Rol</button>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Usuarios</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 && (
              <tr><td colSpan={5} className="empty">Sin roles registrados</td></tr>
            )}
            {roles.map((r, i) => (
              <tr key={r.id}>
                <td className="mono">{i + 1}</td>
                <td>
                  <span className={`badge ${r.nombre === 'admin' ? 'badge-admin' : 'badge-default'}`}>
                    {r.nombre}
                  </span>
                </td>
                <td className="mono">{r.total_usuarios}</td>
                <td>{new Date(r.creado_en).toLocaleDateString('es-BO')}</td>
                <td className="actions">
                  <button className="btn btn-sm btn-edit" onClick={() => abrirEditar(r)}>Editar</button>
                  {r.nombre !== 'admin' && (
                    <button className="btn btn-sm btn-danger" onClick={() => eliminar(r)}>Eliminar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'crear' ? 'Nuevo Rol' : 'Editar Rol'} onClose={cerrar}>
          <div className="form-group">
            <label>Nombre del rol</label>
            <input
              className="input"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && guardar()}
              placeholder="ej: participante"
              autoFocus
            />
            {error && <span className="field-error">{error}</span>}
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={cerrar}>Cancelar</button>
            <button className="btn btn-primary" onClick={guardar}>Guardar</button>
          </div>
        </Modal>
      )}
    </section>
  );
}


  const F = React.memo(({
  field,
  label,
  type = 'text',
  placeholder = '',
  value,
  error,
  onChange
}) => (
  <div className="form-group">
    <label>{label}</label>

    <input
      className={`input ${error ? 'input-error' : ''}`}
      type={type}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
    />

    {error && <span className="field-error">{error}</span>}
  </div>
));
/* ─── SECCIÓN USUARIOS ─── */
function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modal, setModal] = useState(null); // null | 'crear' | 'editar' | 'rol'
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', username: '', password: '', rol: '' });
  const [rolId, setRolId] = useState('');
  const [error, setError] = useState({});
  const [msg, setMsg] = useState('');

  const cargar = useCallback(async () => {
    const [u, r] = await Promise.all([getUsuarios(), getRoles()]);
    setUsuarios(u.data);
    setRoles(r.data);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };
  const cerrar = () => { setModal(null); setError({}); };

  const abrirCrear = () => {
    setForm({ nombre: '', apellido: '', email: '', username: '', password: '', rol: '' });
    setError({});
    setModal('crear');
  };

  const abrirEditar = (u) => {
    setSel(u);
    setForm({ nombre: u.nombre, apellido: u.apellido, email: u.email, username: u.username, password: '', rol: u.rol || '' });
    setError({});
    setModal('editar');
  };

  const abrirRol = (u) => {
    setSel(u);
    setRolId(u.rol || '');
    setModal('rol');
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (!form.apellido.trim()) e.apellido = 'Requerido';
    if (!form.email.trim()) e.email = 'Requerido';
    if (!form.username.trim()) e.username = 'Requerido';
    if (modal === 'crear' && !form.password.trim()) e.password = 'Requerido';
    return e;
  };

  const guardar = async () => {
    const e = validar();
    if (Object.keys(e).length) { setError(e); return; }
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    if (!payload.rol) delete payload.rol;
    try {
      if (modal === 'crear') {
        await createUsuario(payload);
        flash('Usuario creado.');
      } else {
        await updateUsuario(sel.id, payload);
        flash('Usuario actualizado.');
      }
      cerrar(); cargar();
    } catch (ex) {
      const data = ex.response?.data || {};
      const mapped = {};
      Object.keys(data).forEach(k => { mapped[k] = Array.isArray(data[k]) ? data[k][0] : data[k]; });
      setError(mapped);
    }
  };

  const guardarRol = async () => {
    try {
      await asignarRol(sel.id, rolId);
      flash('Rol asignado.');
      cerrar(); cargar();
    } catch {
      alert('Error al asignar rol.');
    }
  };

  const eliminar = async (u) => {
    if (!window.confirm(`¿Eliminar a "${u.nombre} ${u.apellido}"?`)) return;
    await deleteUsuario(u.id);
    flash('Usuario eliminado.');
    cargar();
  };

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2>Usuarios</h2>
          <p className="section-sub">Gestión de participantes y administradores</p>
        </div>
        <button className="btn btn-primary" onClick={abrirCrear}>+ Nuevo Usuario</button>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Username</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 && (
              <tr><td colSpan={6} className="empty">Sin usuarios registrados</td></tr>
            )}
            {usuarios.map((u, i) => (
              <tr key={u.id}>
                <td className="mono">{i + 1}</td>
                <td>{u.nombre} {u.apellido}</td>
                <td className="mono">@{u.username}</td>
                <td>{u.email}</td>
                <td>
                  {u.rol_nombre
                    ? <span className={`badge ${u.rol_nombre === 'admin' ? 'badge-admin' : 'badge-default'}`}>{u.rol_nombre}</span>
                    : <span className="badge badge-none">sin rol</span>}
                </td>
                <td className="actions">
                  <button className="btn btn-sm btn-edit" onClick={() => abrirEditar(u)}>Editar</button>
                  <button className="btn btn-sm btn-role" onClick={() => abrirRol(u)}>Rol</button>
                  <button className="btn btn-sm btn-danger" onClick={() => eliminar(u)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal crear/editar */}
      {(modal === 'crear' || modal === 'editar') && (
        <Modal title={modal === 'crear' ? 'Nuevo Usuario' : 'Editar Usuario'} onClose={cerrar}>
          <div className="form-grid">
            <F
  field="nombre"
  label="Nombre"
  placeholder="Juan"
  value={form.nombre}
  error={error.nombre}
  onChange={(field, value) =>
    setForm(prev => ({ ...prev, [field]: value }))
  }
/>

<F
  field="apellido"
  label="Apellido"
  placeholder="Pérez"
  value={form.apellido}
  error={error.apellido}
  onChange={(field, value) =>
    setForm(prev => ({ ...prev, [field]: value }))
  }
/>

<F
  field="email"
  label="Email"
  type="email"
  placeholder="juan@example.com"
  value={form.email}
  error={error.email}
  onChange={(field, value) =>
    setForm(prev => ({ ...prev, [field]: value }))
  }
/>

<F
  field="username"
  label="Username"
  placeholder="jperez"
  value={form.username}
  error={error.username}
  onChange={(field, value) =>
    setForm(prev => ({ ...prev, [field]: value }))
  }
/>

<F
  field="password"
  label={modal === 'editar'
    ? 'Nueva contraseña (opcional)'
    : 'Contraseña'}
  type="password"
  value={form.password}
  error={error.password}
  onChange={(field, value) =>
    setForm(prev => ({ ...prev, [field]: value }))
  }
/>
            <div className="form-group">
              <label>Rol</label>
              <select className="input" value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}>
                <option value="">— Sin rol —</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
            </div>
          </div>
          {error.non_field_errors && <span className="field-error">{error.non_field_errors}</span>}
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={cerrar}>Cancelar</button>
            <button className="btn btn-primary" onClick={guardar}>Guardar</button>
          </div>
        </Modal>
      )}

      {/* Modal asignar rol */}
      {modal === 'rol' && (
        <Modal title={`Asignar Rol — ${sel?.nombre}`} onClose={cerrar}>
          <div className="form-group">
            <label>Selecciona un rol</label>
            <select className="input" value={rolId} onChange={e => setRolId(e.target.value)}>
              <option value="">— Sin rol —</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={cerrar}>Cancelar</button>
            <button className="btn btn-primary" onClick={guardarRol}>Asignar</button>
          </div>
        </Modal>
      )}
    </section>
  );
}

/* ─── APP PRINCIPAL ─── */
export default function App() {
  const [tab, setTab] = useState('roles');

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">&lt;/&gt;</span>
            <div>
              <div className="logo-title">CompetenciaPro</div>
              <div className="logo-sub">Panel de Administración</div>
            </div>
          </div>
          <nav className="nav">
            <button
              className={`nav-btn ${tab === 'roles' ? 'active' : ''}`}
              onClick={() => setTab('roles')}
            >
              Roles
            </button>
            <button
              className={`nav-btn ${tab === 'usuarios' ? 'active' : ''}`}
              onClick={() => setTab('usuarios')}
            >
              Usuarios
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {tab === 'roles' ? <Roles /> : <Usuarios />}
      </main>

      <footer className="footer">
        <span>Competencia de Programación · Sistema de Gestión</span>
      </footer>
    </div>
  );
}
