// import libs and polyfills
import WebFont from 'webfontloader'
import countdown from 'countdown'
import scrollIt from './scrollIt.js'
import './timer.js'
import './polyfills.js'

var otg = {}

otg.settings = {
  webfont: {
    google: {
      families: ['Roboto:300,700']
    }
  },
  countdown: {
      selector: '.timer',
      initialize: true,
      msgAfter: "We hope you enjoyed the event. Follow the <a href='https://twitter.com/hashtag/oneteamgov'>#oneteamgov</a> hashtag on Twitter.",
      msgPattern : "Only {hours} hours, {minutes}m {seconds}s until doors open. See you soon.",
      dateEnd: new Date('Jun 29, 2017 09:30')
  }
}

otg.webFonts = function webFonts() {
  if(WebFont) {
    WebFont.load(otg.settings.webfont)
  }
}

otg.countDown = function countDown() {
  var countdown = new Countdown(otg.settings.countdown);
}

/**
 * handles the scrollIt feature of links
 */
otg.scrollTo = function scrollTo() {

  let scrollLinks = document.querySelectorAll('.js-scrollTrigger');

  [].forEach.call(scrollLinks, function (link) {

    link.addEventListener('click', () => {
      scrollIt(
        document.querySelector(link.getAttribute('href')),
        450,
        'easeOutQuad'
      );
    });

  });

}

otg.ready = function ready() {
  this.scrollTo()
  this.countDown()
  this.webFonts()
}

otg.ready();
