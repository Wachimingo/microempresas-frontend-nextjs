import { useState, useEffect } from 'react';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
const classes = require('./../styles/menu.module.css');

export default function MenuAdmin(props) {
  const [visible, setVisible] = useState(props.visible);

  useEffect(()=>{
    setVisible(props.visible)
  }, [])

  let section = (title, componentName, Component) => {
      return(<div>
        {/* Title of the section */}
        <h1 className={'centered ' + classes.centerButtons}>{title}</h1>
        <button
          type="button"
          className={'btn btn-info ' + classes.centerButtons}
          onClick={(e) => setVisible(!visible)}
        >
          {/* Show/Hide button */}
          {visible ? (
            <>
              <BsEye /> Mostrar {componentName}
            </>
          ) : (
            <>
              <BsEyeSlash /> Ocultar {componentName}
            </>
          )}
        </button>
        {/* Render of the Component */}
        {visible ? null : Component}
      </div>);
  };
  return (
    <div>
      {section(props.title, props.componentName, props.Component)}
    </div>
  );
}
