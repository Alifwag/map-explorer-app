import React from 'react';

const Skeleton = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch(type) {
      case 'map':
        return (
          <div className="skeleton-map">
            <div className="skeleton shimmer" style={{ width: '100%', height: '100%' }} />
          </div>
        );
      
      case 'search':
        return (
          <div className="skeleton-search">
            <div className="skeleton shimmer" style={{ height: '48px', borderRadius: '12px' }} />
          </div>
        );
      
      case 'list':
        return (
          <div className="skeleton-list">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-item">
                <div className="skeleton shimmer" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
                <div className="skeleton-content">
                  <div className="skeleton shimmer" style={{ height: '16px', width: '60%' }} />
                  <div className="skeleton shimmer" style={{ height: '12px', width: '40%', marginTop: '8px' }} />
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'card':
      default:
        return (
          <div className="skeleton-card">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="skeleton-card-item">
                <div className="skeleton shimmer" style={{ height: '200px', borderRadius: '16px' }} />
                <div className="skeleton shimmer" style={{ height: '16px', width: '80%', marginTop: '12px' }} />
                <div className="skeleton shimmer" style={{ height: '12px', width: '60%', marginTop: '8px' }} />
              </div>
            ))}
          </div>
        );
    }
  };

  return <div className="skeleton-wrapper">{renderSkeleton()}</div>;
};

// CSS untuk skeleton
const style = document.createElement('style');
style.textContent = `
  .skeleton-wrapper {
    padding: 16px;
  }

  .skeleton-map {
    width: 100%;
    height: 500px;
    border-radius: 16px;
    overflow: hidden;
  }

  .skeleton-search {
    margin-bottom: 16px;
  }

  .skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .skeleton-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 12px;
  }

  .skeleton-content {
    flex: 1;
  }

  .skeleton-card {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .dark .skeleton {
    background: linear-gradient(90deg, #2d2d2d 25%, #404040 50%, #2d2d2d 75%);
    background-size: 200% 100%;
  }
`;
document.head.appendChild(style);

export default Skeleton;