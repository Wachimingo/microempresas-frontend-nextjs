import { useCookies } from 'react-cookie';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import DetailedBill from '../../components/Bills/DetailedBill';
import HeaderBill from '../../components/Bills/HeaderBill';
const classes = require('./../../styles/sellHistory.module.css')
const TopBar = dynamic(() => import('../../components/TopBar'), { ssr: false });

export default function sellHistory() {
  const router = useRouter();
  const { typeHistory }  = router.query;
  const [cookie, setCookie] = useCookies(['session']);
  useEffect(() => {
    
  }, []);

  const itemList = (type) => {
    if (type === 'grupal') {
      return <HeaderBill session={cookie.session}/>
    } else if (type === 'individual'){
      return <DetailedBill session={cookie.session}/>
    } else if (type === 'fiado') {
      return <DetailedBill session={cookie.session}/>
    }
  }

  return (
    <div>
      <TopBar logged={cookie.session ? true : false} />
      <h1 className={classes.centerItem}>Historial de ventas {typeHistory}</h1>
      <br/>
      {itemList(typeHistory)}
    </div>
  );
}
