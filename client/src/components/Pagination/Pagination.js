import React from 'react';
import './Pagination.scss';

export default function LoadsShelf(props) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(props.total / props.itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(num => (
                    <li key={num} className='pagination__item'>
                        <a 
                            onClick={(e) => {
                                e.preventDefault();
                                props.paginate(num)}
                            }
                            href='!#'
                            className='pagination__link'
                        > {num} </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}