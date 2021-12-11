import { useState } from "react";
import DevicesList from "./DevicesList";
import Recordings from "./Recordings";

const Players = function () {
    const [data, setData] = useState({ set: null, volume: null, device: null, mic: null, stream:null })   
    return <>
        <DevicesList callback={(type, value) =>
            setData({ set: type + 1, volume: value[2], device: value[1], mic: value[0], stream: value[3] })} />
        <Recordings set={data.set} volume={data.volume} device={data.device} mic={data.mic} stream={data.stream}  />
    </>
}

export default Players;