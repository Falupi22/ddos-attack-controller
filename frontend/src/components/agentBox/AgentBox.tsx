import { useEffect, useState } from "react";
import "./AgentBox.scss"

export interface Agent {
    ip: string;
    url: string;
    uuid: string;
    message: string;
    timestamp: string;
}

interface AgentBoxProps extends Agent {
    deleteCallback: (ip: string) => void;
}

const AgentBox = ({ ip, deleteCallback, url, message, uuid, timestamp }: AgentBoxProps) => {
    const [color, setColor] = useState<string>('gray'); // Default to gray

    useEffect(() => {
        let newColor = color;
        if (message.includes('Ping request could not find host')) {
            newColor = 'gray';
        } else if (message === 'Request timed out') {
            newColor = 'maroon';
        } else if (message.includes('Pending')) {
            newColor = 'orange';
        } else if (message === 'Destination host unreachable') {
            newColor = 'red';
        } else if (message.includes('Ping successful')) {
            newColor = 'green';
        }

        // Only update color if it's different
        if (newColor !== color) {
            setColor(newColor);
        }
    }, [message, color]); // Re-run effect when message changes

    return (
        <div className="agent-box"
            style={{
                backgroundColor: color,
            }}
        >
            <div className="column-button-panel">
                <p className="left-label" style={{ textWrap: 'pretty', width: "70%", fontSize: '10px' }}>
                    Last updated: {timestamp}
                </p>
                <button
                    onClick={() => deleteCallback(uuid)}
                    className="delete-btn">X</button>
            </div>
            <div>
                <h2>{ip}</h2>
                <h4>{url}</h4>
                <h6>{uuid}</h6>
                <p style={{ fontSize: '14px', textWrap: 'wrap' }}>{message}</p>
            </div>
        </div>
    );
};


export default AgentBox;
