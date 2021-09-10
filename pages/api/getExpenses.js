export default async (req, res) => {
// console.log(req.query, req.headers.authorization)
let stats = []
    if (req.query.mode === 'day') {
        // console.log(req.query)
        stats = await fetch(`${process.env.backend_nodejs}/api/v1/stats/expenses/day?limit=${req.query.limit}&day=${req.query.day}&month=${req.query.month}&year=${req.query.year}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                Authorization: `Bearer ${req.headers.authorization}`,
            }
        });
    } else if (req.query.mode === 'week') {
        // console.log(req.query)
        stats = await fetch(`${process.env.backend_nodejs}/api/v1/stats/expenses/week?limit=${req.query.limit}&day=${req.query.day}&month=${req.query.month}&year=${req.query.year}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                Authorization: `Bearer ${req.headers.authorization}`,
            }
        });
    } else if (req.query.mode === 'month') {
        // console.log(req.query)
        stats = await fetch(`${process.env.backend_nodejs}/api/v1/stats/expenses/month?limit=${req.query.limit}&day=${req.query.day}&month=${req.query.month}&year=${req.query.year}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                Authorization: `Bearer ${req.headers.authorization}`,
            }
        });
    } else if (req.query.mode === 'year') {
        // console.log(req.query)
        stats = await fetch(`${process.env.backend_nodejs}/api/v1/stats/expenses/year?limit=${req.query.limit}&day=${req.query.day}&month=${req.query.month}&year=${req.query.year}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                Authorization: `Bearer ${req.headers.authorization}`,
            }
        });
    }

    const data = await stats.json();

    // console.log(data)

    if (stats.ok) {
        res.status(200).json({
            status: 'success',
            data
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
