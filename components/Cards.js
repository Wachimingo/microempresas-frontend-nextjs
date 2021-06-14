const classes = require('./../styles/menu.module.css');
import {
  BsFillTrashFill,
  BsChevronCompactUp,
  BsChevronCompactDown,
  BsGearFill,
} from 'react-icons/bs';

export default function Cards(props) {
  const deleteDish = (id, i) => {
    fetch(`http://localhost:3001/api/v1/menu/${id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${cookie.session.token}`,
      },
    });
    // location.reload();
    document.getElementById(i).className = 'd-none';
  };

  const setDishForToday = (id, forToday) => {
    console.log(forToday);
    fetch(`http://localhost:3001/api/v1/menu/${id}`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${cookie.session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        forToday,
      }),
    }).then((res) => res.json());
    //   .then((res) => console.log(res));
    location.reload();
  };

  const sellDish = dishId => {
    console.log('vendido')
  }

  const cardButtons = (id, i) => (
    <div key={i}>
      {/* Button to Delete Card */}
      <button
        type="button"
        className={'btn btn-danger'}
        onClick={(e) => deleteDish(id, i)}
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
              {props.session !== undefined ? cardButtons(el.id, i) : null}
              <div onClick={(e) => sellDish(el.id)} className={classes.hoverCard}>
                <img
                  src={'http://localhost:3001/img/dishes/' + el.image}
                  className="card-img-top"
                  alt="..."
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
    </div>
  );
}
