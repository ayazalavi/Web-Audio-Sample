import { useEffect, useState } from "react";
import { getDevices } from "../func/browserhelpers";
import { getVolumedStream } from "../func/streaminghelper";
import DeviceDisplay from "./DeviceDisplay";

const DevicesList = ({ callback: setCanRecord }) => {

    const [inputDevices, setInputDevices] = useState([]);
    const [outputDevices, setOutputDevices] = useState([]);
    const [audioStream, setAudioStream] = useState({set1: null, set2:null});

    // const deleteandaddAudioTag = (num) => {        
    //     const audioTag = document.getElementById("gum" + (num+1))        
    //     audioTag && audioTag.remove();
    //     const devices = document.getElementsByClassName("devices")[0];
    //     var child = document.createElement('audio');
    //     child.className = "gum-set"+(num + 1)+" gum";
    //     child.setAttribute("id", "gum" + (num + 1))
    //     child.setAttribute("title", "set "+(num+1)+" audio stream")
    //     devices.appendChild(child);
    // }
    const callback = function (type, index, value) {
        console.log(type, index, value)
        if (type === "recordingfor") {
            //let audio = document.querySelector(index === 0 ? ".gum-set1" : ".gum-set2");    
            console.log("audiostream", audioStream)
            setCanRecord(index, value.concat([index === 0 ? audioStream.set1 : audioStream.set2]))
        }
        else if (type === "inputchanged") {            
           // deleteandaddAudioTag(index)
            const device = inputDevices[value[0]];
            navigator.mediaDevices.getUserMedia({ audio: {deviceId: device.deviceId}}).then((stream) => {
                let audio = document.querySelector(index === 0 ? ".gum-set1" : ".gum-set2");               
                const vstream = getVolumedStream(stream, value[1], value[2]);
                const astream = index === 0 ? { set1: vstream } : { set2: vstream }
                setAudioStream({ ...audioStream, ...astream  })
                value[3].push(vstream);                                
                audio.srcObject = vstream;
                audio.pause();
                audio.load();
                setCanRecord(index, value[3])
               // let audio2 = document.querySelector(index === 0 ? ".gum-set2" : ".gum-set1")

            })
        }
        else if (type === "outputchanged") {
            let audio = document.querySelector(index === 0 ? ".gum-set2" : ".gum-set1")
            audio.setSinkId(value[0].deviceId).then(() => {
                //console.log(`Success, audio output device attached: ${value[0].deviceId} to element with ${audio.title} as source.`);
                audio.volume = value[1];
                audio.play();
            })
                .catch(error => {
                   // let errorMessage = error;
                    if (error.name === 'SecurityError') {
                       // errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
                    }
                   // console.error(errorMessage);
                });
        }
        else if (type === "micenabled") {
            //let audio = document.querySelector(index === 0 ? ".gum-set1" : ".gum-set2");
         //   console.log("mic", value)
           // audio.srcObject = getVolumedStream(audio.srcObject, value[0] ? value[1] : 0);
        }
        else if (type === "micgain") {
           // let audio = document.querySelector(index === 0 ? ".gum-set1" : ".gum-set2");
           // console.log("mic", value)
            //if(audio.srcObject)
             //   audio.srcObject = getVolumedStream(audio.srcObject, value);
        }
        else if (type === "speakerenabled") {
            let audio = document.querySelector(index === 0 ? ".gum-set2" : ".gum-set1");
          //  console.log("speaker", value)
            audio.volume = value[0] ? value[1] : 0;
        }
        else if (type === "speakergain") {
            let audio = document.querySelector(index === 0 ? ".gum-set2" : ".gum-set1");
           // console.log("speaker", value)
            audio.volume = value
        }
    };
    useEffect(function () {
        getDevices().then(devices => {
          const inputs = devices.filter(device => device.kind === "audioinput");
            const outputs = devices.filter(device => device.kind === "audiooutput");
            setTimeout(function () {
                setInputDevices(inputs);        
                setOutputDevices(outputs);         
            }, 2000);          
        });
        const audioarr = document.getElementsByClassName("gum")
        var i;
        for (i = 0; i < audioarr.length; i++) {
            const audio = audioarr[i];
            audio.addEventListener('playing', (event) => {
                //console.log('audio is no longer paused');
            });
            audio.addEventListener('loadeddata', (event) => {
                //console.log('Yay! ' + audio.sinkId);                
                if(audio.sinkId !== '')
                    audio.play()
            });
        }         
      }, []);
    return (
        <div className="devices">
            <DeviceDisplay index={0}
                inputDevices={inputDevices} outputDevices={outputDevices}
                callback={callback}  />
            <DeviceDisplay index={1} inputDevices={inputDevices} outputDevices={outputDevices} callback={callback} />
            
            <audio id="gum2" className="gum-set2 gum" title="set 2 audio stream" controls></audio>
            <audio id="gum1" className="gum-set1 gum" title="set 1 audio stream" controls></audio>
        </div>
    );
}

export default DevicesList;

