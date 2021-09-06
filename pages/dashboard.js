import { useState, useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from './../context/authContext';
import dynamic from 'next/dynamic';
import Script from 'next/script';
const classes = import('./../styles/dashboard.module.css');
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
  const { session } = useContext(AuthContext);
  let dateTime = new Date();
  let nextWeek = new Date(
    dateTime.setDate(dateTime.getDate() - dateTime.getDay() + 1) +
    7 * 24 * 60 * 60 * 1000
  );
  let today = dateTime
    .toISOString()
    .split('T')[0]
    .split('-')
    .reverse()
    .join('-');
  let nextWeekF = nextWeek
    .toISOString()
    .split('T')[0]
    .split('-')
    .reverse()
    .join('-');

  let monday = new Date(
    dateTime.setDate(dateTime.getDate() - dateTime.getDay() + 1)
  )
    .toISOString()
    .split('T')[0]
    .split('-')
    .reverse()
    .join('-');
  const month = [
    '',
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Deciembre',
  ];
  const days = [
    '',
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
  let fiado = [];
  let sold = [];
  let earnings = [];
  let totalSoldDishes = [];
  let totalFiadoDishes = [];
  let totalDishes = [];
  const [loaded, setLoaded] = useState(false);
  const [loadedHistory, setLoadedHistory] = useState(false);
  const [pickedDate, setPickedDate] = useState(today);
  const [mode, setMode] = useState('day');
  const [valuesArray, setValuesArray] = useState({
    fiado,
    sold,
    earnings,
    totalFiadoDishes,
    totalSoldDishes,
    totalDishes,
  });
  const [value, setValue] = useState('totalDishes');
  const [historyMode, setHistoryMode] = useState('day');
  const [lineDate = dateTime.toISOString().split('T')[0], setLineDate] = useState();
  const [donutDate = dateTime.toISOString().split('T')[0], setDonutDate] = useState();

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

  function getMondays() {
    var d = new Date(),
      month = d.getMonth(),
      mondays = [];

    d.setDate(1);

    // Get the first Monday in the month
    while (d.getDay() !== 1) {
      d.setDate(d.getDate() + 1);
    }

    // Get all the other Mondays in the month
    while (d.getMonth() === month) {
      mondays.push(new Date(d.getTime()));
      d.setDate(d.getDate() + 7);
    }

    return mondays;
  }

  useEffect(() => {
    let isConnected = true;
    fetch(`/api/getStats`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        mode,
        day: today.split('-')[0],
        month: today.split('-')[1],
        year: today.split('-')[2],
        token: session.token,
      }),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then((res) => valitateIfemtpy(res))
      .then(() => setLoaded(true))
      .catch((error) => {
        if (isConnected) {
          setState((prevState) => ({
            ...prevState,
            error,
          }));
        }
      });

    fetch(`/api/getStatsHistory`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        historyMode,
        day: monday.split('-')[0],
        month: monday.split('-')[1],
        year: monday.split('-')[2],
        day2: nextWeekF.split('-')[0],
        month2: nextWeekF.split('-')[1],
        year2: nextWeekF.split('-')[2],
        token: session.token,
      }),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res.data.result))
      .then((res) => fillingArrayForLineChart(res.data.result, historyMode))
      .then(() => setLoadedHistory(true));

    // cancel subscription to useEffect
    return () => (isConnected = false);
  }, [stats]);

  const valitateIfemtpy = (res) => {
    if (res.data.result.length > 0) {
      setStats(res.data.result[0]);
    }
  };

  const loadNewData = (e) => {
    e.preventDefault();
    let pickedDate = document.getElementById('donutDate').value;
    let mode = document.getElementById('donutList').value;
    fetch(`/api/getStats`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        mode,
        day: pickedDate.split('-')[2],
        month: pickedDate.split('-')[1],
        year: pickedDate.split('-')[0],
        token: session.token,
      }),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res))
      .then((res) => valitateIfemtpy(res));
  };

  const putValue = (category) => {
    setValue(category);
  };

  const putHistoryMode = (mode) => {
    setHistoryMode(mode);
  };

  const loadNewStatsHistory = (e) => {
    e.preventDefault();

    let pickedDate = new Date(document.getElementById('lineDate').value);
    let pickedDateMonday = new Date(
      pickedDate.setDate(pickedDate.getDate() - pickedDate.getDay())
    );
    let pickedDateMondayF = pickedDateMonday
      .toISOString()
      .split('T')[0]
      .split('-')
      .reverse()
      .join('-');

    // console.log(pickedDate, lineDate, pickedDateMondayF)

    let historyMode = document.getElementById('lineMode').value;

    let nextWeek = new Date(
      pickedDateMonday.setDate(
        pickedDateMonday.getDate() - pickedDateMonday.getDay()
      ) +
        7 * 24 * 60 * 60 * 1000
    );
    let nextWeekF = nextWeek
      .toISOString()
      .split('T')[0]
      .split('-')
      .reverse()
      .join('-');

    setHistoryMode(historyMode);

    fetch(`/api/getStatsHistory`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        historyMode,
        day: pickedDateMondayF.split('-')[0],
        month: pickedDateMondayF.split('-')[1],
        year: pickedDateMondayF.split('-')[2],
        day2: nextWeekF.split('-')[0],
        month2: nextWeekF.split('-')[1],
        year2: nextWeekF.split('-')[2],
        token: session.token,
      }),
    })
      .then((res) => res.json())
      // .then((res) => console.log(res.data))
      .then((res) => fillingArrayForLineChart(res.data.result, historyMode));
  };

  const fillingArrayForLineChart = (result, historyMode) => {
    if (historyMode === 'month') {
      result.map((el) => {
        fiado[el._id] = el.fiado;
        sold[el._id] = el.sold;
        earnings[el._id] = el.earnings;
        totalSoldDishes[el._id] = el.totalSoldDishes;
        totalFiadoDishes[el._id] = el.totalFiadoDishes;
        totalDishes[el._id] = el.totalFiadoDishes + el.totalSoldDishes;
      });
      setValuesArray({
        fiado,
        sold,
        earnings,
        totalFiadoDishes,
        totalSoldDishes,
        totalDishes,
      });
    } else if (historyMode === 'year') {
      let year = [];
      result.map((el) => {
        fiado.push(el.fiado);
        sold.push(el.sold);
        earnings.push(el.earnings);
        totalSoldDishes.push(el.totalSoldDishes);
        totalFiadoDishes.push(el.totalFiadoDishes);
        year.push(el._id);
        totalDishes.push(el.totalFiadoDishes + el.totalSoldDishes);
      });
      setValuesArray({
        fiado,
        sold,
        earnings,
        totalFiadoDishes,
        totalSoldDishes,
        totalDishes,
        year,
      });
    } else if (historyMode === 'day') {
      result.map((el) => {
        fiado[el._id] = el.fiado;
        sold[el._id] = el.sold;
        earnings[el._id] = el.earnings;
        totalSoldDishes[el._id] = el.totalSoldDishes;
        totalFiadoDishes[el._id] = el.totalFiadoDishes;
        totalDishes[el._id] = el.totalFiadoDishes + el.totalSoldDishes;
      });
      setValuesArray({
        fiado,
        sold,
        earnings,
        totalFiadoDishes,
        totalSoldDishes,
        totalDishes,
      });
    }
  };

  const lineChart = () => {
    let category = '';
    let dataSetLabel = '';
    if (value === 'totalDishes')
      (category = 'Total de platos'), (dataSetLabel = 'Platos');
    if (value === 'earnings')
      (category = 'Dinero ganado neto'), (dataSetLabel = 'Dinero');
    if (value === 'totalFiadoDishes')
      (category = 'Total de platos fiados'), (dataSetLabel = 'Platos');
    if (value === 'totalSoldDishes')
      (category = 'Total de platos pagados'), (dataSetLabel = 'Platos');
    if (value === 'fiado')
      (category = 'Total de dinero en platos fiados'),
        (dataSetLabel = 'Dinero');
    if (value === 'sold')
      (category = 'Total de dinero en platos pagados'),
        (dataSetLabel = 'Dinero');
    if (loadedHistory) {
      if (historyMode === 'month') {
        return (
          <LineChart
            category={category}
            name={'Por mes'}
            labels={month}
            dataSetLabel={dataSetLabel}
            values={valuesArray[value]}
            chartId={'lineHistory'}
            height={process.env.NEXT_PUBLIC_Line_Chart_Height}
            maintainAspectRatio={false}
          />
        );
      } else if (historyMode === 'year') {
        return (
          <LineChart
            category={category}
            name={'Por año'}
            labels={valuesArray['year']}
            dataSetLabel={dataSetLabel}
            values={valuesArray[value]}
            chartId={'lineHistory'}
            height={process.env.NEXT_PUBLIC_Line_Chart_Height}
            maintainAspectRatio={false}
          />
        );
      } else if (historyMode === 'day') {
        return (
          <LineChart
            category={category}
            name={'Por dia'}
            labels={days}
            dataSetLabel={dataSetLabel}
            values={valuesArray[value]}
            chartId={'lineHistory'}
            height={process.env.NEXT_PUBLIC_Line_Chart_Height}
            maintainAspectRatio={false}
          />
        );
      }
    }
    return <></>;
  };

  if (!loaded) {
    return <div></div>; //show nothing or a loader
  } else {
    return (
      <div>
        <div className="container">
          <h1>Estadisticas</h1>
          <form id="donutForm" onSubmit={loadNewData}>
            <div className="row">
              <div className="col">
                <select
                  id="donutList"
                  className="form-select"
                  aria-label="Default select example"
                >
                  <option value="day" defaultValue>
                    Hoy
                  </option>
                  <option value="month">Mes</option>
                  <option value="year">Año</option>
                </select>
              </div>
              <div className="col">
                <input type="date" value={donutDate} onChange={(e) => setDonutDate(e.target.value)} id="donutDate" className="form-control" />
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
                values={[
                  stats.totalFiadoDishes + stats.totalSoldDishes,
                  50 - (stats.totalFiadoDishes + stats.totalSoldDishes),
                ]}
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
                className={classes.lineChart}
              />
            </div>
          </div>
          <h1>Historiales</h1>
          <form id="lineForm" onSubmit={loadNewStatsHistory}>
            <div className="row">
              <div className="col">
                <select
                  id="lineCategory"
                  className="form-select"
                  aria-label="Default select example"
                  onChange={(e) => putValue(e.target.value)}
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
                  id="lineMode"
                  className="form-select"
                  aria-label="Default select example"
                // onChange={(e) => putHistoryMode(e.target.value)}
                >
                  <option value="day" defaultValue>
                    Dia
                  </option>
                  <option value="month">Mes</option>
                  <option value="year">Año</option>
                </select>
              </div>
              <div className="col">
                <input type="date" id="lineDate" className="form-control" value={lineDate} onChange={(e) => setLineDate(e.target.value)} />
              </div>
            </div>
            <input type="submit" value="Buscar" />
          </form>
          <div className={'row'}>
            <div className="col">{lineChart()}</div>
          </div>
        </div>
        <br />
      </div>
    );
  }
}
