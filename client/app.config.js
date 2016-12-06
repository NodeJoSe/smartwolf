(function() {
  'use strict';

  angular
    .module('IngeCommerce', [
      'ngAnimate',
      'ngRoute',
      'ngResource',
      'ui.bootstrap',
      'ui.validate'
    ])

  // ROUTES
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '/partials/views/home.html',
          access: {
            restricted: false,
            authorize: false
          }
        })
        .when('/login', {
          templateUrl: '/partials/user/login.html',
          controller: 'LoginController',
          access: {
            restricted: false,
            authorize: false
          }
        })
        .when('/register', {
          templateUrl: '/partials//user/register.html',
          controller: 'RegisterController',
          access: {
            restricted: false,
            authorize: false
          }
        })
        .when('/perfil', {
          templateUrl: '/partials/user/perfil.html',
          controller: 'PerfilController',
          access: {
            restricted: true,
            authorize: false
          }
        })
        .when('/articulos', {
          templateUrl: '/partials/articulos/articulos.html',
          controller: 'ArticulosController',
          access: {
            restricted: false,
            authorize: false
          }
        })
        .when('/articulos/:os', {
          templateUrl: '/partials/articulos/articulos.html',
          controller: 'ArticulosOsController',
          access: {
            restricted: false,
            authorize: false
          }
        })
        .when('/busqueda/:search', {
          templateUrl: '/partials/articulos/busqueda.html',
          controller: 'BusquedaController',
          access: {
            restricted: false,
            authorize: false
          }
        })
        .when('/articulo/:id', {
          templateUrl: '/partials/articulos/articulo.html',
          controller: 'ArticuloController',
          access: {
            restricted: false,
            authorize: false
          }
        })
        .when('/compra', {
          templateUrl: '/partials/articulos/compra.html',
          access: {
            restricted: true,
            authorize: false
          }
        })
        .when('/datos', {
          templateUrl: '/partials/articulos/datos.html',
          access: {
            restricted: true,
            authorize: false
          }
        })
        .when('/carrito', {
          templateUrl: '/partials/articulos/carrito.html',
          controller: 'UserCartController',
          access: {
            restricted: true,
            authorize: false
          }
        })
        .when('/acerca-de-nosotros', {
          templateUrl: '/partials/views/about-us.html',
          access: {
            restricted: false,
            authorize: false
          }
        })
        .when('/ayuda', {
          templateUrl: '/partials/views/ayuda.html',
          access: {
            restricted: false,
            authorize: false
          }
        })
        .when('/admin/users', {
          templateUrl: '/partials/admin/admin-users.html',
          controller: 'RegisterController',
          access: {
            restricted: true,
            authorize: true
          }
        })
        .when('/admin/articulos', {
          templateUrl: '/partials/admin/admin-articulos.html',
          controller: 'ArticulosController',
          access: {
            restricted: true,
            authorize: true
          }
        })
        .when('/admin/facturas', {
          templateUrl: '/partials/admin/admin-facturas.html',
          controller: 'FacturasController',
          access: {
            restricted: true,
            authorize: true
          }
        })
        .when('/factura/:id', {
          templateUrl: '/partials/user/factura.html',
          controller: 'FacturaController',
          access: {
            restricted: true,
            authorize: false
          }
        })
        .otherwise({
          redirectTo: '/'
        });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    }
  ])

  .run(['$rootScope', '$location', '$route', 'AuthService', '$http',
    function($rootScope, $location, $route, AuthService) {

      $rootScope.$on('$routeChangeStart', userStatus);

      function userStatus(event, next) {
        AuthService.getUserStatus()
          .then(authentication);

        function authentication() {
          if (next.access.restricted && !AuthService.isLoggedIn()) {
            $rootScope.online = false;
            $location.path('/login');
            $route.reload();
          } else
          if (!AuthService.isLoggedIn()) {
            $rootScope.online = false;
          } else
          if ($rootScope.currentUser = AuthService.isLoggedIn()) {
            $rootScope.online = true;
            if (next.access.authorize && $rootScope.currentUser !== 'admin') {
              $location.path('/');
              $route.reload();
            }
          }
        }
      }
    }
  ]);

})();
