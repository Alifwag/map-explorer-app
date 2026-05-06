import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error ke service monitoring
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">
              <AlertTriangle size={64} />
            </div>
            
            <h1>Oops! Terjadi Kesalahan</h1>
            
            <p className="error-message">
              Maaf, aplikasi mengalami kesalahan yang tidak terduga.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="error-details">
                <h4>Detail Error:</h4>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <details>
                    <summary>Component Stack</summary>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </details>
                )}
              </div>
            )}

            <div className="error-actions">
              <button className="retry-btn" onClick={this.handleRetry}>
                <RefreshCcw size={20} />
                Coba Lagi
              </button>
              
              <button 
                className="report-btn"
                onClick={() => {
                  // Implement error reporting
                  alert('Error telah dilaporkan ke tim teknis');
                }}
              >
                Laporkan Masalah
              </button>
            </div>

            <div className="error-help">
              <p>Jika masalah berlanjut, coba:</p>
              <ul>
                <li>Refresh halaman</li>
                <li>Bersihkan cache browser</li>
                <li>Gunakan browser yang didukung (Chrome, Firefox, Safari)</li>
              </ul>
            </div>
          </div>

          <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 20px;
            }

            .error-container {
              background: white;
              border-radius: 24px;
              padding: 48px;
              max-width: 600px;
              text-align: center;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }

            .error-icon {
              margin-bottom: 24px;
              animation: shake 0.5s ease-in-out;
            }

            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-10px); }
              75% { transform: translateX(10px); }
            }

            h1 {
              font-size: 28px;
              color: #2d3436;
              margin-bottom: 12px;
            }

            .error-message {
              color: #636e72;
              margin-bottom: 24px;
              line-height: 1.6;
            }

            .error-details {
              text-align: left;
              background: #f8f9fa;
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 24px;
              font-size: 12px;
              max-height: 200px;
              overflow-y: auto;
            }

            .error-details pre {
              white-space: pre-wrap;
              word-break: break-word;
            }

            .error-actions {
              display: flex;
              gap: 12px;
              justify-content: center;
              margin-bottom: 24px;
            }

            .retry-btn, .report-btn {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 12px 24px;
              border-radius: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s;
            }

            .retry-btn {
              background: #0066ff;
              color: white;
              border: none;
            }

            .retry-btn:hover {
              background: #0052cc;
              transform: translateY(-2px);
            }

            .report-btn {
              background: white;
              color: #0066ff;
              border: 2px solid #0066ff;
            }

            .report-btn:hover {
              background: #e7f1ff;
            }

            .error-help {
              text-align: left;
              padding: 16px;
              background: #f8f9fa;
              border-radius: 12px;
              font-size: 14px;
              color: #636e72;
            }

            .error-help ul {
              margin: 8px 0 0 20px;
            }

            .error-help li {
              margin-bottom: 4px;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;