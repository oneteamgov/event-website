// import libs and polyfills
import WebFont from 'webfontloader'
import countdown from 'countdown'
import './timer.js'

var otg = {}

otg.settings = {
  webfont: {
    google: {
      families: ['Roboto:300,700']
    }
  }
}

otg.webFonts = function webFonts() {
  if(WebFont) {
    WebFont.load(otg.settings.webfont)
  }
}

otg.countDown = function countDown() {
  var countdown = new Countdown({
      selector: '.timer',
      initialize: true,
      msgAfter: "OneTeamGov has happend, we hope you enjoyed the event.",
      msgPattern : "{days} days, {hours} hours, {minutes}m {seconds}s left to",
      dateEnd: new Date('Jun 28, 2017 09:30')
  });
}

otg.ready = function ready() {
  this.countDown()
  this.webFonts()
}

otg.ready();
