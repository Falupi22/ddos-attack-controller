import { useState } from 'react';

interface IPInputProps {
    addCallback: (ip: string) => void;
}

const IPInput = ({ addCallback }: IPInputProps) => {
    const [ip, setIp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Regular expressions for validating IPv4 and IPv6
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})$/;

    // Function to validate IP address
    const validateIp = (value: string) => {
        if (ipv4Regex.test(value)) {
            setErrorMessage(''); // Valid IPv4 address
        } else if (ipv6Regex.test(value)) {
            setErrorMessage(''); // Valid IPv6 address
        } else {
            setErrorMessage('Invalid IP address'); // Invalid IP
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const value = e.target.value;
        setIp(value);
        validateIp(value);
    };

    return (
        <div>
            <div style={{ padding: '20px' }}>
                <label htmlFor="ipInput" style={{ fontWeight: 'bold' }}>
                    Enter an IP Address:
                </label>
                <input
                    id="ipInput"
                    type="text"
                    value={ip}
                    onChange={handleChange}
                    style={{ padding: '10px', marginLeft: '10px' }}
                    placeholder="Enter IPv4 or IPv6"
                />
                {errorMessage && (
                    <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
                )}

            </div>
            <button disabled={errorMessage !== ''} onClick={() => addCallback(ip)}>
                Add
            </button>
        </div>
    );
};

export default IPInput;
