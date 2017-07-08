/**
 * Created by jeffromine on 6/25/17.
 */



$(document).ready(function () {
  var wordTable = {
    "MAGNOLIA": {
      title: "Sugar Magnolia",
      src: "https://www.youtube.com/embed/nkKuhAxcH7g"
    },
    "ALTHEA": {
      title: "Althea",
      src: "https://www.youtube.com/embed/N7lMxNfb7rw"
    },
    "BROKEDOWN": {
      title: "Brokedown Palace",
      src: "https://www.youtube.com/embed/A9uyMjzmT3k"
    },
    "PALACE": {
      title: "Brokedown Palace",
      src: "https://www.youtube.com/embed/A9uyMjzmT3k"
    },
    "BEGONIAS": {
      title: "Scarlet Begonias",
      src: "https://www.youtube.com/embed/xgPLFYNEL1A"
    },
    "SCARLET": {
      title: "Scarlet Begonias",
      src: "https://www.youtube.com/embed/xgPLFYNEL1A"
    }
  };

  var state = "init";
  var currentWordArr;
  var lettersGuessed = [];
  var guessesRemaining = 10;
  var correctLetterCount = 0;
  var displayWordArr;
  var words = Object.keys(wordTable);

  function setElementTextById(id, value) {
    "use strict";
    document.getElementById(id).textContent = value;
  }

  function refreshGameArea() {
    "use strict";
    /* TODO Re-write with jQuery */
    setElementTextById("display-word", displayWordArr.join(" "));
    setElementTextById("guesses-remaining", "" + guessesRemaining);
    setElementTextById("letters-guessed", Array.from(lettersGuessed).join(","));
  }

  function updateDisplay(videoData) {
    "use strict";
    /* Show song title with guessed word highlighted above video" */
    /* TODO Re-write with jQuery */

    $("#youtube-iframe").attr("src",videoData.src);
    $("#youtube-iframe-placeholder").hide();
    $("#youtube-iframe").show();
  }

  function displayPlaceholder() {
    "use strict";
    /* Show song title with guessed word highlighted above video" */
    $("#youtube-iframe").hide();
    $("#youtube-iframe-placeholder").show();
    $("#youtube-iframe").attr("src","");
  }

  function isAlpha(ch) {
    "use strict";
    return /^[A-Z]$/i.test(ch);
  }

  function showInstructions() {
    $("#guess").hide();
    $("#instructions").show();
  }

  function showGuess() {
    $("#instructions").hide();
    $("#guess").show();
  }

  document.onkeyup = function (event) {
    "use strict";
    var letter = event.key.toUpperCase();

    if (state === "init") {
      currentWordArr = Array.from(words[Math.floor(Math.random() * words.length)].toUpperCase());
      displayWordArr = currentWordArr.map((x) => "_");
      lettersGuessed = new Set();
      guessesRemaining = 12;
      correctLetterCount = 0;

      refreshGameArea();
      showGuess();
      state = "guess";
    }
    else if (state === "guess") {

      if ((letter.length > 1) || !isAlpha(letter)) {
        return;
      }

      if (!lettersGuessed.has(letter)) {
        lettersGuessed.add(letter);

        if (currentWordArr.includes(letter)) {
          currentWordArr.forEach(function (currentLetter, i) {
            if (currentLetter === letter) {
              if (displayWordArr[i] !== "_") {
                console.log("ERROR: \"" + letter + "\" has already been replaced in display word");
              }
              displayWordArr[i] = letter;
              correctLetterCount += 1;
            }
          });
        }
        guessesRemaining -= 1;

        if (correctLetterCount === currentWordArr.length) {
          // WIN
          var currentWord = wordTable[currentWordArr.join("")];
          updateDisplay(currentWord);
          showInstructions();
          state = "init";
        }
        else if (0 === guessesRemaining) {
          // LOSE
          displayPlaceholder();
          showInstructions();
          state = "init";
        }

      }
      refreshGameArea();
    }
  };
});

