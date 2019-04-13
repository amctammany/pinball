import Polygon from './Polygon'

class Rectangle extends Polygon {
  constructor(props) {
    const {x, y, width, height} = props;
    const points = [
      {x, y},
      {x: x+width, y},
      {x: x+width, y: y+height},
      {x: x, y: y+height},
    ]
    super({...props, points})
    //this.x = props.x;
    //this.y = props.y;
    //this.width = props.width;
    //this.height = props.height;
  }
}

export const Rectangle;
