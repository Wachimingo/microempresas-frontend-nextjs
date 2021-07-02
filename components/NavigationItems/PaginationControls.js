export default function PaginationControls(props) {

    const searchPage = (page) => {
        fetch(`/api/getDetailedBills`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${props.token}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            limit: 10,
            page,
            sort
          }),
        })
          .then((res) => res.json())
          // .then((res) => console.log(res.data.result.data.doc))
          .then(
            (res) => {
              setItems(res.data.result.data.doc);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              setError(error);
            }
          );
      };
  let drawPagination = () => {
    // console.log(Math.ceil(totalRecords / 10))
    let totalPages = [];
    for (let i = 0; i < Math.ceil(props.totalRecords / 10); i++) {
      totalPages.push(i);
    }
    return totalPages;
  };
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        {/* Previous Page */}
        <li className="page-item">
          <a className="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {drawPagination().map((el, i) => {
          return (
            <li key={i} className="page-item">
              <button
                className="page-link"
                onClick={(e) => searchPage(i * 1 + 1)}
              >
                {i * 1 + 1}
              </button>
            </li>
          );
        })}
        {/* Next Page */}
        <li className="page-item">
          <a className="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
