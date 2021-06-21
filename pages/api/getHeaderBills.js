export default async (req, res) => {
    const HeaderBillings = await fetch(
      `http://localhost:3001/api/v1/bills`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    const result = await HeaderBillings.json();
  
    if (HeaderBillings.ok) {
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
  