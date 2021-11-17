const classes = require('./../styles/menu.module.css');
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image'

export default function Caroussel(props) {
  return (
    <>
      <br/>
      <div className={`${classes.carouselSize}`}>
        <Carousel>
          {props.items.map((el, i) => {
            if (el.forToday) {
              let image = el.image !== undefined ? `http://localhost:3000/dishes/${el.image}` : `http://localhost:3000/dishes/stockDishImg.png`
              return (
                <Carousel.Item>
                  <Image
                    src={image}
                    fluid
                  />
                  <Carousel.Caption >
                    <div style={{ backgroundColor: 'black', opacity: "0.5" }}>
                      <h3>{el.name}</h3>
                      <p>{el.description}</p>
                    </div>
                  </Carousel.Caption>
                </Carousel.Item>
              )
            }
          })}
        </Carousel>
      </div>
    </>
  )
}