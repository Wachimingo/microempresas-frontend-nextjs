import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import dynamic from 'next/dynamic';
const classes = require('./../styles/menu.module.css');
import { BsCloudUpload, BsEyeSlash, BsEye } from 'react-icons/bs';
import CarousselSSR from '../components/Caroussel';
import CardsSSR from '../components/Cards';

const TopBar = dynamic(() => import('../components/TopBar'), { ssr: false });
const Caroussel = dynamic(() => import('../components/Caroussel'), {
  ssr: false,
});
const Cards = dynamic(() => import('../components/Cards'), { ssr: false });
const SellCards = dynamic(() => import('../components/SellCards'), {
  ssr: false,
});

export default function Menu({ items }) {
  // const [items, setItems] = useState([]);
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(true);
  const [cookie, setCookie] = useCookies(['session']);
  const addButton = (
    <div>
      <Link href="/addDish" passHref>
        <button
          type="button"
          className={'btn btn-secondary ' + classes.centerButtons}
        >
          <BsCloudUpload /> Agregar
        </button>
      </Link>
    </div>
  );

  const NoSSRElements = (
    <div>
      {/* Title of the section */}
      <h1 className={'centered ' + classes.centerButtons}>Caroussel</h1>
      <button
        type="button"
        className={'btn btn-info ' + classes.centerButtons}
        onClick={(e) => setA(!a)}
      >
        {/* Show/Hide button */}
        {a ? (
          <><BsEye /> Mostrar Caroussel</>
        ) : (
          <><BsEyeSlash /> Ocultar Caroussel</>
        )}
      </button>
      {/* Render of the Component */}
      {a ? null : <Caroussel items={items} />}
      {/* Title of the section */}
      <h1 className={'centered ' + classes.centerButtons}>Vender platillos</h1>
      <button
        type="button"
        className={'btn btn-info ' + classes.centerButtons}
        onClick={(e) => setB(!b)}
      >
        {/* Show/Hide button */}
        {b ? (
          <><BsEye /> Mostrar Vender</>
        ) : (
          <><BsEyeSlash /> Ocultar Vender</>
        )}
      </button>
      {/* Render of the component */}
      {b ? null : <SellCards items={items} session={cookie.session} />}
      {/* Title of the section */}
      <h1 className={'centered ' + classes.centerButtons}>Catalogo de platillos</h1>
      <button
        type="button"
        className={'btn btn-info ' + classes.centerButtons}
        onClick={(e) => setC(!c)}
      >
        {/* Show/Hide button */}
        {c ? (
          <><BsEye /> Mostrar Catalogo</>
        ) : (
          <><BsEyeSlash /> Ocultar Catalogo</>
        )}
      </button>
      {/* Render of the component */}
      {c ? null : <Cards items={items} session={cookie.session} />}
    </div>
  );
  // Server side render component
  const SSRElements = (
    <div>
      <CarousselSSR items={items} />
      <CardsSSR items={items} session={cookie.session} />
    </div>
  );

  return (
    <div>
      {/* NavBar */}
      <TopBar logged={cookie.session ? true : false}/>
      <br/>
      {/* Add Button */}
      {cookie.session !== undefined ? addButton : null}
      <br/>
      {/* Here we render the caroussel and cards depending if the user is logged in or not,
      the loggin components will be client render as they are dynamic, and the not login will be server side rendering */}
      {cookie.session !== undefined ? NoSSRElements : SSRElements}
    </div>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch('http://localhost:3001/api/v1/menu', {
    method: 'GET',
    mode: 'cors',
  });
  const data = await res.json();
  const items = data.data.doc;
  // console.log(data.data.doc)
  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { items }, // will be passed to the page component as props
  };
}
