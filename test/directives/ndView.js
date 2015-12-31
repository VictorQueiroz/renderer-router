var createView = function() {
  var div = document.createElement('div');

  div.innerHTML = ['<div>',
    '<div>',
      '<div nd-view=""></div>',
    '</div>',
  '</div>']
  .join('');

  return div;
};

describe('ndView', function() {
  var view,
      scope,
      router,
      browser,
      ctrlView,
      $$location,
      fakeWindow,
      ControllerView;

  beforeEach(function() {
    scope = new renderer.Scope();

    fakeWindow = new FakeWindow();
    browser = new $location.Browser(fakeWindow);
    $$location = new $location.Location(browser);
    router = new Router($$location);

    view = createView();

    renderer.router = router;
    renderer.compile(view)(scope);

    ControllerView = function(scope, element, attrs, transclude) {
      ctrlView = this;

      this.scope = scope;
      this.element = element;
      this.attrs = attrs;
      this.transclude = transclude;
    };

    router
      .when('/', { template: 'Landing page' })
      .when('/home/index', { template: 'Index' })
      .when('/controller/view', { template: 'Controller view', controller: ControllerView, controllerAs: 'ctrlView' });
  });

  it('should render the view according to the path', function() {
    $$location.path('/');

    expect(view.outerHTML).toEqual(
      '<div><div><div><!-- ndView:  --><div nd-view="">' +
        'Landing page' +
      '</div></div></div></div>'
    );

    $$location.path('/home/index');

    expect(view.outerHTML).toEqual(
      '<div><div><div><!-- ndView:  --><div nd-view="">' +
        'Index' +
      '</div></div></div></div>'
    );
  });

  it('should get the templates from renderer templateCache when using "templateUrl" route option', function() {
    router.when('/', { templateUrl: 'index.jade' });
    renderer.templateCache('index.jade', 'We are using templateUrl here! =)');

    $$location.path('/');

    expect(view.outerHTML).toEqual(
      '<div><div><div><!-- ndView:  --><div nd-view="">' +
        'We are using templateUrl here! =)' +
      '</div></div></div></div>'
    );
  });

  it('should destroy the child scope when the view changes and there is a old view', function() {
    var destroyListener = jasmine.createSpy();

    expect(scope.childScopes.length).toBe(0);
    expect(scope.topLevelScope).toBe(scope);

    $$location.path('/home/index');

    expect(scope.childScopes.length).toBe(1);
    scope.childScopes[0].on('destroy', destroyListener);

    expect(destroyListener).not.toHaveBeenCalled();

    $$location.path('/');

    expect(destroyListener).toHaveBeenCalled();
  });

  it('should instantiate a "controller" with scope, element, attributes and transclude function', function() {
    $$location.path('/controller/view');

    expect(scope.childScopes[0].ctrlView).toBe(ctrlView);
    expect(scope.childScopes[0].ctrlView.scope instanceof renderer.Scope === true).toBeTruthy();
  });
});
