var app = angular.module('FansApp', []);


app.controller('FansCtrl', function($scope, $http) {

  $scope.baseURL = '/fan-dice';  // ultrajanky gh-pages hack

  $scope.dice = [];
  $scope.displayMode = $('body').attr('display-mode');

  $scope.DICE_PARAMETERS = {
    // all must be unique
    relation: ['C', 'I', 'O', 'S', 'W', 'X'],
    transition: ['isolation', 'spin / antispin', 'tracer', 'slide / glide',
                 'stack', 'extension', 'fold', 'toss'],
    num_poses: {C: 6, I: 4, O: 5, S: 6, W: 6, X: 6},
  };

  $scope.getDieType = function(die_name) {
    for (var die_type in $scope.DICE_PARAMETERS) {
      if (_.contains($scope.DICE_PARAMETERS[die_type], die_name)) {
        return die_type;
      }
    }
  };

  $scope.shuffle = function(diceTypes) {
    diceTypes = diceTypes || ['relation', 'transition', 'relation'];
    $scope.dice = _.map(diceTypes, function(dtype) {
      var params = {
        type: dtype,
        content: _.sample($scope.DICE_PARAMETERS[dtype]),
      };
      if ($scope.displayMode == 'pose') {
        params.variant = _.random(
          1, $scope.DICE_PARAMETERS.num_poses[params.content]);
      }
      return params;
    });
    console.log("shuffled;", _.pluck($scope.dice, 'content'));
    $scope.updateUrlParams();
  };

  $scope.getImageUrl = function(die) {
    var relation = die.content;
    if (! _.contains($scope.DICE_PARAMETERS.relation, relation))
      return null;
    if ($scope.displayMode == 'pose' && die.variant !== undefined) {
      return ('/fan-dice/images/relation_' + relation + die.variant.toString() + '.png');
    }
    return '/fan-dice/images/relation_' + relation+ '.png';
  };

  $scope.updateUrlParams = function() {
    // Dump config to url params
    var dice_names = _.map($scope.dice, function(die) {
      if ($scope.displayMode == 'pose' && die.variant !== undefined) {
        return die.content + ':' + die.variant.toString();
      }
      return die.content;
    });
    window.urlparams.setUrlParams({dice: dice_names.join(',')});
  };

  $scope.initialize = function() {
    // Load configuration from permalink, or shuffle if DNE
    try {
      var params = window.urlparams.getUrlParams();
    } catch (ex) {
      $scope.shuffle();
      return;
    }
    if (params.dice) {
      console.log("load", params.dice);
      $scope.dice = _.map(params.dice.split(','), function(die_name) {
        if (_.contains(die_name, ':')) {
          die_name = die_name.split(':');
          return {
            type: $scope.getDieType(die_name[0]),
            content: die_name[0],
            variant: die_name[1],
          };
        }
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
