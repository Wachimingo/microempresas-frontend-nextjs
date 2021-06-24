import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import dynamic from 'next/dynamic';
// import BarChart from '../components/Charts/BarChart';
import DonutChart from '../components/Charts/DonutChart';
const TopBar = dynamic(() => import('../components/TopBar'), { ssr: false });
const BarChart = dynamic(() => import('../components/Charts/BarChart'), { ssr: false });
// const Charts = dynamic(() => import('../components/Charts'), { ssr: false });

export default function dashboard() {
  const [cookie] = useCookies(['session']);
  const [earnings, setEarnings] = useState();
  const [sold, setSold] = useState();
  const [fiado, setFiado] = useState();
  const [totalDishes, setTotalDishes] = useState();
  // const [loaded,setLoaded] = useState(false)
  useEffect(() => {
    
  }, []);

  // if(!loaded){
  //     return <div></div> //show nothing or a loader
  // }
  return (
    <div>
      <TopBar logged={cookie.session ? true : false} />

      <div className="container">
        <div className="row">
          <div className="col">
            <DonutChart
              name={'Platos vendidos'}
              labels={['Vendido', 'Restante']}
              values={[300, 50]}
            />
          </div>
          <div className="col">
            <DonutChart
              name={'Ganancias'}
              labels={['Ingresos', 'Meta']}
              values={[50, 25]}
            />
          </div>
          <div className="col">
            <DonutChart
              name={'Fiados'}
              labels={['Platos']}
              values={[10,1]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
