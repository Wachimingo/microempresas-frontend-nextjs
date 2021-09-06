import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import AuthContext from './../../context/authContext';
const classes = require('./../../styles/menu.module.css');
import { BsCloudUpload } from 'react-icons/bs';
import CarousselSSR from './../../components/Caroussel';
import SellCards from './../../components/SellCards';
import CardsSSR from './../../components/Cards';
import MenuAdmin from './../../components/MenuAdmin';

export default function Menu() {
  const router = useRouter();
  const { session } = useContext(AuthContext);
  const { menuPage } = router.query;

  const [items, setItems] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)

  useEffect(() => {
    fetch(`/api/getMenu`, {
      method: 'GET',
      mode: 'cors',
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then((res) => updateValues(res));
  }, []);

  const updateValues = (res) => {
    setItems(res.data.records)
    setTotalRecords(res.data.totalRecords)
  }

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
        <>
          <MenuAdmin
            title={'Carusel de Platillos para hoy'}
            componentName={'Carusel'}
            visible={false}
            Component={<CarousselSSR items={items} />}
          />
          <Link href="/menu/sell" passHref>
            <a className="btn btn-success">Comprar</a>
          </Link>
        </>
      );
    } else if (page === 'sell') {
      return (
        <>
          <MenuAdmin
            componentName={'Vender Platos'}
            visible={false}
            Component={<SellCards items={items} session={session} />}
          />
        </>
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
            Component={
              <CardsSSR
                items={items}
                totalRecords={totalRecords}
                session={session}
              />
            }
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
      <div className="text-center">{NoSSRElements(menuPage)}</div>
    </div>
  );
}

// export async function getServerSideProps(context) {
//   const res = await fetch('http://localhost:3001/api/v1/menu?limit=100', {
//     method: 'GET',
//     mode: 'cors',
//   });
//   const resForToday = await fetch(
//     'http://localhost:3001/api/v1/menu/forToday',
//     {
//       method: 'GET',
//       mode: 'cors',
//     }
//   );
//   const data = await res.json();
//   const data2 = await resForToday.json();
//   const itemsForToday = data2.data;
//   const items = data.records;
//   const totalRecords = data.totalRecords;
//   // console.log(data.data.totalRecords)
//   if (!data) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: { items, totalRecords, itemsForToday }, // will be passed to the page component as props
//   };
// }
