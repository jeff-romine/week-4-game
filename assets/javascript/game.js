
$(document).ready(function () {

  function toKebobCase(name) {
    return name.toLowerCase().split(" ").join("-");
  }

  function player(name, side, src, healthPoints, attackPower, counterAttackPower) {
    this.name = name;
    this.src = src;
    this.side = side;
    this.id = toKebobCase(name);
    this.healthPoints = healthPoints;
    this.startingHealthPoints = healthPoints;
    this.attackPower = attackPower;
    this.baseAttackPower = attackPower;
    this.counterAttackPower = counterAttackPower;
  }

  var selectPlayer;
  var selectedPlayer;
  var selectOpponent;
  var selectedOpponent;
  var characterMap;
  var clickToRestart = false;

  var allPlayers = [
    new player("Finn", "light", "assets/images/finn.jpeg", 133, 15, 25),
    new player("Rey", "light", "assets/images/rey.jpeg", 150, 17, 35),
    new player("Luke", "light", "assets/images/luke.jpeg", 145, 14, 20),
    new player("Kylo Ren", "dark", "assets/images/ren.jpeg", 150, 17, 35),
    new player("Darth Maul", "dark", "assets/images/darthmaul.jpeg", 145, 14, 20),
    new player("Captain Phasma", "dark", "assets/images/phasma.jpeg", 133, 15, 25)
  ];

  function updateImageArea(id, classes, players) {
    $("#" + id).empty();

    players.forEach((p) => {

      var div = $("<div>")
        .attr("id", id + "-" + p.id)
        .addClass(classes)
        .addClass("character-btn btn btn-default")
        .css(
          {
            "backgroundImage": "url(" + p.src + ")",
            "backgroundRepeat": "no-repeat",
            "backgroundPosition": "center center",
            "backgroundSize": "cover",
            "borderColor": "yellow"
          })
        .css("height", "100%");

      if (p.healthPoints <= 0) {
        var deadImg = $("<img>")
          .attr("src","assets/images/dead.png")
          .addClass("dead-indicator");
        $(div).append(deadImg);
      }
      if (((p === selectedPlayer) || (p === selectedOpponent)) && isAlive(p)) {
        $(div).addClass("progress");

        var progressBarWidth =
          Math.min(Math.ceil((p.healthPoints/p.startingHealthPoints) * 100)).toString()
          + "%";

        var progressBar = $("<div>")
          .addClass("progress-bar")
          .attr("role","progressbar")
          .attr("aria-valuenow",p.healthPoints.toString())
          .attr("aria-valuemin","0")
          .attr("aria-valuemax",p.startingHealthPoints.toString())
          .css({
            "width":progressBarWidth,
            "height":"10%",
            "position":"absolute",
            "bottom":"0",
            "left":"0",
            "padding":"0"}).text(p.healthPoints);

        $(div).append(progressBar);
      }
      $("#" + id).append(div);

    });
  }


  function sNoop(event) {
    return sNoop;
  }

  function copyObject(obj) {
    return jQuery.extend(true, {}, obj);
  }

  function sSelectCharacter(event) {
    console.log("event:", event);
    console.log("characterMap", characterMap);
    var areaId = event.target.parentElement.id;
    var playerId = event.target.id.substring(areaId.length + 1);
    /* make a copy of the object for debugging purposes */

    selectedPlayer = copyObject(characterMap[playerId]);

    if (selectedPlayer.side === "light") {
      selectOpponent = selectPlayer.filter((p) => p.side === "dark").map(copyObject);
    }
    else {
      selectOpponent = selectPlayer.filter((p) => p.side === "light").map(copyObject);
    }

    $("#" + areaId).hide();

    setUpOpponentSelection(selectedPlayer,selectOpponent,"select your first opponent by clicking their image");
    $("#selected-player").show();

    return sSelectOpponent;
  }

  function updateSelectedPlayer() {
    updateImageArea("selected-player","col-sm-12 col-md-12 col-lg-12", [selectedPlayer]);
  }

  function updateSelectedOpponent() {
    updateImageArea("current-opponent-area","col-sm-12 col-md-12 col-lg-12", [selectedOpponent]);
  }

  function updateSelectOpponent() {
    updateImageArea("select-opponent", "col-sm-4 col-md-4 col-lg-4", selectOpponent);
  }

  function setUpOpponentSelection(selectedPlayer, selectOpponent, message) {

    $(".opponent-area").hide();

    updateSelectedPlayer();
    updateSelectOpponent();
    $("#select-opponent").show();

    $("#instruction-message").text(message);
  }

  function sSelectOpponent(event) {
    console.log("event:", event);
    console.log("characterMap", characterMap);

    var areaId = event.currentTarget.parentElement.id;

    if (areaId !== "select-opponent") {
      $("#instruction-message").text("really? do you not know how to click things?");
      return sSelectOpponent;
    }

    var playerId = event.currentTarget.id.substring(areaId.length + 1);

    // extract the selected player from the selectOpponent array

    var newSelectOpponent = [];

    var deadOpponent = false;

    selectOpponent.forEach(function (opponent) {
      if (playerId === opponent.id) {
        if (isAlive(opponent)) {
          selectedOpponent = opponent;
        }
        else {
          $("#instruction-message").text("try picking a live one!");
          deadOpponent = true;
        }
      }
      else {
        newSelectOpponent.push(opponent);
      }
    });

    if (deadOpponent) {
      return sSelectOpponent;
    }

    selectOpponent = newSelectOpponent;

    $("#select-opponent").hide();
    updateImageArea("current-opponent-area", "col-sm-12 col-md-12 col-lg-12", [selectedOpponent]);

    $(".opponent-area").show();

    $("#instruction-message").text("attack your opponent by clicking their image");

    return sFight;
  }


  function sFight(event) {

    console.log("sFight", event);

    selectedOpponent.healthPoints -= selectedPlayer.attackPower;

    console.log(
      "selectedOpponent.healthPoints - " + selectedPlayer.attackPower + " === " +
      selectedOpponent.healthPoints);

    selectedPlayer.attackPower += selectedPlayer.baseAttackPower;

    console.log(
      "new selectedPlayer.attackPower === " + selectedPlayer.attackPower);

    updateSelectedOpponent();

    if (selectedOpponent.healthPoints <= 0) {
      return tPlayerWins();
    }

    selectedPlayer.healthPoints -= selectedOpponent.counterAttackPower;

    console.log(
      "selectedPlayer.healthPoints - " + selectedOpponent.counterAttackPower +
      " === " + selectedPlayer.healthPoints);

    updateSelectedPlayer();

    if (selectedPlayer.healthPoints <= 0) {
      return tGameOverOpponentWins();
    }
    return sFight;
  }

  function sGameOverPlayerWins() {
    $("#instruction-message").text("you win! click anywhere to play again.");
    clickToRestart = true;
    return sNoop;
  }
  function isAlive(p) {
    return p.healthPoints > 0;
  }

  function areSomeAlive(players) {
    return players.some(isAlive);
  }

  function tPlayerWins() {

    selectOpponent.push(selectedOpponent);

    if (areSomeAlive(selectOpponent)) {
      setUpOpponentSelection(selectedPlayer, selectOpponent, "choose your next opponent");
      return sSelectOpponent;
    }
    else {
      setUpOpponentSelection(selectedPlayer, selectOpponent, "you win! click anywhere to play again");
      return sGameOverPlayerWins();
    }
  }

  function tGameOverOpponentWins() {
    $("#instruction-message").text("You have disgraced the " + selectedPlayer.side + " side! click anywhere to retry");
    clickToRestart = true;
    return sNoop;
  }

  function init() {

    $("body").unbind("click",init);

    selectPlayer = allPlayers;

    characterMap = {}

    selectPlayer.forEach((player) => {
      characterMap[player.id] = player;
    });

    selectedPlayer = []
    selectOpponent = []

    $("#select-player").show();
    $("#selected-player").hide();
    $(".opponent-area").hide();
    $("#select-opponent").hide();

    updateImageArea("select-player", "col-sm-4 col-md-4 col-lg-4", selectPlayer);
    updateImageArea("selected-player", "col-sm-12 col-md-12 col-lg-12", selectedPlayer);
    updateImageArea("select-opponent", "col-sm-4 col-md-4 col-lg-4", selectOpponent);

    $("#instruction-message").text("select your character by clicking their image");

    applyClickHandler();

    state = sSelectCharacter;
  }

  function restartHandler(event) {
    if (clickToRestart) {
      // This is a trick to ignore the first invocation
      clickToRestart = false;
    }
    else {
      $("body").unbind("click",restartHandler);
      init();
    }
  }

  function clickHandler(event) {
    state = state(event);
    if (clickToRestart) {
      clearClickHandler();
      $("body").click(restartHandler);
    }
    else {
      applyClickHandler();
    }
  }

  function clearClickHandler() {
    $(".character-btn").unbind("click", clickHandler);
  }

  // It seems to be necessary to re-apply click handlers every time
  // matching elements are added to the DOM.
  function applyClickHandler() {
    // Unbind existing click handlers so that we don't end up
    // with multiple handlers/button.
    clearClickHandler();

    $(".character-btn").click(clickHandler);
  }

  init();
});