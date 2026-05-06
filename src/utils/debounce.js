export const debounce = (func, wait) => {
  let timeout;

  const debouncedFn = (...args) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

  debouncedFn.cancel = () => {
    clearTimeout(timeout);
  };

  return debouncedFn;
};

export const throttle = (func, limit) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};