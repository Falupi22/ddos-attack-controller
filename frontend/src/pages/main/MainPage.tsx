import { useEffect, useState } from "react"
import { IPInput } from "../../components/ip"
import { AgentBox, Agent } from "../../components/agentBox";
import { socket } from "../../socket";

const MainPage = () => {
    const [agents, setAgents] = useState<Array<Agent>>([]);

    useEffect(() => {
        const onNewMessage = function (message: { ip: string, timestamp: string, url: string, uuid: string, message: string }) {
            const agent = agents.find(agentBox => agentBox.uuid === message.uuid);
            if (agent) {
                const updatedAgent = {
                    ...agent,
                    timestamp: new Date(message.timestamp).toLocaleString(),
                    message: message.message
                }
                setAgents((agents) => [...agents.map((agent) => agent.uuid === message.uuid ? updatedAgent : agent)]);
            }
        };

        socket.on('new_message', onNewMessage);

        return () => {
            socket.off('new_message', onNewMessage);
        };
    }, [agents]);



    const addIP = async (ip: string, url: string) => {
        const response = await fetch(`http://localhost:5000/ping/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip: ip, url: url }),
        });
        const uuid = (await response.json()).uuid;
        if (!response.ok) {
            window.alert("Error: " + response.status)
        }
        else {
            const newAgent: Agent = {
                ip,
                url,
                uuid,
                timestamp: "No info",
                message: '',
            };
            setAgents([...agents, newAgent]);
        }
    }

    const deleteIP = async (uuid: string) => {
        const ip = agents.find(agent => agent.uuid === uuid)?.ip;

        if (ip) {
            const response = await fetch(`http://localhost:5000/ping/stop/${ip}/agent/${uuid}`, { method: 'DELETE' });
            if (!response.ok) {
                window.alert("Error: " + response.status)
                return;
            }
            setAgents((agents) => agents.filter((existingAgent) => existingAgent.uuid !== uuid));
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {agents.map((agent) => (
                    <AgentBox key={agent.uuid} timestamp={agent.timestamp} uuid={agent.uuid} ip={agent.ip} url={agent.url} message={agent.message} deleteCallback={deleteIP} />
                ))}
            </div>
            <IPInput addCallback={addIP} />
        </div>
    )
}

export default MainPage