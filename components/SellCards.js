import Image from 'next/image';
import { BsFillTrashFill, BsCheck, BsFlagFill } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import {useState} from 'react'
import 'react-toastify/dist/ReactToastify.css';
const classes = require('./../styles/menu.module.css');
const sellCardsController = require('./../controllers/sellCardsController.js');
const searchBarController = require('./../controllers/searchBarController.js');

export default function SellCards(props) {
  let [filterObject, setFilterObject] = useState(JSON.parse(JSON.stringify(props.items)))

  const searchItem = (text) =>{
    let re = new RegExp(`\\b${text.toLowerCase()}`, 'g');
    props.items.map((el, i)=>{
      let nameLowerCase = el.name.toLowerCase();
      if(nameLowerCase.match(re))
      {
        filterObject[i] = el
      }
      else{
        delete filterObject[i]
      }
    })
    // console.log(filterObject)
    //This is to update the object in the return, as if not the copy in the client won't update
    setFilterObject(searchBarController.cleanArray(JSON.parse(JSON.stringify(filterObject))))
  }

  return (
    <>
      <input className={"form-control me-2 " + classes.searchBar} type="search" placeholder="Search" aria-label="Search" onChange={(e)=>searchItem(e.target.value)}></input>
      <div className={classes.centerSellCard}>
      {
        // console.log(items),
        filterObject.map((el, i) => {
          if (el.forToday) {
            return (
              <div
                key={i}
                id={i}
                className={'card '}
                style={{
                  width: '18rem',
                  display: 'inline-block',
                  marginRight: '2vw',
                }}
              >
                <h2 id={el.id}>0</h2>
                <div
                  onClick={(e) =>
                    sellCardsController.upCounter(el.id, el.price)
                  }
                  className={classes.hoverCard}
                >
                  <Image
                    src={'/dishes/' + el.image}
                    className="card-img-top"
                    alt="me"
                    width="1000"
                    height="1000"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{el.name}</h5>
                    <p className="card-text">{el.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) =>
                    sellCardsController.lowerCounter(el.id, el.price)
                  }
                  className={'btn btn-danger'}
                >
                  <BsFillTrashFill /> Remover
                </button>
              </div>
            );
          } else {
            return null;
          }
        })
      }
      {/* Section to see purchase details */}
      <div className={classes.billInfo}>
        <h2 style={{ marginRight: '10px' }}>Platos:</h2>
        <h2 id="totalDishes" style={{ marginRight: '2vw' }}>
          0
        </h2>
      </div>
      <div className={classes.billInfo}>
        <h2>Total: $</h2>
        <h2 id="totalPrice">0</h2>
      </div>
      <br />
      <button
        type="button"
        className={'btn btn-success '}
        onClick={(e) =>
          sellCardsController.processSell(false, props.session.token)
        }
      >
        <BsCheck /> Procesar venta
      </button>
      {/* Fiado is to lend this dish to the client with the promise to pay afterward */}
      <button
        type="button"
        className={'btn btn-danger ' + classes.fiado}
        onClick={(e) =>
          sellCardsController.processSell(true, props.session.token)
        }
      >
        <BsFlagFill /> Fiar
      </button>
      <br />
      <div>
        <ToastContainer />
      </div>
      </div>
    </>
  );
}
