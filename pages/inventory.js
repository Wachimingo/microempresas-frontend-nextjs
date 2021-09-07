import { useState, useEffect, useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import AuthContext from './../context/authContext';
import Table from './../components/Table';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PaginationControls from './../components/NavigationItems/PaginationControls';

import { BsFillTrashFill, BsGearFill } from 'react-icons/bs';

const classes = require('./../styles/addDish.module.css');
const loader = require('./../styles/loader.module.css');

export default function inventory() {
  const router = useRouter();
  const { session } = useContext(AuthContext);
  const [metric, setMetric] = useState('');
  const [amount, setAmount] = useState(0);
  const [productID, setProductID] = useState('');
  const [productName, setProductName] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemID, setItemID] = useState();
  const [items, setItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // let dateTime = new Date();
  let today = new Date().toISOString().split('T')[0].split('-').reverse().join('-');

  useEffect(() => {
    fetch(`/api/inventory`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then((res) => {
        updateItems(res);
      })
      .then(() => setLoaded(true));
    fetch(`/api/ingredients`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then((res) => {
        setIngredients(res.data.records);
      })
      .then(() => setLoaded(true));
  }, []);

  const updateItems = (res) => {
    res.data.records.map((el, i) => {
      res.data.records[i].ingredient_id = el.ingredient._id;
      res.data.records[i].ingredient_name = el.ingredient.name;
    });
    setItems(res.data.records);
    setTotalRecords(res.data.totalRecords);
  };

  const addItemHandler = (e, mode) => {
    if (e) e.preventDefault();
    fetch(`/api/inventory`, {
      method: mode,
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metric,
        amount,
        productID,
        totalPrice,
        id: itemID,
        createdAt: today
      }),
    })
      .then((res) => res.json())
      .then(
        mode === 'POST'
          ? toast.success('Ingrediente a sido añadido')
          : toast.success('Ingrediente a sido modificado')
      );
    location.reload();
  };

  const removeItem = (id, name) => {
    fetch(`/api/inventory`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((res) => res.json())
      .then(toast.info(`Se ha eleminado ${name} de la lista`));
  };

  const modifyItem = (el) => {
    console.log(el);
    setItemID(el._id);
    setMetric(el.metric);
    setAmount(el.amount);
    setProductName(el.ingredient_name);
    setProductID(el.ingredient_id);
  };

  if (items.length > 0 && totalRecords > 0) {
    return (
      <div>
        <h1>Ingresar ingredientes o producto</h1>
        <br />
        <div className={'container ' + classes.formBody}>
          <div className="row">
            <div className="col">
              <form
                onSubmit={
                  itemID === undefined
                    ? (e) => addItemHandler(e, 'POST')
                    : (e) => addItemHandler(e, 'PATCH')
                }
              >
                <div className="input-group">
                  <span
                    className={'input-group-text ' + classes.labelsText}
                    style={{ width: '6vw' }}
                  >
                    Producto
                  </span>
                  <select
                    id="ingredients"
                    className="form-select"
                    aria-label="Default select example"
                    value={productID}
                    onChange={(e) => setProductID(e.target.value)}
                  >
                    {ingredients.map((el, i) => {
                      return (
                        <>
                          <option key={'ingredient' + el._id} value={el._id}>
                            {el.name}
                          </option>
                        </>
                      );
                    })}
                  </select>
                </div>
                <div className="input-group">
                  <span
                    className={'input-group-text ' + classes.labelsText}
                    style={{ width: '6vw' }}
                  >
                    Unidad
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <span
                    className={'input-group-text ' + classes.labelsText}
                    style={{ width: '6vw' }}
                  >
                    Total de unidades
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <span
                    className={'input-group-text ' + classes.labelsText}
                    style={{ width: '6vw' }}
                  >
                    Total Cancelado
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                  />
                </div>
                <br />
                <div className="input-group">
                  <input
                    type="submit"
                    className="btn btn-outline-primary form-control"
                  />
                  <Link href="/" passHref>
                    <button
                      type="button"
                      className="btn btn-outline-primary form-control"
                    >
                      Cancelar
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div>
          <h3>Lista de items existentes</h3>
          <div className={classes.paginationNav}>
            <PaginationControls
              token={session.token}
              totalRecords={totalRecords}
              limit={10}
              toUpdateParent={updateItems}
              type={null}
              url={'/api/inventory'}
              method={'GET'}
            />
          </div>
          <div className={`${classes.InLineBlock} ${classes.Table2}`}>
            <Table
              headers={[
                'ID',
                'Producto',
                'Unidad',
                'Total',
                'Precio Unitario',
                'Precio total',
                'Fecha',
              ]}
              items={items}
              body={[
                '_id',
                'ingredient_name',
                'metric',
                'quantity',
                'pricePerUnit',
                'totalPrice',
                'createdAt',
              ]}
            />
          </div>
          <div className={`${classes.InLineBlock} ${classes.actions2}`}>
            {items.map((el, i) => {
              return (
                <div key={el._id + i}>
                  {/* Button to Delete Item */}
                  <button
                    type="button"
                    className={'btn btn-danger'}
                    onClick={(e) => removeItem(el._id, el.name)}
                  >
                    <BsFillTrashFill />
                  </button>
                  {/* Button to Modify Item */}
                  <button
                    type="button"
                    className={'btn btn-info'}
                    onClick={(e) => modifyItem(el)}
                  >
                    <BsGearFill />
                  </button>
                  <br />
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <ToastContainer />
        </div>
      </div>
    );
  } else return (<>
    <h1>Cargando...</h1>
    <div className={`${loader.ldsSpinner}`}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  </>)
}
