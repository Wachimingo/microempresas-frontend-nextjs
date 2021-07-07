import { useState } from 'react';
import { useContext } from 'react';
import AuthContext from '../context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const classes = require('./../styles/login.module.css');

export default function SignIn() {
  const [email, setEmail] = useState('a@b.com');
  const [password, setPassword] = useState('pass123456');
  const { setSession } = useContext(AuthContext);

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then(
        (res) => cookieSettup(res),
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  };

  const cookieSettup = (res) => {
    if (res.data.data !== undefined) {
      setSession(res.data.data.data);
      router.push('/');
    } else {
      toast.error('Correo o Contraseña equivocada!');
    }
  };

  return (
    <div>
      <div className={'container ' + classes.formBody}>
        <form className={''} onSubmit={handleSubmit}>
          <h3>Ingresar</h3>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
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
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Submit
          </button>
          <p className="forgot-password text-right">
            Forgot <a href="#">password?</a>
          </p>
        </form>
      </div>
      <div>
        <ToastContainer />
      </div>
    </div>
  );
}
