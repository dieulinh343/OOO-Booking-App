import React from 'react';
import { Modal, Button, Separator } from '@ahaui/react';

export const FooterType = {
  SINGLE: 'single',
  DOUBLE: 'double',
  FULL_WIDTH_DOUBLE: 'full-width-double',
  VERTICAL_DOUBLE: 'vertical-double',
  BETWEEN_DOUBLE: 'between-double',
  SINGLE_RIGHT: 'single-right',
} as const;

const renderFooterInfo = (footerInfo: React.ReactNode) => (
  footerInfo && (
    <>
      <Separator variant="lighter" className="u-marginVerticalSmall" />
      {footerInfo}
    </>
  )
);

interface RenderButtonsProps {
  footerType?: string;
  primaryButtonText?: string;
  primaryButtonVariant?: string;
  secondaryButtonText?: string;
  secondaryButtonVariant?: string;
  onClickPrimaryButton?: () => void;
  onClickSecondaryButton?: () => void;
  disablePrimaryButton?: boolean;
  disableSecondaryButton?: boolean;
  primaryButtonProps?: any;
  secondaryButtonProps?: any;
}

// DS modal props (TODO: use types from Aha)
export interface AhaModalProps {
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  relative?: boolean;
  centered?: boolean;
  show?: boolean;
  onHide?: () => void;
}

// Base modal props
export interface BaseModalProps extends Partial<AhaModalProps> {
  id: string;
  header?: React.ReactNode;
  headerText?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  primaryButtonText?: string;
  onClickPrimaryButton?: () => any;
  secondaryButtonText?: React.ReactNode;
  onClickSecondaryButton?: () => any;
  footerType?: 'single' | 'double' | 'full-width-double' | 'vertical-double' | 'between-double' | 'single-right';
  onHide?: () => void;
  closable?: boolean;
  disablePrimaryButton?: boolean;
  disableSecondaryButton?: boolean;
  showFooter?: boolean;
  showHeader?: boolean;
  // TODO: should import variants from Aha
  primaryButtonVariant?: string;
  secondaryButtonVariant?: string;
  footerInfo?: React.ReactNode;
  primaryButtonProps?: any;
  secondaryButtonProps?: any;
}

const renderButtons = (props: RenderButtonsProps): React.ReactNode | null => {
  const {
    footerType,
    primaryButtonText,
    primaryButtonVariant,
    secondaryButtonText,
    secondaryButtonVariant,
    onClickPrimaryButton,
    onClickSecondaryButton,
    disablePrimaryButton,
    disableSecondaryButton,
    primaryButtonProps,
    secondaryButtonProps,
  } = props;

  const renderPrimaryButton = (customProps?: any): React.ReactNode => (
    <Button
      data-testid="modal-primary-btn"
      variant={primaryButtonVariant}
      onClick={onClickPrimaryButton}
      disabled={disablePrimaryButton}
      {...customProps}
      {...primaryButtonProps}
    >
      {primaryButtonText}
    </Button>
  );

  const renderSecondaryButton = (customProps?: any): React.ReactNode => (
    <Button
      data-testid="modal-secondary-btn"
      variant={secondaryButtonVariant}
      onClick={onClickSecondaryButton}
      disabled={disableSecondaryButton}
      {...customProps}
      {...secondaryButtonProps}
    >
      {secondaryButtonText}
    </Button>
  );

  switch (footerType) {
    case FooterType.SINGLE: {
      return renderPrimaryButton({ width: 'full' });
    }

    case FooterType.DOUBLE: {
      return (
        <div className="u-flex u-flexGrow-1 u-justifyContentEnd">
          {renderSecondaryButton()}
          <div style={{ marginRight: '1rem' }} />
          {renderPrimaryButton()}
        </div>
      );
    }

    case FooterType.FULL_WIDTH_DOUBLE: {
      return (
        <div className="u-flex u-flexGrow-1 u-justifyContentEnd">
          {renderSecondaryButton({ className: 'u-flexGrow1' })}
          <div style={{ marginRight: '1rem' }} />
          {renderPrimaryButton({ className: 'u-flexGrow1' })}
        </div>
      );
    }

    case FooterType.VERTICAL_DOUBLE: {
      return (
        <>
          {renderSecondaryButton({ width: 'full' })}
          {renderPrimaryButton({ width: 'full' })}
        </>
      );
    }

    case FooterType.BETWEEN_DOUBLE: {
      return (
        <div className="u-flex u-flexGrow-1 u-justifyContentBetween">
          {renderSecondaryButton()}
          {renderPrimaryButton()}
        </div>
      );
    }

    case FooterType.SINGLE_RIGHT: {
      return (
        <div className="u-flex u-flexGrow-1 u-justifyContentEnd">
          {renderPrimaryButton()}
        </div>
      );
    }

    default: {
      return null;
    }
  }
};

const renderFooter = (props: any) => {
  const { footerInfo } = props;

  return (
    <div className="u-flexGrow-1 u-flex u-flexColumn">
      {renderButtons(props)}
      {renderFooterInfo(footerInfo)}
    </div>
  );
};

function BaseModal(props: BaseModalProps) {
  const {
    header,
    headerText,
    body,
    footer,
    children,
    onHide,
    closable,
    showFooter,
    showHeader,
    ...rest
  } = props;

  return (
    <Modal
      {...rest}
      show
      onHide={onHide}
    >
      {children || (
        <>
          {showHeader && (
            <Modal.Header closeButton={closable}>
              {header || (
                <Modal.Title>
                  {headerText}
                </Modal.Title>
              )}
            </Modal.Header>
          )}

          <Modal.Body>
            {body}
          </Modal.Body>

          {showFooter && (
            <Modal.Footer>
              {footer || renderFooter(props)}
            </Modal.Footer>
          )}
        </>
      )}
    </Modal>
  );
}

BaseModal.defaultProps = {
  footerType: FooterType.SINGLE,
  closable: true,
  showFooter: true,
  showHeader: true,
  primaryButtonVariant: 'primary',
  secondaryButtonVariant: 'secondary',
};

export default BaseModal;
