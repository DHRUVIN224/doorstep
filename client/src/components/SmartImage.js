import React, { useState, useEffect } from 'react';
import { findWorkingImageUrl } from '../utils/imageHelper';

// Default server URL
const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

/**
 * SmartImage component automatically tries different URL patterns
 * for displaying images when the standard pattern fails
 */
const SmartImage = ({ 
  filename, 
  alt = "Image", 
  className = "", 
  style = {}, 
  onLoad = () => {},
  onError = () => {},
  fallbackElement = null
}) => {
  const [imageSrc, setImageSrc] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Create standard style with defaults
  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    ...style
  };

  useEffect(() => {
    if (!filename) {
      setError(true);
      setLoading(false);
      return;
    }

    // Reset states when filename changes
    setError(false);
    setLoading(true);
    
    // Default image URL
    const defaultUrl = `${SERVER_URL}/images/${filename}`;
    setImageSrc(defaultUrl);

    // Try to find a working URL
    findWorkingImageUrl(filename)
      .then(url => {
        if (url) {
          setImageSrc(url);
          setLoading(false);
        } else {
          console.warn(`No working URL found for image: ${filename}`);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(`Error finding working URL for image: ${filename}`, err);
        setLoading(false);
      });
  }, [filename]);

  // If no filename provided, show fallback or nothing
  if (!filename) {
    return fallbackElement || null;
  }

  // Handle image load error by trying alternate paths
  const handleError = (e) => {
    console.error(`Failed to load image: ${imageSrc}`);
    
    // Try fallback URL patterns in sequence
    const fallbackPaths = [
      `${SERVER_URL}/public/images/${filename}`,
      `http://localhost:5000/images/${filename}`,
      `http://localhost:5000/public/images/${filename}`
    ];
    
    // Find the next URL to try
    const currentIndex = fallbackPaths.indexOf(imageSrc);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < fallbackPaths.length) {
      // Try next URL
      const nextUrl = fallbackPaths[nextIndex];
      console.log(`Trying fallback URL: ${nextUrl}`);
      setImageSrc(nextUrl);
    } else {
      // All URLs failed
      setError(true);
      onError();
    }
  };

  // Handle successful image load
  const handleLoad = (e) => {
    setLoading(false);
    setError(false);
    console.log(`Image loaded successfully: ${imageSrc}`);
    onLoad(e);
  };

  // If there's an error and a fallback is provided, show it
  if (error && fallbackElement) {
    return fallbackElement;
  }

  return (
    <div className={`smart-image-container ${className}`}>
      {loading && (
        <div className="text-center p-2">
          <small className="text-muted">Loading image...</small>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        className={`smart-image ${error ? 'd-none' : ''}`}
        style={imageStyle}
        onError={handleError}
        onLoad={handleLoad}
      />
      
      {error && !fallbackElement && (
        <div className="text-center p-2">
          <p className="text-danger mb-1">Failed to load image</p>
          <small className="text-muted d-block">Filename: {filename}</small>
        </div>
      )}
    </div>
  );
};

export default SmartImage; 