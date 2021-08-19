import Image from 'next/image';
import { BsFillTrashFill, BsCheck, BsFlagFill } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect, useContext, memo } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '../context/authContext';
import 'react-toastify/dist/ReactToastify.css';
const classes = require('./../styles/menu.module.css');
import SearchBar from './NavigationItems/SearchBar';
// import dynamic from 'next/dynamic';
// const Mic = dynamic(() => import('../components/Mic'), {
//   ssr: false,
// });

export default memo(function SellCards(props) {
  const router = useRouter();
  let [filterObject, setFilterObject] = useState(
    JSON.parse(JSON.stringify(props.items))
  );

  const { session } = useContext(AuthContext);
  const [loaded, setLoaded] = useState(false);
  const [customerName, setCustomerName] = useState('');
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
    if (session !== null) {
      // setLoaded(true);
      setCustomerName(session.name)
    } else {
      // setLoaded(false)
    }

    props.items.map((el) => {
      window['counter_' + el.id] = 0;
      window['name_' + el.id] = el.name;
      window['price_' + el.id] = el.price;
    });
  }, []);

  const setNewFilteredObject = (obj) => {
    setFilterObject(obj);
  };

  const setNewItems = (res) => {
    setFilterObject(res.data.doc);
  };

  const upCounter = (id, price) => {
    dishes.push(id);
    window['counter_' + id] = window['counter_' + id] * 1 + 1;
    document.getElementById(`counter_${id}`).innerHTML =
      document.getElementById(`counter_${id}`).innerHTML * 1 + 1;
    setCounterDish(counterDish * 1 + 1);
    setCounterPrice(counterPrice * 1 + price);
  };

  const lowerCounter = (id, price) => {
    //Validating the amount to avoid going to negative numbers
    if (window['counter_' + id] * 1 > 0) {
      // lower the number in the label of total amount in a single dish
      window['counter_' + id] = window['counter_' + id] * 1 - 1;
      document.getElementById(`counter_${id}`).innerHTML =
        window['counter_' + id] * 1;
      setCounterDish(counterDish * 1 - 1);
      setCounterPrice(counterPrice * 1 - price);
    }
  };

  //TODO: remove the loop, and just add the total amount of the dish instead

  const addDishesToBill = (billId) => {
    for (let id of dishes) {
      fetch(`/api/addDishesToBill`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bill: billId,
          dish: id,
          name: window['name_' + id],
          price: window['price_' + id],
          amount: document.getElementById(`counter_${id}`).innerHTML,
          day: week[day],
        }),
      }).then((res) => res.json());
      // .then((res) => console.log(res));
      document.getElementById(`counter_${id}`).innerHTML = 0;
      // // lower the number in the label of total dishes
      document.getElementById('totalDishes').innerHTML = 0;
      // lower the number in the label of total price
      document.getElementById('totalPrice').innerHTML = 0;
    }
  };

  const checkIfLogin = (fiado, token, msg) => {
    if (session === null) {
      router.push({
        pathname: '/login',
        query: { page: '/menu/sell' },
      });
    } else {
      if (session.role === 'admin') {
        processSell(fiado, msg, 'Completed');
      } else {
        processSell(fiado, msg, 'Pending');
      }
    }
  };

  const processSell = (fiado, msg, stat) => {
    // console.log(session)
    if (counterPrice < 0 && counterDish < 1) {
      toast.error('No ha seleccionado platos para facturar');
    } else {
      if (fiado && (customerName === null || customerName === '')) {
        toast.error(
          'No ha ingresado el nombre del cliente a quien le fiara el plato'
        );
      } else {
        fetch(`/api/processSell`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${session.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            totalPrice: counterPrice,
            totalDishes: counterDish,
            day: week[day],
            isFiado: fiado,
            customer: customerName,
            status: stat,
          }),
        })
          .then((res) => res.json())
          // .then((res)=>console.log(res))
          .then((res) => billCreationValidation(res, msg))
          .then(
            (counterDish = 0),
            (counterPrice = 0),
            setCounterDish(0),
            setCounterPrice(0)
          );
      }
    }
  };

  const billCreationValidation = (res, msg, token) => {
    if (res.data.record !== undefined) {
      toast.success(msg);
      // console.log(res)
      addDishesToBill(res.data.record._id, token);
    } else {
      // console.log(res);
      toast.error(res.data.message);
    }
  };

  // const re = new RegExp(`\\b(un|una|[1-9]) (sopa|sopas)`, 'g');

  // const commands = [{
  //   command: re,
  //   callback: () => document.querySelectorAll(`[id^=counter_`)[0].innerHTML = document.querySelectorAll(`[id^=counter_`)[0].innerHTML*1 +1
  // },]

  // if (!loaded) {
  //   return <>cargando...</>;
  // } else {
    return (
      <>
        {/* <Mic commands={commands}/> */}
        <SearchBar updateFilter={setNewFilteredObject} items={props.items} />
        {/* Customer name input */}
        <label htmlFor="customer" className="form-label">
          <h2>Nombre del cliente</h2>
        </label>
        <input
          type="customer"
          className={'form-control ' + classes.customerName}
          id="customer"
          value={session !== null ? '' : customerName}
          aria-describedby="customerHelp"
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <div className={classes.centerSellCard}>
          {
            // console.log(items),
            filterObject.map((el, i) => {
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
                      src={
                        el.image !== undefined
                          ? `/dishes/${el.image}`
                          : `/dishes/stockDishImg.png`
                      }
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
              checkIfLogin(false, 'Factura creada!')
            }
          >
            <BsCheck /> {session !== null ? 'Procesar venta' : 'Realizar pedido'}
          </button>
          {/* Fiado is to lend this dish to the client with the promise to pay afterward */}
          <button
            type="button"
            className={session !== null ? `btn btn-danger ${classes.fiado}` : 'd-none'}
            onClick={(e) =>
              checkIfLogin(true, session.token, 'Factura creada!')
            }
          >
            <BsFlagFill /> Fiar
          </button>
          <br />
          <div>
            <ToastContainer />
          </div>
          <br />
        </div>
      </>
    );
  // }
});
