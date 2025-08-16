import React, { useState } from 'react';
import './GlassPillGroup.css';

interface GlassPillGroupProps {
  options: string[];
  onChange?: (value: string) => void;
}

const GlassPillGroup: React.FC<GlassPillGroupProps> = ({
  options,
  onChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    if (onChange) onChange(options[index]);
  };

  return (
    <div className="glass-pill-container">
      <div
        className="glass-pill-highlight"
        style={{
          width: `${100 / options.length}%`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((option, index) => (
        <button
          key={option}
          className={`glass-pill ${activeIndex === index ? 'active' : ''}`}
          onClick={() => handleClick(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default GlassPillGroup;
