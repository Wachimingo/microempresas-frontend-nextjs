import { ToastContainer, toast } from 'react-toastify';
import Image from 'next/image';
import 'react-toastify/dist/ReactToastify.css';
const classes = require('./../styles/menu.module.css');

import {
  BsFillTrashFill,
  BsChevronCompactUp,
  BsChevronCompactDown,
  BsGearFill,
} from 'react-icons/bs';

export default function Cards(props) {
  const notify = (text) => toast(text);

  const deleteDish = (id, i, fileName) => {
    fetch(`/api/deleteDish`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Authorization: `${props.session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        fileName,
      }),
    });
    document.getElementById(i).className = 'd-none';
    // location.reload();
    notify('Se ha borrado el platillo');
  };

  const setDishForToday = (id, forToday) => {
    fetch(`/api/setDishForToday`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        Authorization: `${props.session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        forToday,
      }),
    })
      .then((res) => res.json())
      .then(() => location.reload());
    notify('Platillo selecionado para hoy!');
  };

  const cardButtons = (id, i, fileName) => (
    <div key={i}>
      {/* Button to Delete Card */}
      <button
        type="button"
        className={'btn btn-danger'}
        onClick={(e) => deleteDish(id, i, fileName)}
      >
        <BsFillTrashFill />
      </button>
      {/* Button to set Dish for today */}
      <button
        type="button"
        className={'btn btn-success'}
        onClick={(e) => setDishForToday(id, true)}
      >
        <BsChevronCompactUp />
      </button>
      {/* Button to remove Dish for today */}
      <button
        type="button"
        className={'btn btn-primary'}
        onClick={(e) => setDishForToday(id, false)}
      >
        <BsChevronCompactDown />
      </button>
      <button type="button" className={'btn btn-warning'}>
        <BsGearFill />
      </button>
    </div>
  );

  return (
    <div className={classes.centerCard}>
      {
        // console.log(items),
        props.items.map((el, i) => {
          let colorBorder = '';
          el.forToday
            ? (colorBorder = classes.borderActive)
            : (colorBorder = '');
          return (
            <div
              key={i}
              id={i}
              className={'card ' + colorBorder}
              style={{
                width: '18rem',
                display: 'inline-block',
                marginRight: '2vw',
              }}
            >
              {props.session !== undefined
                ? cardButtons(el.id, i, el.image)
                : null}
              <div className={classes.hoverCard}>
                <Image
                  src={'/dishes/' + el.image}
                  className="card-img-top"
                  alt="me"
                  width="1000"
                  height="1000"
                />
                <div className="card-body">
                  <h5 className="card-title">{el.name}</h5>
                  <p className="card-text">{el.description}</p>
                </div>
              </div>
            </div>
          );
        })
      }
      <div>
        <ToastContainer />
      </div>
    </div>
  )
}
