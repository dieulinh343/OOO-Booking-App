import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';

function DropFileContainer({
  onDropFile,
  children,
  acceptMIMETypes,
  multiple = false,
  disabled,
  className = 'u-roundedMedium u-border u-borderDashed u-borderSmall u-paddingMedium u-flex u-justifyContentCenter',
}: {
  onDropFile: (files: File[]) => void;
  children: React.ReactNode;
  acceptMIMETypes?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const dragCounter = useRef(0);
  const dropRef = useRef<HTMLInputElement>(null);
  const acceptMIMETypesList = useMemo(() => {
    if (!acceptMIMETypes) return [];
    return acceptMIMETypes.split(',');
  }, [acceptMIMETypes]);

  const handleDrag = useCallback((e) => {
    if (disabled) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
  }, [disabled]);

  const checkFiles = useCallback((files: File[]) => {
    if (acceptMIMETypesList.length === 0) return false;
    let isInvalid = false;
    files.forEach((file) => {
      if (!acceptMIMETypesList.includes(file.type)) {
        isInvalid = true;
      }
    });
    return isInvalid;
  }, [acceptMIMETypesList]);

  const handleDragIn = useCallback((e) => {
    if (disabled) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      let isInvalid;
      if (multiple) {
        isInvalid = checkFiles([...e.dataTransfer.items]);
      } else {
        isInvalid = checkFiles([e.dataTransfer.items[0]]);
      }
      setInvalid(isInvalid);
      setDragging(true);
    }
  }, [disabled, multiple, checkFiles]);

  const handleDragOut = useCallback((e) => {
    if (disabled) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragging(false);
      setInvalid(false);
    }
  }, [disabled]);

  const handleDrop = useCallback((e) => {
    if (disabled) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    setInvalid(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      let isInvalid;
      if (multiple) {
        isInvalid = checkFiles([...e.dataTransfer.files]);
      } else {
        isInvalid = checkFiles([e.dataTransfer.files[0]]);
      }
      if (!isInvalid) {
        onDropFile(e.dataTransfer.files);
      }
      e.dataTransfer.clearData();
      dragCounter.current = 0;
    }
  }, [disabled, multiple, checkFiles, onDropFile]);

  useEffect(() => {
    const div = dropRef.current;
    if (div) {
      div.addEventListener('dragenter', handleDragIn);
      div.addEventListener('dragleave', handleDragOut);
      div.addEventListener('dragover', handleDrag);
      div.addEventListener('drop', handleDrop);
      return () => {
        div.removeEventListener('dragenter', handleDragIn);
        div.removeEventListener('dragleave', handleDragOut);
        div.removeEventListener('dragover', handleDrag);
        div.removeEventListener('drop', handleDrop);
      };
    }

    return () => {};
  }, [handleDragIn, handleDragOut, handleDrag, handleDrop]);

  return (
    <div
      className={classNames(
        className,
        !dragging && 'u-backgroundWhite',
        dragging && !invalid && 'u-borderPrimary u-backgroundPrimaryLight',
        dragging && invalid && 'u-borderNegative u-backgroundNegativeLight',
      )}
      ref={dropRef}
    >
      {children}
    </div>
  );
}

export default DropFileContainer;
