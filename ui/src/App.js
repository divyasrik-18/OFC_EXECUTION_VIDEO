// // // // import React, { useState, useEffect } from 'react';
// // // // import Login from './Login';
// // // // import Dashboard from './Dashboard';

// // // // export default function App() {
// // // //     const [currentUser, setCurrentUser] = useState(null);

// // // //     // --- INITIALIZE DATABASE ---
// // // //     useEffect(() => {
// // // //         if (!localStorage.getItem('bsnl_surveys')) localStorage.setItem('bsnl_surveys', JSON.stringify([]));
// // // //         if (!localStorage.getItem('bsnl_logs')) localStorage.setItem('bsnl_logs', JSON.stringify([]));
        
// // // //         const initialUsers = [
// // // //             { username: 'admin', status: 'Offline', lastAction: '-' },
// // // //             { username: 'user', status: 'Offline', lastAction: '-' }
// // // //         ];
// // // //         if (!localStorage.getItem('bsnl_users')) {
// // // //             localStorage.setItem('bsnl_users', JSON.stringify(initialUsers));
// // // //         }
// // // //     }, []);

// // // //     // --- LOGGER ---
// // // //     const logAction = (username, action, details = '') => {
// // // //         const logs = JSON.parse(localStorage.getItem('bsnl_logs')) || [];
// // // //         const now = new Date();
// // // //         const newLog = {
// // // //             id: Date.now(),
// // // //             username,
// // // //             action,
// // // //             details,
// // // //             isoTime: now.toISOString(), 
// // // //             displayTime: now.toLocaleString() 
// // // //         };
// // // //         logs.unshift(newLog); 
// // // //         if (logs.length > 50) logs.pop(); // Limit logs
// // // //         localStorage.setItem('bsnl_logs', JSON.stringify(logs));
// // // //     };

// // // //     const updateUserStatus = (username, status) => {
// // // //         const users = JSON.parse(localStorage.getItem('bsnl_users')) || [];
// // // //         const updatedUsers = users.map(u => 
// // // //             u.username === username 
// // // //             ? { ...u, status: status, lastAction: new Date().toLocaleString() } 
// // // //             : u
// // // //         );
// // // //         localStorage.setItem('bsnl_users', JSON.stringify(updatedUsers));
// // // //     };

// // // //     const handleLogin = (username) => {
// // // //         updateUserStatus(username, 'Online');
// // // //         logAction(username, 'LOGIN', 'Session Started');
// // // //         setCurrentUser(username);
// // // //     };

// // // //     const handleLogout = () => {
// // // //         updateUserStatus(currentUser, 'Offline');
// // // //         logAction(currentUser, 'LOGOUT', 'Session Ended');
// // // //         setCurrentUser(null);
// // // //     };

// // // //     return (
// // // //         <div className="App">
// // // //             {!currentUser ? (
// // // //                 <Login onLogin={handleLogin} />
// // // //             ) : (
// // // //                 <Dashboard 
// // // //                     user={currentUser} 
// // // //                     role={currentUser} 
// // // //                     onLogout={handleLogout}
// // // //                     logAction={logAction} 
// // // //                 />
// // // //             )}
// // // //         </div>
// // // //     );
// // // // }



// // // import React, { useState, useEffect } from 'react';
// // // import Login from './Login';
// // // import Dashboard from './Dashboard';

// // // function App() {
// // //   const [user, setUser] = useState(null);
// // //   const [role, setRole] = useState('user');

// // //   // 1. ON PAGE RELOAD: Check Local Storage (The Memory)
// // //   useEffect(() => {
// // //     const savedToken = localStorage.getItem('token');
// // //     const savedUser = localStorage.getItem('username');
// // //     const savedRole = localStorage.getItem('role');

// // //     // If data exists in memory, keep the user logged in
// // //     if (savedToken && savedUser) {
// // //       setUser(savedUser);
// // //       setRole(savedRole); 
// // //     }
// // //   }, []);

// // //   // 2. ON LOGIN BUTTON CLICK
// // //   const handleLogin = (username, userRole) => {
// // //     setUser(username);
// // //     setRole(userRole);
// // //     // Note: Login.js already saved the data to localStorage, so we just update State here
// // //   };

// // //   const handleLogout = () => {
// // //     // Clear Memory
// // //     localStorage.removeItem('token');
// // //     localStorage.removeItem('username');
// // //     localStorage.removeItem('role');
// // //     // Reset State
// // //     setUser(null);
// // //     setRole('user');
// // //   };

// // //   return (
// // //     <div>
// // //       {!user ? (
// // //         <Login onLogin={handleLogin} />
// // //       ) : (
// // //         <Dashboard user={user} role={role} onLogout={handleLogout} />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default App;


// // import React, { useState, useEffect } from 'react';
// // import Login from './Login';
// // import Dashboard from './Dashboard';

