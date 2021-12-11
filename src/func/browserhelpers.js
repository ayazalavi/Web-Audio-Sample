export const getMime = () => {
    return [{ 'audio/wav': ".wav"}, {'audio/mpeg':'.mpeg'}, {'audio/webm':".webm"}, {'audio/ogg':".ogg"}]
  .filter((key)=> MediaRecorder.isTypeSupported(Object.keys(key)[0]))[0];
}

export async function getDevices() {
    await navigator.mediaDevices.getUserMedia({audio: true});   
    let devices = await navigator.mediaDevices.enumerateDevices();   
    return devices;
}
  