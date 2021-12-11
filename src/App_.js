import logo from './logo.svg';
import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactSlider from 'react-slider';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react';
import pngegg from './pngegg.png'

function connect({updateStatus}) {
  console.log('Requesting any Bluetooth device...');
  
}

function getSupportedProperties(characteristic) {
  let supportedProperties = [];
  for (const p in characteristic.properties) {
    if (characteristic.properties[p] === true) {
      supportedProperties.push(p.toUpperCase());
    }
  }
  return '[' + supportedProperties.join(', ') + ']';
}

function DeviceDisplay({ index, inputCallback, outputCallback, micEnabled, speakerEnabled, micGainChanged}) {

  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState(undefined)

  const [input, setInput] = useState(undefined)
  const [currentInput, setCurrentInput] = useState(-1)

  const [output, setOutput] = useState(undefined)
  const [currentOutput, setCurrentOutput] = useState(-1)

  const checkbox1 = useCheckboxState({state: true});

  const checkbox2 = useCheckboxState({state: true});

  const connect = () => {

  }
  useEffect(function () {
    console.log("loading", loading)
    
  }, [loading]);

  useEffect(function () {
    console.log("currrent",currentInput)
  }, [currentInput]);

  useEffect(function () {
    console.log("output", currentOutput)

  }, [currentOutput]);

  useEffect(function () {
    getDevices().then(devices => {
      const inputs = devices.filter(device => device.kind === "audioinput");
      const outputs = devices.filter(device => device.kind === "audiooutput");
      setInput(inputs);
     // setCurrentInput(inputs[0])
      setOutput(outputs);
     // setCurrentOutput(outputs[0]);
      setLoading(false)
    })
  }, [])
  if (input && output) {
    return (
      <div className="bluetoothDevice">
        <h1>Set {index + 1}</h1>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          defaultValue={50}
          onChange={(value)=>micGainChanged(value/100.0)}
          renderThumb={(props, state) => <label {...props}>{state.valueNow}%</label>}
        />
        <div className="device">
          <Checkbox {...checkbox1}
            onChange={(e) => {
              checkbox1.setState(!checkbox1.state)
              micEnabled(!checkbox1.state)
            }}
            checked={checkbox1.state}>Mic {index+1}</Checkbox>
          <Dropdown className='dropdown'
            options={input.map((device, index) => ({ value: index, label: device.label }))}
            onChange={(value) => {
              inputCallback(input[value.value]);
              setCurrentInput(input[value.value]);
            }}
            placeholder="Select an input" />
        </div>
        <div className="device">  
          <Checkbox {...checkbox2}
            onChange={() => {
              checkbox2.setState(!checkbox2.state)
              //outputCallback(!checkbox2.state ? currentOutput : -1)
              speakerEnabled(!checkbox2.state)
            }} state={checkbox2.state}>Speaker {index+1}</Checkbox>
          <Dropdown className='dropdown'
            options={output.map((device, index) => ({ value: index, label: device.label }))}
            onChange={(value) => {
              outputCallback(output[value.value])
              setCurrentOutput(output[value.value])
            }}
            placeholder="Select an output" />
        </div>
        <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
          trackClassName="example-track"
          defaultValue={50}
          renderThumb={(props, state) => <label {...props}>{state.valueNow}%</label>}
        />
      </div>
    )
  }
  else {
    return (
      <p>Loading...</p>
    )
  }
  //else {
    
    // else {
    //   return (       
    //       <div className="connect"><button className="largeBlueButton" onClick={connect}>Connect</button></div>
    //   )
    // }
 // }
}

async function getDevices() {
  await navigator.mediaDevices.getUserMedia({audio: true});   
  let devices = await navigator.mediaDevices.enumerateDevices();   
  return devices;
}

let audioChunks = [];
let mediaRecorder;
var set1 = {
  ctx: null, source: null, dest: null, gainNode: null,
  inputstream: null, outputstream: null, inputvolumeStream: null, outputvolumeStream: null
}
var set2 = {
  ctx: null, source: null, dest: null, gainNode: null,
  inputstream: null, outputstream: null, inputvolumeStream: null, outputvolumeStream: null
}