// // function App() {
// //   // 'user' will be an object: { username: "...", mobile: "..." }
// //   const [user, setUser] = useState(null); 
// //   // 'role' will be a string: "admin" or "user"
// //   const [role, setRole] = useState(null); 

// //   // --- 1. ON LOAD: Check Local Storage (Keep user logged in on refresh) ---
// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     const savedUserStr = localStorage.getItem('bsnl_user_details');
// //     const savedRole = localStorage.getItem('bsnl_user_role');

// //     if (token && savedUserStr) {
// //       try {
// //         const parsedUser = JSON.parse(savedUserStr);
// //         setUser(parsedUser);
// //         setRole(savedRole || 'user');
// //       } catch (err) {
// //         console.error("Error parsing saved user:", err);
// //         handleLogout(); // Data corrupted, force logout
// //       }
// //     }
// //   }, []);

// //   // --- 2. HANDLE LOGIN (Called from Login.js) ---
// //   const handleLogin = (userData) => {
// //     // userData received from Login.js: { username: "...", role: "...", mobile: "..." }
// //     console.log("App received login data:", userData);

// //     const userObj = {
// //       username: userData.username,
// //       mobile: userData.mobile || '' // Store mobile for the Survey Form
// //     };

// //     // 1. Update State
// //     setUser(userObj);
// //     setRole(userData.role || 'user');

// //     // 2. Save to Memory (LocalStorage) so refresh works
// //     localStorage.setItem('bsnl_user_details', JSON.stringify(userObj));
// //     localStorage.setItem('bsnl_user_role', userData.role || 'user');
// //     // Note: 'token' is already set inside Login.js
// //   };

// //   // --- 3. HANDLE LOGOUT ---
// //   const handleLogout = () => {
// //     // Clear Memory
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('bsnl_user_details');
// //     localStorage.removeItem('bsnl_user_role');
    
// //     // Reset State
// //     setUser(null);
// //     setRole(null);
// //   };

// //   return (
// //     <div className="App">
// //       {!user ? (
// //         <Login onLogin={handleLogin} />
// //       ) : (
// //         <Dashboard 
// //           user={user}       // Passes object: {username, mobile}
// //           role={role}       // Passes string: "admin" or "user"
// //           onLogout={handleLogout} 
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // export default App;



// import React, { useState, useEffect } from 'react';
// import Login from './Login';
// import Dashboard from './Dashboard';

// function App() {
//   const [user, setUser] = useState(null); 
//   const [role, setRole] = useState(null); 

//   // --- 1. ON LOAD: Clear previous session data ---
//   // This ensures that every time the tab is opened/refreshed, 
//   // the user is forced to the login screen.
//   useEffect(() => {
//     // We clear these so the "auto-login" never happens
//     localStorage.removeItem('bsnl_user_details');
//     localStorage.removeItem('bsnl_user_role');
//     localStorage.removeItem('token');
    
//     // Note: We do NOT clear the browser's saved passwords here.
//     // The browser handles saved passwords separately.
//   }, []);

//   // --- 2. HANDLE LOGIN ---
//   const handleLogin = (userData) => {
//     const userObj = {
//       username: userData.username,
//       mobile: userData.mobile || ''
//     };

//     setUser(userObj);
//     setRole(userData.role || 'user');

//     // Save for the current session if needed, 
//     // but the useEffect above will wipe it on next refresh
//     localStorage.setItem('bsnl_user_details', JSON.stringify(userObj));
//     localStorage.setItem('bsnl_user_role', userData.role || 'user');
//   };

//   // --- 3. HANDLE LOGOUT ---
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('bsnl_user_details');
//     localStorage.removeItem('bsnl_user_role');
//     setUser(null);
//     setRole(null);
//   };

//   return (
//     <div className="App">
//       {!user ? (
//         <Login onLogin={handleLogin} />
//       ) : (
//         <Dashboard 
//           user={user}       
//           role={role}       
//           onLogout={handleLogout} 
//         />
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [user, setUser] = useState(null); 
  const [role, setRole] = useState(null); 
  const [isInitializing, setIsInitializing] = useState(true);

  // --- RESTORE SESSION ON REFRESH ---
  useEffect(() => {
    const savedUserStr = localStorage.getItem('bsnl_user_details');
    const savedRole = localStorage.getItem('bsnl_user_role');
    const token = localStorage.getItem('token');

    if (token && savedUserStr) {
      try {
        setUser(JSON.parse(savedUserStr));
        setRole(savedRole);
      } catch (e) {
        localStorage.clear();
      }
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = (userData) => {
    const userObj = { username: userData.username, mobile: userData.mobile || '' };
    setUser(userObj);
    setRole(userData.role || 'user');
    localStorage.setItem('bsnl_user_details', JSON.stringify(userObj));
    localStorage.setItem('bsnl_user_role', userData.role || 'user');
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
  };

  if (isInitializing) return null; // Prevents the login page from flashing

  return (
    <div className="App">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} role={role} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;