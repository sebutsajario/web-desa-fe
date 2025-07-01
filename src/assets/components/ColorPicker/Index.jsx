import React, { useEffect, useRef } from 'react';
import iro from '@jaames/iro';

const ColorPicker = (props) => {
    const {id, onChangeColor, selectedColor} = props;
  const pickerRef = useRef(null);
  const colorPickerRef = useRef(null); // to store the instance

  useEffect(() => {
    // Clear any previous content
    if (pickerRef.current) {
      pickerRef.current.innerHTML = '';
    }

    // Create the color picker
    colorPickerRef.current = new iro.ColorPicker(pickerRef.current, {
      width: 200,
      color: selectedColor,
    });

    const handleColorChange = (color) => {
        onChangeColor(id, color.hexString)
    };

    colorPickerRef.current.on('color:change', handleColorChange);

    return () => {
      // Clear listeners
      colorPickerRef.current.off('color:change', handleColorChange);
      // Optional: clear DOM if rerendering causes issues
      if (pickerRef.current) {
        pickerRef.current.innerHTML = '';
      }
    };
  }, [id]);

  useEffect(() => {
  const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(selectedColor);
  if (colorPickerRef.current && isValidHex && selectedColor !== colorPickerRef.current.color.hexString) {
    colorPickerRef.current.color.set(selectedColor);
  }
}, [selectedColor]);


  return (
    <div className='flex flex-row gap-x-2'>
        <div ref={pickerRef}></div>
    </div>
  );
};

export default ColorPicker;
