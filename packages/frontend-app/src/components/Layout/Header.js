import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import { toast, formatter } from '@ooo-booking/commons/utils';
import { Avatar, Dropdown, Separator } from '@ahaui/react';


import emailIcon from 'assets/images/email-icon.svg';
import phoneIcon from 'assets/images/phone-icon.svg';
import profileIcon from 'assets/images/profile-icon.svg';

import { logout } from 'actions/user';


function UserInfo() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" size="extraSmall">
        <div>
          <Avatar className="u-backgroundPrimaryLight u-text200" style={{ backgroundColor: '#375DE7' }} text={formatter.getShortName(user.name)} />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Container id="123" additionalStyles={{ textColor: '#170B4D', left: -200, width: 233 }}>
        <div>
          <Dropdown.Item className="u-flex u-alignItemsCenter u-paddingVerticalSmall u-paddingLeftSmall">
            <div>
              <Avatar className="u-backgroundPrimaryLight u-text200" style={{ backgroundColor: '#375DE7' }} text={formatter.getShortName(user.name)} />
            </div>
            <div>
              <p style={{ margin: 0, color: '#172B4D' }} className="u-paddingLeftExtraSmall u-text200 u-fontMedium">{user.name}</p>
              <p style={{ margin: 0, color: '#6B778C' }} className="u-paddingLeftExtraSmall u-text100">{user.position}</p>
            </div>
          </Dropdown.Item>
          <Separator variant="lighter" />
          <div>
            <Dropdown.Item className="u-text200 u-paddingHorizontalLarge u-paddingVerticalExtraTiny">
              <img
                src={phoneIcon}
                alt="Phone"
              />
              <span className="u-paddingLeftExtraSmall">
                {' '}
                {user.phone}
              </span>
            </Dropdown.Item>
            <Dropdown.Item className="u-text200 u-paddingHorizontalLarge">
              <img
                src={emailIcon}
                alt="Email"
              />
              <span className="u-paddingLeftExtraSmall ">
                {' '}
                {user.email}
              </span>
            </Dropdown.Item>
            <Dropdown.Item className="u-text200 u-fontMedium u-paddingHorizontalLarge">
              <img
                src={profileIcon}
                alt="avatar"
              />
              <span className="u-paddingLeftExtraSmall">
                {' '}
                {user.leadName}
                {' '}
              </span>
            </Dropdown.Item>
            <Dropdown.Item
              className="u-text200 u-paddingHorizontalLarge u-borderTop u-paddingVerticalExtraSmall u-cursorPointer"
              onClick={async () => {
                if (loggingOut) {
                  return;
                }

                setLoggingOut(true);

                const { error } = await dispatch(logout());
                if (error) {
                  toast.error(error);
                }

                setLoggingOut(false);
              }}
            >
              <div
                data-testid="logout-btn"
                className={classNames(
                  loggingOut && 'u-textGray u-cursorNotAllow',
                )}
              >
                Sign Out
              </div>
            </Dropdown.Item>
          </div>
        </div>
      </Dropdown.Container>
    </Dropdown>
  );
}

export default function Header() {
  return (
    <header
      className="u-flex u-justifyContentEnd u-paddingVerticalSmall u-paddingHorizontalLarge u-borderBottom u-alignItemsCenter"
    >
      {/* <Button className="u-marginRightSmall">Logout</Button> */}
      <UserInfo />
    </header>
  );
}
