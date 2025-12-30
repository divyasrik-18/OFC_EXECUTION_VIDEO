import React from 'react';

export default function InfoOverlay({ lat, lon }) {
  return (
    <div style={{
        color: "white",
        padding: "10px",
        background: "rgba(0,0,0,0.6)",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.5)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontSize: "11px",
        fontFamily: "monospace",
        height: "100%",
        boxSizing: "border-box"
    }}>
      {lat && lon ? (
        <>
          <div style={{color:'#ff9800', fontWeight:'bold', marginBottom:'5px'}}>{new Date().toLocaleString()}</div>
          <div>LAT: {lat.toFixed(6)}</div>
          <div>LNG: {lon.toFixed(6)}</div>
          <div style={{marginTop:'5px', color:'#4caf50'}}>Accuracy: High</div>
        </>
      ) : (
        <div>Waiting for GPS...</div>
      )}
    </div>
  );
}