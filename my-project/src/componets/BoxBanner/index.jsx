import React from 'react';
import { Link } from 'react-router-dom';

const BoxBanner = (props) => {
    return (
        <div className="box box-Banner overflow-hidden rounded-lg group">
            <Link
                to={props.link || '/'}
                className="block w-full aspect-video bg-gray-100"
            >
                <img
                    src={props.img}
                    alt="Banner"
                    className='w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:rotate-1'
                />
            </Link>
        </div>
    );
};

export default BoxBanner;