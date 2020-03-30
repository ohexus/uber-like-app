import React from 'react';
import './UserInfo.scss';

import InfoTile from '../InfoTile/InfoTile';

export default function UserInfo(props) {

    const user = props.user;

    return (
        <div className='user__profile'>
            <h1 className='user__role'> {user.role.toUpperCase()} </h1>
            
            <div className='user__info'>
                <h2> Info: </h2>
                
                <InfoTile
                    label={'Username:'}
                    info={user.username}
                />
                
                <InfoTile
                    label={'First Name:'}
                    info={user.firstName}
                />
                
                <InfoTile
                    label={'Last Name:'}
                    info={user.lastName}
                />
                
                <InfoTile
                    label={'Email:'}
                    info={user.email}
                />
                
                <InfoTile
                    label={'Mobile number:'}
                    info={user.mobileNumber}
                />
            </div>
        </div>
    );
}