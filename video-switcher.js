function main(){

  // set up DOM access variables
  let wrap = document.querySelector( '#video-switcher-wrap' );
  let video = wrap.querySelector( 'video' );
  let videoControls = wrap.querySelector( '#video-controls' );
  let cameraControls = wrap.querySelector( '#camera-controls' );  
  let cameraControlCanvases = document.querySelectorAll( '#camera-controls canvas' );
  
  // set up canvas context and canvas dimension variables for animation performance
  let cameraControlContexts = [];
  let cameraControlCoordinates = [];
  let canvas_width = 0;
  let canvas_height = 0;

  // listen for video metadata load event to get dimensions
  video.addEventListener( 'loadedmetadata', function(){
    //create canvas elements
    createCanvasElements();
    // update wrap dimensions
    wrap.style.width = `${ video.videoWidth / 2 }px`;
    wrap.style.height = `${ video.videoHeight / 2 }px`;
    // update video controls positioning
    videoControls.style.left = `${ video.videoWidth / 4 - videoControls.offsetWidth / 2 }px`;
    videoControls.style.top = `${ video.videoHeight / 4 - videoControls.offsetHeight / 2 }px`;
    // update camera controls positioning
    cameraControls.style.left = `${ video.videoWidth / 2 - cameraControls.offsetWidth - 20 }px`;
    cameraControls.style.height = `${ video.videoHeight / 2 }px`;
    // listen for video ready play and being updating canvas
    video.addEventListener( 'canplay', function(){
      updateCanvasElements(0);
    });
  });

  // create canvas elements
  createCanvasElements = function(){
    for(var i = 0; i < cameraControlCanvases.length; i++){
      let canvas = cameraControlCanvases[i];
      // set canvas dimensions
      canvas.width = video.videoWidth / 10;
      canvas.height = video.videoHeight / 10;
      canvas_width = canvas.width;
      canvas_height = canvas.height;
      // get and cache 2d context
      cameraControlContexts[i] = canvas.getContext( '2d' );
      // get coordinates  
      let x, y = 0;
      if( i == 0 || i == 2 ) x = 0;
      if( i == 0 || i == 1 ) y = 0;
      if( i == 1 || i == 3 ) x = -canvas.width;
      if( i == 2 || i == 3) y = -canvas.height;
      // cache coordinates
      cameraControlCoordinates[i] = {
        x: x,
        y: y,
      }
    }
  }

  updateCanvasElements = function(i){
    // draw image from video to canvas
    cameraControlContexts[i].drawImage(video, cameraControlCoordinates[i].x, cameraControlCoordinates[i].y, canvas_width * 2, canvas_height * 2);
    i++  
    // loop to beginning if over
    if(i > 3) i = 0
    // use requestAnimationFrame API for performance
    requestAnimationFrame(function(){updateCanvasElements(i)});
  }


  // listen for video events
  video.addEventListener( 'playing', function(){
    wrap.dataset.playing = true;
  });

  // listen for video events
  video.addEventListener( 'ended', function(){
    wrap.dataset.playing = false;
    video.currentTime = 0;
  });
  
  // listen for click event on camera controls
  cameraControls.addEventListener( 'click', function(e){
    video.switchCamera( parseInt( e.target.dataset.cameraIndex ) );
  });

  // listen for click event on video controls
  videoControls.addEventListener( 'click', function(e){
    // switch to camera 2 if current camera is not defined
    if(video.current_camera == undefined){
      video.switchCamera( 0 );
    }
    if(video.is_playing){
      video.pause();
      video.is_playing = false;
      videoControls.querySelector( '[data-video-action="play"]' ).innerText = '▶';
    } else {
      video.play();
      video.is_playing = true;
      videoControls.querySelector( '[data-video-action="play"]' ).innerText = '❙❙';
    }
  });

  // update camera styling to show selected area
  video.switchCamera = function( index ){
    video.current_camera = index;
    // zoom in to video
    video.style.zoom = 1;
    // update wrap status
    wrap.dataset.selectedCamera = index;
    // update styling
    if(index == 0 || index == 2)
      this.style.left = '0px';
    if(index == 0 || index == 1)
      this.style.top = '0px';
    if(index == 1 || index == 3)
      this.style.left = `-${ video.videoWidth / 2 }px`;
    if(index == 2 || index == 3)
      this.style.top = `-${ video.videoHeight / 2 }px`;
  }

}

document.addEventListener( 'DOMContentLoaded', main);

