import { useCookies } from 'react-cookie';
import { BsFillTrashFill, BsCheck } from 'react-icons/bs';
const classes = require('./../styles/menu.module.css');

export default function SellCards(props) {
  let dishIds = new Set();
  let counterDish = 0;
  let counterPrice = 0;
  const [cookie] = useCookies(['session']);
  localStorage.setItem('counterDish', 0);
  localStorage.setItem('counterPrice', 0);

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

  const processSell = () => {
    fetch(`http://localhost:3001/api/v1/bills`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${cookie.session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        totalPrice: localStorage.getItem('counterPrice'),
        totalDishes: localStorage.getItem('counterDish'),
      }),
    })
      .then((res) => res.json())
      // .then((res)=>console.log(res))
      .then((res) => addDishesToBill(res.data.data._id));
  };

  const addDishesToBill = (billId) => {
    for (let id of dishIds) {
      fetch(`http://localhost:3001/api/v1/bills/detailedBilling`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${cookie.session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bill: billId,
          dish: id,
          amount: document.getElementById(id).innerHTML,
          day: 'lunes',
        }),
      }).then((res) => res.json());
      // .then((res) => console.log(res));
    }
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
      <div className="container">
        <div className="row">
          <div className="col-2" style={{ display: 'inline-block' }}>
            <h2>Platos:</h2>
          </div>
          <div className="col" style={{ display: 'inline-block' }}>
            <h2 id="totalDishes">0</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-2" style={{ display: 'inline-block' }}>
            <h2>Total: $</h2>
          </div>
          <div className="col" style={{ display: 'inline-block' }}>
            <h2 id="totalPrice">0</h2>
          </div>
        </div>
      </div>
      <br />
      <button
        type="button"
        className={'btn btn-success '}
        style={{ marginTop: '2%' }}
        onClick={(e) => processSell(e)}
      >
        <BsCheck /> Procesar venta
      </button>
      <br />
    </div>
  );
}
