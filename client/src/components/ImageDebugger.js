import React, { useState, useEffect } from 'react';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

/**
 * Component to debug image loading issues
 * This will try different URLs and display which one works
 */
const ImageDebugger = ({ filename }) => {
  const [successUrl, setSuccessUrl] = useState(null);
  const [testedUrls, setTestedUrls] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filename) {
      setLoading(false);
      return;
    }

    const possiblePaths = [
      `${SERVER_URL}/images/${filename}`,
      `${SERVER_URL}/public/images/${filename}`,
      `http://localhost:5000/images/${filename}`,
      `http://localhost:5000/public/images/${filename}`
    ];

    // Test each URL
    const testUrls = async () => {
      const results = {};
      
      for (const url of possiblePaths) {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          results[url] = response.ok;
          if (response.ok && !successUrl) {
            setSuccessUrl(url);
          }
        } catch (error) {
          results[url] = false;
        }
      }
      
      setTestedUrls(results);
      setLoading(false);
    };

    testUrls();
  }, [filename]);

  if (!filename) {
    return <div className="alert alert-warning">No image filename provided</div>;
  }

  if (loading) {
    return <div className="text-center">Testing image URLs...</div>;
  }

  return (
    <div className="card mt-3">
      <div className="card-header bg-info text-white">
        Image Path Debugger
      </div>
      <div className="card-body">
        <h6>Filename: {filename}</h6>
        
        <div className="mt-3">
          <h6>URL Test Results:</h6>
          <ul className="list-group">
            {Object.entries(testedUrls).map(([url, success]) => (
              <li 
                key={url} 
                className={`list-group-item ${success ? 'list-group-item-success' : 'list-group-item-danger'}`}
              >
                {url}: {success ? '✅ Works' : '❌ Failed'}
              </li>
            ))}
          </ul>
        </div>
        
        {successUrl && (
          <div className="mt-3">
            <h6>Working Image:</h6>
            <img 
              src={successUrl} 
              alt="Working image" 
              style={{ maxWidth: '100%', maxHeight: '200px' }} 
              className="img-thumbnail" 
            />
          </div>
        )}
        
        {!successUrl && (
          <div className="alert alert-danger mt-3">
            None of the tested URLs worked for this image
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDebugger; 