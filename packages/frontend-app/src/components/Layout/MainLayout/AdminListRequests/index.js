import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Icon, Loader } from '@ahaui/react';
import { getAdminOOORequests } from 'actions/oooRequest';
import { toast } from '@ooo-booking/commons/utils';
import auth from 'utils/auth';
import config from 'configuration';
import noData from 'assets/images/no-data.svg';
import ListItem from './ListItem';

export default function AdminListRequests() {
  const [adminRequests, setAdminRequests] = useState(null);

  const dispatch = useDispatch();
  const accessToken = auth.getToken();
  const fetchData = useCallback(async () => {
    const response = await dispatch(getAdminOOORequests());

    if (response.success) {
      setAdminRequests(response.result);
    } else {
      toast(response.error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderMainContent = () => {
    if (adminRequests && adminRequests.length === 0) {
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

    if (adminRequests === null) {
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
              <th scope="col" style={{ width: '95px' }}>
                Start Date
              </th>
              <th scope="col" style={{ width: '95px' }}>
                End Date
              </th>
              <th scope="col" style={{ width: '140px' }}>
                Created By
              </th>
              <th scope="col">Purpose of OOO</th>
              <th scope="col" style={{ width: '100px' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {adminRequests.map((item) => (
              <ListItem key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: '32px 76px',
      }}
    >
      <div className="u-flex u-text600 u-justifyContentBetween">
        <div className="u-text600 u-fontMedium u-margin">
          View all OOO Requests
        </div>
        <div className="u-flex u-alignItemsCenter">
          <Button
            variant="primary_outline"
            onClick={() => {
              window.open(
                `${config.apiUrl}/ooo-requests/csv?access_token=${accessToken}`,
              );
            }}
            size="small"
          >
            <Button.Label className="u-paddingTopTiny">
              Export CSV File
            </Button.Label>
            <Button.Icon>
              <Icon name="fileImport" size="extraSmall" />
            </Button.Icon>
          </Button>
        </div>
      </div>
      {renderMainContent()}
    </div>
  );
}
