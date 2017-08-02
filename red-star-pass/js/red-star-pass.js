'use strict;';

// track the four possible icon types and five colours that will be used for iconography
const icons = ['plus', 'asterisk', 'stop', 'adjust'];
const colours = ['success', 'primary', 'warning', 'danger', 'default'];

// function to handle clicking an icon button to add it to the password
// closure capture is used to get the icon name and colour when building and attachhting the handler
function getAddHandler(glyph, colour) {
  return function addHandler() {
    let found = 999;
    $('.input-group-addon').each(
      function getAddIndex(index) {
        let result = true;
        if ($(this).hasClass('empty')) {
          found = index;
          result = false;
        }
        return result;
      });
    if (found === 999) {
      return;
    }
    const glypElement = `<span class="glyph-padding glyphicon glyphicon-${glyph} text-${colour} " aria-hidden="true"></span>`;
    $('.input-group-addon').eq(found).html(glypElement);
    $('.input-group-addon').eq(found).removeClass('empty');
  };
}

// function to populate the glyph icon button grid that the user will press to add to their password
function replaceAtIndex(index) {
  const row = Math.floor(index / 6);
  const column = index % 6;
  if (column === 0 || column === 5) {
    return;
  }
  const glyph = icons[column - 1];
  const colour = colours[row];
  $(this).html(`<span class="glyphicon glyphicon-${glyph} text-${colour} " aria-hidden="true"></span>`);
  $(this).click(getAddHandler(glyph, colour));
}

// get the byte for the password that represents an icon element,
// does the look up from icon type + colour to ASCII byte in range 1 - 21
// (1 is used when a user hasn't chosen a glyph, 0 is not used as that is string terminator)
function getGlyphByte(element) {
  const span = element.children().eq(0);
  if (!span.hasClass('glyphicon')) {
    return 1;
  }
  let iconNum = 0;
  let colourNum = 0;
  icons.forEach((icon, idx) => { if (span.hasClass(`glyphicon-${icon}`)) { iconNum = idx; } });
  colours.forEach((colour, idx) => { if (span.hasClass(`text-${colour}`)) { colourNum = idx; } });
  return 2 + iconNum + (colourNum * icons.length);
}

// get the raw bytes that represent text part of a password
function passwordBytes(password) {
  const result = password.split('').map(char => char.charCodeAt(0));
  return result;
}

// called when the user presses submit, for proof of concent it just shows the bytes on the page
// this should post to the back end in a real implementation
function passwordSubmit() {
  let pw = [];
  $('.input-group-addon').each(function addGlypByte() { pw.push(getGlyphByte($(this))); });
  pw = pw.concat(passwordBytes($('#password-input').val()));
  $('#password-show').html(JSON.stringify(pw));
}

// used when an added icon is clicked to remove it
function removePasswordGlyph(item) {
  if (item.hasClass('empty')) {
    return;
  }
  item.addClass('empty');
  item.html('<span class="bigbull">&bull;</span>');
}

// when the document loads, write the glyph icons to the buttons a user will press
// attach click handlers for those buttons and the click handler for removing added glyphs
// add click handler for password submit button
$(document).ready(() => {
  $('.pass-button').each(replaceAtIndex);
  $('.input-group-addon').click(function removeGlyp() { removePasswordGlyph($(this)); });
  $('#password-submit').click(passwordSubmit);
});

