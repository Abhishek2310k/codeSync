// import { useParams } from "react-router";
import { useRef, useEffect, useState } from "react";
import { parseSocketInput } from "../../util/util";

const ChatRoom = () => {
  

  // as of now only user that is making a connection is user x but in the future there will be more members 
  const [loading, setLoading] = useState<boolean>(true);
  const [currRoom, setCurrRoom] = useState<string>("");
  const [subscriptions, setSubscriptions] = useState<string[]>([]);

  // const [member, setMember] = useState<boolean>(false);

  // const ws = new WebSocket("ws://localhost:3000","userx");
  const ws = useRef<WebSocket | null>(null);
  function onConnection () {
    setLoading(false);
  }

  function onDissconnect () {
    setLoading(true);
  }

  useEffect(()=>{
    ws.current = new WebSocket("ws://localhost:3000","user1");
    ws.current.onopen = onConnection;
    ws.current.onclose = onDissconnect;

    ws.current.onmessage = (event:MessageEvent) => {
      console.log("some message");
      const objData = parseSocketInput(event.data);
      
      if (objData.type === "pendingMessages") {
        console.log(objData.data);
        setSubscriptions(objData.data.subscriptions);
      }

    };
  },[]);

  useEffect(()=> {
    if (loading == true) {
      // at this point our connection should have been made so lets make a request to get all of the messages 
    }
  },[loading])

  return (
    <div className="chat">
      {
        loading === true ? 
        <h1>Loading</h1>
        :
        <div className="mainContent"> 
        {
          subscriptions === undefined ? 
          <h1>Wait</h1> 
          : 
          subscriptions.map((roomId,index)=><p key={index}>{roomId}</p>)
        }
        </div>
      }
    </div>
  );
}

export default ChatRoom;
