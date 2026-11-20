import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { crearDueno, eliminarDueno, getDuenos, mensajeError } from '../api'
import Alerta from '../components/Alerta'

const VACIO = { rut: '', nombre: '', telefono: '', email: '' }

export default function DuenosPage() {
  const [duenos, setDuenos] = useState([])
  const [form, setForm] = useState(VACIO)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const cargar = () => {
    setCargando(true)
    getDuenos()
      .then(setDuenos)
      .catch(e => setError(mensajeError(e)))
      .finally(() => setCargando(false))
  }

  useEffect(cargar, [])

  const cambiar = e => setForm({ ...form, [e.target.name]: e.target.value })

  const guardar = async e => {
    e.preventDefault()
    setError(''); setOk('')
    try {
      await crearDueno(form)
      setForm(VACIO)
      setOk('Dueño registrado correctamente')
      cargar()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  const borrar = async d => {
    if (!window.confirm(`¿Eliminar a ${d.nombre}? También se borrarán sus mascotas y citas.`)) return
    try {
      await eliminarDueno(d.id)
      cargar()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  return (
    <>
      <h1>Dueños</h1>
      <Alerta onClose={() => setError('')}>{error}</Alerta>
      <Alerta tipo="ok" onClose={() => setOk('')}>{ok}</Alerta>

      <div className="grid">
        <section className="card">
          <h2>Registrar dueño</h2>
          <form onSubmit={guardar} className="formulario">
            <label>RUT<input name="rut" value={form.rut} onChange={cambiar} placeholder="12.345.678-9" required /></label>
            <label>Nombre<input name="nombre" value={form.nombre} onChange={cambiar} required /></label>
            <label>Teléfono<input name="telefono" value={form.telefono} onChange={cambiar} placeholder="+569..." /></label>
            <label>Email<input name="email" type="email" value={form.email} onChange={cambiar} /></label>
            <button className="btn">Guardar</button>
          </form>
        </section>

        <section className="card">
          <h2>Listado</h2>
          {cargando ? <p className="muted">Cargando...</p> : duenos.length === 0 ? (
            <p className="muted">Aún no hay dueños registrados.</p>
          ) : (
            <table>
              <thead>
                <tr><th>RUT</th><th>Nombre</th><th>Contacto</th><th></th></tr>
              </thead>
              <tbody>
                {duenos.map(d => (
                  <tr key={d.id}>
                    <td>{d.rut}</td>
                    <td>{d.nombre}</td>
                    <td className="muted">{d.telefono}<br />{d.email}</td>
                    <td className="acciones">
                      <Link to={`/duenos/${d.id}`} className="btn btn-sm">Ver mascotas</Link>
                      <button className="btn btn-sm btn-peligro" onClick={() => borrar(d)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  )
}
