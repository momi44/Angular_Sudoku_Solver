angular.module("sudoku", ['ui.bootstrap'])
.controller('tDrawCtr', ['$scope', function($scope) {
     $scope.data = [
				[8, 5, 6, 0, 1, 4, 7, 3, 0],
				[0, 9, 0, 0, 0, 0, 0, 0, 0],
				[2, 4, 0, 0, 0, 0, 1, 0, 0],
				[0, 6, 2, 0, 5, 9, 3, 0, 0],
				[0, 3, 1, 8, 0, 2, 4, 5, 0],
				[0, 0, 5, 3, 4, 0, 9, 2, 0],
				[0, 2, 4, 0, 0, 0, 0, 7, 3],
				[0, 0, 0, 0, 0, 0, 0, 1, 0],
				[0, 1, 8, 6, 3, 0, 2, 9, 4]
			];
    
    $scope.result = angular.copy($scope.data);
    // final is 0 when the final result of Sudoku is not solved yet. 
    $scope.final=0;
    
    /**
     * This function solves the sudoku by calling related methods
     */
    $scope.solve = function(){
        if (!$scope.validateData()){
            alert("The data is invalid!");
            return;
        }
        if ($scope.backTrack(0, -1)){
                $scope.final = 1;
        }else{
            alert("The data is invalid!");
        }
    }
    
    /**
     * Validate entry data. Make sure initial data is solvable.
     *
     */
    $scope.validateData = function(){
        for(var r = 0; r < 9; r++){
            for(var c = 0; c < 9; c++){
                if ($scope.result[r][c] != 0 && !($scope.validateRow(r, c) && $scope.validateColumn(r, c) && $scope.validateBox(r, c))){
                    console.log("Values are not valid! ");
                    console.log($scope.result[r][c]);
                    return false; 
                }
            }
        }
        return true;
    }

    /**
     *  Validate a selected item ($scope.result[r][c]) in a row. 
     */
    $scope.validateRow    = function (r, c) {
    var value = $scope.result[r][c];
    for (var col = 0; col < 9; col++) {
        if (col != c && $scope.result[r][col] == value) {
            return false;
        }
    }
    return true;
};

    /**
     *  Validate a selected item ($scope.result[r][c]) in a column. 
     */
    $scope.validateColumn = function (r, c) {
        var value = $scope.result[r][c];
        for (var row = 0; row < 9; row++) {
            if (row != r && $scope.result[row][c] == value) {
                return false;
            }
        }
        return true;
    };

    /**
     *  Validate a selected item ($scope.result[r][c]) in its specified box.
     *  e.g. for r=0, c=3 => boxRow=0 , boxCol=1 => beginning of each "for loop" is 0*3, 1*3 respectively. 
     */
    $scope.validateBox    = function (r, c) {
        var value = $scope.result[r][c];
        var boxRow = Math.floor(r / 3);
        var boxCol = Math.floor(c / 3);

        for (var row = boxRow * 3; row < boxRow * 3 + 3; row++) {
            for (var col = boxCol * 3; col < boxCol * 3 + 3; col++) {
                if (row != r && col != c && $scope.result[row][col] == value) {
                    return false;
                }
            }
        }
        return true;
    };

    $scope.backTrack      = function (r, c) {
        //Moving forward in a row.
        c++; 
        //If it's the end of colomn, go to the next row.
        if (c > 8) { 
            c = 0;
            r++;
        //If the whole table is traversed: r>8.
            if (r > 8) {
                return true;
            }
        }

        // Go forward to the next square if the current one is already filled.
        if ($scope.result[r][c] != 0) { 
            if (!($scope.validateRow(r, c) && $scope.validateColumn(r, c) && $scope.validateBox(r, c))){
                return false;
            }
            return $scope.backTrack(r, c);
        } else {
        // If the square is 0, check all possible answers. 
            for (var x = 1; x < 10; x++) {
                $scope.result[r][c] = x;
                if ($scope.validateRow(r, c) &&  $scope.validateColumn(r, c) && $scope.validateBox(r, c)){
        // Recursive back track.           
                    if ($scope.backTrack(r, c)) {
                        return true;
                    }
                
                }
            }
        // This is where we have to go back and change previous values.
            $scope.result[r][c] = 0;
            return false;
        }
    }; 
}])

/*
* The directive draws the unsolved Sudoku table.
*/
.directive('tDrawMain', function () {
    return {
        restrict: 'EA',
        template: 
            '<table>' +
                '<tr ng-repeat="rows in data">' +
                    '<td ng-repeat="cols in rows track by $index"> <div class="true" ng-if="cols!=0">{{cols}}</div> </td>'+
                '</tr>' +
            '</table>'
    };
})

/*
* The directive populates the result.
*/
.directive('tDrawResult', function () {
    return {
        restrict: 'EA',
        template: 
            '<table>' +
                '<tr ng-repeat="rows in result">' +
                    '<td ng-repeat="cols in rows track by $index"> <span ng-if="final!=0 && cols!=0">{{cols}}</span> </td>'+
                '</tr>' +
            '</table>'
    };
});

