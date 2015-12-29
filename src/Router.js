function Router(location, routes) {
  router.Router.call(this, routes);

  var route,
      self = this;

  this.location = location;

  this.location.on('locationChangeStart', function(url) {
    if((route = self.parse(url))) {
      self.prepare(route);
    }
  })
  .on('locationChangeSuccess', function(){
    self.commit();
  });
}

inherits(Router, router.Router, {
  constructor: Router,

  prepare: function(route) {
    var lastRoute = this.current;

    this.preparedRoute = route;

    if(this.emit('routeChangeStart', route, lastRoute)) {
      return true;
    }

    return false;
  },

  commit: function() {
    this.current = this.preparedRoute;

    this.emit('routeChangeSuccess');
  }
});

var browser = new $location.Browser(window);
var $location = window.$location;
var $$location = new $location.Location(browser);

renderer.router = new Router($$location);

extend(renderer.router, {
  browser: browser,
  location: $$location,
  Router: Router
});

var bootstrap = renderer.bootstrap;

renderer.bootstrap = function(element) {
  bootstrap(element);

  var $location = renderer.router.location;
  var route = renderer.router.parse($location.path());

  renderer.router.prepare(route);
  renderer.router.commit();
};

renderer.bootstrap(document);
