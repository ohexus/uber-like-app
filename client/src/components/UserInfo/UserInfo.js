import React, { useState } from 'react';
import './UserInfo.scss';

import InfoTile from '../InfoTile/InfoTile';
import UserUpdateForm from './UserUpdateForm/UserUpdateForm';
import PasswordUpdateForm from './PasswordUpdateForm/PasswordUpdateForm';

export default function UserInfo(props) {
    const user = props.user;

    const [showUserUpdateForm, setShowUserUpdateForm] = useState(false);
    const [showPasswordUpdateForm, setShowPasswordUpdateForm] = useState(false);
    
    const toggleShowUserUpdateForm = () => {
        setShowUserUpdateForm(!showUserUpdateForm);
        setShowPasswordUpdateForm(false);
    }
    
    const toggleShowPasswordUpdateForm = () => {
        setShowPasswordUpdateForm(!showPasswordUpdateForm);
        setShowUserUpdateForm(false);
    }

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

                <div className="user__update-panel">
                    <button type='button' onClick={toggleShowUserUpdateForm}>
                        {showUserUpdateForm
                            ? 'Close update User Info'
                            : 'Update User Info'
                        }
                    </button>

                    {showUserUpdateForm && <UserUpdateForm user={user} className='user__updateuser' />}
                    
                    <button type='button' onClick={toggleShowPasswordUpdateForm}>
                        {showPasswordUpdateForm
                            ? 'Close update Password Info'
                            : 'Update Password Info'
                        }
                    </button>

                    {showPasswordUpdateForm && <PasswordUpdateForm password={user.password} className='user__updatepassword' />}
                </div>
            </div>
        </div>
    );
}