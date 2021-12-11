export const getVolumedStream = (stream, volume, slider) => {
    var ctx = new AudioContext();
    var source = ctx.createMediaStreamSource(stream);
    var dest = ctx.createMediaStreamDestination();
    var gainNode = ctx.createGain();
    source.connect(gainNode);
    gainNode.connect(dest);
    slider.current.slider.addEventListener('onGainChanged', function (e) {
      gainNode.gain.value = e.detail
    }, false);    
    gainNode.gain.value = volume;
    return dest.stream;
  }