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
    if (session.role === 'admin') {
      getAllPendingOrders();
    } else if (session.role === 'user') {
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
          role: session.role,
          status: 'status',
          ifValue: 'Pending',
        }),
      })
        .then((res) => res.json())
        .then((res) => checkIfEmpty(res))
        .then(() => setLoaded(true));
      // .then((res) => console.log(res))
    } else if (window.location.href.split('/').pop() === 'isReady') {
      fetch(`/api/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: session.role,
          status: 'status',
          ifValue: 'isReady',
        }),
      })
        .then((res) => res.json())
        .then((res) => setItems(res.data.records), setLoaded(true));
      // .then((res) => console.log(res))
    } else if (window.location.href.split('/').pop() === 'isCompleted') {
      fetch(`/api/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: session.role,
          status: 'status',
          ifValue: 'Completed',
        }),
      })
        .then((res) => res.json())
        .then((res) => setItems(res.data.records), setLoaded(true));
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
        id: session._id,
        role: session.role,
      }),
    })
      .then((res) => res.json())
      .then((res) => setItems(res.data.records))
      .then(() => setLoaded(true));
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
          role: session.role,
          status: 'isReady',
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
          role: session.role,
          status: 'Completed',
        }),
      }).then((res) => res.json());
      // .then((res) => console.log(res));
      document.getElementById(`item-${id}`).className = 'd-none';
      document.getElementById(`buttons-${id}`).classList.add('d-none');
    }
  };

  const checkIfEmpty = (res) => {
    if (res.data.records !== undefined) {
      setItems(res.data.records);
    } else if (res.data !== undefined) {
      // res.data.map((el, i) => {
      //   console.log(el);
      // });
      // console.log(res)
      setItems(res.data);
    } else {
      console.log('ERROR');
    }
    // console.log(res.data)
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

  const buttons = (id, status) => {
    if (window.location.href.split('/').pop() === 'isPending') {
      return (
        <div id={`buttons-${id}`} className="">
          <button
            type="button"
            className={`btn btn-success ${classes.pendingOrderButton} ${
              session.role !== 'admin' ? 'd-none' : ''
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
              session.role !== 'admin' ? 'd-none' : ''
            }`}
            onClick={(e) => completeOrder(id)}
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
      if (status === 'Pending' || status === 'isReady') {
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
      } else {
        return <></>;
      }
    }
  };

  const sayStatus = (status) => {
    if (status === 'Pending') {
      return <h4>Orden pendiente</h4>;
    } else if (status === 'isReady') {
      return <h4>Orden lista para retirar</h4>;
    } else if (status === 'Completed') {
      return <h4>Orden previa</h4>;
    }
  };

  if (!loaded) {
    return <></>;
  } else {
    return (
      <div>
        {console.log(items)}
        <h1>Pedidos en linea </h1>
        {items.map((el, i) => {
          return (
            <div key={el.id}>
              {sayStatus(el.status)}
              <div
                id={`item-${el.id}`}
                className={`card ${classes.pendingOrderCards}`}
                onClick={(e) => toggle(el.id)}
                style={
                  el.status === 'isReady'
                    ? { backgroundColor: 'lightgreen' }
                    : el.status === 'Completed'
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
                    {/* {el.dishes.map((el, i) => {
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
                    })} */}
                  </CardBody>
                </Card>
              </Collapse>
              {buttons(el.id, el.status)}
            </div>
          );
        })}
        <br />
      </div>
    );
  }
});
