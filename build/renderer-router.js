(function() { "use strict"; var isArray = Array.isArray || function(array) {
  return isObject(array) && (array instanceof Array === true);
};

function inherits(ctor, ctorSrc, attrs) {
  ctor.prototype = Object.create(ctorSrc.prototype);

  if(isObject(attrs)) {
    extend(ctor.prototype, attrs);
  }
}

function isObject (value) {
  return value !== null && (typeof value === 'object');
}

function inherit(parent, extra) {
  return extend(Object.create(parent), extra);
}

function toArray(target) {
  return Array.prototype.slice.apply(target);
}

function isDefined(target) {
  return isUndefined(target) === false;
}

function isUndefined(target) {
  return typeof target === 'undefined';
}

function forEach (array, iterator, context) {
  var length;

  if(isArray(array)) {
    for(i = 0, length = array.length; i < length; i++) {
      iterator.call(context, array[i], i, array);
    }
  } else if (isObject(array)) {
    var keys = Object.keys(array);
    var ii = keys.length, i, key, value;

    for(i = 0; i < ii; i++) {
      key = keys[i];
      value = array[key];

      iterator.call(context, value, key, array);
    }
  }
  return array;
}

function extend (target) {
  if(!isObject(target)) target = {};

  var sources = toArray(arguments).slice(1).filter(isDefined);

  var source,
      value,
      keys,
      key,
      ii = sources.length,
      jj,
      i,
      j;

  for(i = 0; i < ii; i++) {
    if((source = sources[i]) && isObject(source)) {
      keys = Object.keys(source);
      jj = keys.length;

      for(j = 0; j < jj; j++) {
        key           = keys[j];
        value         = source[key];

        target[key]   = value;
      }
    }
  }

  return target;
}

function isObject (value) {
  return value !== null && (typeof value === 'object');
}

var EventEmitter = window.eventemitter.EventEmitter;

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

var bootstrap = renderer.bootstrap;

renderer.bootstrap = function(element) {
  bootstrap(element);

  var $location = renderer.router.location;
  var route = renderer.router.parse($location.path());

  renderer.router.prepare(route);
  renderer.router.commit();
};

renderer
.register('ndView', function() {
  return {
    restrict: 'A',
    terminal: true,
    priority: 400,
    transclude: 'element',
    compile: function(node) {
      function postLinkFn (scope, node, attrs, ctrls, transclude) {
        renderer.router.on('routeChangeSuccess', function() {
          scope.apply(update);
        });

        update();

        var parent,
            newScope,
            lastView;

        function update() {
          var current = renderer.router.current;

          if(lastView) {
            if((parent = lastView.parentNode)) {
              parent.removeChild(lastView);
            }

            lastView = null;
          }

          if(newScope) {
            newScope.destroy();
          }

          if(current) {
            newScope = scope.clone();

            transclude(newScope, function(clone) {
              parent = node.parentNode;

              if(current.hasOwnProperty('templateUrl')) {
                if(renderer.templateCache(current.templateUrl)) {
                  current.template = renderer.templateCache(current.templateUrl);

                  delete current.templateUrl;
                }
              }

              if(parent) {
                parent[node.nextSibling ? 'insertBefore' : 'appendChild'](clone, node.nextSibling);
              }

              lastView = clone;
            });
          }
        }
      }

      return postLinkFn;
    }
  };
});

renderer.register('ndView', function() {
  return {
    restrict: 'A',
    priority: -400,
    link: function(scope, node, attrs, ctrl, transclude) {
      var current = renderer.router.current;

      node.innerHTML = current.template;

      var link = renderer.compile(node.childNodes);

      if(!current.locals) {
        current.locals = {};
      }

      extend(current.locals, {
        scope: scope,
        attrs: attrs,
        element: node,
        transclude: transclude,
        routeParams: current.params
      });

      if(current.controller) {
        var controller = renderer.controller(current.controller, current.locals);

        if(typeof current.controllerAs === 'string') {
          scope[current.controllerAs] = controller;
        }
      }

      link(scope);
    }
  }
});
}());