import { useContext } from 'react';
import AuthContext from '../context/authContext';
import Image from 'next/image';
// import dynamic from 'next/dynamic';
// const Mic = dynamic(() => import('../components/Mic'), {
//   ssr: false,
// });
const classes = require('./../styles/menu.module.css');
import CarousselSSR from '../components/Caroussel';
import MenuAdmin from '../components/MenuAdmin';

export default function Menu({ items }) {
  const { session } = useContext(AuthContext);

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
      </div>
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
