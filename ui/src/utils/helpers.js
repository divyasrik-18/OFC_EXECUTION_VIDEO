// Fixes the {"user12"} brackets issue from Postgres
export const cleanString = (val) => {
    if (!val) return "";
    return String(val).replace(/[[\]"']/g, '').split(',')[0].trim();
};

export const formatTableDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-IN', { 
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true 
    });
};

export const getBSNLTimestamp = (dateString) => {
    const d = dateString ? new Date(dateString) : new Date();
    return `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`;
};