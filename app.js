var gameApp = angular.module("gameApp",[]);

gameApp.controller("MinesweeperController",['$scope',function($scope){

  $scope.isWinMessageVisible = false;
  $scope.hasLostMessageVisible = false;

  function placeRandomMine(minefield) {
    var row = Math.round(Math.random() * 8);
    var column = Math.round(Math.random() * 8);
    console.log("mine in : "+row+":"+column);
    var spot = getSpot(minefield, row, column);
    spot.content = "mine";
  }
  function getSpot(minefield, row, column) {
    return minefield.rows[row].spots[column];
  }
  function placeManyRandomMines(minefield) {
    for(var i = 0; i < 10; i++) {
      placeRandomMine(minefield);
    }
  }

  function calculateNumber(minefield, row, column) {
    var thisSpot = getSpot(minefield, row, column);

    // if this spot contains a mine then we can't place a number here
    if(thisSpot.content == "mine") {
      return;
    }

    var mineCount = 0;

    // check row above if this is not the first row
    if(row > 0) {
      // check column to the left if this is not the first column
      if(column > 0) {
        // get the spot above and to the left
        var spot = getSpot(minefield, row - 1, column - 1);
        if(spot.content == "mine") {
          mineCount++;
        }
      }

      // get the spot right above
      var spot = getSpot(minefield, row - 1, column);
      if(spot.content == "mine") {
        mineCount++;
      }

      // check column to the right if this is not the last column
      if(column < 8) {
        // get the spot above and to the right
        var spot = getSpot(minefield, row - 1, column + 1);
        if(spot.content == "mine") {
          mineCount++;
        }
      }
    }

    // check column to the left if this is not the first column
    if(column > 0) {
      // get the spot to the left
      var spot = getSpot(minefield, row, column - 1);
      if(spot.content == "mine") {
        mineCount++;
      }
    }

    // check column to the right if this is not the last column
    if(column < 8) {
      // get the spot to the right
      var spot = getSpot(minefield, row, column + 1);
      if(spot.content == "mine") {
        mineCount++;
      }
    }

    // check row below if this is not the last row
    if(row < 8) {
      // check column to the left if this is not the first column
      if(column > 0) {
        // get the spot below and to the left
        var spot = getSpot(minefield, row + 1, column - 1);
        if(spot.content == "mine") {
          mineCount++;
        }
      }

      // get the spot right below
      var spot = getSpot(minefield, row + 1, column);
      if(spot.content == "mine") {
        mineCount++;
      }

      // check column to the right if this is not the last column
      if(column < 8) {
        // get the spot below and to the right
        var spot = getSpot(minefield, row + 1, column + 1);
        if(spot.content == "mine") {
          mineCount++;
        }
      }
    }

    if(mineCount > 0) {
      thisSpot.content = mineCount;
    }
  }


  function calculateAllNumbers(minefield) {
    for(var y = 0; y < 9; y++) {
      for(var x = 0; x < 9; x++) {
        calculateNumber(minefield, x, y);
      }
    }
  }
  function hasWon(minefield) {
    for(var y = 0; y < 9; y++) {
      for(var x = 0; x < 9; x++) {
        var spot = getSpot(minefield, y, x);
        if(spot.isCovered && spot.content != "mine") {
          return false;
        }
      }
    }

    return true;
  }

  function revealAll(minefield){

    for(var y = 0; y < 9; y++)
    for(var x = 0; x < 9; x++)
    minefield.rows[y].spots[x].isCovered = false;
  }

  function createMinefield() {
    var minefield = {};
    minefield.rows = [];

    for(var i = 0; i < 9; i++) {
      var row = {};
      row.spots = [];

      for(var j = 0; j < 9; j++) {
        var spot = {};
        spot.x = i;
        spot.y = j;
        spot.content = "empty";
        spot.isCovered = true;
        spot.nearby: 0,
        row.spots.push(spot);
      }

      minefield.rows.push(row);
    }
    placeManyRandomMines(minefield);
    calculateAllNumbers(minefield);
    return minefield;
  }
  $scope.minefield = createMinefield();
  $scope.uncoverSpot = function(spot){
    //getAdjList(spot);
    spot.isCovered = false;

    if(spot.content === "mine"){
      $scope.hasLostMessageVisible = true;
      revealAll($scope.minefield);
    }
    else {
      if(hasWon($scope.minefield)) {
        $scope.isWinMessageVisible = true;
        revealAll($scope.minefield);
      }
    }
    if(spot.content === "empty")
      uncoverBonus(spot);

  }
  function nearBySpotReveal(spot){

    if(spot.content === "empty"){
      spot.isCovered = false;
      uncoverBonus(spot);
      return;

    }
    else if(spot.content != "mine"){
      spot.isCovered = false;
      return;
    }
    else
      return;
  }




  function uncoverBonus(spot){

    var adjList = getAdjList(spot);
    var numberOfCells = adjList.length;
    for(i=0;i<numberOfCells;i++){
        console.log("beofre caling reveal"+adjList[i][0],adjList[i][1]);
        var spot = getSpot($scope.minefield,adjList[i][0],adjList[i][1]);
        if(spot.isCovered && spot.content != "mine"){
          console.log("calling reveal:"+adjList[i][0],adjList[i][1]);
          nearBySpotReveal(spot);
        }
    }
  }
  function getAdjList(spot) {
    var x = spot.x;
    var y = spot.y;
    var adjList = [];
    var row =[];


    for(var i = x-1 ;i <= x+1 ;i++){
      if(i == -1 || i == 9)
      continue;
      else {
        for(var j = y-1;  j <= y+1 ; j++){
          if(j == -1 || j == 9)
          continue;
          else{
              row = [i,j];
              adjList.push(row);
          }
        }
      }
    }

    console.log(adjList);
    return adjList;
  }


}]);
