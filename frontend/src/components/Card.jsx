export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {children}
    </div>
  )
}
