import React, { useRef, useEffect } from 'react';

const ColorBookImage = ({ imageUrl, width, height, style }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Only attempt to draw the image if the canvas and image URL are available
        if (canvasRef.current && imageUrl) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const img = new Image();
            img.crossOrigin = "Anonymous";
            // Set up the onload function to draw the image once it's loaded
            img.onload = () => {
                // Clear the canvas and draw the image

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i] > 100 && data[i + 1] > 100 && data[i + 2] > 100) {
                        data[i + 3] = 0;
                    } else {
                        data[i] = 0
                        data[i + 1] = 0
                        data[i + 2] = 0
                    }
                }
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.putImageData(imageData, 0, 0);

            };

            // Set the CORS policy for the image
            // If you're not encountering CORS errors, you can comment out this line


            img.onerror = () => {
                console.error('The image could not be loaded.');
            };

            // Set the source of the image to the provided URL
            img.src = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;
        }
    }, [imageUrl]); // This effect should re-run if the imageUrl changes

    return <canvas style={style} ref={canvasRef} width={width} height={height} />;
};

export default ColorBookImage;