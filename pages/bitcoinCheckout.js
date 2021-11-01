import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import AuthContext from '../context/authContext';
const classes = require("./../styles/checkout.module.css");

export default function checkout(props) {
    const router = useRouter();
    const ids = router.query.ids;
    const customerName = router.query.name;
    const billId = router.query.billId;
    const amount = router.query.amount;
    const [checkoutObject, setcheckoutObject] = useState();
    const { session } = useContext(AuthContext);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // console.log(ids)
        let customerRealName = session.name;

        if (customerName !== undefined && customerName !== null && customerName !== "") {
            customerRealName = customerName;
        }

        // Create PaymentIntent as soon as the page loads
        fetch('/api/opennode', {
            method: "POST",
            body: JSON.stringify({
                ids,
                customer: customerRealName,
                email: session.email,
                billId,
                amount
            }),
        })
            .then((res) => res.json())
            //   .then((res) => {console.log(res)})
            .then((res) => handleResult(res));
    }, []);

    const handleResult = (res) => {
        if (res.error) {
            console.log(res.error);
            return;
        } else {
            console.log(res);
            setcheckoutObject(res);
            setIsLoaded(true);
        }
    }
    const goBack = () => {
        router.push({
          pathname: `/`,
          query: { redirect_status: 'cancelled' },
        },
          '/');
      }
      
    if (isLoaded) {
        return (
            <div>
                <Button variant="danger" onClick={goBack}>Cancelar</Button>
                <iframe src={`https://dev-checkout.opennode.com/${checkoutObject.id}`} style={{overflow:"hidden", overflowX: "hidden", overflowY:"hidden", height:"100%", width:"100%",position:"absolute",top:"0px",left:"0px",right:"0px",bottom:"0px",border:"none"}}></iframe>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }
}
