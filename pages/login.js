import { useState, useContext } from 'react';
import AuthContext from '../context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const classes = require('./../styles/login.module.css');

export default function login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
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
      );
  };

  const cookieSettup = (res) => {
    if (res.data.user !== undefined) {
      setSession(res.data.user);
      if(router.query.page){
        router.push(`${router.query.page}`);  
      }else{
      router.push('/');
    }
    } else {
      toast.error(res.data.message);
    }
  };

  const goToSigning = () => {
    if(router.query.page !== undefined){
    router.push({
      pathname: '/signing',
      query: `${router.query.page}`
    })}else {
      router.push('/signing')
    }
  }

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
            Ingresar
          </button>
          <button type="button" className={"btn btn-info btn-block " + classes.moveRight } onClick={(e)=>goToSigning()}>
            Registrarse
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
