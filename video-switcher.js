document.addEventListener('DOMContentLoaded', function(){
  // set up DOM access variables
  let wrap = document.querySelector('#video-switcher-wrap')
  let video = wrap.querySelector('video')
  let videoControls = wrap.querySelector('#video-controls')
  let cameraControls = wrap.querySelector('#camera-controls')  

  // listen for video metadata load event to get dimensions
  video.addEventListener('loadedmetadata', function(){
    wrap.style.width = `${video.videoWidth / 2}px`;
    wrap.style.height = `${video.videoHeight / 2}px`;
    videoControls.style.left = `${video.videoWidth / 4 - videoControls.offsetWidth / 2}px`;
    videoControls.style.top = `${video.videoHeight / 4 - videoControls.offsetHeight / 2}px`;
    cameraControls.style.left = `${video.videoWidth / 2 - cameraControls.offsetWidth - 20}px`;
    cameraControls.style.height = `${video.videoHeight / 2}px`;
  });

  // listen for video events
  video.addEventListener('playing', function(){
    wrap.dataset.playing = true;
  });

  // listen for click event on camera controls
  cameraControls.addEventListener('click', function(e){
    video.style.zoom = 1;
    video.switchCamera(e.target.dataset.cameraIndex);
  });

  // listen for click event on video controls
  videoControls.addEventListener('click', function(e){
    video.play();
  });

  // update camera styling to show selected area
  video.switchCamera = function(index){
    if(index == 0 || index == 2)
      this.style.left = '0px';
    if(index == 0 || index == 1)
      this.style.top = '0px';
    if(index == 1 || index == 3)
      this.style.left = `-${video.videoWidth / 2}px`;
    if(index == 2 || index == 3)
      this.style.top = `-${video.videoHeight / 2}px`;
  }


});
