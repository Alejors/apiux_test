import { logout } from "../services/authService";
import { Link } from "react-router-dom";

import BookIcon from "./BookIcon";

export default function Header() {
    return (
        <header className="bg-blue-600 text-white p-4">
            <nav className="flex justify-between mt-2">
                <ul className="flex space-x-4">
                    <BookIcon className="size-6" />
                    <strong className="me-12">
                        Libros CMPC
                    </strong>
                    <li>
                        <Link to="/" className="hover:underline">Inicio</Link>
                    </li>
                    <li>
                        <Link to="/create" className="hover:underline">Crear Libro</Link>
                    </li>
                    <li>
                        <Link to="/advanced" className="hover:underline">Búsqueda Avanzada</Link>
                    </li>
                </ul>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 cursor-pointer hover:underline">
                    <Link onClick={(() => logout())}>Cerrar Sesión</Link>
                </button>
            </nav>
        </header>
    );
}
