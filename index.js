// // Pete: look around on mobile, if supported
// (function() {
//
//   // assume device doesn't report orientation unless proven otherwise
//   // this allows us to update styles and behaviour only if supported
//   var hasDeviceOrientationInited = false;
//
//   // elements to scroll:
//   // for vertical scroll, some devices support `document.documentElement`
//   // while others use `document.body` so to be safe we support both
//   // for horizontal scroll, for consistency we use the main page wrapper el
//   var scrollVerticalEl;
//   var scrollVerticalElAlt;
//   var scrollHorizontalEl;
//
//   // the wrapper element surrounds all page content
//   // we use this to calculate some positioning
//   var wrapperEl;
//   var wrapperHeight = 0;
//   var wrapperWidth = 0;
//
//   // the canvas element surrounds page content too
//   // but extends beyond the visible border (to allow horizontal movement)
//   // we use this to calculate some positioning too
//   var canvasEl;
//   var canvasWidth = 0;
//
//   // device orientation - default to portrait
//   var isLandscape = false;
//   var isRotatedClockwise = false;
//
//   // message element, to update the text for mobile
//   var messageEl;
//
//   // method called on page load to init behaviour
//   function load() {
//     initElements();
//     calculateCanvasDimensions();
//     calculateDeviceOrientation();
//     initScroll();
//   }
//
//   // find all useful DOM elements
//   function initElements() {
//     scrollVerticalEl = document.documentElement;
//     scrollVerticalElAlt = document.body;
//     scrollHorizontalEl = document.querySelector('.wrapper');
//     wrapperEl = document.querySelector('.wrapper');
//     canvasEl = document.querySelector('.wrapper-inner');
//     messageEl = document.querySelector('.message');
//   }
//
//   // gather canvas dimensions, to be used later in calculations
//   function calculateCanvasDimensions() {
//     wrapperHeight = wrapperEl.offsetHeight;
//     wrapperWidth = wrapperEl.offsetWidth;
//     canvasWidth = canvasEl.offsetWidth;
//   }
//
//   // calculate whether the device is landscape or portrait
//   function calculateDeviceOrientation(e) {
//     isLandscape = document.documentElement.clientHeight < document.documentElement.clientWidth;
//     isRotatedClockwise = window.orientation === -90;
//   }
//
//   // set initial scroll position
//   function initScroll() {
//     var top = 0;
//     var left = 0;
//     setScroll(top, left);
//   }
//
//   // update scroll position
//   function setScroll(top, left) {
//     scrollVerticalEl.scrollTop = top;
//     scrollVerticalElAlt.scrollTop = top;
//     scrollHorizontalEl.scrollLeft = left;
//   }
//
//   // further initialisation logic from first device orientation event
//   //
//   // browsers report that they support device orientation
//   // even when they don't contain a giroscope,
//   // so for the first device orientation event,
//   // set up site to support them
//   function initDeviceOrientation() {
//     wrapperEl.classList.add('has-deviceOrientation');
//     hasDeviceOrientationInited = true;
//
//     // with the addition of a new class on the body element,
//     // styles may now be different for devices that support device orientation,
//     // so re-evaluate dimensions
//     calculateCanvasDimensions();
//
//     messageEl.textContent = `Have a look around!`;
//   }
//
//   // recalculate values based on major device rotation
//   // (e.g. landscape to portrait or vice versa)
//   function handleOrientationChange() {
//     // allow time for the screen layout to readjust first
//     setTimeout(function() {
//       calculateCanvasDimensions();
//       calculateDeviceOrientation();
//     }, 500);
//   }
//
//   // update scroll position based on orientation change event
//   function handleOrientationEvent(event) {
//     if (!hasDeviceOrientationInited) {
//       initDeviceOrientation();
//     }
//
//     // calculate orientation
//     // need to switch beta/gamma if device is in landscape mode
//     var alpha = calculateAlpha(event);
//     var beta = calculateBeta(event);
//
//     // calculate scroll position from orientation
//     var top = calculateVerticalScroll(beta);
//     var left = calculateHorizontalScroll(alpha);
//     setScroll(top, left);
//   }
//
//   // calculate alpha based on device orientation
//   function calculateAlpha(event) {
//     var alpha = event.alpha;
//
//     // landscape adjustments
//     if (isLandscape) {
//       // clockwise rotation
//       if (isRotatedClockwise) {
//         // above the horizon
//         if (event.gamma < 0) {
//           alpha = alpha + 180;
//           if (alpha > 360) {
//             alpha = alpha - 360;
//           }
//         }
//
//         // anti-clockwise rotation
//       } else {
//         // above the horizon
//         if (event.gamma > 0) {
//           alpha = alpha - 180;
//           if (alpha < 0) {
//             alpha = alpha + 360;
//           }
//         }
//       }
//     }
//
//     return alpha;
//   }
//
//   // calculate beta based on device orientation
//   // and fix range values accordingly
//   function calculateBeta(event) {
//     var beta;
//
//     // landscape adjustments
//     // beta (gamma) values change at the horizon
//     if (isLandscape) {
//       beta = event.gamma;
//
//       // clockwise rotation
//       // below the horizon, -90 (close to horizon) down to 0 (face up)
//       // above the horizon, 90 (close to horizon) down to 0 (face down)
//       if (isRotatedClockwise) {
//         if (beta < 0) { beta = 180 - Math.abs(beta); }
//
//         // anti-clockwise rotation
//         // below the horizon, 90 (close to horizon) down to 0 (face up)
//         // above the horizon, -90 (close to horizon) down to 0 (face down)
//       } else {
//         if (beta > 0) { beta = 180 - beta; }
//         if (beta < 0) { beta = Math.abs(beta); }
//       }
//
//     // portrait adjustments
//     } else {
//       beta = event.beta;
//     }
//
//     return beta;
//   }
//
//   // calculate new vertical scroll position
//   // beta: degree in the range [-180,180]
//   // convert beta value to a value within page height range
//   function calculateVerticalScroll(beta) {
//     var topRange = mapRange(beta, 180, 0, wrapperHeight, 0);
//     return Math.round(Math.abs(topRange));
//   }
//
//   // calculate new horizontal scroll position - based on alpha value
//   // alpha: degree in the range [0,360]
//   function calculateHorizontalScroll(alpha) {
//     var availableWidth = canvasWidth - wrapperWidth;
//     var alphaMax = 360;
//     var ratio = alpha / alphaMax;
//     return availableWidth - Math.round(availableWidth * ratio);
//   }
//
//   // map a value from one [min-max] range to another [min-max] range
//   function mapRange(value, fromMin, fromMax, toMin, toMax) {
//     return (value - fromMin) * (toMax - toMin) / (fromMax - fromMin) + toMax;
//   }
//
//   // init listeners
//   if (window.DeviceOrientationEvent) {
//     window.addEventListener('deviceorientation', handleOrientationEvent);
//   }
//   window.addEventListener('orientationchange', handleOrientationChange);
//
//   load();
//
// })();


