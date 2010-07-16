/**
 *
 * WebFont.load({
 *   manual: {
 *     path: "fonts/Tangerine",
 *     formats: ['woff', 'ttf', 'eot']
 *   }
 * });
 *
 * @constructor
 */
webfont.ManualCss = function(userAgent, domHelper, configuration) {
  this.userAgent_ = userAgent;
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

webfont.ManualCss.NAME = 'manual';

webfont.ManualCss.FORMATS = {
    'woff': 'woff',
    'ttf': 'truetype',
    'otf': 'truetype',
    'svg': 'svg',
};

webfont.ManualCss.prototype.pickBestFormat = function() {
  var name = this.userAgent_.getName(),
      version = this.userAgent_.getVersion(),
      float
      woff = false, ttf = true, otf = false, eot = false, svg = false;
  switch (name) {
    case "Firefox":
      if (parseFloat(version) >= 3.6) {
          woff = true;
      }
    case "MSIE":
      if (parseFloat(version) >= 9) {
          woff = true;
      }
      ttf = false;
      eot = true;
      break;
  }
  // Check in the preferred order
  if (woff && this.hasFormat("woff")) return "woff";
  if (ttf && this.hasFormat("ttf")) return "ttf";
  if (otf && this.hasFormat("otf")) return "otf";
  if (eot && this.hasFormat("eot")) return "eot";
  if (svg && this.hasFormat("svg")) return "svg";
}

webfont.ManualCss.prototype.hasFormat = function(formatStr) {
    var formats = this.configuration_['formats'];
    for (var i = 0, len = formats.length; i < len; i++) {
      var format = String(formats[i]).toLowerCase();
      if (format == formatStr) return true;
    }
    return false;
}

webfont.ManualCss.prototype.load = function(onReady) {
  var name = this.configuration_['name'];
  var path = this.configuration_['path'];
  var bestFormat = this.pickBestFormat();
  if (bestFormat) {
    this.domHelper_.insertInto('head', this.domHelper_.createCssStyle(
        /*@font-face {
        	font-family: 'CloisterBlackLight';
        	src: url('CloisterBlack-webfont.eot');
        	src: local('☺'), url('CloisterBlack-webfont.woff') format('woff'), url('CloisterBlack-webfont.ttf') format('truetype'), url('CloisterBlack-webfont.svg#webfontrwSM9VT7') format('svg');
        	font-weight: normal;
        	font-style: normal;
        }*/
      "@font-face { " +
        "font-family: '" + name + "'; " +
        "font-style: normal; " +
        "font-weight: normal; " +
        "src: local('☺'), url('" + path + "." + bestFormat + "') format('" + webfont.ManualCss.FORMATS[bestFormat] + "'); " +
      "}"
    ));
    onReady([name]);
  }
};

webfont.ManualCss.prototype.supportUserAgent = function(userAgent, support) {
  return support(userAgent.isSupportingWebFont());
};

WebFont.addModule(webfont.ManualCss.NAME, function(configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent);
  var userAgent = userAgentParser.parse();
  return new webfont.ManualCss(userAgent,
      new webfont.DomHelper(document), configuration);
});
