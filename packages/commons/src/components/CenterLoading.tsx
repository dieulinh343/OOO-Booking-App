import React from 'react';
import { Loader } from '@ahaui/react';

export function CenterLoading ({
  hideText,
  text,
  duration,
  size = 'large',
}: {
  hideText: boolean;
  text: string;
  duration: number;
  size?: string;
}) {
  return (
    <div className="u-positionAbsolute u-positionFull u-flex u-alignContentCenter u-justifyContentCenter">
      <div className="u-flex u-alignItemsCenter u-justifyContentCenter u-flexColumn">
        <div className="u-flexShrink-0">
          <Loader size={size} duration={duration} />
        </div>
        {!hideText && <div className="u-textLight u-marginTopMedium">{text || 'The system is processing. Please wait…'}</div>}
      </div>
    </div>
  );
}

export default CenterLoading;
