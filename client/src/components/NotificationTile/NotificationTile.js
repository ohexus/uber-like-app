import React from 'react';
import './NotificationTile.scss';

export default function NotificationTile(props) {
  return (
    <div className='notificationtile'>
      <h3 className='notificationtile__info'>{ props.info }</h3>
      <button
        type='button'
        onClick={ props.closeNotification }
        className='notificationtile__cross'
      > x </button>
    </div>
  );
}
