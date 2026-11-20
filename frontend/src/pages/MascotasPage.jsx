import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { crearMascota, eliminarMascota, getDueno, getMascotasDeDueno, mensajeError } from '../api'
import Alerta from '../components/Alerta'

const VACIO = { nombre: '', especie: 'Perro', raza: '', fechaNacimiento: '' }
const ICONOS = { perro: '🐶', gato: '🐱', ave: '🐦', conejo: '🐰', hamster: '🐹' }

export default function MascotasPage() {
  const { id } = useParams()
  const [dueno, setDueno] = useState(null)
  const [mascotas, setMascotas] = useState([])
  const [form, setForm] = useState(VACIO)
  const [error, setError] = useState('')

  const cargar = () => {
    getDueno(id).then(setDueno).catch(e => setError(mensajeError(e)))
    getMascotasDeDueno(id).then(setMascotas).catch(e => setError(mensajeError(e)))
  }

  useEffect(cargar, [id])

  const cambiar = e => setForm({ ...form, [e.target.name]: e.target.value })

  const guardar = async e => {
    e.preventDefault()
    setError('')
    try {
      await crearMascota({ ...form, fechaNacimiento: form.fechaNacimiento || null, duenoId: Number(id) })
      setForm(VACIO)
      cargar()
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  const borrar = async m => {
    if (!window.confirm(`¿Eliminar a ${m.nombre} y sus citas?`)) return
    try { await eliminarMascota(m.id); cargar() } catch (err) { setError(mensajeError(err)) }
  }

  return (
    <>
      <Link to="/" className="volver">← Volver a dueños</Link>
      <h1>Mascotas de {dueno ? dueno.nombre : '...'}</h1>
      {dueno && <p className="muted">RUT {dueno.rut} · {dueno.telefono} · {dueno.email}</p>}
      <Alerta onClose={() => setError('')}>{error}</Alerta>

      <div className="grid">
        <section className="card">
          <h2>Agregar mascota</h2>
          <form onSubmit={guardar} className="formulario">
            <label>Nombre<input name="nombre" value={form.nombre} onChange={cambiar} required /></label>
            <label>Especie
              <select name="especie" value={form.especie} onChange={cambiar}>
                <option>Perro</option><option>Gato</option><option>Ave</option>
                <option>Conejo</option><option>Hamster</option><option>Otro</option>
              </select>
            </label>
            <label>Raza<input name="raza" value={form.raza} onChange={cambiar} /></label>
            <label>Fecha de nacimiento<input name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={cambiar} /></label>
            <button className="btn">Guardar</button>
          </form>
        </section>

        <section>
          {mascotas.length === 0 ? (
            <div className="card"><p className="muted">Este dueño aún no tiene mascotas.</p></div>
          ) : (
            <div className="tarjetas">
              {mascotas.map(m => (
                <article key={m.id} className="card mascota">
                  <div className="icono">{ICONOS[m.especie?.toLowerCase()] || '🐾'}</div>
                  <h3>{m.nombre}</h3>
                  <p className="muted">{m.especie}{m.raza ? ` · ${m.raza}` : ''}</p>
                  {m.fechaNacimiento && <p className="muted">Nació el {m.fechaNacimiento}</p>}
                  <div className="acciones">
                    <Link to={`/mascotas/${m.id}`} className="btn btn-sm">Citas</Link>
                    <button className="btn btn-sm btn-peligro" onClick={() => borrar(m)}>Eliminar</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