// Michelle - press left / right cursor and space to fire

(function() {
var pane = $('.wrapper-inner'),
    cannon = $('.cannon'),
    hits = 0,
    aliens = $('.invader').length;
    w = pane.width() - 60,
    d = {},
    x = 3;
    y = 3;

// capture keyboard events
$(window).keydown(function(e) { d[e.which] = true; });
$(window).keyup(function(e) { d[e.which] = false; });

// press space to fire
setInterval(function() {
  function shoot(cannonShot) {
    cannonShot.css({
      visibility: 'visible',
      left: cannon.position().left + 30,
      top: cannon.position().top,
    });
  }

  if(d[32]) {
    var $shot = $('<div class="cannon-shot"></div>');
    $('.wrapper-inner').append($shot);
    shoot($shot);
  }
}, 350);

// game loop
setInterval(function() {
  // cannon movement
  function newv(v,a,b) {
    var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
     return n < 0 ? 0 : n > w ? w : n;
  }
  cannon.css( {
    left: function(i,v) { return newv(v, 37, 39); },
  });

  function overlap(rect1, rect2) {
    return !(rect1.right <= rect2.left - 10 ||
      rect1.left >= rect2.right + 10 ||
      rect1.bottom <= rect2.top - 10 ||
      rect1.top >= rect2.bottom + 10);
  }

  // can non shot movement
  var cannonShot = $('.cannon-shot');
  cannonShot.each(function(){
    var shot = $(this)[0];
    var rect = $(this)[0].getBoundingClientRect();
    if(rect.top < 0) { $(this).remove() }
    else { $(this).css({ top: rect.top - y }); }
    // detect hit
    $('.invader').each(function(){
      if($(this).css('visibility') !== 'hidden' &&
        overlap(rect, $(this)[0].getBoundingClientRect())) {
        $(this).css({ visibility: 'hidden' });
        shot.remove();
        hits = hits + 1;
      }
    })
  })

  // game over?
  if (hits >= aliens) {
    $('.replay').css({ visibility: 'visible'});

    function restart() {
      hits = 0;
      $('.replay').css({ visibility: 'hidden'});
      $('.invader').css({ visibility: 'visible'});
    }

    $('.replay').click(function(){ restart(); });
    if(d[13]) { restart(); }
  }

}, 20);


})();

// Your code here...
