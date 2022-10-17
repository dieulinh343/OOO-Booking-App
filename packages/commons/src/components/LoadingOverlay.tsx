
import React from 'react';
import CenterLoading from './CenterLoading';

export function LoadingOverlay({
  text,
  spinnerSize,
}: {
  text: string;
  spinnerSize: string;
}) {
  return (
    <div className="u-positionAbsolute u-positionFull u-zIndex3">
      <div className="u-positionAbsolute u-positionFull u-backgroundWhite u-opacityThreeQuarter" />
      <CenterLoading
        text={text}
        hideText={!text}
        duration={1500}
        size={spinnerSize}
      />
    </div>
  );
}

export default LoadingOverlay;
