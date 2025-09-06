
import React from "react";
import "./HistorySidebar.css";

export default function HistorySidebar({ username = "Abdul Hakeem", history = [], activeIdx = 0, onSelect }) {
  return (
    <aside className="history-sidebar">
      <div className="history-header">History</div>
      <div className="history-list">
        {history.length === 0 ? (
          <div className="history-empty">No history yet.</div>
        ) : (
          history.map((item, idx) => (
            <div
              key={idx}
              className={`history-item${activeIdx === idx ? " active" : ""}`}
              onClick={() => onSelect && onSelect(idx)}
            >
              {idx + 1}. {item}
            </div>
          ))
        )}
      </div>
      <div className="history-user">
        <span className="history-username">{username}</span>
        <button className="history-signout">Sign Out</button>
      </div>
    </aside>
  );
}
