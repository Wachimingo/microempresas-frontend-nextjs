export default async (req, res) => {
    const stats = await fetch('http://localhost:3001/api/v1/bills/stats/months', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${req.body.token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        year: req.body.year,
      }),
    });
  
    const data = await stats.json();
    if (stats.ok) {
      res.status(200).json({
        status: 'success',
        data: data.data,
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          message: data.message,
        },
      });
    }
  };
  