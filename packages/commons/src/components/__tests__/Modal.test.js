import React from 'react';
import { render } from '@testing-library/react';

import Modal, { FooterType } from '../Modal';

const props = {
  headerText: 'Header',
  body: 'SomeBodyText',
  primaryButtonText: 'PrimaryButton',
  secondaryButtonText: 'SecondaryButton',
  onHide: () => { },
  showFooter: true,
  showHeader: true,
};

describe('components/Modal', () => {
  let rendered;

  const renderWithProps = (customProps) => {
    const allProps = {
      ...props,
      ...customProps,
    };
    rendered = render(<Modal {...allProps} />);
  };

  it('should render header', () => {
    renderWithProps();

    const header = rendered.getByText(/Header/i);
    expect(header).toBeInTheDocument();
  });

  it('should render body', () => {
    renderWithProps();

    const body = rendered.queryByText(/SomeBodyText/i);
    expect(body).toBeInTheDocument();
  });

  it('should render footer if footer prop is specified', () => {
    renderWithProps({ footer: 'SomeFooterText' });

    const footer = rendered.queryByText(/SomeFooterText/i);
    expect(footer).toBeInTheDocument();
  });

  it('should render with footerType="single" by default', () => {
    renderWithProps();

    const primaryButton = rendered.getByText(/PrimaryButton/i);
    expect(primaryButton).toBeInTheDocument();

    const secondaryButton = rendered.queryByText(/SecondaryButton/i);
    expect(secondaryButton).not.toBeInTheDocument();
  });

  it('should render only one button with footerType="single-right"', () => {
    renderWithProps({ footerType: FooterType.SINGLE_RIGHT });

    const primaryButton = rendered.getByText(/PrimaryButton/i);
    expect(primaryButton).toBeInTheDocument();

    const secondaryButton = rendered.queryByText(/SecondaryButton/i);
    expect(secondaryButton).not.toBeInTheDocument();
  });

  it('should render 2 buttons with footerType="double"', () => {
    renderWithProps({ footerType: FooterType.DOUBLE });

    const primaryButton = rendered.getByText(/PrimaryButton/i);
    expect(primaryButton).toBeInTheDocument();

    const secondaryButton = rendered.queryByText(/SecondaryButton/i);
    expect(secondaryButton).toBeInTheDocument();
  });

  it('should render 2 buttons with footerType="vertical-double"', () => {
    renderWithProps({ footerType: FooterType.VERTICAL_DOUBLE });

    const primaryButton = rendered.getByText(/PrimaryButton/i);
    expect(primaryButton).toBeInTheDocument();

    const secondaryButton = rendered.queryByText(/SecondaryButton/i);
    expect(secondaryButton).toBeInTheDocument();
  });

  it('should render 2 buttons with footerType="between-double"', () => {
    renderWithProps({ footerType: FooterType.BETWEEN_DOUBLE });

    const primaryButton = rendered.getByText(/PrimaryButton/i);
    expect(primaryButton).toBeInTheDocument();

    const secondaryButton = rendered.queryByText(/SecondaryButton/i);
    expect(secondaryButton).toBeInTheDocument();
  });

  it('should render with no button if footerType is provided with null', () => {
    renderWithProps({ footerType: null });

    const primaryButton = rendered.queryByText(/PrimaryButton/i);
    expect(primaryButton).not.toBeInTheDocument();

    const secondaryButton = rendered.queryByText(/SecondaryButton/i);
    expect(secondaryButton).not.toBeInTheDocument();
  });

  it('should render footerInfo if provided', () => {
    renderWithProps({ footerInfo: (
      <div className="u-flexGrow-1 u-flex u-justifyContentCenter u-alignItemsCenter u-text200 u-textGray">
        <span>Don't have an account?</span>
      </div>
    ) });
    const footerInfo = rendered.getByText(/Don't have an account?/i);
    expect(footerInfo).toBeInTheDocument();
  });
});
