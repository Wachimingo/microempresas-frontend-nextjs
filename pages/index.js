import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import dynamic from 'next/dynamic';
const classes = require('./../styles/menu.module.css');
import { BsCloudUpload } from 'react-icons/bs';
import CarousselSSR from '../components/Caroussel';
import CardsSSR from '../components/Cards';

const TopBar = dynamic(() => import('../components/TopBar'), { ssr: false });
const Caroussel = dynamic(() => import('../components/Caroussel'), {
  ssr: false,
});
const Cards = dynamic(() => import('../components/Cards'), { ssr: false });
const SellCards = dynamic(() => import('../components/SellCards'), { ssr: false });

export default function Menu() {
  const [items, setItems] = useState([]);
  const [cookie, setCookie] = useCookies(['session']);
  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/menu`, {
      method: 'GET',
      mode: 'cors',
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setItems(result.data.doc);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, []);
  const addButton = (
    <div className={classes.centerButtons}>
      <Link href="/addDish" passHref>
        <button type="button" className="btn btn-secondary">
          <BsCloudUpload /> Agregar
        </button>
      </Link>
    </div>
  );

  const NoSSRElements = (
    <div>
      <Caroussel items={items} />
      <h1 className='centered'>Vender platillos</h1>
      <SellCards items={items} session={cookie.session} />
      <h1 className='centered'>Catalogo de platillos</h1>
      <Cards items={items} session={cookie.session} />
    </div>
  );
  const SSRElements = (
    <div>
      <CarousselSSR items={items} />
      <CardsSSR items={items} session={cookie.session} />
    </div>
  );

  return (
    <div>
      {/* NavBar */}
       <TopBar logged={cookie.session ? true : false} />
      <br />
      {/* Add Button */}
      {cookie.session !== undefined ? addButton : null}

      {/* Here we render the caroussel and cards depending if the user is logged in or not,
      the loggin components will be client render as they are dynamic, and the not login will be server side rendering */}
      {cookie.session !== undefined ? NoSSRElements : SSRElements}
    </div>
  );
}