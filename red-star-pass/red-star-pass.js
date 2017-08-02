"use strict;"

const icons = ["plus","asterisk","stop","adjust"];
const colours = ["success","primary","warning","danger", "default"];

function replaceAtIndex(index) {
  const row = Math.floor(index / 6);
  const column = index % 6;
  if (column === 0 || column === 5  ) {
    return;
  }
  const glyph = icons[column - 1];
  const colour = colours[row];
  $(this).html("<span class=\"glyphicon glyphicon-" + glyph + " text-" + colour  + " \" aria-hidden=\"true\"></span>");
  $(this).click(getAddHandler(glyph, colour));

}

function getAddHandler(glyph, colour) {
  return function() {
    let found = 999;
    $(".input-group-addon").each(function(index) { if($(this).hasClass("empty")) { found = index; return false; } });
    if (found === 999) {
      return;
    }
    $(".input-group-addon").eq(found).html("<span class=\"glyph-padding glyphicon glyphicon-" + glyph + " text-" + colour  + " \" aria-hidden=\"true\"></span>");
    $(".input-group-addon").eq(found).removeClass("empty");
  }
}

function removePasswordGlyph(item) {
  if(item.hasClass("empty")) {
    return;
  }
  item.addClass("empty");
  item.html("<span class=\"bigbull\">&bull;</span>");
}

function passwordSubmit() {
  let pw = [];
  $(".input-group-addon").each(function(){ pw.push(getByte($(this))); })
  pw = pw.concat(passwordBytes($("#password-input").val()));
  console.log(pw);
}

function passwordBytes(password) {
  const result = password.split("").map( function(char) { return char.charCodeAt(0)});
  console.log("password bytes");
  return result;
}

function getByte(element) {
  const span = element.children().eq(0);
  if (!span.hasClass("glyphicon")) {
    return 1;
  }
  let iconNum = 0;
  let colourNum = 0;
  icons.map(function(icon, idx) { if (span.hasClass("glyphicon-" + icon)) { iconNum = idx; }});
  colours.map(function(colour, idx) { if (span.hasClass("text-" + colour)) { colourNum = idx; }});
  return 2 + iconNum + (colourNum * icons.length);
}

$( document ).ready(function() {
    $(".pass-button").each(replaceAtIndex);
    $(".input-group-addon").click( function() {removePasswordGlyph($(this))});
    $("#password-submit").click(passwordSubmit);
});

