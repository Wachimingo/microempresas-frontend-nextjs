import { useState, useEffect } from 'react';
const classes = require('./../../styles/sellHistory.module.css')

export default function HeaderBill(props) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(`/api/getHeaderBills`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${props.session.token}`,
      },
    })
      .then((res) => res.json())
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
      <div className="row justify-content-center">
              <div className={"col-1 " + classes.headerRow}>ID</div>
              <div className={"col " + classes.headerRow + ' ' + classes.middleCol}>Total de Platos</div>
              <div className={"col-1 " + classes.headerRow + ' ' + classes.middleCol}>Total</div>
              <div className={"col " + classes.headerRow}>Fecha</div>
            </div>
        {items.map((el, i) => {
        
          return (
            <div key={i} className="row">
              <div className={"col-1 " + classes.bodyRow}>{i+1}</div>
              <div className={"col " + classes.bodyRow + ' ' + classes.middleCol}>{el.totalDishes} Platos</div>
              <div className={"col-1 " + classes.bodyRow + ' ' + classes.middleCol}>${el.totalPrice}</div>
              <div className={"col " + classes.bodyRow}>{el.createdAt}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
