export default async (req, res) => {
  const detailedBillings = await fetch(
    `http://localhost:3001/api/v1/bills/detailedBilling`,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: req.headers.authorization,
      },
    }
  );
  const result = await detailedBillings.json();

  if (detailedBillings.ok) {
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
        message: result.message[0].message,
      },
    });
  }
};
