var app = angular.module('FansApp', []);


app.controller('FansCtrl', function($scope, $http) {

  $scope.dice = [];
  $scope.diceTypes = ['relation', 'transition', 'relation'];

  $scope.DICE_PARAMETERS = {
    // all must be unique
    relation: ['C', 'I', 'O', 'S', 'W', 'X'],
    transition: ['static', 'extension', 'fold', 'spin + antispin', 'tracer',
                 'glides + slides', 'isolation', 'stack'],
    num_poses: {C: 6, I: 4, O: 5, S: 6, W: 6, X: 6},
  };

  $scope.getDieType = function(die_name) {
    for (var die_type in $scope.DICE_PARAMETERS) {
      if (_.contains($scope.DICE_PARAMETERS[die_type], die_name)) {
        return die_type;
      }
    }
  };

  $scope.shuffle = function() {
    $scope.dice = _.map($scope.diceTypes, function(dtype) {
      return {
        type: dtype,
        content: _.sample($scope.DICE_PARAMETERS[dtype]),
      };
    });
    $scope.updateUrlParams();
  };

  $scope.getImageUrl = function(relationName) {
    if (! _.contains($scope.DICE_PARAMETERS.relation, relationName))
      return null;
    if ($('body').attr('display-mode') == 'pose') {
      return ('/images/relation_' + relationName +
              _.random(1, $scope.DICE_PARAMETERS.num_poses[relationName]).toString()
              + '.png');
    }
    return '/images/relation_' + relationName + '.png';
  };

  $scope.updateUrlParams = function() {
    // Dump config to url params
    var dice_names = _.map($scope.dice, function(die) {
      return die.content;
    });
    window.urlparams.setUrlParams({dice: dice_names.join(',')});
  };

  $scope.initialize = function() {
    // Load configuration from permalink, or shuffle if DNE
    var params = window.urlparams.getUrlParams();
    if (params.dice) {
      $scope.dice = _.map(params.dice.split(','), function(die_name) {
        return {
          type: $scope.getDieType(die_name),
          content: die_name
        };
      });
    }
    else {
      $scope.shuffle();
    }
  };

  $scope.initialize();
});
