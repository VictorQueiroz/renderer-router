function FakeWindow() {
  EventEmitter.call(this);

  var self = this,
      $location = { hash: '' };

  this.location = {
    get hash() {
      return $location.hash;
    },

    set hash(value) {
      try {
        if(value.charAt(0) !== '#') {
          value = ('#' + value);
        }

        return ($location.hash = value);
      } finally {
        self.emit('hashchange');
      }
    }
  };
}

inherits(FakeWindow, EventEmitter, {
  addEventListener: function () {
    return this.on.apply(this, arguments);
  },

  removeEventListener: function() {
    return this.off.apply(this, arguments);
  }
});

describe('Router', function() {
  var router,
      browser = new $location.Browser(new FakeWindow()),
      location;

  beforeEach(function() {
    location = new $location.Location(browser);
    router = new Router(location);
  });

  describe('prepare()', function() {
    it('should prepare a route to be commited', function() {
      var route = {};

      router.when('/a/b/c', route);
      router.prepare(router.parse('/a/b/c'));

      expect(router.preparedRoute).toBe(route);
    });
  });
});
