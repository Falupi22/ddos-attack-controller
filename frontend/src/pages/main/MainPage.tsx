import { useState } from "react"
import { IPInput } from "../../components/ip"
import { AgentBox } from "../../components/agentBox";

const MainPage = () => {
    const [ips, setIPs] = useState<Array<string>>([]);

    const addIP = (ip: string) => {
        setIPs([...ips, ip]);
    }

    const deleteIP = (ip: string) => {
        setIPs((ips) => ips.filter((existingIP) => existingIP !== ip));
    }

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {ips.map((ip) => (
                    <AgentBox key={ip} ip={ip} deleteCallback={deleteIP} />
                ))}
            </div>
            <IPInput addCallback={addIP} />
        </div>
    )
}

export default MainPage