(function() {
  
  'use strict';
  
  angular
    .module('harbor.layout.project')
    .controller('ProjectController', ProjectController);

  ProjectController.$inject = ['$scope', 'ListProjectService', '$timeout', 'currentUser', 'getRole', '$filter', 'trFilter']; 

  function ProjectController($scope, ListProjectService, $timeout, currentUser, getRole, $filter, trFilter) {
    var vm = this;
 
    vm.isOpen = false;
    vm.projectName = '';
    vm.publicity = 0;
     
    vm.retrieve = retrieve;
    vm.showAddProject = showAddProject;
    vm.searchProject = searchProject;    
    vm.showAddButton = showAddButton;
    vm.togglePublicity = togglePublicity;    
    vm.user = currentUser.get();      
    vm.retrieve();
    vm.getProjectRole = getProjectRole;
    
    
    //Error message dialog handler for project.
    $scope.$on('modalTitle', function(e, val) {
      vm.modalTitle = val;
    });
    
    $scope.$on('modalMessage', function(e, val) {
      vm.modalMessage = val;
    });
       
    $scope.$on('raiseError', function(e, val) {
      if(val) {   
        vm.action = function() {
          $scope.$broadcast('showDialog', false);
        };
        vm.contentType = 'text/plain';
        vm.confirmOnly = true;      
        $scope.$broadcast('showDialog', true);
      }
    });
    
    
    function retrieve() {       
      ListProjectService(vm.projectName, vm.publicity)
        .success(listProjectSuccess)
        .error(listProjectFailed);
    }
    
    function listProjectSuccess(data, status) {
      vm.projects = data || [];
    }
    
    function getProjectRole(roleId) {
      if(roleId !== 0) {
        var role = getRole({'key': 'roleId', 'value': roleId});
        return role.name;
      }
      return '';
    }
    
    function listProjectFailed(data, status) {
      $scope.$emit('modalTitle', $filter('tr')('error'));
      $scope.$emit('modalMessage', $filter('tr')('failed_to_get_project'));
      $scope.$emit('raiseError', true);
      console.log('Failed to get Project.');
    }
          
    $scope.$on('addedSuccess', function(e, val) {
      vm.retrieve();
    });
    
    function showAddProject() {
      if(vm.isOpen){
        vm.isOpen = false;        
      }else{
        vm.isOpen = true;        
      }
    }
    
    function searchProject() {
      vm.retrieve();
    }
    
    function showAddButton() {
      if(vm.publicity === 0) {
        return true;
      }else{
        return false;
      }
    }
    
    function togglePublicity(e) {
      vm.publicity = e.publicity;
      vm.isOpen = false;
      vm.retrieve();
      console.log('vm.publicity:' + vm.publicity);
    }
    
  }
  
})();