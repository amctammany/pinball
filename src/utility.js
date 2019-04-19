export const isFunction = f => f && {}.toString.call(f) === "[object Function]";
export const isObject = o => o === Object(o);
