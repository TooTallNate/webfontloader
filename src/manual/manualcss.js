/**
 *
 * WebFont.load({
 *   manual: {
 *     name: "Tangerine",
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
  'svg': 'svg'
  // 'eot' doesn't support the format()
};

webfont.ManualCss.prototype.pickBestFormat = function() {
  var name = this.userAgent_.getName(),
    version = this.userAgent_.getVersion(),
    floatVersion = parseFloat(version),
    woff = false, ttf = true, otf = false, eot = false, svg = false;
  if (this.userAgent_.getPlatform().match(/iPad|iPod|iPhone/)) {
    svg = true;
    ttf = false;
  } else {
    switch (name) {
      case "Firefox":
        if (floatVersion >= 3.6) {
          woff = true;
        }
        break;
      case "Safari":
        otf = true;
        break;
      case "MSIE":
        if (floatVersion >= 9) {
          woff = true;
        }
        ttf = false;
        eot = true;
        break;
      // Opera 10+ supports TTF font files
    }
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
  this.configuration_['formats'] = this.configuration_['formats'] || [ 'ttf' ];
  var name = this.configuration_['name'],
    path = this.configuration_['path'],
    bestFormat = this.pickBestFormat(),
    notEot = bestFormat != "eot";
  if (bestFormat) {
    this.domHelper_.insertInto('head', this.domHelper_.createCssStyle(
      "@font-face { " +
        "font-family: '" + name + "'; " +
        "font-style: normal; " +
        "font-weight: normal; " +
        "src: " + (notEot ? "local('☺'), " : "") +
                "url('" + path + "." + bestFormat + "')" +
                (notEot ? " format('" + webfont.ManualCss.FORMATS[bestFormat] + "')" : "") + "; " +
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
