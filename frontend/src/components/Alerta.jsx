export default function Alerta({ tipo = 'error', children, onClose }) {
  if (!children) return null
  return (
    <div className={`alerta alerta-${tipo}`}>
      <span>{children}</span>
      {onClose && <button className="cerrar" onClick={onClose}>×</button>}
    </div>
  )
}
