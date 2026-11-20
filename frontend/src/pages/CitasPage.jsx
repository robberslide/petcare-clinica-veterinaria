import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { crearCita, eliminarCita, getCitasDeMascota, getMascota, mensajeError } from '../api'
import Alerta from '../components/Alerta'

const VACIO = { fecha: '', motivo: '', diagnostico: '', costo: '' }
const clp = n => '$' + Number(n).toLocaleString('es-CL')
const formatoFecha = f => new Date(f).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' })

export default function CitasPage() {
  const { id } = useParams()
  const [mascota, setMascota] = useState(null)
  const [citas, setCitas] = useState([])
  const [form, setForm] = useState(VACIO)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const cargar = () => {
    getMascota(id).then(setMascota).catch(e => setError(mensajeError(e)))
    getCitasDeMascota(id).then(setCitas).catch(e => setError(mensajeError(e)))
  }

  useEffect(cargar, [id])

  const cambiar = e => setForm({ ...form, [e.target.name]: e.target.value })

  const guardar = async e => {
    e.preventDefault()
    setError(''); setOk('')
    try {
      await crearCita({
        ...form,
        fecha: form.fecha.length === 16 ? form.fecha + ':00' : form.fecha, // datetime-local -> yyyy-MM-ddTHH:mm:ss
        costo: Number(form.costo),
        mascotaId: Number(id),
      })
      setForm(VACIO)
      setOk('Cita registrada correctamente')
      cargar()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  const borrar = async c => {
    if (!window.confirm('¿Eliminar esta cita?')) return
    try { await eliminarCita(c.id); cargar() } catch (err) { setError(mensajeError(err)) }
  }

  const total = citas.reduce((s, c) => s + (c.costo || 0), 0)

  return (
    <>
      {mascota && <Link to={`/duenos/${mascota.dueno.id}`} className="volver">← Volver a mascotas de {mascota.dueno.nombre}</Link>}
      <h1>Citas de {mascota ? mascota.nombre : '...'}</h1>
      {mascota && <p className="muted">{mascota.especie}{mascota.raza ? ` · ${mascota.raza}` : ''}</p>}
      <Alerta onClose={() => setError('')}>{error}</Alerta>
      <Alerta tipo="ok" onClose={() => setOk('')}>{ok}</Alerta>

      <div className="grid">
        <section className="card">
          <h2>Registrar cita</h2>
          <form onSubmit={guardar} className="formulario">
            <label>Fecha y hora<input name="fecha" type="datetime-local" value={form.fecha} onChange={cambiar} required /></label>
            <label>Motivo<input name="motivo" value={form.motivo} onChange={cambiar} placeholder="Control, vacuna, urgencia..." required /></label>
            <label>Diagnóstico<textarea name="diagnostico" rows="3" value={form.diagnostico} onChange={cambiar} /></label>
            <label>Costo (CLP)<input name="costo" type="number" min="0" value={form.costo} onChange={cambiar} required /></label>
            <button className="btn">Registrar cita</button>
          </form>
        </section>

        <section className="card">
          <h2>Historial {citas.length > 0 && <span className="muted">· total {clp(total)}</span>}</h2>
          {citas.length === 0 ? <p className="muted">Sin citas registradas.</p> : (
            <ul className="historial">
              {citas.map(c => (
                <li key={c.id}>
                  <div>
                    <strong>{c.motivo}</strong>
                    <span className="muted"> · {formatoFecha(c.fecha)}</span>
                    {c.diagnostico && <p>{c.diagnostico}</p>}
                  </div>
                  <div className="derecha">
                    <span className="costo">{clp(c.costo)}</span>
                    <button className="btn btn-sm btn-peligro" onClick={() => borrar(c)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
