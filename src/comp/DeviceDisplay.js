import ReactSlider from 'react-slider';
import Dropdown from 'react-dropdown';
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react';
import 'react-dropdown/style.css';
import { useRef, useState } from 'react';

//export default function DeviceDisplay({ index, inputCallback, outputCallback, micEnabled, speakerEnabled, micGainChanged }) {
export default function DeviceDisplay({ index, inputDevices, outputDevices, callback}) {
console.log(index)
  const checkbox1 = useCheckboxState({ state: true });
  const checkbox2 = useCheckboxState({ state: true });
  const [currentInput, setCurrentInput] = useState()
  const [micVolume, setCurrentMicVolume] = useState(0.5)
  const [speakerVolume, setCurrentSpeakerVolume] = useState(0.5)
  
  // useEffect(function () {
  //   console.log("input changed")
  //   if (currentInput) {
      
  //   }
  // }, [currentInput, checkbox1, micVolume])
  const micgain = useRef();
  if (inputDevices.length && outputDevices.length) {
    return (
      <div className="bluetoothDevice">
        <h1>Set {index + 1}</h1>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          defaultValue={50}
          ref={micgain}
          onChange={(value) => {
            callback("micgain", index, value / 100.0)
            setCurrentMicVolume(value / 100.0)
            callback("recordingfor", index, [checkbox1.state, currentInput, value / 100.0])
            const event = new CustomEvent('onGainChanged', { detail: value / 100.0 });
            micgain.current.slider.dispatchEvent(event);
          }}
          renderThumb={(props, state) => <label {...props}>{state.valueNow}%</label>} />
        <div className="device">
          <Checkbox {...checkbox1}
            onChange={(e) => {
              checkbox1.setState(!checkbox1.state);
              callback("micenabled", index, [!checkbox1.state, micVolume]);
              callback("recordingfor", index, [!checkbox1.state, currentInput, micVolume])
              const event = new CustomEvent('onGainChanged', { detail: !checkbox1.state ? micVolume : 0 });
              micgain.current.slider.dispatchEvent(event);
            }}
            checked={checkbox1.state}>Mic {index + 1}</Checkbox>
          <Dropdown className='dropdown'
            options={inputDevices.map((device, ind_) => ({ value: ind_, label: device.label }))}
            onChange={(value) => {
              callback("inputchanged", index, [value.value, micVolume, micgain,
              [checkbox1.state, inputDevices[value.value], micVolume]]);
              callback("recordingfor", index, [checkbox1.state, inputDevices[value.value], micVolume])
              setCurrentInput(inputDevices[value.value])
            }}
            placeholder="Select an input" />
        </div>
        <div className="device">
          <Checkbox {...checkbox2}
            onChange={() => {
              checkbox2.setState(!checkbox2.state);
              callback("speakerenabled", index, [!checkbox2.state, speakerVolume]);
            }} state={checkbox2.state}>Speaker {index + 1}</Checkbox>
          <Dropdown className='dropdown'
            options={outputDevices.map((device, ind_) => ({ value: ind_, label: device.label }))}
            onChange={(value) => {
              callback("outputchanged", index, [outputDevices[value.value], speakerVolume]);
              //setCurrentOutput(outputDevices[value.value])
            }}
            placeholder="Select an output" />
        </div>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          defaultValue={50}
          onChange={(value) => {
            callback("speakergain", index, value / 100.0)
            setCurrentSpeakerVolume(value / 100.0)
          }}
          renderThumb={(props, state) => <label {...props}>{state.valueNow}%</label>} />
      </div>
    );
  }
  else {
    return (
      <p>Loading...</p>
    );
  }
  //else {
  // else {
  //   return (       
  //       <div className="connect"><button className="largeBlueButton" onClick={connect}>Connect</button></div>
  //   )
  // }
  // }
}
