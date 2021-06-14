import dynamic from 'next/dynamic';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const TopBar = dynamic(() => import('../components/TopBar'), { ssr: false });


export default function sell() {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [cookie, setCookie] = useCookies(['session']);
    
    useEffect(()=>{
        // Validate if user is logged in
        if(!cookie.session){
            router.push('/')
        }

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
    }, [])

    return (
        <div>
            <TopBar logged={cookie.session ? true : false} />
            
        </div>
    )
}
