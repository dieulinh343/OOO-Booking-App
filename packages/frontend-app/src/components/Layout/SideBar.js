import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SidebarMenu } from '@ahaui/react';
import logo from 'assets/images/logo.svg';

export default function SideBar() {
  const user = useSelector(state => state.user);
  const location = useLocation();
  const history = useHistory();

  const current = location.pathname.slice(1, location.pathname.length).replace(/\//g, '.');

  return (
    <div
      className="u-flexShrink0 u-borderRight"
      style={{
        width: 280,
      }}
    >
      <img
        src={logo}
        className="u-marginTopSmall u-marginLeftMedium"
        alt="Logo"
      />
      <SidebarMenu
        current={current}
        onSelect={(path) => {
          history.push(`/${path.replace(/\./g, '/')}`);
        }}
      >
        {user.isUser && (
          <SidebarMenu.SubMenu
            icon="contact"
            eventKey="my-requests"
            title="My OOO Requests"
          >
            <SidebarMenu.Item
              icon="document"
              eventKey="all"
            >
              List of requests
            </SidebarMenu.Item>
            <SidebarMenu.Item
              icon="create"
              eventKey="create"
            >
              Create new request
            </SidebarMenu.Item>
          </SidebarMenu.SubMenu>
        )}
        {user.isLead && (
          <SidebarMenu.SubMenu
            icon="column"
            eventKey="mentees-requests"
            title="My mentees' OOO Requests"
          >
            <SidebarMenu.Item
              icon="document"
              eventKey="all"
            >
              List of requests
            </SidebarMenu.Item>
          </SidebarMenu.SubMenu>
        )}
        {user.isAdmin && (
          <SidebarMenu.SubMenu
            icon="calendar"
            eventKey="admin-requests"
            title="View OOO Requests"
          >
            <SidebarMenu.Item
              icon="data"
              eventKey="all"
            >
              View all OOO requests
            </SidebarMenu.Item>
          </SidebarMenu.SubMenu>
        )}
      </SidebarMenu>
    </div>
  );
}
