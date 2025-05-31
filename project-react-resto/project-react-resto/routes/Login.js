// ...existing imports...

const Login = () => {
    // ...existing state and hooks...

    const handleLogin = async (data) => {
        try {
            setError('');
            setLoading(true);

            const response = await axios.post('/api/auth/login', data);

            if (response.data.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // First navigate to admin page
                navigate('/admin');
                
                // Then reload the page to refresh all components
                window.location.reload();
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            
            // Clear form if credentials are invalid
            if (err.response?.status === 401) {
                reset();
            }
        } finally {
            setLoading(false);
        }
    };

    // ...existing JSX...
};
