// import libs and polyfills
import $ from 'jquery'
import WebFont from 'webfontloader'

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

otg.ready = function ready() {
  this.webFonts()
}

if($) {
  $(function(){
    otg.ready();
  })
}
