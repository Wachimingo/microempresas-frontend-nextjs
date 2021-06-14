import TopBar from '../components/TopBar';
import {useState, useEffect} from 'react';
import cookieCutter from 'cookie-cutter';
export default function inventario() {
    const [loaded,setLoaded] = useState(false)
    useEffect(() => {
        // conditional redirect
        if(!cookieCutter.get('jwt')){
            // with router.push the page may be added to history
            // the browser on history back will  go back to this page and then forward again to the redirected page
            // you can prevent this behaviour using location.replace
            location.replace('/')
        }else{
            setLoaded(true)
        }
      },[]);

    if(!loaded){
        return <div></div> //show nothing or a loader
    }
    return (
        <div>
            <TopBar/>
        </div>
    )
}
