import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    // State to switch between Login and Register views
    const [isLoginMode, setIsLoginMode] = useState(true);
    const API_BASE = process.env.REACT_APP_API_URL;

    // Form Fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState(''); // NEW: Mobile Number State
    const [role, setRole] = useState('user'); 
    
    // UI Feedback
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        const endpoint = isLoginMode ? '/login' : '/register';
        const url = `${API_BASE}/users${endpoint}`;
        
        // Base Payload
        const payload = { 
            username: username, 
            password: password 
        };

        // Add Role and Mobile ONLY if Registering
        if (!isLoginMode) {
            payload.role = role;
            payload.mobile = mobile; 
        }

        try {
            const response = await axios.post(url, payload, {
                withCredentials: true
            });

            if (isLoginMode) {
                // --- LOGIN LOGIC ---
                if (response.data.success) {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("id", response.data.user.id);
                    
                    // PASS FULL USER OBJECT (Username + Mobile + Role)
                    // Ensure your backend /login returns the mobile number in 'user' object
                    onLogin({
                        username: response.data.user.username,
                        role: response.data.user.role,
                        mobile: response.data.user.mobile || mobile 
                    });
                }
            } else {
                // --- REGISTER LOGIC ---
                setSuccessMsg("Registration Successful! Please log in now.");
                setIsLoginMode(true); 
                setPassword('');
            }

        } catch (err) {
            console.error("Auth Error:", err);
            const message = err.response?.data?.error || 'Connection failed or Invalid Credentials';
            setError(message);
        }
    };

    // --- STYLES ---
    const styles = {
        container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5', fontFamily: 'Arial, sans-serif' },
        card: { background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', width: '380px' },
        header: { textAlign: 'center', color: '#2A4480', marginBottom: '25px', borderBottom: '2px solid #2A4480', paddingBottom: '15px' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555', fontWeight: 'bold' },
        input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
        select: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', background: 'white' },
        button: { width: '100%', padding: '12px', background: '#2A4480', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', transition: '0.3s' },
        toggleLink: { display: 'block', width: '100%', textAlign: 'center', marginTop: '15px', background: 'none', border: 'none', color: '#2A4480', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' },
        error: { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' },
        success: { background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.header}>
                    {isLoginMode ? 'SECURE LOGIN' : 'NEW REGISTRATION'}
                </h2>

                {error && <div style={styles.error}>{error}</div>}
                {successMsg && <div style={styles.success}>{successMsg}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={styles.input} placeholder="Enter Username" required />
                    </div>
                    
                    {/* NEW: Mobile Number Field (Register Only) */}
                    {!isLoginMode && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Mobile Number</label>
                            <input 
                                type="tel" 
                                value={mobile} 
                                onChange={e => setMobile(e.target.value)} 
                                style={styles.input} 
                                placeholder="10-digit Mobile Number" 
                                pattern="[0-9]{10}"
                                required 
                            />
                        </div>
                    )}
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} placeholder="Enter Password" required />
                    </div>

                    {!isLoginMode && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Role</label>
                            <select value={role} onChange={e => setRole(e.target.value)} style={styles.select}>
                                <option value="user">User (Surveyor)</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" style={styles.button}>
                        {isLoginMode ? 'LOGIN' : 'REGISTER'}
                    </button>
                </form>

                {/* <button 
                    onClick={() => { setIsLoginMode(!isLoginMode); setError(''); setSuccessMsg(''); }} 
                    style={styles.toggleLink}
                >
                    {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </button> */}

                <div style={{ marginTop: '20px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
                    Authorized Personnel Only | v2.0
                </div>
            </div>
        </div>
    );
};

export default Login;


