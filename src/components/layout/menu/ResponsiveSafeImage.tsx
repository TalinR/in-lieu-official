// src/components/ResponsiveSafeImage.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ResponsiveSafeImageProps {
  src: string;
  alt: string;
  safeArea?: { x: number; y: number };
}

const ResponsiveSafeImage = ({
  src,
  alt,
  safeArea = { x: 0.1, y: 0.4 },
}: ResponsiveSafeImageProps) => {
  // Refs for the container and the image elements
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // State to hold the calculated inline styles for the image
  const [imageStyle, setImageStyle] = useState<React.CSSProperties>({
    opacity: 0, // Start hidden until dimensions are calculated
    transform: 'scale(1) translate(0px, 0px)',
  });

  // The main calculation logic, memoized with useCallback
  const calculateStyle = useCallback(() => {
    // Ensure both the container and image have loaded and have dimensions
    if (!containerRef.current || !imageRef.current || !imageRef.current.naturalWidth) {
      return;
    }

    const cWidth = containerRef.current.offsetWidth;
    const cHeight = containerRef.current.offsetHeight;
    const iWidth = imageRef.current.naturalWidth;
    const iHeight = imageRef.current.naturalHeight;

    // Dimensions of the safe area in pixels
    const safeWidth = iWidth * safeArea.x;
    const safeHeight = iHeight * safeArea.y;

    // Calculate the scale factor needed to fit the safe area to the container
    const scaleX = cWidth / safeWidth;
    const scaleY = cHeight / safeHeight;

    // We must use the SMALLER scale factor to ensure the safe area is
    // fully visible while filling the container.
    const scale = Math.min(scaleX, scaleY);

    // Calculate the new dimensions of the entire image
    const newImageWidth = iWidth * scale;
    const newImageHeight = iHeight * scale;


    // Calculate the top/left position to center the scaled image
    const left = (cWidth - newImageWidth) / 2;
    // const top = (cHeight - newImageHeight) / 2;
    let top: number;
    

    if ((cHeight - newImageHeight)<0) {
      top = (cHeight - newImageHeight) / 2
    }
    else{
      top=0
    }


    // Set the new style to position and scale the image
    setImageStyle({
      position: 'absolute',
      width: `${newImageWidth}px`,
      height: `${newImageHeight}px`,
      left: `${left}px`,
      top: `${top}px`,
      maxWidth: 'none', // Override any potential max-width from parent CSS
      opacity: 1, // Make it visible
      transition: 'opacity 0.3s ease-in-out',
    });
  }, [safeArea.x, safeArea.y]); // Dependency array for useCallback

  // Effect to handle image loading and container resizing
  useEffect(() => {
    // We need a ResizeObserver to detect when the container's size changes.
    // This is more efficient than listening to the window's resize event.
    const observer = new ResizeObserver(() => {
      calculateStyle();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Also, ensure calculations run when the image finishes loading
    const imgElement = imageRef.current;
    if (imgElement) {
      imgElement.addEventListener('load', calculateStyle);
    }
    
    // Cleanup function to remove listeners and observers
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      if (imgElement) {
        imgElement.removeEventListener('load', calculateStyle);
      }
    };
  }, [calculateStyle]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={imageStyle}
        // Run calculation in case the image is already cached and 'load' doesn't fire
        onLoad={calculateStyle}
      />
    </div>
  );
};

export default ResponsiveSafeImage;