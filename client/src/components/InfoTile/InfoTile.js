import React from 'react';
import './InfoTile.scss';

export default function InfoTile(props) {
    return (
        <div className='user__infotile infotile'>
            <h3 className='infotile__label'>{props.label}</h3>
            <span className='infotile__info'>{props.info}</span>
        </div>
    );
}