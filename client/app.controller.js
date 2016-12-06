(function() {
  'use strict';

  angular
    .module('IngeCommerce')

  .controller('PerfilController', ['$scope', 'FacturaService', 'AuthService',
    function($scope, FacturaService, AuthService) {

      $scope.editUser = editUser;
      $scope.user = {};
      $scope.form = {};
      $scope.facturas = [];
      $scope.pageSize = 6;
      $scope.currentPage = 1;
      $scope.tasa = 10;
      $scope.disabled = false;
      $scope.profile = {
        show: true
      };
      $scope.setAdress = {
        show: false
      };
      $scope.setFacturas = {
        show: false
      };

      FacturaService
        .userFacturas
        .query({}, userFacturas);

      function userFacturas(data) {
        $scope.facturas = data;
      }

      AuthService
        .getUser
        .get({}, getUserSuccess);

      function getUserSuccess(data) {
        $scope.user = data;
      }

      function editUser() {
        $scope.disabled = true;

        AuthService
          .getUser
          .save({
            id: $scope.user._id
          }, $scope.form, editUserSuccess);

        function editUserSuccess(data) {
          $scope.user = data;
          $scope.form = {};
          $scope.disabled = false;
          $scope.profile.show = true;
          $scope.setAdress.show = false;
          $scope.setFacturas.show = false;
        }
      }

    }
  ])

  .controller('UserCartController', ['$scope', 'CartService', 'FacturaService',
    '$location', 'AuthService', '$route',
    function($scope, CartService, FacturaService,
      $location, AuthService, $route) {

      $scope.deleteCartItem = deleteCartItem;
      $scope.deleteCart = deleteCart;
      $scope.buyCart = buyCart;
      $scope.user = {};
      $scope.products = [];
      $scope.empty = false;
      $scope.tasa = 10;
      $scope.total = {
        price: 0
      };

      CartService
        .getCart
        .query({}, getCartSuccess);

      function getCartSuccess(data) {
        $scope.products = data;
        if (!$scope.products[0]) {
          $scope.empty = true;
        } else {
          for (let i = 0; i < $scope.products.length; i++) {
            $scope.total.price =
              $scope.total.price + parseInt($scope.products[i].product.price);
          }
        }
      }

      AuthService
        .getUser
        .get({}, getUserSuccess);

      function getUserSuccess(data) {
        $scope.user = data;
      }

      function deleteCartItem(index) {
        bootbox.confirm('Seguro que quieres quitar este articulo del carrito?', question);

        function question(answer) {
          if (answer === true) {
            CartService
              .getCartItem
              .delete({
                id: $scope.products[index].product._id
              }, deleteCartItemSuccess);
          }

          function deleteCartItemSuccess() {
            $scope.products.splice(index, 1);
            $scope.total.price = 0;
            for (let i = 0; i < $scope.products.length; i++) {
              $scope.total.price =
                $scope.total.price + parseInt($scope.products[i].product.price);
            }
          }
        }

      }

      function deleteCart(index) {

        bootbox.confirm('Seguro que quieres limpiar el carrito?', question2);

        function question2(answer) {
          if (answer === true) {
            CartService
              .getCart
              .delete({}, deleteCartSuccess);
          }

          function deleteCartSuccess() {
            $scope.products.splice(index);
            $scope.total.price = 0;
          }
        }
      }

      function buyCart() {
        bootbox.confirm('Confirmar Compra', question2);

        function question2(answer) {
          if (answer === true) {
            if ($scope.user.email) {
              FacturaService
                .cartFacturas
                .save({}, $scope.products);
              $location.path('/compra');
            } else {
              $location.path('/datos');
              $route.reload();
            }
          }
        }
      }

    }
  ])

  .controller('BusquedaController', [
    '$scope', '$routeParams', 'AmazonService', 'ProductService', '$location',
    function($scope, $routeParams, AmazonService, ProductService, $location) {

      $scope.verAmazon = verAmazon;
      $scope.amazonProducts = [];
      $scope.facturas = [];
      $scope.product = {};
      $scope.pageSize = 6;
      $scope.currentPage = 1;
      $scope.tasa = 10;


      AmazonService
        .amazonProducts
        .query({
          search: $routeParams.search
        }, amazonSuccess);

      function amazonSuccess(data) {
        $scope.amazonProducts = data;
      }

      function verAmazon(index) {

        addToDatabase(index);

        ProductService
          .getProduct
          .save({}, $scope.product, saveSuccess);

        function saveSuccess(data) {
          $location.path('/articulo/' + data._id);
        }
      }

      function addToDatabase(index) {
        $scope.product = {
          title: $scope.amazonProducts[index].ItemAttributes[0].Title[0],
          price: $scope.amazonProducts[index].OfferSummary[0].LowestNewPrice[0].Amount[0],
          URL: $scope.amazonProducts[index].LargeImage[0].URL[0],
          brand: $scope.amazonProducts[index].ItemAttributes[0].Brand[0],
          os: $scope.amazonProducts[index].ItemAttributes[0].OperatingSystem[0]
        };
      }

    }
  ])

  .controller('ArticuloController', [
    '$scope', '$routeParams', 'ProductService', 'FacturaService',
    'AuthService', '$location', 'CartService', '$route',
    function($scope, $routeParams, ProductService, FacturaService,
      AuthService, $location, CartService, $route) {

      $scope.confirmarCompra = confirmarCompra;
      $scope.addToCart = addToCart;
      $scope.product = {};
      $scope.user = {};
      $scope.comprar = false;
      $scope.tasa = 10;

      ProductService
        .getProduct
        .get({
          id: $routeParams.id
        }, getProductSuccess);

      function getProductSuccess(data) {
        $scope.product = data;
      }

      AuthService
        .getUser
        .get({}, getUserSuccess);

      function getUserSuccess(data) {
        $scope.user = data;
      }

      function confirmarCompra() {

        $scope.disabled = true;

        if (!AuthService.isLoggedIn()) {
          $location.path('/login');
        } else {
          bootbox.confirm('Confirmar Compra', question);
        }

        function question(answer) {
          if (answer === true) {
            if ($scope.user.email) {
              FacturaService
                .getFactura
                .save({}, $scope.product);
              $location.path('/compra');
            } else {
              $location.path('/datos');
              $route.reload();
            }
          }
        }
      }

      function addToCart() {
        if (!AuthService.isLoggedIn()) {
          $location.path('/login');
        } else {
          bootbox.confirm('Seguro que quieres añadir este articulo al carrito?', question2);
        }

        function question2(answer) {
          if (answer === true) {
            CartService
              .getCartItem
              .save({}, $scope.product);
          }
        }
      }

    }
  ])

  .controller('FacturaController', ['$scope', '$routeParams', 'FacturaService', '$window',
    function($scope, $routeParams, FacturaService, $window) {

      $scope.back = back;
      $scope.print = print;
      $scope.factura = {};
      $scope.tasa = 10;

      FacturaService
        .getFacturaId
        .get({
          id: $routeParams.id
        }, getSuccess);

      function getSuccess(data) {
        $scope.factura = data;
      }

      function print() {
        $window.print();
      }

      function back() {
        $window.history.back();
      }
    }
  ])

  .controller('FacturasController', ['$scope', '$routeParams', 'FacturaService',
    function($scope, $routeParams, FacturaService) {

      $scope.deleteFacturas = deleteFacturas;
      $scope.deleteFactura = deleteFactura;
      $scope.facturas = [];
      $scope.pageSize = 6;
      $scope.currentPage = 1;
      $scope.tasa = 10;

      FacturaService
        .getFacturas
        .query({}, getFacturasSuccess);

      function getFacturasSuccess(data) {
        $scope.facturas = data;
      }

      function deleteFacturas(index) {
        bootbox.confirm('Seguro que quieres eliminar todas las facturas?', question);

        function question(answer) {
          if (answer === true) {
            FacturaService
              .getFacturas
              .delete({}, deleteFacturasSuccess);
          }

          function deleteFacturasSuccess() {
            $scope.facturas.splice(index);
          }
        }
      }

      function deleteFactura(index) {
        bootbox.confirm('Seguro que quieres eliminar esta fatura?', question2);

        function question2(answer) {
          if (answer === true) {
            FacturaService
              .getFactura
              .delete({
                id: $scope.facturas[index]._id
              }, deleteFacturaSuccess);
          }

          function deleteFacturaSuccess() {
            $scope.facturas.splice(index, 1);
          }
        }
      }

    }
  ])

  .controller('ArticulosOsController', ['$scope', '$location', 'ProductService', '$routeParams',
    function($scope, $location, ProductService, $routeParams) {

      $scope.products = [];
      $scope.pageSize = 6;
      $scope.currentPage = 1;
      $scope.tasa = 10;

      if ($routeParams.os === 'google_android' || $routeParams.os === 'iOS') {
        ProductService
          .productsByOs
          .query({
            os: $routeParams.os
          }, getProductsSuccess);
      } else {
        $location.path('/articulos/google_android');
      }

      function getProductsSuccess(data) {
        $scope.products = data;
      }

    }
  ])

  .controller('ArticulosController', ['$scope', '$location', 'ProductService', 'AmazonService',
    function($scope, $location, ProductService, AmazonService) {

      $scope.addProducts = addProducts;
      $scope.deleteProducts = deleteProducts;
      $scope.deleteProduct = deleteProduct;
      $scope.products = [];
      $scope.form = {};
      $scope.limit = 4;
      $scope.pageSize = 6;
      $scope.currentPage = 1;
      $scope.pageSizeAdmin = 4;
      $scope.tasa = 10;
      $scope.disabled = false;

      ProductService
        .getProducts
        .query({}, getProductsSuccess);

      function getProductsSuccess(data) {
        $scope.products = data;
      }

      function addProducts() {

        $scope.disabled = true;

        AmazonService
          .amazonDB
          .query({
            keywords: $scope.form.keywords
          }, saveSuccess);

        function saveSuccess(data) {
          $scope.disabled = false;
          $scope.products.push.apply($scope.products, data);
        }
      }

      function deleteProducts(index) {
        bootbox.confirm('Seguro que quieres eliminar todos los Productos?', question);

        function question(answer) {
          if (answer === true) {
            ProductService
              .getProducts
              .delete({}, deleteProductsSuccess);
          }

          function deleteProductsSuccess() {
            $scope.products.splice(index);
          }
        }
      }

      function deleteProduct(index) {
        bootbox.confirm('Seguro que quieres eliminar este Producto?', question2);

        function question2(answer) {
          if (answer === true) {
            ProductService
              .getProduct
              .delete({
                id: $scope.products[index]._id
              }, deleteProductSuccess);
          }

          function deleteProductSuccess() {
            $scope.products.splice(index, 1);
          }
        }
      }

    }
  ])

  .controller('LoginController', ['$scope', '$location', 'AuthService', '$route',
    function($scope, $location, AuthService, $route) {

      $scope.login = login;
      $scope.loginForm = {};

      function login() {

        $scope.errorMessage = '';
        $scope.error = false;
        $scope.disabled = true;

        AuthService
          .login($scope.loginForm.username, $scope.loginForm.password)
          .then(loginSuccess)
          .catch(loginError);

        function loginSuccess() {
          if ($scope.loginForm.username === 'admin') {
            $location.path('/admin/users');
          } else {
            $location.path('/');
            $route.reload();
          }
          $scope.disabled = false;
          $scope.loginForm = {};
        }

        function loginError() {
          $scope.error = true;
          $scope.errorMessage = 'Usuario o contraseña incorrecta';
          $scope.disabled = false;
          $scope.loginForm = {};
        }
      }

    }
  ])

  .controller('LogoutController', ['$scope', '$location', 'AuthService', '$route',
    function($scope, $location, AuthService, $route) {

      $scope.logout = logout;

      function logout() {
        AuthService
          .logout()
          .then(logoutSuccess);

        function logoutSuccess() {
          $location.path('/');
          $route.reload();
        }
      }

    }
  ])

  .controller('RegisterController', ['$scope', '$location', 'AuthService',
    function($scope, $location, AuthService) {

      $scope.deleteUsers = deleteUsers;
      $scope.deleteUser = deleteUser;
      $scope.register = register;
      $scope.form = {};
      $scope.users = [];
      $scope.password2 = null;
      $scope.pageSize = 8;
      $scope.currentPage = 1;

      AuthService
        .getUsers
        .query({}, getUsers);

      function getUsers(data) {
        $scope.users = data;
      }

      function register(admin) {

        $scope.error = false;
        $scope.disabled = true;

        AuthService
          .register
          .save({}, $scope.form, registerSuccess, registerError);

        function registerSuccess(data) {
          $scope.form = {};
          $scope.disabled = false;
          $scope.password2 = null;
          $scope.users.push(data);
          if (!admin) {
            $location.path('/login');
          }
        }

        function registerError() {
          $scope.error = true;
          $scope.errorMessage = 'algo salio mal';
          $scope.disabled = false;
        }

      }

      function deleteUsers(index) {
        bootbox.confirm('Seguro que quieres eliminar todos los Usuarios?', question);

        function question(answer) {
          if (answer === true) {
            AuthService
              .getUsers
              .delete({}, deleteUsersSuccess);
          }

          function deleteUsersSuccess() {
            $scope.users.splice(index);
          }
        }
      }

      function deleteUser(index) {
        bootbox.confirm('Seguro que quieres eliminar este usuario?', question);

        function question(answer) {
          if (answer === true) {
            AuthService
              .getUser
              .delete({
                id: $scope.users[index]._id
              }, deleteUserSuccess);
          }

          function deleteUserSuccess() {
            $scope.users.splice(index, 1);
          }
        }

      }

    }
  ])

  .controller('HeaderController', ['$scope',
    function($scope) {
      $scope.navbarCollapsed = true;
      $scope.templateUrl = '';
    }
  ])

  .controller('AdminHeaderController', ['$scope',
    function($scope) {

      $scope.navbarCollapsed = true;
      $scope.URL = ['/users', '/articulos', '/facturas'];
    }
  ])

  .controller('DropdownController', ['$scope', '$log',
    function($scope, $log) {

      $scope.toggleDropdown = toggleDropdown;
      $scope.toggled = toggled;
      $scope.items = ['google_android', 'iOS'];
      $scope.status = {
        isopen: false
      };

      function toggled(open) {
        $log.log('Dropdown is now: ', open);
      }

      function toggleDropdown($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
      }

      $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
    }
  ])

  .controller('CarouselController', ['$scope',
    function($scope) {

      let slides = $scope.slides = [];
      $scope.noWrapSlides = false;
      $scope.myInterval = 5000;
      $scope.active = 0;
      let currIndex = 0;
      let img = $scope.imgs = [
        '../public/img/android.jpg',
        '../public/img/iphone.jpg',
        '../public/img/lumia.jpg'
      ];

      $scope.addSlide = function() {
        slides.push({
          image: img[currIndex],
          text: ['Android', 'iOS'][slides.length % 4],
          id: currIndex++,
          items: ['google_android', 'iOS'][slides.length % 4]
        });
      };

      for (let i = 0; i < 2; i++) {
        $scope.addSlide();
      }

    }
  ]);

})();
