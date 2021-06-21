import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import Link from 'next/link';
const classes = require('./../styles/topbar.module.css');

export default function TopBar(props) {
  const router = useRouter();
  const [cookie, setCookie, removeCookie] = useCookies(['session']);

  const loggoutHandlder = (e) => {
    e.preventDefault();
    removeCookie('session');
    router.replace('/');
  };

  if (props.logged) {
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
                <Link href="/dashboard" passHref>
                  <a className="nav-link">DashBoard</a>
                </Link>
              </li>
              <li>
                <Link href="/" passHref>
                  <a className="nav-link">Menu</a>
                </Link>
              </li>
              <li>
                <Link href="/sell" passHref>
                  <a className="nav-link">Vender</a>
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
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link href="/sellHistory/grupal" passHref>
                      <a className="dropdown-item">Listado grupal</a>
                    </Link>
                  </li>
                  <Link href="/sellHistory/individual" passHref>
                    <a className="dropdown-item">Listado individual</a>
                  </Link>
                </ul>
              </li>
            </ul>
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
            <Link href="/" passHref>
              <a className="nav-link" onClick={(e) => loggoutHandlder(e)}>
                Logout
              </a>
            </Link>
          </div>
        </div>
      </nav>
    );
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
            </ul>
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
            <Link href="/login" passHref>
              <a className="nav-link">Login</a>
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}
