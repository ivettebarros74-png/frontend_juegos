export const SobreNosotros = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-lg md:text-xl">
            Transformando la educación matemática a través del juego
          </p>
        </div>
      </div>

      {/* Misión y Visión */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-lg">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Nuestra Misión</h2>
              <p className="text-gray-700 leading-relaxed">
                Hacer que el aprendizaje de las matemáticas sea accesible, divertido y efectivo 
                para estudiantes de todas las edades. Creemos que cada persona puede dominar las 
                matemáticas cuando se le presenta de la manera correcta.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 shadow-lg">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Nuestra Visión</h2>
              <p className="text-gray-700 leading-relaxed">
                Convertirnos en la plataforma líder de educación matemática interactiva, 
                ayudando a millones de estudiantes a desarrollar confianza y habilidades 
                matemáticas que los acompañarán toda la vida.
              </p>
            </div>
          </div>

          {/* Historia */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Nuestra Historia
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  <span className="text-5xl float-left mr-4 text-indigo-600">📖</span>
                  Math Games nació de una simple observación: muchos estudiantes encuentran 
                  las matemáticas intimidantes y aburridas. Queríamos cambiar eso.
                </p>
                <p>
                  En 2024, un equipo de educadores y desarrolladores se unió con un objetivo común: 
                  crear una plataforma donde las matemáticas fueran emocionantes, accesibles y, 
                  sobre todo, divertidas.
                </p>
                <p>
                  Comenzamos con un juego simple de suma y resta. La respuesta de los estudiantes 
                  fue increíble. Nos motivó a expandir nuestra colección, añadiendo multiplicación, 
                  división, ecuaciones algebraicas y geometría.
                </p>
                <p>
                  Hoy, miles de estudiantes utilizan nuestra plataforma cada día, mejorando sus 
                  habilidades matemáticas mientras se divierten. Y apenas estamos comenzando.
                </p>
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Nuestros Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Educación</h3>
                <p className="text-gray-600 text-sm">
                  Comprometidos con el aprendizaje de calidad
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
                <div className="text-4xl mb-3">🎮</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Diversión</h3>
                <p className="text-gray-600 text-sm">
                  Aprender debe ser emocionante
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
                <div className="text-4xl mb-3">🌟</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Innovación</h3>
                <p className="text-gray-600 text-sm">
                  Siempre buscamos mejorar
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Accesibilidad</h3>
                <p className="text-gray-600 text-sm">
                  Gratis para todos, siempre
                </p>
              </div>
            </div>
          </div>

          {/* Por qué funciona */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              ¿Por Qué Funciona?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-xl mb-3 text-gray-800 flex items-center">
                  <span className="text-3xl mr-3">🧠</span>
                  Aprendizaje Activo
                </h3>
                <p className="text-gray-700">
                  Los estudiantes aprenden mejor haciendo. Nuestros juegos requieren participación 
                  activa, no solo observación pasiva.
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-xl mb-3 text-gray-800 flex items-center">
                  <span className="text-3xl mr-3">🔄</span>
                  Repetición Espaciada
                </h3>
                <p className="text-gray-700">
                  La práctica constante con dificultad progresiva ayuda a consolidar el conocimiento 
                  en la memoria a largo plazo.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-xl mb-3 text-gray-800 flex items-center">
                  <span className="text-3xl mr-3">🎯</span>
                  Feedback Inmediato
                </h3>
                <p className="text-gray-700">
                  Los estudiantes saben al instante si acertaron, permitiéndoles corregir 
                  errores y reforzar aciertos.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-xl mb-3 text-gray-800 flex items-center">
                  <span className="text-3xl mr-3">🏆</span>
                  Motivación Intrínseca
                </h3>
                <p className="text-gray-700">
                  Los puntos, niveles y logros crean un sistema de recompensas que motiva 
                  a seguir aprendiendo.
                </p>
              </div>
            </div>
          </div>

          {/* Equipo */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Nuestro Equipo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  ED
                </div>
                <h3 className="font-bold text-lg text-gray-800">Educadores</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Profesores con años de experiencia en enseñanza matemática
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  DV
                </div>
                <h3 className="font-bold text-lg text-gray-800">Desarrolladores</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Expertos en tecnología creando experiencias interactivas
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  DS
                </div>
                <h3 className="font-bold text-lg text-gray-800">Diseñadores</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Creativos que hacen que aprender sea visualmente atractivo
                </p>
              </div>
            </div>
          </div>

          {/* Impacto */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Nuestro Impacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-bold mb-2">1000+</div>
                <div className="text-lg">Estudiantes Activos</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">50K+</div>
                <div className="text-lg">Problemas Resueltos</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">95%</div>
                <div className="text-lg">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}