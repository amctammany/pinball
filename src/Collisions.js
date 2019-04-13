import Vector from "./Vector";

export function polygonCollidesWithPolygon(p1, p2, displacement) {
  const mtv1 = getMTV(p1, p2, displacement, p1.getAxes());
  const mtv2 = getMTV(p1, p2, displacement, p2.getAxes());
  // var mtv1 = p1.minimumTranslationVector(p1.getAxes(), p2, displacement),
  // mtv2 = p1.minimumTranslationVector(p2.getAxes(), p2, displacement);

  if (mtv1.overlap === 0 || mtv2.overlap === 0)
    return { axis: undefined, overlap: 0 };
  return mtv1.overlap < mtv2.overlap ? mtv1 : mtv2;
}
export function checkMTVAxisDirection(mtv, collider, collidee) {
  if (mtv.axis === undefined) return;

  const centroid1 = new Vector(collider.centroid());
  const centroid2 = new Vector(collidee.centroid());
  const centroidVector = centroid2.subtract(centroid1);
  const centroidUnitVector = new Vector(centroidVector).normalize();

  return centroidUnitVector.dot(mtv.axis) > 0
    ? { axis: mtv.axis.multiply(-1), overlap: mtv.overlap }
    : mtv;
  // if (centroidUnitVector.dotProduct(mtv.axis) > 0) {
  // mtv.axis.x = -mtv.axis.x;
  // mtv.axis.y = -mtv.axis.y;
  // }
}
function getMTV(shape1, shape2, displacement = 0, axes) {
  return axes.reduce(
    ({ axis, overlap }, ax) => {
      const proj1 = shape1.project(ax);
      const proj2 = shape2.project(ax);
      const p12overlap = proj1.getOverlap(proj2);

      if (p12overlap === 0) {
        return { axis: undefined, overlap: p12overlap };
      }
      if (p12overlap < overlap) {
        return { axis: ax, overlap: p12overlap };
      }
      return { axis, overlap };
    },
    { axis: undefined, overlap: 999999 }
  );
}
export function polygonCollidesWithCircle(polygon, circle) {
  const closest = getPolygonPointClosestToPoint(polygon, circle.position);
  const axes = polygon.getAxes();
  axes.push(circle.position.subtract(closest).normalize());
  console.log(axes)
  return !polygon.seperationOnAxes(axes, circle);
}

export function checkProjectionOverlap(p1, p2) {
  if (!(p1.max > p2.min && p2.max > p1.min)) {
    return 0;
  }
  let overlap;
  if (p1.max > p2.max) {
    overlap = p2.max - p1.min;
  } else {
    overlap = p1.max - p2.min;
  }
  return overlap;
}
export function getPolygonPointClosestToPoint(polygon, point) {
  let min = 9999;
  let closest;
  for (let i = 0; i < polygon.points.length; ++i) {
    const pt = polygon.points[i];
    const length = Math.sqrt(
      Math.pow(pt.x - point.x, 2),
      Math.pow(pt.y - point.y, 2)
    );
    if (length < min) {
      min = length;
      closest = pt;
    }
  }
  return closest;
}
