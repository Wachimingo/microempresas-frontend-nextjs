import { useState } from 'react';
import { useContext } from 'react';
import Link from 'next/link';
import AuthContext from '../context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const classes = require('./../styles/login.module.css');

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [hasAgreed, setHasAgreed] = useState(false)
  const { setSession } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/signing', {
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
      if (router.query.page) {
        router.push(`${router.query.page}`);
      } else {
        router.push('/');
      }
    } else {
      toast.error('Error!');
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
            <label htmlFor="password">Confirmar password</label>
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter password"
            />
          </div>
          <br />
          <div className="form-group">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
                onChange={(e)=>setHasAgreed(!hasAgreed)}
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                <Link href="/agreement" passHref>
                  <a>Acepto los terminos y condiciones</a>
                </Link>
              </label>
            </div>
          </div>
          <br />
          {
              hasAgreed ? <button type="submit" className="btn btn-primary btn-block">
              Submit
            </button> : <button type="submit" className="btn btn-primary btn-block" disabled>
            Submit
          </button>
          }
        </form>
      </div>
      <div>
        <ToastContainer />
      </div>
    </div>
  );
}
