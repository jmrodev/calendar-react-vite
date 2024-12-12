import { Login } from "./login"

export const Header = () => {

    return (
        <header>
            <h1>Calendario de citas</h1>
            <nav>
                <ul>
                    <li><a href="/">Inicio</a></li>
                    <li><a href="/login">Iniciar sesión</a></li>
                </ul>
            </nav>
        </header>
    )
}