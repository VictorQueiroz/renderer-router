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
      $$location,
      fakeWindow;

  beforeEach(function() {
    scope = new renderer.Scope();

    fakeWindow = new FakeWindow();
    browser = new $location.Browser(fakeWindow);
    $$location = new $location.Location(browser);
    router = new Router($$location);

    view = createView();

    renderer.router = router;
    renderer.compile(view)(scope);
  });

  it('should render the view according to the path', function() {
    router
    .when('/', { template: 'Landing page' })
    .when('/home/index', { template: 'Index' });

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
});
