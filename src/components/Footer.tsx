
export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm">
            {new Date().getFullYear()} Mi sitio web. Todos los derechos reservados.
          </div>
          <ul className="flex space-x-4 mt-4 md:mt-0">
            <li><a href="#" className="hover:text-gray-400">Politica de Privacidad</a></li>
            <li><a href="#" className="hover:text-gray-400">Terminos y condiciones</a></li>
            <li><a href="#" className="hover:text-gray-400">Contactos</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
