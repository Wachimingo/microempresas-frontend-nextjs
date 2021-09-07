import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/authContext';
import Table from './../components/Table';

export default function Menu({ items }) {
    const { session } = useContext(AuthContext);

    return (
        <div>
            <Table
                headers={['Fecha', 'Gastado']}
                items={items}
                body={['_id', 'payed']}
            />
        </div>
    );
}

export async function getServerSideProps(context) {
    const res = await fetch(
        `${process.env.backend_nodejs}/api/v1/stats/payed?limit=100`,
        {
            method: 'GET',
            mode: 'cors',
        }
    );
    const data = await res.json();
    const items = data.records;
    //   console.log(data.records)
    if (!data) {
        return {
            notFound: true,
        };
    }

    return {
        props: { items }, // will be passed to the page component as props
    };
}
