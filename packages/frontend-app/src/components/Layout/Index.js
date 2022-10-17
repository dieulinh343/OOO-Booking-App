import React from 'react';
import Header from './Header';
import SideBar from './SideBar';
import MainLayout from './MainLayout';

export default function Layout() {
  return (
    <div
      className="u-flex u-flexRow"
      style={{
        height: '100vh',
      }}
    >
      <SideBar />
      <div className="u-flex u-flexColumn u-flexGrow1">
        <Header />
        <MainLayout />
      </div>
    </div>
  );
}
