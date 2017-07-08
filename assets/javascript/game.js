
$(document).ready( function () {

  function player(name,imageSrc,hitPoints,side) {
    this.name=name;
    this.imageSrc=imageSrc;
    this.hitPoints=hitPoints;
    this.side=side;
  }

  var players = [
    new player("Ren","assets/images/ren.jpeg",100,"light"),
    new player("Ren","assets/images/phasma.jpeg",120,"dark")
  ];

  var selectPlayer = players;

  function updateImageArea(id,players) {
    $(id).empty();

    players.forEach((player) => {
      var img=$("<img/>")
        .attr("src",player.imageSrc)
        .css("height","100px");
      $(id).append(img);
    });
  }

  function updateDisplay() {
    updateImageArea("#select-player", selectPlayer);
  }

  updateDisplay();
});