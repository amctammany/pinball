import Polygon from "./Polygon";

class Rectangle extends Polygon {
  constructor(props) {
    const { x, y, width, height } = props;
    const points = [
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height]
    ];
    super({ ...props, points });
  }
}

export default Rectangle;
