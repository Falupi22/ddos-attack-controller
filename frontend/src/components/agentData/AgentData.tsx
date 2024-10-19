// Props for AgentData
interface AgentDataProps {
    ip: string;
    uuid: string;
    url: string;
    targetIP?: string; // Target IP for showing in the modal
    message: string;
    timestamp: string;
    location: string;
    name?: string; // Optional prop for showing name in the modal
}

// Component to show detailed data inside the modal
const AgentData = ({ ip, uuid, url, message, targetIP, timestamp, location, name }: AgentDataProps) => {
    return (
        <div className="agent-data">
            <h2>Agent Detailed Data</h2>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Agent IP:</strong> {ip}</p>
            <p><strong>URL:</strong> {url}</p>
            {targetIP ? <p><strong>Target IP:</strong> {targetIP}</p> : null}
            <p><strong>Location:</strong> {location}</p>
            <p><strong>Status:</strong> {message}</p>
            <p><strong>Last Updated:</strong> {timestamp}</p>
            <p><strong>UUID:</strong> {uuid}</p>
        </div>
    );
};

export default AgentData;