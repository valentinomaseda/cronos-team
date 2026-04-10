import { useEffect, useState } from 'react'

export default function Confetti({ active, onComplete }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!active) return

    // Generar partículas de confetti
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 0.5,
      backgroundColor: ['#00BFFF', '#00FF88', '#FFD700', '#FF1493', '#9D4EDD'][Math.floor(Math.random() * 5)],
      rotation: Math.random() * 360
    }))

    setParticles(newParticles)

    // Limpiar después de la animación
    const timer = setTimeout(() => {
      setParticles([])
      if (onComplete) onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [active, onComplete])

  if (!active || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${particle.left}%`,
            top: '-10%',
            backgroundColor: particle.backgroundColor,
            animationDelay: `${particle.animationDelay}s`,
            transform: `rotate(${particle.rotation}deg)`
          }}
        />
      ))}
    </div>
  )
}
