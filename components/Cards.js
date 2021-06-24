// import { ToastContainer, toast } from 'react-toastify';
import Image from 'next/image';
// import 'react-toastify/dist/ReactToastify.css';
import {useState} from 'react'
const classes = require('./../styles/menu.module.css');
const cardsController = require('./../controllers/cardsController.js');
const searchBarController = require('./../controllers/searchBarController.js');

import {
  BsFillTrashFill,
  BsChevronCompactUp,
  BsChevronCompactDown,
  BsGearFill,
} from 'react-icons/bs';

export default function Cards(props) {
  //Clone props.items to filter object
  let [filterObject, setFilterObject] = useState(JSON.parse(JSON.stringify(props.items)))
  
  // const notify = (text) => toast(text);
  const cardButtons = (id, i, fileName) => (
    <div key={i}>
      {/* Button to Delete Card */}
      <button
        type="button"
        className={'btn btn-danger'}
        onClick={(e) =>
          cardsController.deleteDish(id, i, fileName, props.session.token)
        }
      >
        <BsFillTrashFill />
      </button>
      {/* Button to set Dish for today */}
      <button
        type="button"
        className={'btn btn-success'}
        onClick={(e) =>
          cardsController.setDishForToday(id, true, props.session.token)
        }
      >
        <BsChevronCompactUp />
      </button>
      {/* Button to remove Dish for today */}
      <button
        type="button"
        className={'btn btn-primary'}
        onClick={(e) =>
          cardsController.setDishForToday(id, false, props.session.token)
        }
      >
        <BsChevronCompactDown />
      </button>
      <button type="button" className={'btn btn-warning'}>
        <BsGearFill />
      </button>
    </div>
  );

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
      {
        // console.log(filterObject),
        filterObject.map((el, i) => {
          let colorBorder = '';
          el.forToday
            ? (colorBorder = classes.borderActive)
            : (colorBorder = '');
          return (
            <div
              key={i}
              id={i}
              className={'card ' + colorBorder}
              style={{
                width: '18rem',
                display: 'inline-block',
                marginRight: '2vw',
              }}
            >
              {props.session !== undefined
                ? cardButtons(el.id, i, el.image)
                : null}
              <div className={classes.hoverCard}>
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
            </div>
          );
        })
      }
      {/* <div>
        <ToastContainer />
      </div> */}
    </>
  );
}
