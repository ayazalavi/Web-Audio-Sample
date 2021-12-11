import { getMime } from "./browserhelpers";

export const canRecordForSet = (data, set) => {
    return data[set] && data[set].stream !== undefined;
}

export const startRecording = (stream) => {
        //  const stream = await navigator.mediaDevices.getUserMedia({ audio: media.deviceId })
          //let volumedStream = getVolumedStream(stream, {}, getVolume(recordingSet === "Set 1" ? 1 : 2))
    var mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();       
    let audioChunks = [];
    mediaRecorder.addEventListener("stop", event => {
        (async () => {
            let fileinput = document.querySelector(".fileinput");
            fileinput.value = await saveFile(audioChunks);
         })();
    });
    mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
    });
    return mediaRecorder;
}
export const saveFile = async (audioChunks) => {
    const opts = {
        types: [{
            description: 'Audio File',
            accept: { ...getMime() },
        }],
    };
    const newHandle = await window.showSaveFilePicker(opts);
    const writableStream = await newHandle.createWritable();
    await writableStream.write(new Blob(audioChunks, { type: Object.keys(getMime())[0] }));
    await writableStream.close();
    return newHandle.name;
}