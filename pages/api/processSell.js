export default async (req, res) => {
  const processSell = await fetch(`http://192.168.1.2:3001/api/v1/bills`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: req.headers.authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      totalPrice: req.body.totalPrice,
      totalDishes: req.body.totalDishes,
      day: req.body.day,
      isFiado: req.body.isFiado,
    }),
  });

  const result = await processSell.json();

  if (processSell.ok) {
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
