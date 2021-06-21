import { useState, useEffect } from 'react';
const classes = require('./../../styles/sellHistory.module.css')

export default function DetailedBill(props) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (props.session === undefined) router.push('/');

    fetch(`/api/getDetailedBills`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${props.session.token}`,
      },
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then(
        (result) => {
          setItems(result.data.result.data.doc);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, []);

  return (
    <div>
      <div className={"container " + classes.tableBorder}>
      <div className="row">
      <div className={"col-1 " + classes.headerRow}>ID</div>
              <div className={"col " + classes.headerRow + ' ' + classes.middleCol}>Plato</div>
              <div className={"col " + classes.headerRow + ' ' + classes.middleCol}>Dia</div>
              <div className={"col-1 " + classes.headerRow}>Precio</div>
            </div>
        {items.map((el, i) => {
        
          return (
            <div key={i} className="row">
              <div className={"col-1 " + classes.bodyRow}>{i+1}</div>
              <div className={"col " + classes.bodyRow + ' ' + classes.middleCol}>{el.dish.name}</div>
              <div className={"col " + classes.bodyRow + ' ' + classes.middleCol}>{el.day}</div>
              <div className={"col-1 " + classes.bodyRow}>${el.dish.price}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
