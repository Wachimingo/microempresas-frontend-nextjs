import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Modal, Button } from 'react-bootstrap';
import Link from 'next/link';
import AuthContext from '../context/authContext';
import Image from 'next/image';
const classes = require('./../styles/menu.module.css');
import CarousselSSR from '../components/Caroussel';
import MenuAdmin from '../components/MenuAdmin';

export default function Menu({ items }) {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = (title, msg) =>{ 
    setTitle(title);
    setMsg(msg);
    setShow(true);
  }

  useEffect(() => { 
    // console.log(router.query.redirect_status)
    if(router.query.redirect_status !== undefined) {
      if(router.query.redirect_status === 'succeeded') {
        handleShow('Exito', 'Su transaccion fue procedada con exito');
      } else if (router.query.redirect_status === 'cancelled') {
        handleShow('Cancelacion', 'Su transaccion fue cancelada, por favor pague en el comedor');
      }
    }
  }, [router.query]);

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
        <h2>Actualmente hay {count} clientes en el local</h2>
        <br />
        <Image src={`/logo.jpg`} alt="logo" width="250" height="250" />
        <br />
        {SSRElements}
        <Link href="/menu/sell" passHref>
          <a className="btn btn-success">Comprar</a>
        </Link>
      </div>
      <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{msg}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch(
    `${process.env.BACKEND}/api/v1/menu?limit=100`,
    {
      method: 'GET',
      mode: 'cors',
    }
  );
  const data = await res.json();
  const items = data.records;

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { items }, // will be passed to the page component as props
  };
}