function App() {
  const [setIds, setSetIds] = useState({ 0: -1, 1: -1, 2: -1, 3: -1, 4: true, 5: true , 6: true, 7: true})
  const [isRecording, setIsRecording] = useState(false)
  const [canRecord, setCanRecord] = useState(false)
  const [recordingSet, setRecordingSet] = useState("Set 1")
  const [volumes, setVolumes] = useState({set1: 0.5, set2: 0.5, set3: 0.5, set4: 0.5})

  const ref = useRef();
  
  useEffect(function () {
    console.log(setIds, recordingSet, setIds['2'])
    setCanRecord((recordingSet === "Set 1" && setIds['0'] !== -1) || (recordingSet === "Set 2" && setIds['2'] !== -1))    
  }, [setIds, recordingSet]);


  useEffect(function () {
    console.log("setIds")
  }, [setIds]);

  const getMime = () => {
    return [{ 'audio/wav': ".wav"}, {'audio/mpeg':'.mpeg'}, {'audio/webm':".webm"}, {'audio/ogg':".ogg"}]
  .filter((key)=> MediaRecorder.isTypeSupported(Object.keys(key)[0]))[0];
  }
  const saveFile = () => {
    (async () => {
      const opts = {
        types: [{
          description: 'Audio File',
          accept: {...getMime()},
        }],
      };
        const newHandle = await window.showSaveFilePicker(opts);
        ref.current.value = newHandle.name;
        const writableStream = await newHandle.createWritable();        
        await writableStream.write(new Blob(audioChunks,  { type: Object.keys(getMime())[0] }));        
        await writableStream.close();    
    })();
  }

  const getVolume = useCallback((numb) => {
    return numb === 1 ? (setIds["4"] ? volumes.set1 : 0) : (setIds["6"] ? volumes.set2 : 0);
  }, [volumes, setIds])

  useEffect(function () {
    if (set1.gainNode) {
      console.log("volume updated")
      set1.gainNode.gain.value = getVolume(1)
    }
    if (set2.gainNode) {
      console.log("volume updated")
      set2.gainNode.gain.value = getVolume(2)
    }
  }, [volumes, isRecording, getVolume]);

  useEffect(function () {
    console.log("volumes",volumes)
  }, [volumes])


  const startStreaming = (set, media) => {
    console.log("input changed");
    (async () => {
      if (set === 1) {
        if(media.deviceId !== setIds["0"])
          setSetIds({ ...setIds, 0: media })
        if (setIds["4"]) {
          console.log(media);
          set1.inputstream = await navigator.mediaDevices.getUserMedia({ audio: media.deviceId });
          set1.inputvolumeStream = getVolumedStream(set1.inputstream, set1, getVolume(1))
          if (setIds["7"] && setIds["3"] !== -1) {            
            const tracks = set1.inputstream.getAudioTracks();
            console.log("can add track", tracks)
            //set2.outputstream = await navigator.mediaDevices.getUserMedia({ audio: setIds["3"].deviceId });
            //set2.outputvolumeStream = getVolumedStream(set2.outputstream, set2, getVolume(2));
           // set2.outputvolumeStream.addTrack(tracks[0]);
          }
        }
      }
      else {
        if(media.deviceId !== setIds["2"])
          setSetIds({ ...setIds, 2: media })
        if (setIds["6"]) {
          console.log(media);
          set2.inputstream = await navigator.mediaDevices.getUserMedia({ audio: media.deviceId });
          set2.inputvolumeStream = getVolumedStream(set2.inputstream, set2, getVolume(2))
          if (setIds["5"] && setIds["1"] !== -1) {
            console.log("can add track set 2")
          }
          else {
            console.log("no streaming")
          }
        }
      }
    })();
  }

  const stopInputStreaming = (device) => {
    
  }
  
  const getVolumedStream = (stream, set, volume) => {
    set.ctx = new AudioContext();
    set.source = set.ctx.createMediaStreamSource(stream);
    set.dest = set.ctx.createMediaStreamDestination();
    set.gainNode = set.ctx.createGain();
    set.source.connect(set.gainNode);
    set.gainNode.connect(set.dest);
    console.log(getVolume())
    set.gainNode.gain.value = volume;
    return set.dest.stream;
  }
  
  const startRecording = (e) => {
    const stream = recordingSet === "Set 1" ? set1.inputvolumeStream : set2.inputvolumeStream;
    if (stream) {
      console.log("start recording", recordingSet, stream);
      setIsRecording(true);
        (async () => {
        //  const stream = await navigator.mediaDevices.getUserMedia({ audio: media.deviceId })
          //let volumedStream = getVolumedStream(stream, {}, getVolume(recordingSet === "Set 1" ? 1 : 2))
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start();       
          audioChunks = [];
          mediaRecorder.addEventListener("onstart", event => {
            
          });
          mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
          });       
        })();
    }
  }
  const stopRecording = () => {
    if(!mediaRecorder) throw new Error("no recorder")
    mediaRecorder.addEventListener("stop", () => {
      setIsRecording(false);
      saveFile();
      // const audioBlob = new Blob(audioChunks);
      // const audioUrl = URL.createObjectURL(audioBlob);
      // const audio = new Audio(audioUrl);
      // audio.play();
    });
    //setTimeout(() => {
    mediaRecorder.stop();
    //}, 100);   
  }
  return (
    <div className="container">
      <label>Audio POC setup</label>
        <div className="devices">
        <DeviceDisplay index={0}
           micGainChanged={(set1) => setVolumes({...volumes, set1})}
           micEnabled={(id) => setIds["4"]!== id ? setSetIds({ ...setIds, 4: id }): ''}
           speakerEnabled={(id) => setIds["5"]!== id ? setSetIds({ ...setIds, 5: id }): ""} 
           inputCallback={(id) =>startStreaming(1, id)}
          outputCallback={(id) => setSetIds({ ...setIds, 1: id })}
        />
        <DeviceDisplay index={1}
          micGainChanged={(set2) => setVolumes({...volumes, set2})}
          micEnabled={(id) =>  setIds["6"]!== id ? setSetIds({ ...setIds, 6: id }):""}
          speakerEnabled={(id) => setIds["7"]!== id ? setSetIds({ ...setIds, 7: id }):""} 
          inputCallback={(id) => startStreaming(2, id)}
          outputCallback={(id) => setSetIds({ ...setIds, 3: id })}
        />
      </div>
      <div className="recordings">
      <div>
          <button className={`largeBlueButton${isRecording ? ' recording' : ''}`} onClick={startRecording} disabled={!canRecord || isRecording}>Record{isRecording?'ing':''}</button>
        <button className="largeBlueButton" onClick={stopRecording} disabled={!isRecording}>Stop</button>
      </div>
        <div>
          <label>Record which set?</label>
          <Dropdown className="dropdown2"
            options={["Set 1", "Set 2"]}
            onChange={(item)=>setRecordingSet(item.value)}
            value={"Set 1"}
            placeholder="Select recording set" />
        </div>
        <div>
          <label>Recording saved to:</label>
          <div className="directorycont">
          <input type="text" className="fileinput" ref={ref} disabled />
            <button className="directory" onClick={saveFile}><img src={pngegg} /></button>
            </div>
        </div>
      </div>
    </div>    
  );
}

export default App;
