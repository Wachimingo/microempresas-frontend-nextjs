export default async (req, res) => {
    const addDishesToBill = await fetch(`http://192.168.1.2:3001/api/v1/bills/detailedBilling`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: req.headers.authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bill: req.body.bill,
        dish: req.body.dish,
        // amount: req.body.amount,
        day: req.body.day,
      }),
    });
  
    const result = await addDishesToBill.json();
  
    if (addDishesToBill.ok) {
      res.status(201).json({
        status: 'success',
        data: {
          result,
        },
      });
    } else {
      res.status(401).json({
        status: 'failed',
        data: {
          message: result.message,
        },
      });
    }
  };
  