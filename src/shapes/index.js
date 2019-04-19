import Circle from "./Circle";
import Point from "./Point";
import Rectangle from "./Rectangle";
import Line from "./Line";
import Polygon from "./Polygon";

export default {
  Circle,
  Point,
  Rectangle,
  Line,
  Polygon,
  createDomePolygons
};

const DOME_SIDES = 15;
const DOME_X = 275;
const DOME_Y = 235;
const DOME_RADIUS = 232;
function createDomePolygons({ x, y, radius, sides }) {
  const thetaDelta = Math.PI / sides;
  const midPointRadius = radius * 1.5;

  const polygons = [...Array(sides)].map((_, i) => {
    const points = [];
    const startTheta = i * thetaDelta;
    const endTheta = startTheta + thetaDelta;
    const midPointTheta = startTheta + (endTheta - startTheta) / 2;
    points.push([
      x + radius * Math.cos(startTheta),
      y - radius * Math.sin(startTheta)
    ]);

    points.push([
      x + midPointRadius * Math.cos(midPointTheta),
      y - midPointRadius * Math.sin(midPointTheta)
    ]);

    points.push([
      x + radius * Math.cos(endTheta),
      y - radius * Math.sin(endTheta)
    ]);

    points.push([
      x + radius * Math.cos(startTheta),
      y - radius * Math.sin(startTheta)
    ]);
    return new Polygon({ points, mass: 0 });
  });
  return polygons;
}
