import { useEffect, useState, useContext } from 'react'
import AuthContext from '../context/authContext'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PaginationControls from './../components/NavigationItems/PaginationControls';
import SearchBar from './../components/NavigationItems/SearchBar';

export default function User() {
    const { session } = useContext(AuthContext)
    const [users, setUsers] = useState()
    const [totalRecords, setTotalRecords] = useState(1)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        fetch('/api/users?limit=10&page=1`', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session.token}`
            },
        }).then(res => res.json()).then(res => updateStates(res))
    }, [])

    const updateStates = (res) => {
        // console.log(res)
        if (res.data !== undefined) {
            setUsers(res.data.records)
            setTotalRecords(res.data.totalRecords)
            setLoaded(true)
        }
    }

    const toggleFiar = (id, fiar) => {
        fetch(`/api/users?id=${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.token}`
            },
            body: JSON.stringify({
                fiar
            })
        })
            .then(res => res.json())
            .then(() => location.reload())
        // .then((res) => updateStates(res))
    }


    if (!loaded) {
        return <div>Loading...</div>
    } else {
        return (
            <>
                <h1 style={{marginLeft: "37vw"}}>Usuarios registrados</h1>
                <br/>
                <section style={{marginLeft: "45vw"}}>
                <PaginationControls
                    token={session.token}
                    totalRecords={totalRecords}
                    limit={10}
                    toUpdateParent={updateStates}
                    url={'/api/users'}
                    method={'GET'}
                />
                <br />
                </section>
                <br/>
                <section style={{marginLeft: "12vw"}}>
                <Container fluid>
                    <Row>
                        <Col>Usuario</Col>
                        <Col>Correo</Col>
                        <Col>Telefono</Col>
                        <Col>Puede fiar</Col>
                    </Row>
                    {
                        // console.log(users)
                        users.map((user, index) => {
                            if (user.role === 'user') {
                                return (
                                    <Row key={user._id + index}>
                                        <Col>{user.name}</Col>
                                        <Col>{user.email}</Col>
                                        <Col>{user.tn}</Col>
                                        <Col>
                                            {user.canBorrow ? <Button variant="danger" onClick={() => toggleFiar(user._id, !user.canBorrow)}>Denegar</Button> : <Button variant="success" onClick={() => toggleFiar(user._id, !user.canBorrow)}>Permitir</Button>}
                                        </Col>
                                    </Row>
                                )
                            } else return null
                        })
                    }
                </Container>
                </section>
            </>
        )
    }
}