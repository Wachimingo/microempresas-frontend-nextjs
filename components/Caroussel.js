const classes = require('./../styles/menu.module.css');
import { UncontrolledCarousel, Row, Col } from 'reactstrap';

export default function Caroussel(props) {

  const carussel = () => {
    const items = [];

    props.items.map((el, i) => {
      if (el.forToday) {
        items.push({
          src: `/dishes/${el.image}`,
          altText: `Slide ${i}`,
          caption: '',
          header: '',
          key: i + el._id,
        });
      }
    });

    return (
      <UncontrolledCarousel items={items}/>
    );
  };

  return <div className={classes.carouselSize}>{carussel()}</div>;
}
