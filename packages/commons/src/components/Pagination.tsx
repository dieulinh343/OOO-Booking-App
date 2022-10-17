import React from 'react';
import { Pagination as PaginationUI } from '@ahaui/react';

interface PaginationProps {
  currentPage: number;
  disabled?: boolean;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemsEachSide?: number;
}

class Pagination extends React.Component<PaginationProps> {
  renderNextButton = (nextDisabled: boolean, handleNextClick: (e: Event) => void) => (
    <PaginationUI.Next
      id="pagination-next"
      disabled={nextDisabled}
      onClick={handleNextClick}
    />
  )

  renderPrevButton = (previousDisabled: boolean, handlePreviousClick: (e: Event) => void) => (
    <PaginationUI.Prev
      id="pagination-prev"
      disabled={previousDisabled}
      onClick={handlePreviousClick}
    />
  )

  renderPage = (page: number, content: unknown, handlePageClick: (page: number) => void, invalidPage = false) => {
    const { currentPage, disabled } = this.props;
    const active = (currentPage === page) && !invalidPage;
    return (
      <PaginationUI.Item
        active={active}
        onClick={
          (!active && handlePageClick)
            ? () => handlePageClick(page)
            : undefined
        }
        page={page}
        key={page}
        disabled={disabled}
      >
        {content}
      </PaginationUI.Item>
    );
  }

  renderEllipsis = (key: number) => <PaginationUI.Ellipsis key={`elipsis-${key}`} />

  render() {
    const { totalItems, itemsPerPage, currentPage: propCurrentPage, onPageChange, disabled, itemsEachSide: propItemsEachSide } = this.props;

    let currentPage = propCurrentPage;
    const firstPage = 1;
    const numberOfPage = Math.ceil(totalItems / itemsPerPage);
    // If the current page is out-of-range, render the pagination same as page 1,
    // but do not let page 1 active, and disable 2 navigation buttons
    const invalidPage = (currentPage < firstPage) || (currentPage > numberOfPage);
    const previousDisabled = currentPage === firstPage || invalidPage || disabled;
    const nextDisabled = currentPage === numberOfPage || invalidPage || disabled;
    if (invalidPage) {
      currentPage = firstPage;
    }
    Object.freeze(currentPage);

    const handlePageClick = (page: string | number) => {
      onPageChange(typeof page === 'number' ? page : parseInt(page));
    };

    const handlePreviousClick = (e: Event) => {
      e.preventDefault();
      if (previousDisabled) {
        return;
      }
      onPageChange(currentPage - 1);
    };

    const handleNextClick = (e: Event) => {
      e.preventDefault();
      if (nextDisabled) {
        return;
      }
      onPageChange(currentPage + 1);
    };

    const intialized = this.renderPage(currentPage, currentPage, handlePageClick, invalidPage);
    const pages = [intialized];

    let left = currentPage;
    let right = currentPage;
    // Calculate the remaining items that need to be rendered to the left/right side of current page
    // With itemsEachSide = 3: (itemsEachSide can be customable from props in specific case if needed, but must be >= 2)
    // --> Max to total items is 7 (including ellipsis)
    //
    // E.g 1: <  1  (2)  3   4   5  ...  20  >
    //           1   2   3   4   5   6   7   (items)
    // - spacesLeft    = 1, spacesRight    = 18
    // - missingLeft   = 2, missingRight   = 0
    // - remainingLeft = 1, remainingRight = 5
    //
    // E.g 2: <  1  ...  8  (9)  10 ...  20  >
    //           1   3   3   4   5   6   7   (items)
    //
    // remainingLeft/remainingRight must not exceed the spacesLeft/spacesRight
    // E.g 3: <  1  (2)  3   4  >
    // - spacesLeft    = 1, spacesRight    = 2
    // - missingLeft   = 2, missingRight   = 1
    // - remainingLeft = 1, remainingRight = 2
    //
    const itemsEachSide = propItemsEachSide || 3;
    const spacesLeft = Math.max(0, currentPage - firstPage);
    const spacesRight = Math.max(0, numberOfPage - currentPage);
    const missingLeft = Math.max(0, itemsEachSide - spacesLeft);
    const missingRight = Math.max(0, itemsEachSide - spacesRight);
    let remainingLeft = Math.min(spacesLeft, itemsEachSide - missingLeft + missingRight);
    let remainingRight = Math.min(spacesRight, itemsEachSide - missingRight + missingLeft);

    while (left > firstPage || right < numberOfPage) {
      if (remainingLeft > 0) {
        if (left > firstPage) {
          left -= 1;
          remainingLeft -= 1;
          if (remainingLeft === 1 && left > (firstPage + 1)) {
            pages.unshift(this.renderEllipsis(left));
          } else if (remainingLeft === 0) {
            left = firstPage;
            pages.unshift(this.renderPage(left, left, handlePageClick));
          } else {
            pages.unshift(this.renderPage(left, left, handlePageClick));
          }
        }
      }
      if (remainingRight > 0) {
        if (right < numberOfPage) {
          right += 1;
          remainingRight -= 1;
          if (remainingRight === 1 && right < (numberOfPage - 1)) {
            pages.push(this.renderEllipsis(right));
          } else if (remainingRight === 0) {
            right = numberOfPage;
            pages.push(this.renderPage(right, right, handlePageClick));
          } else {
            pages.push(this.renderPage(right, right, handlePageClick));
          }
        }
      }
    }

    return (
      <div className="u-flex u-justifyContentCenter" id="pagination">
        <PaginationUI>
          {this.renderPrevButton(!!previousDisabled, handlePreviousClick)}
          {pages}
          {this.renderNextButton(!!nextDisabled, handleNextClick)}
        </PaginationUI>
      </div>
    );
  }
}

export default Pagination;
