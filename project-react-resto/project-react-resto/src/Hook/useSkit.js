import { useState, useEffect } from 'react';
import axios from 'axios';

const useSkit = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(url);
                setData(response.data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, refresh]);

    const refreshData = () => setRefresh(prev => prev + 1);

    return { data, loading, error, refreshData };
};

export default useSkit;
