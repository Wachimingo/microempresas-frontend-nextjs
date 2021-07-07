import Link from 'next/link';
import { useRouter } from 'next/router';
import {useContext} from 'react'
import AuthContext from './../../context/authContext';
import dynamic from 'next/dynamic';
const classes = require('./../../styles/menu.module.css');
import { BsCloudUpload } from 'react-icons/bs';
import CarousselSSR from './../../components/Caroussel';
// import CardsSSR from './../../components/Cards';
import MenuAdmin from './../../components/MenuAdmin';

const SellCards = dynamic(() => import('./../../components/SellCards'), {
  ssr: true,
});

const CardsSSR = dynamic(() => import('./../../components/Cards'), {
  ssr: true,
});

export default function Menu({ items, totalRecords }) {
  const router = useRouter();
  const {session} = useContext(AuthContext)

  const { menuPage } = router.query;
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

  const NoSSRElements = (page) => {
    if (page === 'carusel') {
      return (
        <MenuAdmin
          title={'Carusel de Platillos para hoy'}
          componentName={'Carusel'}
          visible={false}
          Component={<CarousselSSR items={items} />}
        />
      );
    } else if (page === 'sell') {
      return (
        <MenuAdmin
          title={'Vender platos'}
          componentName={'Vender Platos'}
          visible={false}
          Component={<SellCards items={items} session={session} />}
        />
      );
    } else if (page === 'catalog') {
      return (
        <>
          <Link href="/addDish" passHref>
            <button type="button" className={'btn btn-secondary '}>
              <BsCloudUpload /> Agregar
            </button>
          </Link>
          <MenuAdmin
            title={'Catalogo'}
            componentName={'Catalogo'}
            visible={false}
            Component={<CardsSSR items={items} totalRecords={totalRecords} session={session} />}
          />
        </>
      );
    } else if (page === 'add') {
      return (
        <MenuAdmin
          title={'Vender platos'}
          componentName={'Vender Platos'}
          visible={false}
          Component={<SellCards items={items} session={session} />}
        />
      );
    }
  };
  return (
    <div>
      <div className='text-center'>{NoSSRElements(menuPage)}</div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch('http://localhost:3001/api/v1/menu?limit=100', {
    method: 'GET',
    mode: 'cors',
  });
  const data = await res.json();
  const items = data.data.doc;
  const totalRecords = data.data.totalRecords
  // console.log(data.data.totalRecords)
  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { items, totalRecords }, // will be passed to the page component as props
  };
}
