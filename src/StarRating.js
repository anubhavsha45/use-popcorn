import { useState } from "react";

export default function StarRating({
  maxRating = 5,
  size = 48,
  color = "#fcc419",
  messages = [],
  defaultRating = 0,
  onSetRating = () => {},
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  const textStyle = {
    margin: 0,
    fontSize: `${size / 1.5}px`,
    color,
  };

  function handleRate(r) {
    setRating(r);
    onSetRating(r);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            index={i + 1}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onRate={handleRate}
            onHoverIn={setTempRating}
            onHoverOut={setTempRating}
            color={color}
            size={size}
          />
        ))}
      </div>

      {/* show message or rating number */}
      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}

function Star({ index, full, onRate, onHoverIn, onHoverOut, size, color }) {
  return (
    <span
      role="button"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "block",
        cursor: "pointer",
      }}
      onClick={() => onRate(index)}
      onMouseEnter={() => onHoverIn(index)}
      onMouseLeave={() => onHoverOut(0)}
    >
      {full ? (
        // FULL STAR
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 
          1.902 0l1.07 3.292a1 1 0 
          00.95.69h3.462c.969 0 1.371 
          1.24.588 1.81l-2.8 2.034a1 1 
          0 00-.364 1.118l1.07 3.292c.3.921
          -.755 1.688-1.54 1.118l-2.8-2.034a1 
          1 0 00-1.175 0l-2.8 2.034c-.784.57
          -1.838-.197-1.539-1.118l1.07-3.292a1 
          1 0 00-.364-1.118L2.98 8.72c-.783-.57
          -.38-1.81.588-1.81h3.461a1 1 0 
          00.951-.69l1.07-3.292z"
          />
        </svg>
      ) : (
        // EMPTY STAR
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.049 2.927c.3-.921 1.603-.921 
            1.902 0l1.07 3.292a1 1 0 
            00.95.69h3.462c.969 0 1.371 
            1.24.588 1.81l-2.8 2.034a1 1 
            0 00-.364 1.118l1.07 3.292c.3.921
            -.755 1.688-1.54 1.118l-2.8-2.034a1 
            1 0 00-1.175 0l-2.8 2.034c-.784.57
            -1.838-.197-1.539-1.118l1.07-3.292a1 
            1 0 00-.364-1.118L2.98 8.72c-.783-.57
            -.38-1.81.588-1.81h3.461a1 1 0 
            00.951-.69l1.07-3.292z"
          />
        </svg>
      )}
    </span>
  );
}
