
export const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-bold">
          <a href="/inicio" className="hover:text-gray-200">Mi Sitio Web</a>
        </div>
        <ul className="flex space-x-6">
          <li>
            <a href="/inicio" className="hover:text-gray-200">Inicio</a>
          </li>
          <li>
            <a href="/contacto" className="hover:text-gray-200">Contacto</a>
          </li>
          <li>
            <a href="/sobre-nosotros" className="hover:text-gray-200">Sobre Nosotros</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};