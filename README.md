# renderer-router

### Dependencies
- [renderer](https://github.com/VictorQueiroz/renderer)
- [location](https://github.com/VictorQueiroz/location)
- [routedriver](https://github.com/VictorQueiroz/routedriver)
- [eventemitter](https://github.com/VictorQueiroz/eventemitter)

### Usage
```
renderer.router.when('/index', {
  templateUrl: 'home.html'
})
.when('/', {
  template: '<h3>Welcome, {{user.name}}.</h3>'
});
```

#### Template Cache (Like AngularJS `$templateCache` service)
```
renderer.templateCache('home.html', '<div>Index</div>');
expect(renderer.templateCache('home.html')).toEqual('<div>Index</div>');
```

### Installation
```
bower install --save renderer renderer-route
```
