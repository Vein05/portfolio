import React, { useState } from 'react';

/**
 * Pantry — hand-drawn shelf with real pantry item images.
 * Each shelf has 2 planks × 3 items = 6 per shelf. Extra items get another shelf.
 * Items are shuffled and tilted for a messy lived-in kitchen feel.
 */

const ITEM_COUNT = 12;

// Predefined chaotic tilts — one "fallen over" at 45°
const TILTS = [-3, 5, -1, 8, -6, 2, -4, 45, 3, -7, 1, -2];
const Y_NUDGE = [0, -2, 3, 1, -3, 2, -1, 4, 0, -2, 3, -1];

// Seeded shuffle — consistent across renders
const seededShuffle = (arr) => {
  const shuffled = [...arr];
  let seed = 42;
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 16807) % 2147483647;
    const j = seed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Pantry = ({ ingredients = [], onTagClick, activeTag }) => {
  const [hoveredTag, setHoveredTag] = useState(null);

  if (!ingredients.length) return null;

  const shuffled = seededShuffle(ingredients);

  // Split into shelves of 6 (top plank 3 + bottom plank 3)
  const shelves = [];
  for (let i = 0; i < shuffled.length; i += 6) {
    const items = shuffled.slice(i, i + 6);
    shelves.push({
      topPlank: items.slice(0, 3),
      bottomPlank: items.slice(3, 6),
    });
  }

  const handleClick = (item) => {
    if (onTagClick) {
      onTagClick(item.tag);
    } else if (item.dishes && item.dishes.length > 0) {
      window.location.href = `/blog/${item.dishes[0].slug}`;
    }
  };

  const renderItem = (item, globalIdx) => {
    const isActive = activeTag === item.tag;
    const isHovered = hoveredTag === item.tag;
    const imgNum = (globalIdx % ITEM_COUNT) + 1;
    const tilt = TILTS[globalIdx % TILTS.length];
    const nudge = Y_NUDGE[globalIdx % Y_NUDGE.length];

    return (
      <button
        key={item.tag}
        type="button"
        className={`pantry-item ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
        style={{
          transform: `rotate(${tilt}deg)`,
          marginBottom: `${nudge}px`,
        }}
        onClick={() => handleClick(item)}
        onMouseEnter={() => setHoveredTag(item.tag)}
        onMouseLeave={() => setHoveredTag(null)}
        aria-label={item.tag}
      >
        <img
          src={`/images/kitchen-sprites/pantry-items/item-${String(imgNum).padStart(2, '0')}.png`}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          className="pantry-item-img"
        />
        {isHovered && (
          <span className="pantry-item-tooltip">
            {item.tag}
            {item.count != null && <span className="pantry-item-count">{item.count}</span>}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="pantry">
      <div className="pantry-header">
        <span className="pantry-title">Pantry</span>
      </div>
      {shelves.map((shelf, shelfIdx) => {
        const baseIdx = shelfIdx * 6;
        return (
          <div key={shelfIdx} className="pantry-shelf-unit">
            <img
              src="/images/kitchen-sprites/shelf.webp"
              alt=""
              className="pantry-shelf-img"
              loading="lazy"
            />
            <div className="pantry-plank pantry-plank-top">
              {shelf.topPlank.map((item, idx) => renderItem(item, baseIdx + idx))}
            </div>
            {shelf.bottomPlank.length > 0 && (
              <div className="pantry-plank pantry-plank-bottom">
                {shelf.bottomPlank.map((item, idx) => renderItem(item, baseIdx + 3 + idx))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Pantry;
