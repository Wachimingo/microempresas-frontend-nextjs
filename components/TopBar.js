import { useRouter } from 'next/router';
import {useContext} from 'react'
import AuthContext from '../context/authContext';
import Link from 'next/link';
const classes = require('./../styles/topbar.module.css');

export default function TopBar(props) {
  const router = useRouter();
  const {session, quitSession} = useContext(AuthContext)

  if (session) {
    // console.log(session)
    if (session.user.role === 'admin') {
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link href="/" passHref>
              <a className="navbar-brand">Buen Amanecer</a>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href="/" passHref>
                  <a className="nav-link">Home</a>
                </Link>
              </li>
                <li className="nav-item">
                  <Link href="/dashboard" passHref>
                    <a className="nav-link">DashBoard</a>
                  </Link>
                </li>
                <li>
                  <Link href="/menu/sell" passHref>
                    <a className="nav-link">Vender</a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/menu/catalog" passHref>
                    <a className="nav-link">Catalogo</a>
                  </Link>
                </li>
                <li>
                  <Link href="/menu/carusel" passHref>
                    <a className="nav-link">Carusel</a>
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Historial
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link href="/sellHistory/grupal" passHref>
                        <a className="dropdown-item">Listado grupal</a>
                      </Link>
                    </li>
                    <Link href="/sellHistory/individual" passHref>
                      <a className="dropdown-item">Listado individual</a>
                    </Link>
                    <Link href="/sellHistory/individual" passHref>
                      <a className="dropdown-item">Estadisticas</a>
                    </Link>
                  </ul>
                </li>
              </ul>
              <Link href="/" passHref>
                <a className="nav-link" onClick={quitSession}>
                  Logout
                </a>
              </Link>
            </div>
          </div>
        </nav>
      );
    } else if (session.user.role === 'user') {
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link href="/" passHref>
              <a className="navbar-brand">Buen Amanecer</a>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href="/" passHref>
                  <a className="nav-link">Home</a>
                </Link>
              </li>
                <li>
                  <Link href="/menu/carusel" passHref>
                    <a className="nav-link">Platos de hoy</a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/menu/catalog" passHref>
                    <a className="nav-link">Catalogo</a>
                  </Link>
                </li>
                <li>
                  <Link href="/review" passHref>
                    <a className="nav-link">Reseñar</a>
                  </Link>
                </li>
                <li>
                  <Link href="/askForTomorrow" passHref>
                    <a className="nav-link">Solicitar un Plato para mañana</a>
                  </Link>
                </li>
              </ul>
              <Link href="/" passHref>
                <a className="nav-link" onClick={quitSession}>
                  Logout
                </a>
              </Link>
            </div>
          </div>
        </nav>
      );
    }
  } else {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link href="/" passHref>
            <a className="navbar-brand">Buen Amanecer</a>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href="/" passHref>
                  <a className="nav-link">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/menu/carusel" passHref>
                  <a className="nav-link">Platos de hoy</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/menu/catalog" passHref>
                  <a className="nav-link">Catalogo</a>
                </Link>
              </li>
            </ul>
            <Link href="/login" passHref>
              <a className="nav-link">Login</a>
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}
