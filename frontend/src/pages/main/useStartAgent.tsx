import { useEffect, useState } from "react"

const useStartAgent = (ip: string, targetIP: string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [result, setResult] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ip, targetIP }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setResult(await response.json());
            }
            catch (error) {
                setError(`${error.message}`);
            }
            finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [ip, targetIP])

    return { loading, error, result };
}

export default useStartAgent;