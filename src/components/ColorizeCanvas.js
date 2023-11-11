import React, { useRef, useState, useEffect } from 'react';
import ColorBookImage from "./ColorBookImage";

let lastMouseCoordinates = { offsetX: 0, offsetY: 0 };

const ColorizeCanvas = ({ width, height, brushSize = 5, brushColor, imageUrl }) => {
  const drawingCanvasRef = useRef(null);
  const indicatorCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const drawingCanvas = drawingCanvasRef.current;
    const context = drawingCanvas.getContext('2d');
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.fillStyle = brushColor;
    context.strokeStyle = brushColor;

    // Setup indicator canvas to have no events and ignore mouse events
    indicatorCanvasRef.current.style.pointerEvents = 'none';
  }, [brushSize, brushColor]); // Only re-run the effect if brushSize changes


  const onMouseEnterCanvas = (event) => {
    // Check if the left mouse button is pressed while entering the canvas
    if (event.buttons === 1) { // buttons property is 1 when left mouse button is pressed
      startDrawing(event); // Start drawing
    }
  };

  const startDrawing = (event) => {
    const { offsetX, offsetY } = getCoordinates(event);

    const context = drawingCanvasRef.current.getContext('2d');
    setIsDrawing(true);

    // Start a new path for the circle and fill it
    context.beginPath();
    context.arc(offsetX, offsetY, brushSize / 2, 0, Math.PI * 2);
    context.fill();

    // Also begin a path for potential dragging
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  const keepDrawing = (event) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(event);
    const context = drawingCanvasRef.current.getContext('2d');

    // Draw a line to the new location
    context.lineTo(offsetX, offsetY);
    context.stroke();

    // Begin a new path from the new location to allow for a new circle
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const context = drawingCanvasRef.current.getContext('2d');
      context.closePath();
      setIsDrawing(false);
    }
    clearIndicatorCanvas(); // Clear the indicator canvas to remove the brush circle after drawing
  };

  const getCoordinates = (event) => {
    if (!drawingCanvasRef.current) {
      return { offsetX: 0, offsetY: 0 };
    }
    const canvas = drawingCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
  };

  const clearIndicatorCanvas = () => {
    const canvas = indicatorCanvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawBrushIndicator = (event) => {
    if (isDrawing) return; // Don't draw the indicator if currently drawing
    clearIndicatorCanvas();
    const { offsetX, offsetY } = getCoordinates(event);
    lastMouseCoordinates = { clientX: event.clientX, clientY: event.clientY };
    const context = indicatorCanvasRef.current.getContext('2d');
    context.beginPath();
    context.arc(offsetX, offsetY, brushSize / 2, 0, Math.PI * 2);
    context.fillStyle = brushColor;
    context.fill();
  };

  // Initialize canvas with brush settings and attach event listeners
  useEffect(() => {
    const drawingCanvas = drawingCanvasRef.current;
    const context = drawingCanvas.getContext('2d');
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.strokeStyle = brushColor;

    // Attach mouse event listeners
    drawingCanvas.onmousedown = startDrawing;
    drawingCanvas.onmousemove = (e) => isDrawing && keepDrawing(e);
    drawingCanvas.onmouseup = stopDrawing;
    drawingCanvas.onmouseleave = stopDrawing; // Stop drawing when mouse leaves the canvas
    drawingCanvas.onmouseout = clearIndicatorCanvas; // Clear indicator when mouse leaves the canvas
    drawingCanvas.onmouseenter = onMouseEnterCanvas;

    // Setup indicator canvas to have no events and ignore mouse events
    indicatorCanvasRef.current.style.pointerEvents = 'none';

    // Clean up function to remove event listeners
    return () => {
      drawingCanvas.onmousedown = null;
      drawingCanvas.onmousemove = null;
      drawingCanvas.onmouseup = null;
      drawingCanvas.onmouseleave = null;
      drawingCanvas.onmouseout = null;
    };
  }, [brushSize, isDrawing]);

  useEffect(() => {
    drawBrushIndicator(lastMouseCoordinates)
  }, [brushColor, brushSize]); // Only re-run the effect if brushColor changes
  // Styles for the canvas container and canvas elements
  const canvasContainerStyle = {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: 'white',

  };

  const canvasStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    border: '1px solid black',
    cursor: 'none',
  };

  return (
    <div style={canvasContainerStyle} onMouseMove={drawBrushIndicator} onMouseOut={clearIndicatorCanvas}>
      <canvas
        ref={drawingCanvasRef}
        width={width}
        height={height}
        style={canvasStyle}
      />
      <canvas
        ref={indicatorCanvasRef}
        width={width}
        height={height}
        style={{ ...canvasStyle, pointerEvents: 'none' }} // Ignore mouse events
      />
       <ColorBookImage style={{ ...canvasStyle, pointerEvents: 'none', zIndex: 0 }} width={width} height={height} imageUrl={imageUrl}></ColorBookImage>
    </div>
  );
};

export default ColorizeCanvas;