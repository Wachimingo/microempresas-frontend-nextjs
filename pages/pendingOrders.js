import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/authContext';
import Image from 'next/image';
import { Collapse, CardBody, Card } from 'reactstrap';
const classes = require('./../styles/menu.module.css');

export default function pendingOrders() {
  const { session } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/PendingOrders', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setItems(res.data.result.data.doc), setLoaded(true));
    // .then((res) => console.log(res.data.result.data.doc))
  }, []);

  const toggle = (id) => {
    document.getElementById(id).classList.toggle('show');
    document
      .getElementById(`item-${id}`)
      .classList.toggle(`${classes.activated}`);
  };

  const completeOrder = (id) => {
    fetch(`/api/PendingOrders`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        pending: false,
      }),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res));
      document.getElementById(`item-${id}`).className = 'd-none'
      document.getElementById(`buttons-${id}`).classList.add('d-none');
  };

  const cancelOrder = (id) => {
    fetch(`/api/PendingOrders`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
    document.getElementById(`item-${id}`).className = 'd-none'
    document.getElementById(`buttons-${id}`).classList.add('d-none');
  };

  if (!loaded) {
    return <></>;
  } else {
    return (
      <div>
        <h1>Pedidos en linea</h1>
        {items.map((el, i) => {
          return (
            <div key={el.id}>
              <div
                id={`item-${el.id}`}
                className={`card ${classes.pendingOrderCards}`}
                onClick={(e) => toggle(el.id)}
              >
                <div className={classes.hoverCard}>
                  <Image
                    src={`/dishes/stockDishImg.png`}
                    className={`${classes.pendingOrderCardsImage}`}
                    alt="me"
                    width="100"
                    height="100"
                  />
                  <div className={`${classes.pendingOrderCardsBody}`}>
                    <h5 className={``}>Cliente: {el.customer}</h5>
                    <p className={``}>Total de Platos: {el.totalDishes}</p>
                    <p className={``}>Hora: {el.dayTime}</p>
                    <p className={``}>
                      Fecha {el.day} {el.createdAt}
                    </p>
                  </div>
                </div>
              </div>
              <Collapse
                id={el.id}
                isOpen={false}
                className={classes.collapseCard}
              >
                <Card className={classes.collapseInnerCard}>
                  <CardBody>
                    {el.dishes.map((el, i) => {
                      return (
                        <div
                          className={classes.pendingOrderCardsInnerCard}
                          key={`inner-${i}`}
                        >
                          <Image
                            src={`/dishes/${el.dish.image}`}
                            className={`${classes.pendingOrderCardsImage}`}
                            alt="me"
                            width="100"
                            height="100"
                          />
                          <div className={`${classes.pendingOrderCardsBody}`}>
                            <h5 className={``}>
                              Cantidad de platos: {el.amount}
                            </h5>
                            <p className={``}>
                              Precio unitario: ${el.dish.price}
                            </p>
                            <p className={``}>
                              Precio total del mismo plato: $
                              {el.dish.price * el.amount}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </CardBody>
                </Card>
              </Collapse>
              <div id={`buttons-${el.id}`} className="">
                <button
                  type="button"
                  className={`btn btn-success ${classes.pendingOrderButton}`}
                  onClick={(e) => completeOrder(el.id)}
                >
                  Completar pedido{' '}
                </button>
                <button
                  type="button"
                  className={`btn btn-danger ${classes.pendingOrderButton}`}
                  onClick={(e) => cancelOrder(el.id)}
                >
                  Cancelar pedido
                </button>
              </div>
            </div>
          );
        })}
        <br />
      </div>
    );
  }
}
