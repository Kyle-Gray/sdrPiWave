'use strict';

angular.module('app.controllers', ['ionic'])

  .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {

    }
  ])

  .controller('homeCtrl', ['$scope', '$stateParams', 'filesService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, filesService) {
      const vm = this;
      vm.$onInit = onInit;

      function onInit() {
        filesService.getFiles()
          .then((res) => {
            vm.data = res.data;
          });
      }
    }
  ])
  .controller('searchCtrl', ['$scope', '$stateParams', 'filesService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, filesService) {
      const vm = this;
      vm.$onInit = search;

      function search() {
        vm.data = filesService.files;
        // return filesService.service.files;
      }
    }
  ])

  .controller('profileCtrl', ['$scope', '$stateParams', '$http', 'filesService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $http, filesService) {
      const vm = this;
      vm.$onInit = onInit;
      vm.profileFilter = localStorage.getItem("username");

      function onInit() {
        var user = localStorage.getItem("user");
        vm.uploadData = filesService.files;
        return $http.get(`http://eggnogg:8000/users/${user}`)
          .success(function (userProfile) {
            vm.data = userProfile;

          })
          .error(function (data) {
            alert(`error: ${data}`);
          });
      }
    }
  ])

  .controller('loginCtrl', ['$scope', '$stateParams', '$http', '$state', 'UserFactory', 'tokenService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $http, $state, UserFactory, tokenService) {
      const vm = this;
      vm.login = login;
      vm.$onInit = onInit;

      function onInit() {
        if (tokenService.checkToken()) {
          console.log('You are already logged in!');
          $state.go('tabsController.home');
        } else {
          UserFactory.logout();
          console.log('You are not logged in!');
        }
      }

      function login() {

        if (!vm.loginForm.email) {
          window.plugins.toast.showWithOptions({
            message: "Please enter an email",
            duration: "long",
            position: "center",
            addPixelsY: -40
          });
        } else if (!vm.loginForm.password) {
          window.plugins.toast.showWithOptions({
            message: "Please enter an password",
            duration: "long",
            position: "center",
            addPixelsY: -40
          });
        } else {
          UserFactory.login(vm.loginForm.email, vm.loginForm.password).then((res) => {
            console.log('login successful:', res.data);
            console.log('UserFactory:', UserFactory.userData);
            vm.data = UserFactory.userData;

            $state.go('tabsController.home');
          }, (error) => {
            console.log('login failed:', error.data);
            window.plugins.toast.showWithOptions({
              message: `Login failed: ${error.data}.\n Please try again.`,
              duration: "long",
              position: "center",
              addPixelsY: -40
            });
          });
        }

      }
    }
  ])

  .controller('landingCtrl', ['$scope', '$stateParams', '$ionicModal', '$http', '$timeout', 'networkService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName

    function ($scope, $stateParams, $ionicModal, $http, $timeout, networkService) {
      const vm = this;

      vm.$onInit = onInit;
      vm.toggleModal = toggleModal;
      vm.testNetwork = testNetwork;
      vm.buttonMessage = "Try Again";
      vm.wifiName = "EGGNOGG";
      vm.showModal = true;

      function testNetwork() {
        return networkService.testNetwork()
          .then((online) => {
            if (online) {
              vm.showModal = false;
              vm.modal.hide().then(() => {
                vm.message = ["Thank you for connecting to ", ""];
                vm.buttonMessage = "Continue";
                vm.modal.show();
                $timeout(() => {
                  toggleModal();
                }, 1500);
              });
            } else {
              vm.message = ["Please ensure your phone is connected to ", " before continuing."];
              vm.showModal = true;
              vm.modal.hide().then(() => {
                toggleModal();
              });
            }
          });
      }

      function toggleModal() {
        if (vm.showModal) {
          vm.modal.show();
        } else {
          vm.modal.remove();
        }
      }

      function onInit() {
        $ionicModal.fromTemplateUrl('wifi-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          vm.modal = modal;
        });
        testNetwork();
      }
    }
  ])
  .controller('signupCtrl', ['$scope', '$stateParams', '$http', '$state', 'UserFactory',
    // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $http, $state, UserFactory) {

      const vm = this;
      vm.signup = signup;

      function signup() {

        if (!vm.signupForm.email) {
          window.plugins.toast.showWithOptions({
            message: "Please enter an email",
            duration: "long",
            position: "center",
            addPixelsY: -40
          });
        } else if (!vm.signupForm.username) {
          window.plugins.toast.showWithOptions({
            message: "Please enter an username",
            duration: "long",
            position: "center",
            addPixelsY: -40
          });
        } else if (!vm.signupForm.password) {
          window.plugins.toast.showWithOptions({
            message: "Please enter an password",
            duration: "long",
            position: "center",
            addPixelsY: -40
          });
        } else {
          UserFactory.makeNew(vm.signupForm.email, vm.signupForm.username, vm.signupForm.password)
            .then(function success(userData) {
              vm.data = userData;
              console.log(Object.keys(userData));
              UserFactory.login(UserFactory.userData);
              $state.go('tabsController.profile');
            }, function error(error) {
              console.log('error creating user');
              window.plugins.toast.showWithOptions({
                message: `Failed to create user: ${error.data}.\nPlease try again.`,
                duration: "long",
                position: "center",
                addPixelsY: -40
              });
            });
        }
      }
    }
  ]);
