function main(){

  // set up DOM access variables
  let wrap = document.querySelector( '#video-switcher-wrap' );
  let video = wrap.querySelector( 'video' );
  let videoControls = wrap.querySelector( '#video-controls' );
  let cameraControls = wrap.querySelector( '#camera-controls' );  
  let cameraControlCanvases = document.querySelectorAll( '#camera-controls canvas' );

  // listen for video metadata load event to get dimensions
  video.addEventListener( 'loadedmetadata', function(){
    //create canvas elements
    updateCanvasElements();
    // update wrap dimensions
    wrap.style.width = `${ video.videoWidth / 2 }px`;
    wrap.style.height = `${ video.videoHeight / 2 }px`;
    // update video controls positioning
    videoControls.style.left = `${ video.videoWidth / 4 - videoControls.offsetWidth / 2 }px`;
    videoControls.style.top = `${ video.videoHeight / 4 - videoControls.offsetHeight / 2 }px`;
    // update camera controls positioning
    cameraControls.style.left = `${ video.videoWidth / 2 - cameraControls.offsetWidth - 20 }px`;
    cameraControls.style.height = `${ video.videoHeight / 2 }px`;
  });

  // update canvas elements
  updateCanvasElements = function(){
    for(var i = 0; i < cameraControlCanvases.length; i++){
      let canvas = cameraControlCanvases[i];
      canvas.width = video.videoWidth / 10;
      canvas.height = video.videoHeight / 10;
      let context = canvas.getContext( '2d' );
      // get coordinates  
      let x, y = 0;
      if( i == 0 || i == 2 ) x = 0;
      if( i == 0 || i == 1 ) y = 0;
      if( i == 1 || i == 3 ) x = -canvas.width;
      if( i == 2 || i == 3) y = -canvas.height;
      // draw image from video to canvas
      context.drawImage(video, x, y, canvas.width * 2, canvas.height * 2);
    }
  }

  // listen for video ready play
  video.addEventListener( 'canplay', function(){
    updateCanvasElements();
  });

  // listen for video events
  video.addEventListener( 'playing', function(){
    wrap.dataset.playing = true;
    video.update_cameras_interval = window.setInterval(updateCanvasElements, 10);
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

