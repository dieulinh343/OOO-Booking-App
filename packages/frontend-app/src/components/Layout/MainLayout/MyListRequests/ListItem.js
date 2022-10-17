import React from 'react';
import { Button, Overlay, Tooltip } from '@ahaui/react';
import moment from 'moment';
import { RequestStatus } from 'constants/request';

function Status({ color, text }) {
  return (
    <div
      className="u-flex u-alignItemsCenter"
      style={{
        color,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: 6,
          background: color,
          marginRight: 8,
        }}
      />
      {text}
    </div>
  );
}


export default function ListItem({ item, onCancel }) {
  return (
    <tr
      style={{
        color: item.status === RequestStatus.CANCELLED ? '#97A0AF' : '#172B4D',
      }}
      className="u-text200"
    >
      <td style={{ width: '95px' }}>
        {moment(item.startDate).format('MM/DD/YYYY')}
      </td>
      <td style={{ width: '95px' }}>
        {moment(item.endDate).format('MM/DD/YYYY')}
      </td>
      <td style={{ width: '150px' }}>
        {/* Status */}
        {item.status === RequestStatus.APPROVAL_WAITING && (
          <Status color="#FF991F" text="Approval waiting" />
        )}
        {item.status === RequestStatus.APPROVED && (
          <Status color="#22A861" text="Approved" />
        )}
        {item.status === RequestStatus.REJECTED && (
          <Status color="#D0021B" text="Rejected" />
        )}
        {item.status === RequestStatus.CANCELLED && (
          <Status color="#97A0AF" text="Cancelled" />
        )}
        {/* Reject reason */}
        {item.status === RequestStatus.REJECTED && (
          <Overlay.Trigger
            key="top"
            placement="top"
            overlay={(props) => (
              <Tooltip
                className="u-textWordBreak u-TextTruncate"
                id="tooltip-reject-reason"
                {...props}
              >
                {`Reason: ${item.rejectReason}`}
              </Tooltip>
            )}
          >
            <div
              className="u-textTruncate u-textLight"
              style={{
                maxWidth: 150,
              }}
            >
              {item.rejectReason}
            </div>
          </Overlay.Trigger>
        )}
      </td>
      <td className="u-textWordBreak">{item.purpose}</td>
      <td>
        <Button
          variant="primary_outline"
          size="small"
          onClick={onCancel}
          disabled={
            item.status === RequestStatus.CANCELLED
            || item.status === RequestStatus.APPROVED
          }
        >
          <Button.Label>Cancel</Button.Label>
        </Button>
      </td>
    </tr>
  );
}
