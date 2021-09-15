import { useState, useEffect, useContext, memo } from 'react';
import { useRouter } from 'next/router';
import PaginationControls from './../../components/NavigationItems/PaginationControls';
import AuthContext from '../../context/authContext';
import ParamsContext from '../../context/paramsContext';
import Image from 'next/image';
import { Collapse, CardBody, Card } from 'reactstrap';
const classes = require('./../../styles/menu.module.css');

export default function pendingOrders({ items, totalRecords, backend }) {
  const router = useRouter();
  const { type } = router.query;
  const { session } = useContext(AuthContext);
  let [filterObject = [...items], setFilterObject] = useState();
  const { params } = useContext(ParamsContext);


  const toggle = (id) => {
    // console.log(backend)
    if (backend === 'py') return;
    document.getElementById(id).classList.toggle('show');
    document
      .getElementById(`item-${id}`)
      .classList.toggle(`${classes.activated}`);
  };

  const completeOrder = (id) => {
    if (router.query.type === 'Pending') {
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
          url: params[0].paramValue
        }),
      }).then((res) => res.json());
      // .then((res) => console.log(res));
      document.getElementById(`item-${id}`).className = 'd-none';
      document.getElementById(`buttons-${id}`).classList.add('d-none');
    } else if (router.query.type === 'isReady') {
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
          url: params[0].paramValue
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
        url: params[0].paramValue
      }),
    }).then((res) => res.json());
    // .then((res) => console.log(res))
    document.getElementById(`item-${id}`).className = 'd-none';
    document.getElementById(`buttons-${id}`).classList.add('d-none');
  };

  const buttons = (id, status) => {
    if (router.query.type === 'Pending') {
      return (
        <div id={`buttons-${id}`} className="">
          <button
            type="button"
            className={`btn btn-success ${classes.pendingOrderButton} ${session.role !== 'admin' ? 'd-none' : ''
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
    } else if (router.query.type === 'isReady') {
      return (
        <div id={`buttons-${id}`} className="">
          <button
            type="button"
            className={`btn btn-success ${classes.pendingOrderButton} ${session.role !== 'admin' ? 'd-none' : ''
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
    } else if (router.query.type === 'Completed') {
      return <></>;
    } else if (router.query.role === 'user') {
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
    // console.log(router.query.type)
  };

  const parentItemsUpdate = (res) => {
    // console.log(res)
    if(res.data.records !== undefined){
      setFilterObject(res.data.records);
    } else {
      totalRecords = 0;
      backend = 'py'
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

  return (
    <div>
      {/* {console.log(filterObject)} */}
      <h1>Pedidos en linea</h1>
      <div className={classes.paginationNav}>
        <PaginationControls
          token={session.token}
          totalRecords={totalRecords}
          limit={10}
          sort={null}
          toUpdateParent={parentItemsUpdate}
          type={null}
          url={`/api/orders?status=status&ifValue=${router.query.type}&role=${session.role}`}
          method={'POST'}
        />
      </div>
      {filterObject.map((el, i) => {
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
                  {el.dishes !== undefined ? (
                    el.dishes.map((el, i) => {
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
                    })
                  ) : (
                    <div
                      className={classes.pendingOrderCardsInnerCard}
                      key={`inner-${i}`}
                    >
                      <Image
                        src={`/dishes/stockDishImg.png`}
                        className={`${classes.pendingOrderCardsImage}`}
                        alt="me"
                        width="100"
                        height="100"
                      />
                      <div className={`${classes.pendingOrderCardsBody}`}>
                        <h2>No hay informacion para mostrar</h2>
                      </div>
                    </div>
                  )}
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
};

export async function getServerSideProps({ query }) {
  // Get external data from the file system, API, DB, etc.
  // console.log(query) // here is the data of the url { blogname: 'wfe436' }
  let res = []

  if (query.role === 'admin') {
    res = await fetch(`${process.env.backend_orders}/api/v1/bills/orders`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${query.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'status',
        ifValue: query.type,
      }),
    });
  } else if (query.role === 'user') {
    res = await fetch(`${process.env.backend_orders}/api/v1/bills/ownedOrders?sort=-status`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${query.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: query.id,
        status: 'status',
        ifValue: query.type,
      }),
    });
  } else {
    return {
      notFound: true,
    };
  }

  const data = await res.json()

  const items = data.records !== undefined ? data.records : data
  const totalRecords = data.totalRecords !== undefined ? data.totalRecords.length > 0 ? data.totalRecords[0].total : 1 : 1
  const backend = data.records !== undefined ? 'js' : 'py'
  // console.log(data)

  return {
    props: { items, totalRecords, backend }, // will be passed to the page component as props
  };
}