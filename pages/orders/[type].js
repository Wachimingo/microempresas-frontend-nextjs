import { useState, useEffect, useContext, memo } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '../../context/authContext';
import Image from 'next/image';
import { Collapse, CardBody, Card } from 'reactstrap';
const classes = require('./../../styles/menu.module.css');

export default memo(function pendingOrders() {
  const router = useRouter();
  const { type } = router.query;
  const { session } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (session.user.role === 'admin') {
      getAllPendingOrders();
    } else if (session.user.role === 'user') {
      getOwnedPendingOrders();
    }
  }, [type]);

  const getAllPendingOrders = () => {
    if (window.location.href.split('/').pop() === 'isPending') {
      fetch(`/api/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: session.user.role,
          status: 'isPending',
          ifValue: true,
        }),
      })
        .then((res) => res.json())
        .then((res) => setItems(res.data.result.data.doc), setLoaded(true));
      // .then((res) => console.log(res))
    } else if (window.location.href.split('/').pop() === 'isReady') {
      fetch(`/api/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: session.user.role,
          status: 'isPending',
          ifValue: false,
        }),
      })
        .then((res) => res.json())
        .then((res) => setItems(res.data.result.data.doc), setLoaded(true));
      // .then((res) => console.log(res))
    } else if (window.location.href.split('/').pop() === 'isCompleted') {
      fetch(`/api/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: session.user.role,
          status: 'isCompleted',
          ifValue: true,
        }),
      })
        .then((res) => res.json())
        .then((res) => setItems(res.data.result.data.doc), setLoaded(true));
      // .then((res) => console.log(res))
    }
  };

  const getOwnedPendingOrders = () => {
    fetch(`/api/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: session.user._id,
        role: session.user.role,
      }),
    })
      .then((res) => res.json())
      .then((res) => setItems(res.data.result.data.doc), setLoaded(true));
    // .then((res) => console.log(res))
  };

  const toggle = (id) => {
    document.getElementById(id).classList.toggle('show');
    document
      .getElementById(`item-${id}`)
      .classList.toggle(`${classes.activated}`);
  };

  const completeOrder = (id) => {
    if (window.location.href.split('/').pop() === 'isPending') {
      fetch(`/api/orders`, {
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
      }).then((res) => res.json());
      // .then((res) => console.log(res));
      document.getElementById(`item-${id}`).className = 'd-none';
      document.getElementById(`buttons-${id}`).classList.add('d-none');
    } else if (window.location.href.split('/').pop() === 'isReady') {
      fetch(`/api/orders`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          completed: true,
        }),
      }).then((res) => res.json());
      // .then((res) => console.log(res));
      document.getElementById(`item-${id}`).className = 'd-none';
      document.getElementById(`buttons-${id}`).classList.add('d-none');
    }
  };

  const cancelOrder = (id) => {
    fetch(`/api/orders`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    }).then((res) => res.json());
    // .then((res) => console.log(res))
    document.getElementById(`item-${id}`).className = 'd-none';
    document.getElementById(`buttons-${id}`).classList.add('d-none');
  };

  const buttons = (id) => {
    if (window.location.href.split('/').pop() === 'isPending') {
      return (
        <div id={`buttons-${id}`} className="">
          <button
            type="button"
            className={`btn btn-success ${classes.pendingOrderButton} ${
              session.user.role !== 'admin' ? 'd-none' : ''
            }`}
            onClick={(e) => completeOrder(id)}
          >
            Orden Lista
          </button>
          <button
            type="button"
            className={`btn btn-danger ${classes.pendingOrderButton}`}
            onClick={(e) => cancelOrder(id)}
          >
            Cancelar pedido
          </button>
        </div>
      );
    } else if (window.location.href.split('/').pop() === 'isReady') {
      return (
        <div id={`buttons-${id}`} className="">
          <button
            type="button"
            className={`btn btn-success ${classes.pendingOrderButton} ${
              session.user.role !== 'admin' ? 'd-none' : ''
            }`}
            onClick={(e) => completeOrder(el.id)}
          >
            Completar pedido
          </button>
          <button
            type="button"
            className={`btn btn-danger ${classes.pendingOrderButton}`}
            onClick={(e) => cancelOrder(id)}
          >
            Cancelar pedido
          </button>
        </div>
      );
    } else if (window.location.href.split('/').pop() === 'isCompleted') {
      return <></>;
    } else if (window.location.href.split('/').pop() === 'user') {
      return (
        <>
          <button
            type="button"
            className={`btn btn-danger ${classes.pendingOrderButton}`}
            onClick={(e) => cancelOrder(id)}
          >
            Cancelar pedido
          </button>
        </>
      );
    }
  };

  const sayStatus = (pending) => {
    if(pending) {
      return <h4>Orden Pendiente</h4>
    } else if (!pending){
      return <h4>Orden lista para retirar</h4>
    } else if (pending !== true && pending !== false) {
      return <h4>Orden anterior</h4>
    } else {
      console.log('Error, el valdor del estado de la orden no se pudo manejar')
    }
  }

  if (!loaded) {
    return <></>;
  } else {
    return (
      <div>
        <h1>Pedidos en linea </h1>
        {items.map((el, i) => {
          return (
            <div key={el.id}>
              {sayStatus(el.isPending)}
              <div
                id={`item-${el.id}`}
                className={`card ${classes.pendingOrderCards}`}
                onClick={(e) => toggle(el.id)}
                style={
                  !el.isPending
                    ? { backgroundColor: 'lightgreen' }
                    : el.isCompleted
                    ? { backgroundColor: 'lightgray' }
                    : {}
                }
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
              {buttons(el.id)}
            </div>
          );
        })}
        <br />
      </div>
    );
  }
});
