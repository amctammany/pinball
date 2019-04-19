import Vector from "./Vector";

function getMTV(shape1, shape2, displacement = 0, axes) {
  return axes.reduce(
    ({ axis, overlap }, ax) => {
      const proj1 = shape1.project(ax);
      const proj2 = shape2.project(ax);
      const p12overlap = proj1.getOverlap(proj2, displacement);

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
export function circleCollidesWithCircle(c1, c2) {
  const distance = c2.position.subtract(c1.position).getMagnitude();

  const overlap = Math.abs(c1.radius + c2.radius) - distance;

  return overlap < 0
    ? { axis: undefined, overlap: 0 }
    : { axis: undefined, overlap };
}

export function polygonCollidesWithPolygon(p1, p2, displacement) {
  const mtv1 = getMTV(p1, p2, displacement, p1.getAxes());
  const mtv2 = getMTV(p1, p2, displacement, p2.getAxes());

  if (mtv1.overlap === 0 || mtv2.overlap === 0)
    return { axis: undefined, overlap: 0 };
  return mtv1.overlap < mtv2.overlap ? mtv1 : mtv2;
}
export function checkMTVAxisDirection(mtv, collider, collidee) {
  if (mtv.axis === undefined) return mtv;

  const centroid1 = new Vector(collider.centroid());
  const centroid2 = new Vector(collidee.centroid());
  const centroidVector = centroid2.subtract(centroid1);
  const centroidUnitVector = new Vector(centroidVector).normalize();

  return centroidUnitVector.dot(mtv.axis) > 0
    ? { axis: mtv.axis.multiply(-1), overlap: mtv.overlap }
    : mtv;
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
  return polygon.points.reduce(
    (acc, pt) => {
      const length = Math.sqrt((pt.x - point.x) ** 2, (pt.y - point.y) ** 2);
      return length < acc.min ? { min: length, closest: pt } : acc;
    },
    { closest: null, min: 99999 }
  ).closest;
}

export function polygonCollidesWithCircle(polygon, circle) {
  const closest = getPolygonPointClosestToPoint(polygon, circle.position);
  const axes = polygon.getAxes();
  axes.push(circle.position.subtract(closest).normalize());
  return getMTV(polygon, circle, 0, axes);
}

export function separate(b, axis, overlap) {
  const d = axis.multiply(overlap);
  const { x: dx, y: dy } = d;
  const { x: vx, y: vy } = b.velocity;

  const delta = {
    x: (dx < 0 && vx < 0) || (dx > 0 && vx > 0) ? -1 * dx : dx,
    y: (dy < 0 && vy < 0) || (dy > 0 && vy > 0) ? -1 * dy : dy
  };
  b.move(delta);
}
export function resolveCollision(mtv, b1, b2) {
  const axis =
    mtv.axis !== undefined
      ? mtv.axis.normalize()
      : b1
          .getPosition()
          .subtract(b2.getPosition())
          .normalize();

  // if (b1.invMass) separate(b1, axis, mtv.overlap);
  // if (b2.invMass) separate(b2, axis, mtv.overlap);

  const relativeVelocity = b2.velocity.subtract(b1.velocity); // .normalize()
  const velocityAlongNormal = relativeVelocity.dot(axis);
  if (velocityAlongNormal < 0) return;
  const aa = axis.dot(axis);

  const totalInvMass = b1.invMass + b2.invMass;

  const impulse = axis.multiply(
    (-2 * velocityAlongNormal) / (totalInvMass * aa)
  );
  b1.velocity = b1.velocity.subtract(impulse.multiply(b1.invMass));
  b2.velocity = b2.velocity.add(impulse.multiply(b2.invMass));
}
