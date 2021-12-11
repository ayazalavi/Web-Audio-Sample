import Dropdown from "react-dropdown";
import pngegg from '../pngegg.png'
import { useEffect, useState } from "react";
import { canRecordForSet, startRecording } from "../func/recordinghelpers";

const Recordings = function (props) {
    //console.log("recording", props);
    const [isRecording, setIsRecording] = useState(false)
    const [currentSet, setCurrentSet] = useState(-1)
    const [data, setData] = useState({})
    const [mediaRecorder, setMediaRecorder] = useState();
    //const ref = useRef();

    useEffect(function () {
        //console.log("recording props", props);
        
        if (props.set) {
           // console.log("set updated", data)
            let sample = {};
            sample[`${props.set}`] = { ...props }
            setData(d=>({...d, ...sample}));   
        }       
    }, [props]);

    useEffect(function () {
        console.log("data", data);
        
    }, [data]);

    return (<div className="recordings">
        <div>
            <button className={`largeBlueButton${isRecording ? ' recording' : ''}`}
                onClick={() => {
                   // navigator.mediaDevices.getUserMedia({ audio: data[currentSet].device.deviceId }).then((stream) => {                        
                        const stream = data[currentSet].stream;
                        const mediar = startRecording(stream)
                        setMediaRecorder(mediar);
                        setIsRecording(true)
                    //});
                }}
                disabled={isRecording || !canRecordForSet(data, currentSet)}>Record{isRecording ? 'ing' : ''}</button>
            <button className="largeBlueButton" onClick={() => {
                if (mediaRecorder) mediaRecorder.stop();
                setIsRecording(false);
            }} disabled={!isRecording}>Stop</button>
        </div>
        <div>
            <label>Record which set?</label>
            <Dropdown className="dropdown2"
                options={[{ value: 1, label: "Set 1" }, { value: 2, label: "Set 2" }]}
                placeholder="Select a set"
                onChange={(item) => setCurrentSet(item.value)}/>
        </div>
        <div>
            <label>Recording saved to:</label>
            <div className="directorycont">
                <input type="text" className="fileinput" disabled />
                <button className="directory" onClick={()=>{}}><img src={pngegg} alt="" /></button>
            </div>
        </div>
    </div>);
    
}

export default Recordings;