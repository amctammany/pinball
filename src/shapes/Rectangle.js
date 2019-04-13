import Polygon from "./Polygon";

class Rectangle extends Polygon {
  constructor(props) {
    const { x, y, width, height } = props;
    const points = [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height }
    ];
    super({ ...props, points });
  }
}

export default Rectangle;
