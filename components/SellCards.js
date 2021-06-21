import Image from 'next/image';
import { BsFillTrashFill, BsCheck, BsFlagFill } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const classes = require('./../styles/menu.module.css');

export default function SellCards(props) {
  let dishIds = new Set();
  let counterDish = 0;
  let counterPrice = 0;
  let Today_date = new Date();
  let day = Today_date.getDay();
  const week = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ];
  localStorage.setItem('counterDish', 0);
  localStorage.setItem('counterPrice', 0);

  const notify = (text) => toast(text);

  const upCounter = (id, price) => {
    dishIds.add(id);
    counterDish = counterDish * 1 + 1;
    counterPrice = counterPrice * 1 + price;
    // Up the number in the label of total amount in a single dish
    document.getElementById(id).innerHTML =
      document.getElementById(id).innerHTML * 1 + 1;
    // Up the number in the label of total dishes
    document.getElementById('totalDishes').innerHTML =
      document.getElementById('totalDishes').innerHTML * 1 + 1;
    // Up the number in the label of total price
    document.getElementById('totalPrice').innerHTML =
      document.getElementById('totalPrice').innerHTML * 1 + price;
    // Set the number in localStorage so the fetch function to create the bill can work properly, if other method is used it will only call the first fetch
    localStorage.setItem('counterDish', counterDish);
    localStorage.setItem('counterPrice', counterPrice);
    // console.log(localStorage.getItem('counterDish'), localStorage.getItem('counterPrice'))
  };
  const lowerCounter = (id, price) => {
    //Validating the amount to avoid going to negative numbers
    if (document.getElementById(id).innerHTML > 0) {
      // lower the number in the label of total amount in a single dish
      document.getElementById(id).innerHTML =
        document.getElementById(id).innerHTML * 1 - 1;
      // lower the number in the label of total dishes
      document.getElementById('totalDishes').innerHTML =
        document.getElementById('totalDishes').innerHTML * 1 - 1;
      // lower the number in the label of total price
      document.getElementById('totalPrice').innerHTML =
        document.getElementById('totalPrice').innerHTML * 1 - price;
      counterDish = counterDish * 1 - 1;
      counterPrice = counterPrice * 1 - price;
      localStorage.setItem('counterDish', counterDish);
      localStorage.setItem('counterPrice', counterPrice);
      // console.log(localStorage.getItem('counterDish'), localStorage.getItem('counterPrice'))
    } else {
      dishIds.delete(id);
      document.getElementById(id).innerHTML = 0;
      localStorage.setItem('counterDish', 0);
      localStorage.setItem('counterPrice', 0);
    }
  };

  const processSell = (fiado) => {
    if (localStorage.getItem('counterDish') * 1 > 0) {
      fetch(`/api/processSell`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${props.session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalPrice: localStorage.getItem('counterPrice'),
          totalDishes: localStorage.getItem('counterDish'),
          day: week[day],
          isFiado: fiado,
        }),
      })
        .then((res) => res.json())
        // .then((res)=>console.log(res))
        .then((res) => addDishesToBill(res.data.result.data.data._id));
    }
  };

  const addDishesToBill = (billId) => {
    for (let id of dishIds) {
      fetch(`/api/addDishesToBill`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${props.session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bill: billId,
          dish: id,
          amount: document.getElementById(id).innerHTML,
          day: week[day],
        }),
      }).then((res) => res.json());
      // .then((res) => console.log(res));
    }
    // notify('Factura creada!');
    location.reload();
  };

  return (
    <div className={classes.centerSellCard}>
      {
        // console.log(items),
        props.items.map((el, i) => {
          return (
            <div
              key={i}
              id={i}
              className={'card '}
              style={{
                width: '18rem',
                display: 'inline-block',
                marginRight: '2vw',
              }}
            >
              <h2 id={el.id}>0</h2>
              <div
                onClick={(e) => upCounter(el.id, el.price)}
                className={classes.hoverCard}
              >
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
              <button
                type="button"
                onClick={(e) => lowerCounter(el.id, el.price)}
                className={'btn btn-danger'}
              >
                <BsFillTrashFill /> Remover
              </button>
            </div>
          );
        })
      }
      {/* Section to see purchase details */}
      <div className={classes.billInfo}>
        <h2 style={{marginRight: '10px'}}>Platos:</h2>
        <h2 id="totalDishes" style={{ marginRight: '2vw' }}>
          0
        </h2>
      </div>
      <div className={classes.billInfo}>
        <h2>Total: $</h2>
        <h2 id="totalPrice">0</h2>
      </div>
      <br />
      <button
        type="button"
        className={'btn btn-success '}
        
        onClick={(e) => processSell(false)}
      >
        <BsCheck /> Procesar venta
      </button>
      {/* Fiado is to lend this dish to the client with the promise to pay afterward */}
      <button
        type="button"
        className={'btn btn-danger ' + classes.fiado}
        
        onClick={(e) => processSell(true)}
      >
        <BsFlagFill /> Fiar
      </button>
      <br />
      <div>
        <ToastContainer />
      </div>
    </div>
  );
}
