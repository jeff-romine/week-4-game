function toKebobCase(name) {
  return name.toLowerCase().split(" ").join("-");
}

$(document).ready(function () {

  function player(name, src, hitPoints, side) {
    this.name = name;
    this.src = src;
    this.hitPoints = hitPoints;
    this.side = side;
    this.id = toKebobCase(name);
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
    new player("Finn", "assets/images/finn.jpeg", 100, "light"),
    new player("Rey", "assets/images/rey.jpeg", 100, "light"),
    new player("Luke", "assets/images/luke.jpeg", 100, "light"),
    new player("Kylo Ren", "assets/images/ren.jpeg", 100, "dark"),
    new player("Darth Maul", "assets/images/darthmaul.jpeg", 120, "dark"),
    new player("Captain Phasma", "assets/images/phasma.jpeg", 120, "dark")
  ];

  function updateDisplay() {
    updateImageArea("select-player", "col-sm-4 col-md-4 col-lg-4", selectPlayer);
    updateImageArea("selected-player", "col-sm-12 col-md-12 col-lg-12", selectedPlayer);
    updateImageArea("select-opponent", "col-sm-4 col-md-4 col-lg-4", selectOpponent);
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

    // $("#" + areaId).css("visibility","hidden");

    $("#" + areaId).hide();

    updateImageArea("selected-player", "col-sm-12 col-md-12 col-lg-12", [selectedPlayer]);
    updateImageArea("select-opponent", "col-sm-4 col-md-4 col-lg-4", selectOpponent);

    $("#instruction-message").text("choose your first opponent by clicking their image");

    return sSelectOpponent;
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

    selectedOpponent = [copyObject(characterMap[playerId])];

    $("#select-opponent").hide();

    updateImageArea("current-opponent-area", "col-sm-12 col-md-12 col-lg-12", selectedOpponent);
    $(".opponent-area").show();

    $("#instruction-message").text("attack your opponent by clicking their image");

    return sFight;
  }

  function sFight(event) {
    console.log("sFight",event);
    return sFight;
  }

  function init() {

    selectPlayer = allPlayers;

    characterMap = {}

    selectPlayer.forEach((player) => {
      characterMap[player.id] = player;
    });

    selectedPlayer = []
    selectOpponent = []

    updateDisplay();

    $("#instruction-message").text("select your character by clicking their image");

    return sSelectCharacter;
  }

  var state = init();

  function clickHandler(event) {

    $("#instruction-message").text("nice hit!");

    state = state(event);
    applyClickHandler();
  }

  function applyClickHandler() {
    $(".character-btn").unbind("click",clickHandler);

    $(".character-btn").click(clickHandler);
  }

  applyClickHandler();

});