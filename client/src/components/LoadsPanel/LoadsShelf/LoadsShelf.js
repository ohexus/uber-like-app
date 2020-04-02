import React from 'react';
import './LoadsShelf.scss';

import LoadInfo from '../LoadInfo/LoadInfo';

export default function LoadsShelf(props) {
    return (
        <div className='loads__shelf'>
            {props.loads.map(load => {
                return <LoadInfo
                    key={load._id}
                    load={load} 
                />
            })}
        </div>
    );
}