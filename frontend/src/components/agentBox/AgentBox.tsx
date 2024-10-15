import { useEffect, useState } from 'react';
import "./AgentBox.scss"

interface AgentBoxProps {
    ip: string;
    deleteCallback: (ip: string) => void;
}


// Function to simulate ping response
const simulatePing = (ip: string) => {
    const responses = ['Request timed out', 'Destination host unreachable', 'Ping successful'];
    // Simulate random ping results
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
};

const AgentBox = ({ ip, deleteCallback }: AgentBoxProps) => {
    const [status, setStatus] = useState(''); // Status of the IP ping
    const [color, setColor] = useState('gray'); // Box color

    // Use effect to simulate listening for ping updates
    useEffect(() => {
        // Function to update the ping status and box color based on the result
        const updatePingStatus = () => {
            const pingResult = simulatePing(ip);
            setStatus(pingResult);

            // Update color based on ping result
            if (pingResult === 'Request timed out') {
                setColor('gray');
            } else if (pingResult === 'Destination host unreachable') {
                setColor('red');
            } else {
                setColor('green');
            }
        };

        updatePingStatus(); // Simulate initial ping

        // Set up a timer to update the ping status every 5 seconds
        const interval = setInterval(() => {
            updatePingStatus();
        }, 5000); // Adjust the interval as needed

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, [ip]);

    return (
        <div className="agent-box"
            style={{
                backgroundColor: color,
            }}
        >
            <div className="column-button-panel">
                <p className="left-label">Created At:</p>
                <button
                    onClick={() => deleteCallback(ip)}
                    className="delete-btn">X</button>
            </div>
            <div>
                <h2>{ip}</h2>
                <p style={{ fontSize: '14px' }}>{status}</p>
            </div>
        </div>
    );
};

export default AgentBox;
