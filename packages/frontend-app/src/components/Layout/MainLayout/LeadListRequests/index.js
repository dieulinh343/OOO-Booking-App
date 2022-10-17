import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getMenteesOOORequests, approveMenteeOOORequest, rejectMenteeOOORequest, submitRejectReason } from 'actions/oooRequest';
import { showModal } from 'actions/modal';
import { ModalKey } from 'constants/modal';
import { toast } from '@ooo-booking/commons/utils';
import { Loader } from '@ahaui/react';
import noData from 'assets/images/no-data.svg';
import ListItem from './ListItem';




export default function LeadListRequests() {
  const [myMenteesRequests, setMenteesRequests] = useState(null);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    const response = await dispatch(getMenteesOOORequests());

    if (response.success) {
      setMenteesRequests(response.result);
    } else {
      toast.error(response.error);
    }
  }, [dispatch]);

  const approveItem = (item) => {
    dispatch(showModal(ModalKey.APPROVE_OOO_CONFIRM, {
      onConfirm: async () => {
        // approve item
        const response = await dispatch(approveMenteeOOORequest(item.id));
        if (response.success) {
          setMenteesRequests(response.result);
        } else {
          toast.error(response.error);
        }
      },
    }));
  };

  const rejectItem = (item) => {
    dispatch(showModal(ModalKey.REJECT_OOO_CONFIRM, {
      onConfirm: async (rejectReason) => {
        // reject item
        const response = await dispatch(rejectMenteeOOORequest(item.id, rejectReason));
        if (response.success) {
          setMenteesRequests(response.result);
        } else {
          toast.error(response.error);
        }
      },
    }));
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderMainContent = () => {
    if (myMenteesRequests && myMenteesRequests.length === 0) {
      return (
        <div
          className="u-backgroundWhite u-marginTopLarge u-roundedMedium u-flex u-alignItemsCenter u-justifyContentCenter u-flexColumn"
          style={{
            height: 284,
          }}
        >
          <img src={noData} alt="noData" />
          <div className="u-marginTopMedium u-textNeutral80">
            No data to display
          </div>
        </div>
      );
    }

    if (myMenteesRequests === null) {
      return (
        <div
          className="u-backgroundWhite u-marginTopLarge u-roundedMedium u-flex u-alignItemsCenter u-justifyContentCenter u-flexColumn"
          style={{
            height: 284,
          }}
        >
          <Loader size="medium" />
        </div>
      );
    }

    return (
      <div className="u-backgroundWhite u-marginTopLarge u-roundedSmall">
        <table
          className="Table Table--striped u-backgroundWhite u-textDark u-text200"
          style={{
            margin: 0,
          }}
        >
          <thead style={{ color: '#97A0AF' }}>
            <tr>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Created by</th>
              <th scope="col">Purpose of OOO</th>
              <th scope="col">Status</th>
              <th
                scope="col"
                style={
                  {
                    width: '200px',
                  }
                }
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {myMenteesRequests
              .map(item => (
                <ListItem
                  key={item.id}
                  item={item}
                  onApprove={() => approveItem(item)}
                  onReject={() => rejectItem(item)}
                />
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{
      padding: '32px 76px',
    }}
    >
      <div className="u-text600 u-justifyContentBetween">
        <div className="u-text600 u-fontMedium u-margin">
          List of mentees' OOO requests
        </div>
        {renderMainContent()}
      </div>
    </div>
  );
}
