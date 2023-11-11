// App.js
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import ColorizeCanvas from './components/ColorizeCanvas';
import ColorSelector from './components/ColorSelector';
import { generateImage } from './clients/gpt';

const WIDTH = 600;
const HEIGHT = 600;
const API_KEY = "";
function App() {
  const imageCanvas = useRef(null);
  const [brushSize, setBrushSize] = useState(40);
  const [imageUrl, setImageUrl] = useState(null);
  const [color, setColor] = useState('rgb(255, 0, 0)'); // Initial color

  const changeBrushSize = (event) => {
    setBrushSize((size) => Math.min(Math.max(size + event.deltaY * -0.05, 5), 100));
  };

  useEffect(() => {
    generateImage(API_KEY, (imageUrl, error) => {
      if (error) {
        console.error('Error fetching image:', error);
        return;
      }
      setImageUrl(imageUrl.data[0].url);
    });
  }, [setImageUrl]);

  console.log(imageUrl)
  return (
    <div className="App" onWheel={changeBrushSize}>
      <header className="App-header">
        {/* ... header content ... */}
      </header>
      <ColorSelector selectedColor={color} onColorSelect={setColor} />
      <ColorizeCanvas width={WIDTH} height={HEIGHT} brushSize={brushSize} brushColor={color} imageUrl={imageUrl}/>
      {/* ... other app content ... */}
    </div>
  );
}

export default App;