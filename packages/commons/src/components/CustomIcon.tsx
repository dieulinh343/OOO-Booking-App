import React from 'react';
import classNames from 'classnames';

type SizeName = 'tiny' | 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge' | 'extraLargePlus' | 'huge';

const sizes: Record<SizeName, number> = {
  tiny: 12,
  extraSmall: 16,
  small: 24,
  medium: 32,
  large: 48,
  extraLarge: 64,
  extraLargePlus: 96,
  huge: 128,
};

const styles = {
  svg: {
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  path: {
    fill: 'currentColor',
  },
};

const CustomIcon = React.forwardRef(({
  className,
  size = 'small',
  content,
  style,
  ...props
}: {
  className: string;
  size: SizeName;
  name: string;
  content: string;
  style: any,
}, ref: any) => (
  <svg
    ref={ref}
    {...props}
    style={{ ...styles.svg, ...style }}
    width={`${sizes[size]}px`}
    height={`${sizes[size]}px`}
    className={classNames(
      className && className,
    )}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      style={styles.path}
      d={content}
    />
  </svg>
));


CustomIcon.displayName = 'CustomIcon';
export default CustomIcon;
