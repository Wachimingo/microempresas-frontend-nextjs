import dynamic from 'next/dynamic';
const TopBar = dynamic(() => import('../components/TopBar'), { ssr: false });
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
const classes = require('./../styles/addDish.module.css');

export default function addDish() {
  const router = useRouter();
  const [cookie] = useCookies(['session']);
  const [isForTodayState = true, setIsForTodayState] = useState();
  const [name, setNameState] = useState();
  const [description, setDescriptionState] = useState();
  const [price, setPriceState] = useState();
  const [image, setImageState] = useState();

  const isForTodayHanlder = () => {
    setIsForTodayState(!isForTodayState);
  };

  const addItemHandler = (e) => {
    //convertir este form en un json, para convertirlo en form en el API
    e.preventDefault();
    //Using form data to be able to sent the image to node.js backend
    var formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (image !== undefined && image.filename !== '') {
      formData.append('image', image);
    }
    formData.append('forToday', isForTodayState);

    // console.log(formData);
    fetch(`/api/addDish`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `${cookie.session.token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      // .then((res) => console.log(res));
    .then((res) => router.push('/'));
  };

  return (
    <div>
      <TopBar logged={cookie.session ? true : false} />
      <br />
      <div className={'container ' + classes.formBody}>
        <form onSubmit={addItemHandler}>
          <div className="input-group">
            <span
              className={'input-group-text ' + classes.labelsText}
              style={{ width: '6vw' }}
            >
              Nombre
            </span>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setNameState(e.target.value)}
            />
          </div>
          <br />
          <div className="input-group">
            <span
              className={'input-group-text ' + classes.labelsText}
              style={{ width: '6vw' }}
            >
              Descripcion
            </span>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setDescriptionState(e.target.value)}
            />
          </div>
          <br />
          <div className="input-group">
            <span
              className={'input-group-text ' + classes.labelsText}
              style={{ width: '6vw' }}
            >
              Precio
            </span>
            <input
              type="number"
              className="form-control"
              step="0.01"
              onChange={(e) => setPriceState(e.target.value)}
            />
            {/* Foto upload */}
            <span className="input-group-text">Foto</span>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImageState(e.target.files[0])}
            />
          </div>
          <br />
          <div className="input-group">
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio1"
              onClick={(e) => isForTodayHanlder()}
            />
            <label className="btn btn-outline-primary" htmlFor="btnradio1">
              ¿Es para hoy?
            </label>
            <label className="btn btn-outline-primary">
              {isForTodayState ? 'Si' : 'No'}
            </label>
          </div>
          <br />
          <div className="input-group">
            <input
              type="submit"
              className="btn btn-outline-primary form-control"
            />
            <Link href="/" passHref>
              <button
                type="button"
                className="btn btn-outline-primary form-control"
              >
                Cancelar
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
