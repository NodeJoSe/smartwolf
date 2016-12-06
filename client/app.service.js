(function() {
  'use strict';

  angular
    .module('IngeCommerce')

    .service('CartService', ['$resource',
      function($resource) {

        const getCart = $resource('/cart/getCart/:id', {
          id: '@id'
        });
        const getCartItem = $resource('/cart/getCartItem/:id', {
          id: '@id'
        });

        const service = {
          getCart: getCart,
          getCartItem: getCartItem
        };

        return service;
      }
    ])

  .service('ProductService', ['$resource',
    function($resource) {

      const getProduct = $resource('/product/getProduct/:id', {
        id: '@id'
      });
      const getProducts = $resource('/product/getProducts/:id', {
        id: '@id'
      });
      const productsByOs = $resource('/product/getProducts/os/:os', {
        os: '@os'
      });
      //TODO No guardar productos repetidos
      const productByTitle = $resource('/product/getProduct/title/:title', {
        title: '@title'
      });

      const service = {
        getProduct: getProduct,
        getProducts: getProducts,
        productsByOs: productsByOs,
        productByTitle: productByTitle
      };

      return service;
    }
  ])

  .service('FacturaService', ['$resource',
    function($resource) {

      const getFacturaId = $resource('/factura/getFacturaId/:id', {
        id: '@id'
      });
      const getFactura = $resource('/factura/getFactura/:id', {
        id: '@id'
      });
      const getFacturas = $resource('/factura/getFacturas/:id', {
        id: '@id'
      });
      const cartFacturas = $resource('/factura/cart/facturas/:id', {
        id: '@id'
      });
      const userFacturas = $resource('/factura/user/getFacturas/:id', {
        id: '@id'
      });

      const service = {
        getFacturaId: getFacturaId,
        getFactura: getFactura,
        getFacturas: getFacturas,
        userFacturas: userFacturas,
        cartFacturas: cartFacturas
      };

      return service;
    }
  ])

  .service('AmazonService', ['$resource',
    function($resource) {

      const amazonProducts = $resource('/api/amazon/:search', {
        search: '@search'
      });
      const amazonDB = $resource('/api/amazon/search/:keywords', {
        keywords: '@keywords'
      });

      const service = {
        amazonDB: amazonDB,
        amazonProducts: amazonProducts
      };

      return service;
    }
  ])

  .service('AuthService', ['$resource', '$q', '$timeout', '$http',
    function($resource, $q, $timeout, $http) {

      let user = null;

      const getUser = $resource('/user/getUser/:id', {
        id: '@id'
      });
      const getUsers = $resource('/user/getUsers/:id', {
        id: '@id'
      });
      const register = $resource('/user/register/:id', {
        id: '@id'
      });

      const service = {
        login: login,
        logout: logout,
        getUser: getUser,
        getUsers: getUsers,
        register: register,
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus
      };

      return service;

      function isLoggedIn() {
        if (user) {
          return user;
        }
        if (!user) {
          return false;
        }
      }

      function getUserStatus() {
        return $http.get('/user/status')
          .success(getUserStatusSuccess)
          .error(getUserStatusError);

        function getUserStatusSuccess(data) {
          if (data.status) {
            user = data.status;
          } else {
            user = false;
          }
        }

        function getUserStatusError() {
          user = false;
        }
      }

      function login(username, password) {

        const deferred = $q.defer();

        $http.post('/user/login', {
            username: username,
            password: password
          })
          .success(loginSuccess)
          .error(loginError);

        function loginSuccess(data, status) {
          if (status === 200 && data.status) {
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        }

        function loginError() {
          user = false;
          deferred.reject();
        }

        return deferred.promise;

      }

      function logout() {

        const deferred = $q.defer();

        $http.get('/user/logout')
          .success(logoutSuccess)
          .error(logoutError);

        function logoutSuccess() {
          user = false;
          deferred.resolve();
        }

        function logoutError() {
          user = false;
          deferred.reject();
        }

        return deferred.promise;

      }

    }
  ])

  .filter('startFrom', function() {
    return function(data, start) {
      return data.slice(start);
    };
  });

})();
