import './App.css';
import {atom, useRecoilState} from "recoil";
import Chat from "./component/Chat";
import {useEffect} from "react";
import amqp from "amqplib/callback_api";

const handleAmqpCallback = (callback) => {
  return (err, anyObj) => {
    if(err)
      throw err;

    callback(anyObj);
  };
}

const QUEUE_NAME = "chat";

function App() {
  const recoilMessagesAtom = atom({key: "messages", default: []});
  const amqpChannelAtom = atom({key: "amqpChannel", default: null});

  const [messages, setMessages] = useRecoilState(recoilMessagesAtom);
  const [, setAmqpChannel] = useRecoilState(amqpChannelAtom);

  useEffect(() => {
    amqp.connect("amqp://localhost", handleAmqpCallback((conn) => {
      conn.createChannel(handleAmqpCallback((channel) => {
        channel.assertQueue(QUEUE_NAME, {durable: false});
        setAmqpChannel(channel);

        channel.consume(QUEUE_NAME, (msg) => {
          setMessages([...messages, msg.content.toString()]);
        }, {
            noAck: true
        })
      }));
    }));
  }, []);
  return <Chat recoilMessagesAtom={recoilMessagesAtom} />;
}

export default App;
