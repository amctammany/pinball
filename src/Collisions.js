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
  return getMTV(polygon, circle, 0, axes)
  //return !polygon.seperationOnAxes(axes, circle);
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
  return polygon.points.reduce((acc, pt) => {
    const length = Math.sqrt(
      (pt.x - point.x) ** 2,
      (pt.y - point.y) ** 2
    )
    return length < acc.min ? {min: length, closest: pt} : acc;

  }, {closest: null, min: 99999}).closest
 }

export function separate(b, axis, overlap) {
  const d = axis.multiply(overlap)
  const {x: dx, y: dy} = d
  const {x: vx, y: vy} = b.velocity

  const delta = {
    x: ((dx < 0 && vx < 0) || (dx > 0 && vx > 0)) ? -1 * dx : dx,
    y: ((dy < 0 && vy < 0) || (dy > 0 && vy > 0)) ? -1 * dy : dy
  }
  b.move(delta)

}
export function resolveCollision(mtv, b1, b2) {
  const axis = mtv.axis !== undefined ? mtv.axis//.normalize()//.perpendicular()
    : b1.getPosition().subtract(b2.getPosition())//.normalize()//.perpendicular();

  if (b1.invMass) separate(b1, axis, mtv.overlap)
   //if (b1.invMass) b1.move(mtv.axis.multiply(mtv.overlap * 1))
  if (b2.invMass) separate(b2, axis.multiply(-1), mtv.overlap)
  //if (b2.invMass) b2.move(mtv.axis.multiply(mtv.overlap * 1))

  const relativeVelocity = b2.velocity.subtract(b1.velocity)//.normalize()
  const velocityAlongNormal = relativeVelocity.dot(axis)
  //console.log(velocityAlongNormal)
  if (velocityAlongNormal < 0) return
  const aa = axis.dot(axis)

  const totalInvMass = (b1.invMass + b2.invMass)

  const impulse = axis.multiply(-2 * velocityAlongNormal / (totalInvMass * aa))
  b1.velocity = b1.velocity.subtract(impulse.multiply(b1.invMass))
  b2.velocity = b2.velocity.add(impulse.multiply(b2.invMass))


  //b1.velocity = b1.velocity.subtract(
    //axis.multiply(
      //-1 * (b2.invMass / totalInvMass) * (velocityAlongNormal / 1)// * b1.velocity.normalize()
    //)
  //)

  ////console.log(b)

  //b2.velocity = b2.velocity.subtract(
    //axis.multiply(
      //-1 * (b1.invMass / totalInvMass) * (velocityAlongNormal / aa) /[> b2.velocity.normalize()
    //)
  //)

  return
  //var v1 = b1.velocity,
      //v1n = v1.normalize(),
      //v2 = b2.velocity,
      //v2n = v2.normalize(),
      //perpendicular;
  //if (collision.axis !== undefined) {
    //perpendicular = collision.axis.perpendicular()
  //if (b1.invMass) b1.move(collision.axis.multiply(collision.overlap * 1))
  //if (b2.invMass) b2.move(collision.axis.multiply(collision.overlap * -1))
  //} else {
    //let axis = b1.getPosition().subtract(b2.getPosition()).normalize()
    //perpendicular = axis.perpendicular()
  //if (b1.invMass) b1.move(axis.multiply(collision.overlap * 1))
  //if (b2.invMass) b2.move(axis.multiply(collision.overlap * -1))
  //}

  ////var rv = b2.velocity.subtract(b1.velocity)
  ////var vN = rv.dot(collision.axis);
  ////if (vN > 0) return;
  ////var j = -2 * vN;
  ////j /= b1.invMass + b2.invMass;
  ////var impulse = collision.axis.normalize().multiply(j);
  ////b1.forceAccumulator.iadd(impulse)
  ////b2.forceAccumulator.isubtract(impulse)
  ////return;

  //if (b1.invMass === 0) return
  //var v1dotl = v1n.dot(perpendicular),
      //v2dotl = v2n.dot(perpendicular),
      //ldotl = perpendicular.dot(perpendicular),
      //dotProductRatio1 = v1dotl / ldotl,
      //dotProductRatio2 = v2dotl / ldotl;

  //var p1 = new Vector();
  //var p2 = new Vector();

  //p1.x = 2 * dotProductRatio1 * perpendicular.x - v1n.x;
  //p1.y = 2 * dotProductRatio1 * perpendicular.y - v1n.y;
  //var totalInvMass = 1;//b1.invMass + b2.invMass

  //p2.x = 2 * dotProductRatio2 * perpendicular.x - v2n.x;
  //p2.y = 2 * dotProductRatio2 * perpendicular.y - v2n.y;

  ////b1.forceAccumulator.iadd(p1.multiply(v1.getMagnitude() / 1 ))
  ////b2.forceAccumulator.iadd(p1.multiply(v2.getMagnitude() / 1 ))
  //b1.velocity.x = p1.x * v1.getMagnitude() / totalInvMass;
  //b1.velocity.y = p1.y * v1.getMagnitude() / totalInvMass;
  ////b2.velocity.x = p2.x * v2.getMagnitude() / totalInvMass;;
  ////b2.velocity.y = p2.y * v2.getMagnitude() / totalInvMass;;

  ////console.log(collision.axis)
  ////b1.velocity.x *= collision.axis.y
  ////b1.velocity.y *= -1 * collision.axis.x
  //////b1.velocity.imultiply(collision.axis.multiply(1))
  //////b2.velocity.imultiply(collision.axis.multiply(-1))
  ////b2.velocity.x *= collision.axis.y
  ////b2.velocity.y *= -1 * collision.axis.x

}
