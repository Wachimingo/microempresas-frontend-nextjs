import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import dynamic from 'next/dynamic';
import Script from 'next/script';
const TopBar = dynamic(() => import('../components/TopBar'), { ssr: true });
const BarChart = dynamic(() => import('../components/Charts/BarChart'), {
  ssr: true,
});
const LineChart = dynamic(() => import('../components/Charts/LineChart'), {
  ssr: true,
});
const DonutChart = dynamic(() => import('../components/Charts/DonutChart'), {
  ssr: true,
});

export default function dashboard() {
  let dateTime = new Date();
  let today = dateTime
    .toISOString()
    .split('T')[0]
    .split('-')
    .reverse()
    .join('-');
  const month = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Septiembre',
    'Agosto',
    'Octubre',
    'Noviembre',
    'Deciembre',
  ];
  const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ];
  let [stats, setStats] = useState({
    fiado: 0,
    sold: 0,
    earnings: 0,
    totalSoldDishes: 0,
    totalFiadoDishes: 0,
    TotalDishes: 0,
  });
  let [statsHistory, setStatsHistory] = useState();
  const [loaded, setLoaded] = useState(false);
  const [loadedHistory, setLoadedHistory] = useState(false);
  const [pickedDate, setPickedDate] = useState(today);
  const [mode, setMode] = useState('day');
  const [historyMode, setHistoryMode] = useState('month');
  const options = {
    plugins: {
      datalabels: {
        display: true,
        color: 'black',
      },
    },
    rotation: 1 * Math.PI,
    circumference: 1 * Math.PI,
  };

  const [cookie] = useCookies(['session']);
  // const [loaded,setLoaded] = useState(false)
  useEffect(() => {
    const stats = fetch(`/api/getStats`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        mode: 'month',
        day: today.split('-')[0],
        month: today.split('-')[1],
        year: today.split('-')[2],
        token: cookie.session.token,
      }),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then((res) => setStats(res.data))
      .then(() => setLoaded(true));

    const statsHistory = fetch(`/api/getStatsHistory`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        year: today.split('-')[2],
        token: cookie.session.token,
      }),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then((res) => setStatsHistory(res.data))
      .then(() => setLoadedHistory(true));
  }, []);

  const loadNewData = (e) => {
    e.preventDefault();
    const stats = fetch(`/api/getStats`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        mode,
        day: pickedDate.split('-')[0],
        month: pickedDate.split('-')[1],
        year: pickedDate.split('-')[2],
        token: cookie.session.token,
      }),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then((res) => setStats(res.data));
  };
  const putCategory = (category) => {
    console.log(category)
  };

  if (!loaded) {
    return <div></div>; //show nothing or a loader
  } else {
    return (
      <div>
        <TopBar logged={cookie.session ? true : false} />
        <div className="container">
          <h1>Estadisticas</h1>
          <form onSubmit={(e) => loadNewData(e)}>
            <div className="row">
              <div className="col">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="day" defaultValue>
                    Hoy
                  </option>
                  <option value="month">Mes</option>
                  <option value="year">Año</option>
                </select>
              </div>
              <div className="col">
                <input
                  onChange={(e) =>
                    setPickedDate(
                      e.target.value
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('-')
                    )
                  }
                  type="date"
                  id="date"
                  className="form-control"
                />
              </div>
            </div>
            <input type="submit" value="Buscar" />
          </form>
          <div className="row">
            <div className="col">
              <DonutChart
                category={'Platos'}
                name={'Platos vendidos'}
                labels={['Vendido', 'Restante']}
                values={[stats.TotalDishes, 50 - stats.TotalDishes]}
                options={options}
                chartId={'platos'}
              />
            </div>
            <div className="col">
              <DonutChart
                category={'Comparacion'}
                name={'Pagado vs Fiado'}
                labels={['Pagado', 'Fiado']}
                values={[stats.totalSoldDishes, stats.totalFiadoDishes]}
                chartId={'pagadoVsFiado'}
              />
            </div>
            <div className="col">
              <DonutChart
                category={'Finanzas'}
                name={'Ganancias'}
                labels={['Entrada', 'Meta']}
                values={[stats.earnings, 100 - stats.earnings]}
                options={options}
                chartId={'ganancias'}
              />
            </div>
          </div>
          <h1>Historiales</h1>
          <form onSubmit={(e) => loadNewData(e)}>
            <div className="row">
              <div className="col">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={(e) => putCategory(e.target.value)}
                >
                  <option value="totalDishes" defaultValue>
                    Total de Platos
                  </option>
                  <option value="earnings">Ganancias</option>
                  <option value="fiado">Fiado</option>
                  <option value="sold">Vendido</option>
                  <option value="totalFiadoDishes">Platos fiados</option>
                  <option value="totalSoldDishes">Platos pagados</option>
                </select>
              </div>
              <div className="col">
                <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={(e) => sethistoryMode(e.target.value)}
                >
                  <option value="month" defaultValue>
                    Mes
                  </option>
                  <option value="day">Dia</option>
                  <option value="year">Año</option>
                </select>
              </div>
              <div className="col">
                <input
                  onChange={(e) =>
                    setPickedDate(
                      e.target.value
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('-')
                    )
                  }
                  type="date"
                  id="date"
                  className="form-control"
                />
              </div>
            </div>
            <input type="submit" value="Buscar" />
          </form>
          <div className="row">
            <div className="col">
              {loadedHistory ? (
                <LineChart
                  category={'Platos'}
                  name={'Semana'}
                  labels={month}
                  dataSetLabel={statsHistory.year}
                  values={statsHistory.TotalDishes}
                  chartId={'week'}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <br />
        <Script
          src="https://google.com"
          onLoad={() => {
            document.getElementById('date').value = dateTime
              .toISOString()
              .split('T')[0];
          }}
        />
      </div>
    );
  }
}
