import { useState, useEffect, useCallback } from 'react';
import { CHAT_PANEL, CSS_CLASSES } from '../constants';

interface UseResizablePanelOptions {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

/**
 * Hook for managing a resizable panel
 */
export const useResizablePanel = ({
  initialWidth = CHAT_PANEL.DEFAULT_WIDTH,
  minWidth = CHAT_PANEL.MIN_WIDTH,
  maxWidth = CHAT_PANEL.MAX_WIDTH,
}: UseResizablePanelOptions = {}) => {
  const [width, setWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);

  // Start dragging
  const startResize = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    // Prevent default to avoid text selection on initial click
    e.preventDefault();
  }, []);

  // Handle mouse movement during drag
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newWidth = window.innerWidth - e.clientX;
        setWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
      }
    },
    [isDragging, minWidth, maxWidth],
  );

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Remove the no-select class when dragging stops
    document.body.classList.remove(CSS_CLASSES.RESIZE_NO_SELECT);
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      // Add a class to the body to prevent text selection during resize
      document.body.classList.add(CSS_CLASSES.RESIZE_NO_SELECT);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Clean up the class when component unmounts or effect re-runs
      document.body.classList.remove(CSS_CLASSES.RESIZE_NO_SELECT);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    width,
    isDragging,
    setIsDragging,
    startResize,
  };
};
