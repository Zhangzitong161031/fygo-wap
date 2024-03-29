;((doc, win) => {
  var docEl = doc.documentElement
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  var recalc = () => {
    var clientWidth = docEl.clientWidth
    if (!clientWidth) return
    docEl.style.fontSize = 20 * (clientWidth / 320) + 'px'
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
