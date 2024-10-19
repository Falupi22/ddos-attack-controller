import { useEffect, useState } from "react";
import "./AgentBox.scss"
import { Modal } from "../general/modal";
import { AgentData } from "../agentData";

export interface Agent {
    ip: string;
    url: string;
    uuid: string;
    message: string;
    timestamp: string;
    name: string | undefined;
}

interface AgentBoxProps extends Agent {
    deleteCallback: (ip: string) => void;
}

const AgentBox = ({ ip, deleteCallback, url, message, uuid, timestamp, name }: AgentBoxProps) => {
    const [color, setColor] = useState<string>('gray'); // Default to gray
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [location, setLocation] = useState('');
    const [targetIP, setTargetIP] = useState();

    const openModal = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsModalOpen(true);
    };

    const closeModal = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsModalOpen(false);
    };

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

    useEffect(() => {
        const fetchLocation = async () => {
            // Resolve the domain name to an IP address

            let isURL = true;
            try {
                new URL(url);
            } catch {
                isURL = false;
            }

            let dns;
            if (!isURL) {
                const resolveResponse = await fetch(`https://dns.google/resolve?name=${url}`);
                dns = await resolveResponse.json();
            }

            const urlIP = dns?.Answer?.[0]?.data ?? url;
            if (urlIP) {
                // Fetch location data using ipapi.co (or similar service)
                const response = await fetch(`https://ipapi.co/${urlIP}/json/`);
                if (!response.ok) {
                    setLocation('Not available')
                }
                else {
                    const locationData = await response.json();

                    if (locationData.error) {
                        setLocation('Not available')
                    }
                    else {
                        setLocation(`${locationData.city}, ${locationData.region}, ${locationData.country_name}`);
                    }

                    if (dns && !locationData.error) {
                        setTargetIP(urlIP);
                    }
                }
            }
            else {
                setLocation('Not available')
            }
        }

        fetchLocation();
    }, [url]);

    return (
        <div className="agent-box"
            onClick={openModal}
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
                <h3>{name}</h3>
                <h5>{url}</h5>
                <p style={{ fontSize: '14px', textWrap: 'wrap' }}>{message}</p>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <AgentData ip={ip} targetIP={targetIP} uuid={uuid} name={name} url={url} timestamp={timestamp}
                    location={location} message={message} />
            </Modal>
        </div>
    );
};


export default AgentBox;
