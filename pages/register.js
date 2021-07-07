import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
const classes = require('./../styles/login.module.css');

export default function register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [cookie, setCookie] = useCookies(['session']);

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/register', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        passwordConfirm,
      }),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then((res) => cookieSettup(res));
    router.push('/');
  };

  const cookieSettup = (res) => {
    if (res.data.data !== undefined) {
      setCookie('session', JSON.stringify(res.data.data.data), {
        path: '/',
        sameSite: true,
        // maxAge: 3600, //One our
      });
    }
  };

  return (
    <div>
      <div className={'container ' + classes.formBody}>
        <form className={''} onSubmit={handleSubmit}>
          <h3>Registrarse</h3>

          <div className="form-group">
            <label htmlFor="email">Nombre</label>
            <input
              type="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Enter name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Confirme su Password</label>
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="form-control"
              placeholder="Enter password again"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
