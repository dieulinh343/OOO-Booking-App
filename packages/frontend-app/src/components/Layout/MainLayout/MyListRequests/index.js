import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Icon, Loader } from '@ahaui/react';
import { useDispatch } from 'react-redux';
import { getMyOOORequests, cancelMyOOORequest } from 'actions/oooRequest';
import { showModal } from 'actions/modal';
import { ModalKey } from 'constants/modal';
import { toast } from '@ooo-booking/commons/utils';
import noData from 'assets/images/no-data.svg';
import ListItem from './ListItem';

export default function MyListRequests() {
  const history = useHistory();
  const [myRequests, setMyRequests] = useState(null);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    const response = await dispatch(getMyOOORequests());

    if (response.success) {
      setMyRequests(response.result);
    } else {
      toast(response.error);
    }
  }, [dispatch]);

  const cancelItem = (item) => {
    dispatch(showModal(ModalKey.DELETE_OOO_CONFIRM, {
      onConfirm: async () => {
        // delete item
        const response = await dispatch(cancelMyOOORequest(item.id));
        if (response.success) {
          setMyRequests(response.result);
        } else {
          toast(response.error);
        }
      },
    }));
  };


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderMainContent = () => {
    if (myRequests && myRequests.length === 0) {
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

    if (myRequests === null) {
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
          className="Table Table--striped u-backgroundWhite u-textDark u-text100"
          style={{
            margin: 0,
          }}
        >
          <thead style={{ color: '#97A0AF' }}>
            <tr>
              <th style={{ width: '95px' }} scope="col">Start Date</th>
              <th style={{ width: '95px' }} scope="col">End Date</th>
              <th style={{ width: '140px' }} scope="col">Status</th>
              <th scope="col">Purpose of OOO</th>
              <th style={{ width: '80px' }} scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {myRequests.map(item => (
              <ListItem
                key={item.id}
                item={item}
                onCancel={() => cancelItem(item)}
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
      <div className="u-flex u-text600 u-justifyContentBetween">
        <div className="u-text600 u-fontMedium u-margin">
          List of OOO requests
        </div>
        <div className="u-flex u-alignItemsCenter">
          <Button
            onClick={() => {
              history.push('/my-requests/create');
            }}
            size="small"
          >
            <Button.Label className="u-paddingTopTiny">
              Create OOO Request
            </Button.Label>
            <Button.Icon>
              <Icon name="create" size="extraSmall" />
            </Button.Icon>
          </Button>
        </div>
      </div>
      {renderMainContent()}
    </div>
  );
}
