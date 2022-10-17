import React from 'react';

const NewVersionTooltip = ({ handleDismissTooltip }: { handleDismissTooltip: () => void }) => (
  <div
    className="u-positionFixed u-paddingSmall u-backgroundPrimary u-roundedMedium"
    style={{
      zIndex: '999999',
      bottom: '15px',
      left: '15px',
      display: 'inline-block',
      color: 'white',
    }}
    data-testid="new-version-tooltip"
  >
    <span className="u-text200 u-marginRightSmall" style={{ wordBreak: 'break-word' }}>
      A new version is available
    </span>
    <button
      type="button"
      className="u-backgroundPrimary u-textWhite u-text300 u-fontMedium u-marginLeftSmall u-marginRightSmall u-paddingNone u-borderNone u-cursorPointer"
      onClick={() => window.location.reload()}
      data-testid="tooltip-refresh-button"
    >
      REFRESH
    </button>
    <button
      type="button"
      className="u-backgroundPrimary u-textWhite u-marginLeftSmall u-paddingNone u-text200 u-borderNone u-cursorPointer"
      onClick={handleDismissTooltip}
      data-testid="tooltip-dismiss-button"
    >
      ✕
    </button>
  </div>
);

export default NewVersionTooltip;
