import { useState } from 'react';

interface IPInputProps {
    addCallback: (ip: string, url: string) => void;
}

const IPInput = ({ addCallback }: IPInputProps) => {
    const [ip, setIP] = useState('');
    const [url, setURL] = useState('');
    const [errorMessageIP, setErrorMessageIP] = useState('');
    const [errorMessageURL, setErrorMessageURL] = useState('');

    // Regular expressions for validating IPv4 and IPv6
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})$/;
    const urlRegex = "^(https?:\\/\\/)?([\\w\\d-]+)\\.([a-z]{2,6})(\\.[a-z]{2,6})?([\\/\\w\\d#?&=.-]*)?$";

    // Function to validate IP address
    const validateIP = (value: string) => {
        if (ipv4Regex.test(value)) {
            setErrorMessageIP(''); // Valid IPv4 address
        } else if (ipv6Regex.test(value)) {
            setErrorMessageIP(''); // Valid IPv6 address
        } else {
            setErrorMessageIP('Invalid IP address'); // Invalid IP
        }
    };

    const validateURL = (url: string) => {
        const urlPattern = new RegExp(
            urlRegex,
            "i"
        );

        if (urlPattern.test(url) || ipv4Regex.test(url) || ipv6Regex.test(url)) {
            setErrorMessageURL(''); // Valid URL
        }
        else {
            setErrorMessageURL('Invalid URL'); // Invalid URL
        }
    };

    // Handle input change
    const handleIPChange = (e) => {
        const value = e.target.value;
        setIP(value);
        validateIP(value);
    };

    const handleURLChange = (e) => {
        const value = e.target.value;
        setURL(value);
        validateURL(value);
    };


    return (
        <div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="ipInput" style={{ fontWeight: 'bold' }}>
                    Enter an IP Address:
                </label>
                <input
                    id="ipInput"
                    type="text"
                    value={ip}
                    onChange={handleIPChange}
                    style={{ padding: '10px', marginLeft: '10px' }}
                    placeholder="Enter IPv4 or IPv6"
                />
                <br />
                <br />
                <label htmlFor="urlInput" style={{ fontWeight: 'bold' }}>
                    Enter a URL/IP:
                </label>
                <input
                    id="urlInput"
                    type="text"
                    value={url}
                    onChange={handleURLChange}
                    style={{ padding: '10px', marginLeft: '10px' }}
                    placeholder="Enter IPv4 or IPv6"
                />
                {errorMessageIP && (
                    <p style={{ color: 'red', marginTop: '10px' }}>{errorMessageIP}</p>
                )}
                {errorMessageURL && (
                    <p style={{ color: 'red', marginTop: '10px' }}>{errorMessageURL}</p>
                )}
            </div>
            <button disabled={errorMessageIP !== '' || errorMessageURL !== ''} onClick={() => addCallback(ip, url)}>
                Add
            </button>
        </div>
    );
};

export default IPInput;
