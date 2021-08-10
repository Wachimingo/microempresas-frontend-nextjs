export default async (req, res) => {
  const records = await fetch(
    `http://localhost:3001/api/v1/bills/?limit=100`,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: req.headers.authorization,
      },
    }
  );

  const result = await records.json();
  // console.log(result)
  if (records.ok) {
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
