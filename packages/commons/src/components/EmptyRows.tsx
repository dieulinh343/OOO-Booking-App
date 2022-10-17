import React from 'react';
import { Skeleton } from '@ahaui/react';

interface EmptyRowsProps {
  numberOfCols: number;
  numberOfRows: number;
}

export const EmptyRows = ({ numberOfCols, numberOfRows }: EmptyRowsProps): JSX.Element => {
  const cols = Array.from(Array(numberOfCols).keys());
  const rows = Array.from(Array(numberOfRows).keys());

  return (
    <>
      {rows.map(row => (
        <tr key={row}>
          {cols.map(col => (
            <td key={col}><Skeleton width="50%" /></td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default React.memo<EmptyRowsProps>(EmptyRows);
