import React, { useRef, useState, useCallback, useLayoutEffect, useEffect } from 'react';
import { Icon } from '@ahaui/react';
import classNames from 'classnames';
import { useHandleClickOutside, useEventListener } from '../hooks';
import { Key } from '../constants/common';

const Option = ({
  option,
  isSelected,
  onClick,
}: {
  option: {
    name: string,
    id: string | number,
  };
  isSelected: boolean;
  onClick: (id: string | number) => void;
}) => (
  <div
    data-name="option"
    data-testid="dropdown-option"
    className={classNames(
      'u-paddingHorizontalSmall  u-paddingVerticalExtraSmall u-cursorPointer u-textWordBreakAll hover:u-backgroundLightest',
      isSelected && 'u-backgroundLightest',
    )}
    onClick={() => {
      onClick(option.id);
    }}
  >
    {option.name}
  </div>
);

export default function DropdownSelect({
  onSelected,
  options = [],
  idOptionSelected,
  style,
  className,
  inputStyle,
  isInvalid,
  error,
  ...rest
}: {
  onSelected: (id: string | number) => void;
  options: {
    name: string,
    id: string | number,
  }[];
  idOptionSelected?: string | number;
  style?: React.CSSProperties;
  className?: string;
  inputStyle?: React.CSSProperties;
  isInvalid?: boolean;
  error?: string;
  rest?: object;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSelected, setCurrentSelected] = useState(() => options.findIndex(option => option.id === idOptionSelected));
  const dropDownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onClick = useCallback(
    (id) => {
      if (id !== idOptionSelected) {
        onSelected(id);
      }
      setIsOpen(false);
    },
    [idOptionSelected, onSelected],
  );

  useHandleClickOutside([dropDownRef, containerRef], () => {
    setIsOpen(false);
  });

  useEventListener('keydown', (e) => {
    if (isOpen) {
      const { keyCode } = e;
      e.preventDefault();
      if (keyCode === Key.DOWN) {
        if (currentSelected === options.length - 1) {
          setCurrentSelected(0);
        } else {
          setCurrentSelected(pre => pre + 1);
        }
      }

      if (keyCode === Key.UP) {
        if (currentSelected === 0) {
          setCurrentSelected(options.length - 1);
        } else {
          setCurrentSelected(pre => pre - 1);
        }
      }

      if (keyCode === Key.ENTER) {
        if (options[currentSelected].id !== idOptionSelected) {
          onSelected(options[currentSelected].id);
        }
        setIsOpen(false);
      }
    }
  });

  useLayoutEffect(() => {
    if (isOpen === true && dropDownRef.current) {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      };

      const callback: IntersectionObserverCallback = (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && dropDownRef.current) {
            dropDownRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          }
        });
      };

      const observer = new IntersectionObserver(callback, options);
      observer.observe(dropDownRef.current);
      return () => {
        observer.disconnect();
      };
    }

    return () => {};
  }, [isOpen]);

  useEffect(() => {
    const index = options.findIndex(option => option.id === idOptionSelected);
    setCurrentSelected(index);
  }, [idOptionSelected, options]);

  return (
    <div
      ref={containerRef}
      className={`u-positionRelative ${className || ''}`}
      style={style}
      {...rest}
    >
      <div
        className={classNames('FormInput FormInput--select u-positionRelative u-flex u-overflowHidden u-cursorPointer u-alignItemsCenter', { 'is-invalid': isInvalid && error })}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        data-testid="input-selected"
        style={inputStyle}
      >
        <div
          className="FormInput-select u-widthFull u-borderNone u-backgroundTransparent u-marginLeftNone u-marginVerticalNone u-cursorPointer u-textTruncate"
          data-testid="value-selected"
        >
          {options[currentSelected]?.name}
        </div>
        <div className="u-paddingVerticalTiny u-marginLeftTiny u-marginRightExtraSmall u-positionAbsolute u-positionRight u-pointerEventsNone u-paddingHorizontalExtraSmall">
          <Icon size="tiny" name="arrowDown" className={classNames({ 'u-rotate180': isOpen })} />
        </div>
      </div>

      {!isOpen && (
      <div className="u-marginTopTiny u-widthFull u-text100 invalid-feedback" data-testid="dropdown-error">
        {error}
      </div>
      )}

      {isOpen && (
        <div
          ref={dropDownRef}
          className="u-zIndexDropdownContainer u-backgroundWhite u-roundedMedium u-shadowMedium u-textLeft u-marginVerticalTiny u-paddingVerticalExtraSmall u-widthFull u-overflowVerticalAuto u-webkitScrollbar u-positionAbsolute"
          style={{
            maxHeight: 140,
          }}
          data-testid="dropdown-selected"
        >
          {options.map((option, index) => (
            <Option
              key={option.id}
              option={option}
              onClick={onClick}
              isSelected={currentSelected === index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
