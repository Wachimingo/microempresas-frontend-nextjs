import Link from 'next/link';
import { useCookies } from 'react-cookie';
import dynamic from 'next/dynamic';
const classes = require('./../styles/menu.module.css');
import { BsCloudUpload } from 'react-icons/bs';
import CarousselSSR from '../components/Caroussel';
import CardsSSR from '../components/Cards';
import MenuAdmin from '../components/MenuAdmin';

const TopBar = dynamic(() => import('../components/TopBar'), { ssr: false });
// const Caroussel = dynamic(() => import('../components/Caroussel'), {
//   ssr: false,
// });
// const Cards = dynamic(() => import('../components/Cards'), { ssr: false });

const SellCards = dynamic(() => import('../components/SellCards'), {
  ssr: false,
});

export default function Menu({ items }) {
  const [cookie, setCookie] = useCookies(['session']);
  // console.log(cookie.session)

  const addButton = (
    <>
      <Link href="/addDish" passHref>
        <button type="button" className={'btn btn-secondary '}>
          <BsCloudUpload /> Agregar
        </button>
      </Link>
    </>
  );

  const NoSSRElements = (
    <>
      <MenuAdmin
        title={'Carusel de Platillos para hoy'}
        componentName={'Carusel'}
        visible={true}
        Component={<CarousselSSR items={items} />}
      />
      <MenuAdmin
        title={'Vender platos'}
        componentName={'Vender Platos'}
        visible={false}
        Component={<SellCards items={items} session={cookie.session} />}
      />
      <MenuAdmin
        title={'Catalogo'}
        componentName={'Catalogo'}
        visible={true}
        Component={<CardsSSR items={items} session={cookie.session} />}
      />
    </>
  );
  // Server side render component
  const SSRElements = (
    <>
      <MenuAdmin
        title={'Carusel de Platillos para hoy'}
        componentName={'Carusel'}
        visible={false}
        Component={<CarousselSSR items={items} />}
      />
      <MenuAdmin
        title={'Catalogo'}
        componentName={'Catalogo'}
        visible={false}
        Component={<CardsSSR items={items} session={cookie.session} />}
      />
    </>
  );

  return (
    <div>
      {/* NavBar */}
      <TopBar logged={cookie.session ? true : false} />
      <br />
      <div className={classes.centered}>
        {/* Add Button */}
        {cookie.session !== undefined ? addButton : null}
        <br />
        {/* Here we render the caroussel and cards depending if the user is logged in or not,
      the loggin components will be client render as they are dynamic, and the not login will be server side rendering */}
        {cookie.session !== undefined ? NoSSRElements : SSRElements}
      </div>
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
