import {useRecoilState} from "recoil";
import ChatMessage from "./ChatMessage";

const Chat = ({recoilMessagesAtom, recoilAmqpChannelAtom}) => {
    const [messages, setMessages] = useRecoilState(recoilMessagesAtom);
    const [amqpChannel] = useRecoilState(recoilAmqpChannelAtom);

    const handlePublish = (e) => {
        e.preventDefault();

        if(amqpChannel) {
            const message = e.target.value;
            amqpChannel.sendToQueue("chat", Buffer.from(message));
            setMessages([...messages, message]);
        }
    };

    return (
        <div>
            <h1>Chat</h1>
            {messages.map((message, index) => <ChatMessage key={index} message={message} /> )}
            <form onSubmit={handlePublish}>
                <input type="submit" placeholder="Napiš zprávu..." required />
            </form>
        </div>
    )
}

export default Chat;