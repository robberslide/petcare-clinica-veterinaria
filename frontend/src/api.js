import axios from 'axios'

// URL del backend Spring Boot
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// Saca un mensaje legible de los errores que devuelve el backend
export function mensajeError(err) {
  const data = err.response?.data
  if (!err.response) return 'No se pudo conectar con el backend. ¿Está corriendo en el puerto 8080?'
  if (data?.detalle) return Object.values(data.detalle).join(' · ')
  return data?.error || 'Ocurrió un error inesperado'
}

// ---- Dueños ----
export const getDuenos = () => api.get('/duenos').then(r => r.data)
export const getDueno = id => api.get(`/duenos/${id}`).then(r => r.data)
export const crearDueno = d => api.post('/duenos', d).then(r => r.data)
export const eliminarDueno = id => api.delete(`/duenos/${id}`)
export const getMascotasDeDueno = id => api.get(`/duenos/${id}/mascotas`).then(r => r.data)

// ---- Mascotas ----
export const getMascota = id => api.get(`/mascotas/${id}`).then(r => r.data)
export const crearMascota = m => api.post('/mascotas', m).then(r => r.data)
export const eliminarMascota = id => api.delete(`/mascotas/${id}`)
export const getCitasDeMascota = id => api.get(`/mascotas/${id}/citas`).then(r => r.data)

// ---- Citas ----
export const crearCita = c => api.post('/citas', c).then(r => r.data)
export const eliminarCita = id => api.delete(`/citas/${id}`)

export default api
