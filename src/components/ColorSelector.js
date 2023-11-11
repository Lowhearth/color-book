// ColorSelector.js
import React from 'react';

const colors = [
'rgb(0, 0, 0)',
'rgb(255, 255, 255)',
  'rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)',
  'rgb(255, 255, 0)', 'rgb(0, 255, 255)', 'rgb(255, 0, 255)',
  'rgb(192, 192, 192)', 'rgb(128, 0, 0)', 'rgb(128, 128, 0)',
  'rgb(0, 128, 0)',
]; // Add more colors as needed

const ColorSelector = ({ selectedColor, onColorSelect }) => {
  const buttonStyle = (color) => ({
    backgroundColor: color,
    borderRadius: '50%', // Makes the button round
    width: color === selectedColor ? '40px': '30px' ,
    height: color === selectedColor ? '40px': '30px' ,
    display: 'inline-block',
    margin: '5px',
    border: color === selectedColor ? '1px solid grey' : '1px solid rgba(0,0,0,0.2)',
    boxShadow: color === selectedColor ? '0 0 5px 2px rgba(0,0,0,0.3)' : 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s', // Smooth transition for scale and shadow
  });

  return (
    <div style={{ padding: '10px', position: 'absolute', bottom: "25px" }}>
      {colors.map((color) => (
        <span
          key={color}
          onClick={() => onColorSelect(color)}
          style={buttonStyle(color)}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')} // Scales up the color circle on mouse enter
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')} // Scales back down on mouse leave
        />
      ))}
    </div>
  );
};

export default ColorSelector;