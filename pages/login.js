import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import dynamic from 'next/dynamic';
// import TopBar from '../components/TopBar';
const classes = require('./../styles/login.module.css');

const TopBar = dynamic(() => import('../components/TopBar'), { ssr: false });

export default function SignIn() {
  const [email, setEmail] = useState('a@b.com');
  const [password, setPassword] = useState('pass123456');
  const [cookie, setCookie] = useCookies(['session']);

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
      <TopBar />
      <br />
      <div className={'container ' + classes.formBody}>
        <form className={''} onSubmit={handleSubmit}>
          <h3>Sign In</h3>

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
    </div>
  );
}
