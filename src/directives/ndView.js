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
