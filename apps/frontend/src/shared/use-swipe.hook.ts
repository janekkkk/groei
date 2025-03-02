import { TouchEvent, useState } from "react";

interface SwipeInput {
  onSwipedLeft: () => void;
  onSwipedRight: () => void;
}

interface SwipeOutput {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
}

/**
 * Source: https://stackoverflow.com/a/75060088
 * import useSwipe from "whatever-path/useSwipe";
 * const swipeHandlers = useSwipe({ onSwipedLeft: () => console.log('left'), onSwipedRight: () => console.log('right') });
 * <div {...swipeHandlers}>some swipeable div (or whatever html tag)</div>
 * @param input - the input object with the callbacks for left and right swipe
 * @param leftSwipeThresholdPercentage - the percentage of the screen width from the left side where the swipe should be detected, for instance for menu bar only opening on left 10% of the screen.
 */
export const useSwipe = (
  input: SwipeInput,
  leftSwipeThresholdPercentage?: number,
  rightSwipeThresholdPercentage?: number,
): SwipeOutput => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(0); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const screenWidth = window.innerWidth;

    console.log({ isLeftSwipe, isRightSwipe });

    if (rightSwipeThresholdPercentage && isRightSwipe) {
      const rightThreshold =
        screenWidth * (rightSwipeThresholdPercentage / 100);
      if (touchStart <= rightThreshold) {
        input.onSwipedRight();
      }
    } else if (leftSwipeThresholdPercentage && isLeftSwipe) {
      const leftThreshold = screenWidth * (leftSwipeThresholdPercentage / 100);
      if (touchStart >= leftThreshold) {
        input.onSwipedLeft();
      }
    } else {
      if (isLeftSwipe) {
        input.onSwipedLeft();
      }
      if (isRightSwipe) {
        input.onSwipedRight();
      }
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
