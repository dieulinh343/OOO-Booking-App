import React from 'react';
import { Button, Overlay, Tooltip, Avatar } from '@ahaui/react';
import moment from 'moment';
import { formatter } from '@ooo-booking/commons/utils';



function Status({
  color,
  text,
}) {
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


export default function ListItem({ item, onApprove, onReject }) {
  return (
    <tr
      key={item.id}
      style={{
        color: item.status === 'cancelled' ? '#97A0AF' : '#172B4D',

      }}
    >
      <td style={{ width: '95px' }}>{moment(item.startDate).format('MM/DD/YYYY')}</td>
      <td style={{ width: '95px' }}>{moment(item.endDate).format('MM/DD/YYYY')}</td>
      <td style={{ display: 'flex', gap: '7px' }}>
        <Avatar size="small" className="u-backgroundPrimaryLight u-text200 u-flexRow u-flex" text={formatter.getShortName(item.user.name)} />
        <span>{item.user.name}</span>
      </td>
      <td
        className="u-textWordBreak"
        style={{
          maxWidth: 250,
        }}
      >
        {item.purpose}
      </td>
      <td style={{ width: '150px' }}>
        {item.status === 'approval_waiting' && <Status color="#FF991F" text="Approval waiting" />}
        {item.status === 'approved' && <Status color="#22A861" text="Approved" />}
        {item.status === 'rejected' && <Status color="#D0021B" text="Rejected" />}
        {item.status === 'cancelled' && (
          <Status color="#97A0AF" text="Cancelled" />
        )}
        {item.status === 'rejected' && (
          <Overlay.Trigger
            key="top"
            placement="top"
            overlay={props => (
              <Tooltip id="tooltip-top-long" {...props} className="u-textWordBreak u-TextTruncate">
                {`Reason: ${item.rejectReason}`}
              </Tooltip>
            )}
          >
            <div
              className="u-textTruncate"
              style={{
                maxWidth: 150,
                color: '#97A0AF',
              }}
            >
              {item.rejectReason}
            </div>
          </Overlay.Trigger>
        )}
      </td>
      <td
        style={
          {
            width: '250px',
          }
      }
      >
        <Button
          style={{ width: '76 px' }}
          variant="positive_outline"
          size="small"
          onClick={onApprove}
          disabled={item.status !== 'approval_waiting'}
        >
          <Button.Label>Approve</Button.Label>
        </Button>
        <Button
          style={{ width: '76px' }}
          className="u-marginLeftLarge"
          variant="negative_outline"
          size="small"
          onClick={onReject}
          disabled={item.status !== 'approval_waiting'}
          nonUppercase
        >
          <Button.Label>Reject</Button.Label>
        </Button>
      </td>
    </tr>
  );
}
