import { useState } from 'react'

export const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setError('')

    // Validaciones
    if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
      setError('Por favor completa todos los campos')
      setEnviando(false)
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido')
      setEnviando(false)
      return
    }

    // Simular envío (aquí conectarías con tu backend)
    setTimeout(() => {
      setEnviando(false)
      setEnviado(true)
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
      })

      // Resetear mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setEnviado(false)
      }, 5000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contáctanos
          </h1>
          <p className="text-lg md:text-xl">
            ¿Tienes preguntas, sugerencias o necesitas ayuda? Estamos aquí para ti
          </p>
        </div>
      </div>

      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información de Contacto */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Información de Contacto
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md">
                  <div className="text-3xl">📧</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Email</h3>
                    <p className="text-gray-600">contacto@mathgames.com</p>
                    <p className="text-gray-600">soporte@mathgames.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md">
                  <div className="text-3xl">📱</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Teléfono</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Lunes a Viernes: 9:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md">
                  <div className="text-3xl">🌍</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Redes Sociales</h3>
                    <div className="flex gap-3 mt-2">
                      <a href="#" className="text-blue-600 hover:text-blue-700 text-2xl">📘</a>
                      <a href="#" className="text-blue-400 hover:text-blue-500 text-2xl">🐦</a>
                      <a href="#" className="text-pink-600 hover:text-pink-700 text-2xl">📷</a>
                      <a href="#" className="text-red-600 hover:text-red-700 text-2xl">▶️</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Rápido */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-xl mb-4 text-gray-800">Preguntas Frecuentes</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">¿Los juegos son gratis?</p>
                    <p className="text-gray-600">Sí, todos nuestros juegos son 100% gratuitos.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">¿Necesito crear una cuenta?</p>
                    <p className="text-gray-600">No, puedes jugar sin registrarte.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">¿Para qué edades son los juegos?</p>
                    <p className="text-gray-600">Nuestros juegos son aptos para todas las edades.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Envíanos un Mensaje
                </h2>

                {enviado && (
                  <div className="bg-green-50 border-2 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <p className="font-semibold">¡Mensaje enviado exitosamente! Te responderemos pronto.</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                    <span className="text-2xl">❌</span>
                    <p className="font-semibold">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Asunto *
                    </label>
                    <select
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="soporte">Soporte Técnico</option>
                      <option value="sugerencia">Sugerencia</option>
                      <option value="error">Reportar Error</option>
                      <option value="colaboracion">Colaboración</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Escribe tu mensaje aquí..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={enviando}
                    className={`w-full font-bold py-3 rounded-lg transition transform hover:scale-105 ${
                      enviando
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {enviando ? 'Enviando...' : 'Enviar Mensaje 📧'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}