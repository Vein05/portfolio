import React, { useEffect, useState } from 'react';

const VALID_STATUSES = ['raw', 'cooking', 'plated', 'fermented'];
const FRAME_COUNT = 12;
const FRAME_MS = 200;

/**
 * Kitchen status sprite — renders hand-drawn PNG icons for the post state.
 *
 * Animations:
 *   raw       — 12-frame cracked egg sequence
 *   cooking   — 12-frame steam sequence
 *   plated    — 12-frame garnish sequence
 *   fermented — 12-frame bubble sequence
 */
const KitchenSprite = ({ status = 'plated', size = 30 }) => {
  const safeStatus = VALID_STATUSES.includes(status) ? status : 'plated';
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    setFrame(1);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const frameImages = Array.from({ length: FRAME_COUNT }, (_, index) => {
      const image = new Image();
      const paddedFrame = String(index + 1).padStart(2, '0');
      image.src = `/images/kitchen-sprites/${safeStatus}-frames/${safeStatus}-${paddedFrame}.webp`;
      return image;
    });

    const interval = window.setInterval(() => {
      setFrame((currentFrame) => (currentFrame % FRAME_COUNT) + 1);
    }, FRAME_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [safeStatus]);

  const paddedFrame = String(frame).padStart(2, '0');
  const imageSrc = `/images/kitchen-sprites/${safeStatus}-frames/${safeStatus}-${paddedFrame}.webp`;

  return (
    <div
      className={`kitchen-sprite kitchen-sprite--${safeStatus}`}
      style={{ width: size, height: size }}
      title={safeStatus}
      aria-label={`Status: ${safeStatus}`}
    >
      <img
        src={imageSrc}
        alt={`${safeStatus} icon`}
        width={size}
        height={size}
        loading="lazy"
      />
    </div>
  );
};

export default KitchenSprite;
