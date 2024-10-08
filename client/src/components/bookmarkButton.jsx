import React, { useState } from "react";

const BookmarkButton = () => {
  // State to track whether the item is bookmarked
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Toggle bookmark state
  const toggleBookmark = () => {
    setIsBookmarked((prevState) => !prevState);
  };

  return (
    <button
      onClick={toggleBookmark}
      style={{
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
      }}
    >
      {/* SVG Bookmark Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill={isBookmarked ? "gold" : "gray"} // Change color based on state
        className="bi bi-bookmark-fill"
        viewBox="0 0 16 16"
      >
        <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
      </svg>
    </button>
  );
};

export default BookmarkButton;
