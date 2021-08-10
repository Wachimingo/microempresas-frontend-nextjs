import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/authContext';
import Image from 'next/image';
const classes = require('./../styles/menu.module.css');

export default function pendingOrders() {
  const { session } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch('/api/getPendingOrders', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setItems(res.data.result.data.doc));
    //   .then((res) => console.log(res.data.result.data.doc))
  }, []);
  return (
    <div>
      <h1>Pedidos en linea</h1>
      {
        console.log(items),
        items.map((el, i) => {
          // console.log(el)
          return (
            <div key={i} id={i} className={`card ${classes.pendingOrderCards}`}>
              <div className={classes.hoverCard}>
                <Image
                  src={
                    `/dishes/stockDishImg.png`
                  }
                  className={`${classes.pendingOrderCardsImage}`}
                  alt="me"
                  width="100"
                  height="100"
                />
                <div className={`${classes.pendingOrderCardsBody}`}>
                  <h5 className={``}>Cliente: {el.customer}</h5>
                  <p className={``}>Total de Platos: {el.totalDishes}</p>
                  <p className={``}>Hora: {el.dayTime}</p>
                  <p className={``}>Fecha {el.day} {el.createdAt}</p>
                </div>
              </div>
            </div>
          );
        })
      }
      <br />
    </div>
  );
}
