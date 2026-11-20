import { Link, Route, Routes } from 'react-router-dom'
import DuenosPage from './pages/DuenosPage.jsx'
import MascotasPage from './pages/MascotasPage.jsx'
import CitasPage from './pages/CitasPage.jsx'

export default function App() {
  return (
    <>
      <header className="topbar">
        <Link to="/" className="logo">🐾 PetCare</Link>
        <span className="subtitulo">Clínica Veterinaria</span>
      </header>
      <main className="contenedor">
        <Routes>
          <Route path="/" element={<DuenosPage />} />
          <Route path="/duenos/:id" element={<MascotasPage />} />
          <Route path="/mascotas/:id" element={<CitasPage />} />
          <Route path="*" element={<p>Página no encontrada. <Link to="/">Volver</Link></p>} />
        </Routes>
      </main>
    </>
  )
}
