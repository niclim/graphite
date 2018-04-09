// from https://davidwalsh.name/javascript-debounce-function
// because i don't want to import lodash
const debounce = (func, wait, immediate) => {
  let timeout
  return () => {
    const args = arguments
    const later = () => {
      timeout = null
      if (!immediate) { func.apply(this, args) }
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) { func.apply(this, args) }
  }
}

module.exports = {
  debounce
}
