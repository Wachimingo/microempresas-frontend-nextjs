import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/authContext';
import Table from './../components/Table';

export default function Menu() {
    let dateTime = new Date();
    const { session } = useContext(AuthContext);
    const [item, setItem] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [date = dateTime.toISOString().split('T')[0], setDate] = useState();
    useEffect(() => {
        fetch(`/api/getExpenses?limit=100&day=07&month=09&year=2021&mode=day`,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    Authorization: session.token
                }
            }
        )
            .then((res) => res.json())
            // .then((res) => console.log(res))
            .then((res) => setItem(res.data.records))
            .then(()=> setLoaded(true));
    }, [])

    const getStats = () => {
        let pickedDate = document.getElementById('calendar').value;
        let mode = document.getElementById('calendarMode').value;
        fetch(`/api/getExpenses?limit=100&day=${pickedDate.split('-')[2]}&month=${pickedDate.split('-')[1]}&year=${pickedDate.split('-')[0]}&mode=${mode}`,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    Authorization: session.token
                }
            }
        )
            .then((res) => res.json())
            // .then((res) => console.log(res))
            .then((res) => setItem(res.data.records));
    }

    if (!loaded) {
        return <h1>Cargando...</h1>
    } else {
        return (
            <>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} id="calendar" className="form-control" />

                <select
                    id="calendarMode"
                    className="form-select"
                    aria-label="Default select example"
                // onChange={(e) => putHistoryMode(e.target.value)}
                >
                    <option value="day" defaultValue>
                        Dia
                    </option>
                    <option value="week">Semana</option>
                    <option value="month">Mes</option>
                    <option value="year">Año</option>
                </select>
                <input type="button" value="Buscar" onClick={(e) => getStats(e)} />
                <div className="card">
                    <div className="card-body">
                        {/* {console.log(items[0].expense)} */}
                        <h5 className="card-title">Gasto total del dia</h5>
                        {item.length > 0 ? '$' + item[0].expense : `No hay datos de esta fecha ${date}`}
                    </div>
                </div>
            </>
        );
    }
}