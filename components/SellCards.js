import Image from 'next/image';
import { BsFillTrashFill, BsCheck, BsFlagFill } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
const classes = require('./../styles/menu.module.css');
import SearchBar from './NavigationItems/SearchBar';
import dynamic from 'next/dynamic';
const Mic = dynamic(() => import('../components/Mic'), {
  ssr: false,
});

export default function SellCards(props) {
  let [filterObject, setFilterObject] = useState(
    JSON.parse(JSON.stringify(props.items))
  );

  let [counterDish, setCounterDish] = useState(0);
  let [counterPrice, setCounterPrice] = useState(0);
  let [dishes] = useState([]);
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

  useEffect(() => {
    props.items.map((el) => {
      if (el.forToday) {
        window['counter_' + el.id] = 0;
        dishes.push(el.id);
        window['name_'+el.id] = el.name;
        window['price_'+el.id] = el.price;
      }
    });
  }, []);

  const setNewFilteredObject = (obj) => {
    setFilterObject(obj);
  };

  const setNewItems = (res) => {
    setFilterObject(res.data.doc);
  };

  const upCounter = (id, price) => {
    window['counter_' + id] = window['counter_' + id] * 1 + 1;
    document.getElementById(`counter_${id}`).innerHTML = window['counter_' + id]*1
    setCounterDish(counterDish * 1 + 1);
    setCounterPrice(counterPrice * 1 + price);
  };

  const lowerCounter = (id, price) => {
    //Validating the amount to avoid going to negative numbers
    if (window['counter_' + id] * 1 > 0) {
      // lower the number in the label of total amount in a single dish
      window['counter_' + id] = window['counter_' + id] * 1 - 1;
      document.getElementById(`counter_${id}`).innerHTML = window['counter_' + id]*1
      setCounterDish(counterDish * 1 - 1);
      setCounterPrice(counterPrice * 1 - price);
    }
  };

  const addDishesToBill = (billId, token) => {
    for(let i = 0; i < document.querySelectorAll(`[id^=counter_`).length; i++){
      document.querySelectorAll(`[id^=counter_`)[i].innerHTML = 0
    }
    for (let id of dishes) {
      for (let i = 0; i < window['counter_' + id] * 1; i++) {
        console.log(window['counter_' + id])
        fetch(`/api/addDishesToBill`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bill: billId,
            dish: id,
            name: window['name_'+id], 
            price: window['price_'+id],
            day: week[day],
          }),
        }).then((res) => res.json());
        // .then((res) => console.log(res));
      }      
      // // lower the number in the label of total dishes
      document.getElementById('totalDishes').innerHTML = 0;
      // lower the number in the label of total price
      document.getElementById('totalPrice').innerHTML = 0;
      
    }
  };

  const processSell = (fiado, token, msg) => {
    if (counterPrice < 0 && counterDish < 1) {
      toast.error('No ha seleccionado platos para facturar');
    } else {
      toast.success(msg);
      fetch(`/api/processSell`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalPrice: counterPrice,
          totalDishes: counterDish,
          day: week[day],
          isFiado: fiado,
        }),
      })
        .then((res) => res.json())
        // .then((res)=>console.log(res))
        .then((res) => addDishesToBill(res.data.result.data.data._id, token))
        .then(
          (counterDish = 0),
          (counterPrice = 0),
          setCounterDish(0),
          setCounterPrice(0),
        );
    }
  };

  const re = new RegExp(`\\b(un|una|[1-9]) (sopa|sopas)`, 'g')

  const commands = [{
    command: re,
    callback: () => document.querySelectorAll(`[id^=counter_`)[0].innerHTML = document.querySelectorAll(`[id^=counter_`)[0].innerHTML*1 +1
  },]

  return (
    <>
    <Mic commands={commands}/>  
      <SearchBar updateFilter={setNewFilteredObject} items={props.items} />
      <div className={classes.centerSellCard}>
        {
          // console.log(items),
          filterObject.map((el, i) => {
            if (el.forToday) {
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
                  <h2 id={`counter_${el.id}`}>0</h2>
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
                      <h5 id={el.id + ' name'} className="card-title">
                        {el.name}
                      </h5>
                      <h5 id={el.id + ' price'} className="card-text">
                        {el.price}
                      </h5>
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
            } else {
              return null;
            }
          })
        }
        {/* Section to see purchase details */}

        <div className={classes.billInfo}>
          <h2 style={{ marginRight: '10px' }}>Platos:</h2>
          <h2 id="totalDishes" style={{ marginRight: '2vw' }}>
            {counterDish}
          </h2>
        </div>
        <div className={classes.billInfo}>
          <h2>Total: $</h2>
          <h2 id="totalPrice">{counterPrice.toFixed(2)}</h2>
        </div>
        <br />
        <button
          type="button"
          className={'btn btn-success '}
          onClick={(e) =>
            processSell(false, props.session.token, 'Factura creada!')
          }
        >
          <BsCheck /> Procesar venta
        </button>
        {/* Fiado is to lend this dish to the client with the promise to pay afterward */}
        <button
          type="button"
          className={'btn btn-danger ' + classes.fiado}
          onClick={(e) =>
            processSell(true, props.session.token, 'Factura creada!')
          }
        >
          <BsFlagFill /> Fiar
        </button>
        <br />
        <div>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}
