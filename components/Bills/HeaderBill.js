import { useState, useEffect } from 'react';
const classes = require('./../../styles/sellHistory.module.css');

export default function HeaderBill(props) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState();
  const [sort, setSort] = useState('');
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetch(`/api/getHeaderBills`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${props.session.token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        limit: 10,
        sort,
      }),
    })
      .then((res) => res.json())
      .then(
        (res) => {
          setItems(res.data.result.data.doc),
            setTotalRecords(res.data.result.data.totalRecords);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, []);

  const searchPage = (page) => {
    fetch(`/api/getHeaderBills`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${props.session.token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        limit: 10,
        page,
        sort,
      }),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res.data.result.data.doc))
      .then(
        (res) => {
          setItems(res.data.result.data.doc);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  };

  let drawPagination = () => {
    // console.log(Math.ceil(totalRecords / 10))
    let totalPages = [];
    for (let i = 0; i < Math.ceil(totalRecords / 10); i++) {
      totalPages.push(i);
    }
    return totalPages;
  };

  return (
    <div className={classes.centerTable}>
      <div className={classes.paginationNav}>
        <nav aria-label={'Page navigation example'}>
          <ul className="pagination">
            {/* Previous Page */}
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            {drawPagination().map((el, i) => {
              return (
                <li key={i} className="page-item">
                  <button
                    className="page-link"
                    onClick={(e) => searchPage(i * 1 + 1)}
                  >
                    {i * 1 + 1}
                  </button>
                </li>
              );
            })}
            {/* Next Page */}
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className={'container ' + classes.tableBorder}>
        <div className="row justify-content-center">
          <div className={'col-1 ' + classes.headerRow}>ID</div>
          <div className={'col ' + classes.headerRow + ' ' + classes.middleCol}>
            Total de Platos
          </div>
          <div
            className={'col-1 ' + classes.headerRow + ' ' + classes.middleCol}
          >
            Total
          </div>
          <div
            className={'col-1 ' + classes.headerRow + ' ' + classes.middleCol}
          >
            Estado
          </div>
          <div className={'col ' + classes.headerRow}>Fecha</div>
        </div>
        {items.map((el, i) => {
          let estado = 'Pagado';
          let fondo = '';
          if (el.isFiado) {
            estado = 'Fiado';
            fondo = classes.estado;
          }
          return (
            <div key={i} className="row">
              <div className={'col-1 ' + classes.bodyRow}>{i + 1}</div>
              <div
                className={'col ' + classes.bodyRow + ' ' + classes.middleCol}
              >
                {el.totalDishes} Platos
              </div>
              <div
                className={'col-1 ' + classes.bodyRow + ' ' + classes.middleCol}
              >
                ${el.totalPrice}
              </div>
              <div
                className={
                  'col-1 ' +
                  classes.bodyRow +
                  ' ' +
                  classes.middleCol +
                  ' ' +
                  fondo
                }
              >
                {estado}
              </div>
              <div className={'col ' + classes.bodyRow}>
                {el.day} {el.createdAt}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
