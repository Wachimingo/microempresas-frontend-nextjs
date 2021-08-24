import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import AuthContext from '../context/authContext';
import ParamsContext from '../context/paramsContext';
import Image from 'next/image';
// import dynamic from 'next/dynamic';
// const Mic = dynamic(() => import('../components/Mic'), {
//   ssr: false,
// });
const classes = require('./../styles/menu.module.css');
import CarousselSSR from '../components/Caroussel';
import MenuAdmin from '../components/MenuAdmin';

export default function Menu() {
  const { session } = useContext(AuthContext);
  const { setParams } = useContext(ParamsContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`/api/getMenu`, {
      method: 'GET',
      mode: 'cors',
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then((res) => setItems(res.data.records));

    fetch(`/api/params`, {
      method: 'GET',
      mode: 'cors',
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then((res) => setParams(res.data.records));
  }, []);

  // Server side render component
  const SSRElements = (
    <>
      <MenuAdmin
        title={'Disfruta de nuestros platillos preparados para hoy'}
        componentName={'Carusel'}
        visible={false}
        Component={<CarousselSSR items={items} />}
      />
    </>
  );

  return (
    <div>
      <div className={'text-center '}>
        <h1>Bienvenido a Comedor Buen Amancer</h1>
        <br />
        <Image src={`/logo.jpg`} alt="logo" width="250" height="250" />
        <br />
        {SSRElements}
        {/* <Mic/> */}
        <Link href="/menu/sell" passHref>
          <a className="btn btn-success">Comprar</a>
        </Link>
      </div>
    </div>
  );
}

// export async function getServerSideProps(context) {
//   const { setParams } = useContext(ParamsContext);
  // const res = await fetch(`${process.env.backend_nodejs}/api/v1/menu?limit=100`, {
  //   method: 'GET',
  //   mode: 'cors',
  // });
//   const data = await res.json();
//   const items = data.records;

//   const res2 = await fetch(`${process.env.backend_nodejs}/api/v1/params`, {
//     method: 'GET',
//     mode: 'cors',
//   });
//   const data2 = await res2.json();
//   const params = data2.records;
//   setParams(params)
//   // console.log(data2)
//   if (!data) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: { items }, // will be passed to the page component as props
//   };
// }
