(function() {

var global = {
  el: '',
  ul: '',
  imageNumber: '',
  imageWidth: '',
  currentPosition: 0,
  currentImage: 0,
  currentIndex: 0,
  ulLeft: 0,
  initialize: function() {
    this.el = document.getElementById('slider'); 
    this.ul = document.getElementById('slider-wrapper');
    this.li_items = this.ul.children;
    this.imageNumber = this.li_items.length;
    this.imageWidth = this.li_items[0].children[0].clientWidth;
    this.currentPosition = 0;
    this.currentImage = 0;
    this.currentIndex = 0;
    this.ulLeft = 0;

    this.ul.style.width = this.imageWidth * this.imageNumber + 'px';
  }
}

var swipe = {
  initialize: function() {
    ontouch(global.el, function(evt, dir, phase, swipeType, distance) {
      if (phase == 'start') { 
        global.ulLeft = parseInt(global.ul.style.left) || 0; 
      }
      else if (phase == 'move' && (dir =='left' || dir == 'right')) { 
        var totaldist = distance + global.ulLeft; 
        global.ul.style.left = Math.min(totaldist, (global.currentIndex+1) * global.imageWidth) + 'px'; 
      }
      else if (phase == 'end') { 
        if (swipeType == 'left') {
          toggleIndicator(1);
        } 
        else if (swipeType == 'right') {
          toggleIndicator(-1);
        }
        global.ul.style.left = parseInt(-global.currentIndex * global.imageWidth) + 'px';
      }
    }) 
  }
}

var click = {
  initialize: function() {
    var prev = document.getElementById('previous');
    var next = document.getElementById('next');

    next.onclick = moveSlide.bind(this, 1, onClickNext);
    prev.onclick = moveSlide.bind(this, -1, onClickPrev);
  }
}

function toggleIndicator(delta) {
  var currentIndicator = document.getElementsByClassName('indicator-active')[0];
  global.currentIndex = parseInt(currentIndicator.dataset.id);
  var nextIndex = (global.currentIndex+delta+global.imageNumber) % global.imageNumber;
  currentIndicator = document.querySelectorAll("label[data-id='"+global.currentIndex+"']")[0];
  var nextIndicator = document.querySelectorAll("label[data-id='"+nextIndex+"']")[0];

  nextIndicator.classList.toggle('indicator-active');
  currentIndicator.classList.toggle('indicator-active');
  global.currentIndex = nextIndex;
}

function moveSlide(delta, sliderCallback) { 
  toggleIndicator(delta);
  sliderCallback();
};

function animate(opts) {
  var start = new Date;
  var id = setInterval(function() {
    var timePassed = new Date - start;
    var progress = timePassed / opts.duration;
    if (progress > 1) {
      progress = 1;
    }
    var delta = opts.delta(progress);
    opts.step(delta);
    if (progress == 1) {
      clearInterval(id);
      opts.callback();
    }
  }, opts.delay || 17);
}

function slideTo(imageToGo) {
  var direction;
  var numOfImageToGo = Math.abs(imageToGo - global.currentImage);

  direction = global.currentImage > imageToGo ? 1 : -1;
  global.currentPosition = -1 * global.currentImage * global.imageWidth;
  var opts = {
    duration: 300,
    delta: function(p) {
      return p;
    },
    step: function(delta) {
      global.ul.style.left = parseInt(global.currentPosition + direction * delta * global.imageWidth * numOfImageToGo) + 'px';
    },
    callback: function() { 
      global.currentImage = imageToGo;
    }  
  };
  animate(opts);
}

function onClickPrev() {
  if (global.currentImage == 0) {
    slideTo(global.imageNumber - 1);
  }     
  else {
    slideTo(global.currentImage - 1);
  }   
}

function onClickNext() {
  if (global.currentImage == global.imageNumber - 1) {
    slideTo(0);
  }   
  else {
    slideTo(global.currentImage + 1);
  } 
}

// Helper for touch events. 
function ontouch(el, callback) {
  var touchsurface = el;
  var dir;
  var swipeType;
  var startX;
  var startY;
  var distX;
  var distY;
  var threshold = 150; 
  var restraint = 100; 
  var allowedTime = 500; 
  var elapsedTime;
  var startTime;
  var handletouch = callback || function(evt, dir, phase, swipetype, distance){};

  touchsurface.addEventListener('touchstart', function(e) {
    var touchobj = e.changedTouches[0];
    dir = 'none';
    swipeType = 'none';
    dist = 0;
    startX = touchobj.pageX;
    startY = touchobj.pageY;
    startTime = new Date().getTime();
    handletouch(e, 'none', 'start', swipeType, 0); 
    e.preventDefault();

  }, false)

  touchsurface.addEventListener('touchmove', function(e) {
    var touchobj = e.changedTouches[0];
    distX = touchobj.pageX - startX;
    distY = touchobj.pageY - startY;
    if (Math.abs(distX) > Math.abs(distY)) { // horizontal
      dir = (distX < 0) ? 'left' : 'right';
      handletouch(e, dir, 'move', swipeType, distX) ;
    }
    e.preventDefault(); 
  }, false)

  touchsurface.addEventListener('touchend', function(e) {
    var touchobj = e.changedTouches[0];
    elapsedTime = new Date().getTime() - startTime;
    if (elapsedTime <= allowedTime) { 
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { 
        swipeType = dir; 
      }
    }
    handletouch(e, dir, 'end', swipeType, distX);
    e.preventDefault();
  }, false)
}

window.addEventListener('orientationchange', function(e) {
  e.preventDefault;
  if (orientation == 0) {
    global.initialize();
  }
  else if (orientation == 90) {
    global.initialize();
  }
  else if (orientation == -90) {
    global.initialize();
  }
  else if (orientation == 180) {
    global.initialize();
  } else {
    global.initialize();
  }
});

global.initialize();
swipe.initialize();
click.initialize();

})();