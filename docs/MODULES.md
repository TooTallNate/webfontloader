# Modules

WebFont Loader provides a generic module system so that any web font provider
may be used. The specifics of each provider are documented here.


## Google

Using Google's Font API, name the font families you'd like to load.

    WebFont.load({
      google: {
        families: ['Droid Sans', 'Droid Serif']
      }
    });

Learn more about the [Google Font API][gfontapi].


## Typekit

When using Typekit, specify the Kit to retrieve by its ID. You can find this
ID within Typekit's Kit Editor interface.

    WebFont.load({
      typekit: {
        id: 'xxxxxx'
      }
    });

Learn more about [Typekit][tk].


## Custom

To load fonts from any external stylesheet, use the `custom` module. Here you'll
need to specify both the url of the stylesheet as well as the font families it
provides.

    WebFont.load({
      custom: {
        families: ['My Font', 'My Other Font'],
        urls: ['/fonts.css']
      }
    });


## Manual

To load a font from a manually defined URL, use the `manual` module. Here you
need to specify the URL to the font files, omitting the file extension, as the
_path_. You must also specify which formats of the font are available for the
varying user-agents, in a _formats_ Array. And finally you must define the
_name_ of the font, as it will be used in the CSS on the page.

    WebFont.load({
      manual: {
        name: "Cloister",
        path: "fonts/CloisterBlack-webfont",
        formats: ['woff', 'ttf', 'eot', 'svg']
      }
    });

[gfontapi]: https://code.google.com/apis/webfonts/docs/getting_started.html
[tk]: http://typekit.com/