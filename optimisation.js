(function(window) {
  'use strict';

  var app = {},
      proto = document.querySelector('.proto'),
      movers,
      bodySize = document.body.getBoundingClientRect(),
      ballSize = proto.getBoundingClientRect(),
      maxHeight = Math.floor(bodySize.height - ballSize.height),
      maxWidth = Math.floor(bodySize.width - ballSize.width),
      incrementor = 10,
      distance = 3,
      frame,
      minimum = 100,
      subtract = document.querySelector('.subtract'),
      add = document.querySelector('.add');

  app.optimize = false;
  app.count = minimum;
  app.enableApp = true;

  app.init = function () {
    if (movers) {
      bodySize = document.body.getBoundingClientRect();
      for (var i = 0; i < movers.length; i++) {
        document.body.removeChild(movers[i]);
      }
      document.body.appendChild(proto);
      ballSize = proto.getBoundingClientRect();
      document.body.removeChild(proto);
      maxHeight = Math.floor(bodySize.height - ballSize.height);
      maxWidth = Math.floor(bodySize.width - ballSize.width);
    }
    for (var i = 0; i < app.count; i++) {
      var m = proto.cloneNode();
      m.style.left = maxWidth * Math.random() + 'px';
      m.style.top = maxHeight * Math.random() + 'px';
      document.body.appendChild(m);
    }
    movers = document.querySelectorAll('.mover');
  };

  app.update = function (timestamp) {
    for (var i = 0; i < app.count; i++) {
      var m = movers[i];
      if (!app.optimize) {
        var top = m.classList.contains('down') ? m.offsetTop + distance : m.offsetTop - distance;
        var left = m.classList.contains('right') ? m.offsetLeft + distance : m.offsetLeft - distance;
        if (top < 0) top = 0;
        if (top > maxHeight) top = maxHeight;
        m.style.top = top + 'px';
        if (left < 0) left = 0;
        if (left > maxWidth) left = maxWidth;
        m.style.left = left + 'px';
        if (m.offsetTop === 0) {
          m.classList.remove('up');
          m.classList.add('down');
        }
        if (m.offsetTop === maxHeight) {
          m.classList.remove('down');
          m.classList.add('up');
        }
        if (m.offsetLeft === 0) {
          m.classList.remove('left');
          m.classList.add('right');
        }
        if (m.offsetLeft === maxWidth) {
          m.classList.remove('right');
          m.classList.add('left');
        }
      } else {
      //  fastdom.mutate(() => {
          var top = m.classList.contains('down') ? m.style.top + distance : m.getBoundingClientRect().top - distance;
          var left = m.classList.contains('right') ? m.style.left + distance : m.getBoundingClientRect().left - distance;
          if (top < 0) top = 0;
          if (top > maxHeight) top = maxHeight;
          m.style.top = top + 'px';
          if (left < 0) left = 0;
          if (left > maxWidth) left = maxWidth;
          m.style.left = left + 'px';
          if (m.style === 0) {
            m.classList.remove('up');
            m.classList.add('down');
          }
          if (m.style.top === maxHeight) {
            m.classList.remove('down');
            m.classList.add('up');
          }
          if (m.style === 0) {
            m.classList.remove('left');
            m.classList.add('right');
          }
          if (m.style === maxWidth) {
            m.classList.remove('right');
            m.classList.add('left');
          }
       // });
       // var maxTop = m.style.top + m.style.left;
        // var forceRedraw = function(element){
        //   var disp = element.style.display;
        //   element.style.display = 'none';
        //   var trick = element.offsetHeight;
        //   element.style.display = disp;
        // };
        // var elemsWithBoundingRects = [];

        // window.pbsGetBoundingClientRect = function( element ) {
        //   if ( ! element._boundingClientRect ) {
        //     element._boundingClientRect = element.getBoundingClientRect();
        //     elemsWithBoundingRects.push( element );
        //   }
        //   return element._boundingClientRect;
        // };

        // fastdom.measure( function() {

        //   // Use our cached client rect.
        //   var rect = window.pbsGetBoundingClientRect( elem );
        
        //   // Bunch together the writes from other threads.
        //   fastdom.mutate( function() {
        //     elem.style.top = ( rect.top + window.pbsScrollY() ) + 'px';
        //     elem.style.height = rect.height + 'px';
        //     elem.style.left = rect.left + 'px';
        //     elem.style.width = rect.width + 'px';
        //   }.bind( this ) );
        // }.bind( this ) );​
      
        // Optimised code here
      }
    }
    frame = window.requestAnimationFrame(app.update);
  }

  document.querySelector('.stop').addEventListener('click', function (e) {
    if (app.enableApp) {
      cancelAnimationFrame(frame);
      e.target.textContent = 'Start';
      app.enableApp = false;
    } else {
      frame = window.requestAnimationFrame(app.update);
      e.target.textContent = 'Stop';
      app.enableApp = true;
    }
  });

  document.querySelector('.optimize').addEventListener('click', function (e) {
    if (e.target.textContent === 'Optimize') {
      app.optimize = true;
      e.target.textContent = 'Un-Optimize';
    } else {
      app.optimize = false;
      e.target.textContent = 'Optimize';
    }
  });

  add.addEventListener('click', function (e) {
    cancelAnimationFrame(frame);
    app.count += incrementor;
    subtract.disabled = false;
    app.init();
    frame = requestAnimationFrame(app.update);
  });

  subtract.addEventListener('click', function () {
    cancelAnimationFrame(frame);
    app.count -= incrementor;
    app.init();
    frame = requestAnimationFrame(app.update);
    if (app.count === minimum) {
      subtract.disabled = true;
    }
  });

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  var onResize = debounce(function () {
    if (app.enableApp) {
        cancelAnimationFrame(frame);
        app.init();
        frame = requestAnimationFrame(app.update);
    }
  }, 500);

  window.addEventListener('resize', onResize);

  add.textContent = 'Add ' + incrementor;
  subtract.textContent = 'Subtract ' + incrementor;
  document.body.removeChild(proto);
  proto.classList.remove('.proto');
  app.init();
  window.app = app;
  frame = window.requestAnimationFrame(app.update);

})(window);
