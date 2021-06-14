const classes = require('./../styles/menu.module.css');
export default function Caroussel(props) {
  return (
    <div className={classes.centerCarousel}>
      {/* Carousel */}
      <div
        id="carouselExampleControls"
        className={'carousel slide d-block ' + classes.carouselSize}
        data-bs-ride="carousel"
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          {props.items.map((el, i) => {
            let active = '';
            if (i === 1) {
              active = 'active';
            } else {
              active = '';
            }
            if (el.forToday) {
              return (
                <button
                  key={i}
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to={i}
                  className={active}
                  style={{ backgroundColor: 'black' }}
                  aria-current="true"
                  aria-label={'Slide to ' + i}
                ></button>
              );
            }
          })}
        </div>
        <div className="carousel-inner">
          {props.items.map((el, i) => {
            let active = '';
            if (i === 1) {
              active = 'active';
            } else {
              active = '';
            }
            if (el.forToday) {
              return (
                <div key={i} className={'carousel-item ' + active}>
                  <div className="card">
                    <img
                      src={'http://localhost:3001/img/dishes/' + el.image}
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 className="card-title">{el.name}</h5>
                      <p className="card-text">{el.description}</p>
                    </div>
                  </div>
                </div>
              );
            } else return null;
          })}
        </div>
        {/* Controls */}
        <div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}
