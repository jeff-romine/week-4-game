function toKebobCase(name) {
  return name.toLowerCase().split(" ").join("-");
}

$(document).ready(function () {

  function player(name, side, src, healthPoints, attackPower, counterAttackPower) {
    this.name = name;
    this.src = src;
    this.side = side;
    this.id = toKebobCase(name);
    this.healthPoints = healthPoints;
    this.attackPower = attackPower;
    this.baseAttackPower = attackPower;
    this.counterAttackPower = counterAttackPower;
  }

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

      $("#" + id).append(div);

    });
  }

  var selectPlayer;
  var selectedPlayer;
  var selectOpponent;
  var selectedOpponent;
  var characterMap;

  var allPlayers = [
    new player("Finn", "light", "assets/images/finn.jpeg", 100, 5, 10),
    new player("Rey", "light", "assets/images/rey.jpeg", 100, 5, 10),
    new player("Luke", "light", "assets/images/luke.jpeg", 100, 5, 10),
    new player("Kylo Ren", "dark", "assets/images/ren.jpeg", 100, 5, 50),
    new player("Darth Maul", "dark", "assets/images/darthmaul.jpeg", 100, 5, 10),
    new player("Captain Phasma", "dark", "assets/images/phasma.jpeg", 100, 5, 10)
  ];

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

  function setUpOpponentSelection(selectedPlayer, selectOpponent, message) {

    $(".opponent-area").hide();

    updateImageArea("selected-player", "col-sm-12 col-md-12 col-lg-12", [selectedPlayer]);
    updateImageArea("select-opponent", "col-sm-4 col-md-4 col-lg-4", selectOpponent);
    $("#select-opponent").show();

    $("#instruction-message").text(message);
  }


  function sSelectOpponent(event) {
    console.log("event:", event);
    console.log("characterMap", characterMap);

    var areaId = event.target.parentElement.id;

    if (areaId !== "select-opponent") {
      $("#instruction-message").text("really? do you not know how to click things?");
      return sSelectOpponent;
    }

    var playerId = event.target.id.substring(areaId.length + 1);

    // extract the selected player from the selectOpponent array

    var newSelectOpponent = [];

    selectOpponent.forEach(function (opponent) {
      if (playerId === opponent.id) {
        selectedOpponent = opponent;
      }
      else {
        newSelectOpponent.push(opponent);
      }
    });

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

    if (selectedOpponent.healthPoints <= 0) {
      return playerWins();
    }

    selectedPlayer.healthPoints -= selectedOpponent.counterAttackPower;

    console.log(
      "selectedPlayer.healthPoints - " + selectedOpponent.counterAttackPower +
      " === " + selectedPlayer.healthPoints);

    if (selectedPlayer.healthPoints <= 0) {
      return opponentWins();
    }
    return sFight;
  }

  function playerWins() {

    selectOpponent.push(selectedOpponent);
    setUpOpponentSelection(selectedPlayer, selectOpponent, "choose your next opponent");
    return sSelectOpponent;
  }

  function opponentWins() {

    $("body").click(init);

    $("#instruction-message").text("you have disgraced the " + selectedPlayer.side + " side. click anywhere to try for redemption.");

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


  function clickHandler(event) {

    $("#instruction-message").text("nice hit!");

    state = state(event);
    applyClickHandler();
  }

  // It seems to be necessary to re-apply click handlers every time
  // matching elements are added to the DOM.
  function applyClickHandler() {
    // Unbind existing click handlers so that we don't end up
    // with multiple handlers/button.
    $(".character-btn").unbind("click", clickHandler);

    $(".character-btn").click(clickHandler);
  }

  init();
});