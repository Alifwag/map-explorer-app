import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, Search, RotateCcw } from 'lucide-react';

const History = ({ onSelectHistory }) => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const stored = localStorage.getItem('searchHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  };

  const removeItem = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const filteredHistory = history.filter(item =>
    item.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupByDate = (items) => {
    const groups = {};
    items.forEach(item => {
      const date = new Date(item.timestamp).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  };

  const groupedHistory = groupByDate(filteredHistory);

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>
          <Clock size={20} />
          Riwayat Pencarian
        </h3>
        {history.length > 0 && (
          <button className="clear-all-btn" onClick={clearAll}>
            <RotateCcw size={16} />
            Hapus Semua
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="search-filter">
          <Search size={16} />
          <input
            type="text"
            placeholder="Cari riwayat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="history-list">
        {history.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} />
            <p>Belum ada riwayat pencarian</p>
            <span>Riwayat pencarian Anda akan muncul di sini</span>
          </div>
        ) : (
          Object.entries(groupedHistory).map(([date, items]) => (
            <div key={date} className="history-group">
              <div className="date-header">{date}</div>
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="history-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    whileHover={{ x: 5 }}
                    onClick={() => onSelectHistory?.(item)}
                  >
                    <div className="history-icon">
                      <Search size={16} />
                    </div>
                    <div className="history-content">
                      <div className="history-query">{item.query}</div>
                      <div className="history-time">
                        {new Date(item.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {item.category && (
                          <span className="history-category">
                            • {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .history-panel {
          padding: 16px;
          background: var(--bg-primary);
          border-radius: 16px;
          max-height: 500px;
          overflow-y: auto;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .history-header h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          color: var(--text-primary);
        }

        .clear-all-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .clear-all-btn:hover {
          background: #ffe7e7;
          color: #ff4757;
          border-color: #ff4757;
        }

        .search-filter {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--bg-secondary);
          border-radius: 8px;
          margin-bottom: 16px;
          color: var(--text-secondary);
        }

        .search-filter input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
        }

        .history-group {
          margin-bottom: 20px;
        }

        .date-header {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 4px;
        }

        .history-item:hover {
          background: var(--bg-secondary);
        }

        .history-icon {
          width: 36px;
          height: 36px;
          background: #e7f1ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0066ff;
        }

        .history-content {
          flex: 1;
        }

        .history-query {
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 500;
          margin-bottom: 4px;
        }

        .history-time {
          font-size: 12px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .history-category {
          color: var(--accent-color);
        }

        .remove-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          opacity: 0;
          transition: all 0.2s;
        }

        .history-item:hover .remove-btn {
          opacity: 1;
        }

        .remove-btn:hover {
          background: #ffe7e7;
          color: #ff4757;
        }
      `}</style>
    </div>
  );
};

export default History;