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

  prepare: function(route, url) {
    url = (url || this.location.url());

    var param,
        params = (url.match(route.regexp) || []).slice(1),
        lastRoute = this.current;

    this.preparedRoute = route;
    route.params = {};

    route.originalPath.replace(/{(\w+)}/g, function(all, name) {
      if((param = params.shift())) {
        route.params[name] = param;
      }
    });

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

var $location = window.$location;
var browser = new $location.Browser(window);
var $$location = new $location.Location(browser);

renderer.router = new Router($$location);
renderer.controller = function(Type, locals) {
  locals = locals || {};

  var args = [];

  forEach(locals, function(value) {
    args.push(value);
  });

  args.unshift(Type);

  return new (Function.prototype.bind.apply(Type, args));
};

extend(renderer.router, {
  browser: browser,
  location: $$location,
  Router: Router
});

renderer.afterCompile(function(rootScope, rootElement) {
  var $location = renderer.router.location;
  var route = renderer.router.parse($location.path());

  renderer.router.prepare(route);
  renderer.router.commit();
});
