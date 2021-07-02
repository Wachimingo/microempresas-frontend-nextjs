import { useState, useEffect } from 'react';
const classes = require('./../../styles/sellHistory.module.css');
import PaginationControls from '../NavigationItems/PaginationControls';

export default function DetailedBill(props) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState();
  const [sort, setSort] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (props.session === undefined) router.push('/');
    fetch(`/api/getDetailedBills`, {
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
      // .then((res) => console.log(res.data.result.data.doc))
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
      )
      .then(() => setLoaded(true));
  }, []);

  const searchPage = (page) => {
    fetch(`/api/getDetailedBills`, {
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

  if (!loaded) {
    return <></>; //show nothing or a loader
  } else {
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
          <div className="row">
            <div className={'col ' + classes.headerRow}>ID</div>
            <div
              className={'col ' + classes.headerRow + ' ' + classes.middleCol}
            >
              Plato
            </div>
            <div
              className={'col ' + classes.headerRow + ' ' + classes.middleCol}
            >
              Dia
            </div>
            <div className={'col-1 ' + classes.headerRow}>Precio</div>
          </div>
          {items.map((el, i) => {
            return (
              <div key={i} className="row">
                <div className={'col ' + classes.bodyRow}>{el._id}</div>
                <div
                  className={'col ' + classes.bodyRow + ' ' + classes.middleCol}
                >
                  {el.dish.name}
                </div>
                <div
                  className={'col ' + classes.bodyRow + ' ' + classes.middleCol}
                >
                  {el.day}{' '}
                  {el.createdAt.split('T')[0].split('-').reverse().join('-')}
                </div>
                <div className={'col-1 ' + classes.bodyRow}>
                  ${el.dish.price}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
