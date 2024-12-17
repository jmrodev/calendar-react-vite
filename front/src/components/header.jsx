import { Login } from "./login";
  import { useSelector } from "react-redux";

export const Header = () => {

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userName = useSelector((state) => state.auth.userName);

  return (
    <header>
      <nav>
        <ul>
          <li>
            <a href="/">Inicio</a>
          </li>
          {isLoggedIn ? (
            <li>Bienvenido, {userName}</li>
          ) : (
            <li>
              <a href="/login">Iniciar sesión</a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
