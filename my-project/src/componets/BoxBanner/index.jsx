import React from 'react'
import { Link } from 'react-router-dom'

const BoxBanner = (props) => {
    return (
        <div className="box box-Banner overflow-hidden rounded-lg group">
            <Link to={'/'}>
                <img src={props.img} alt="" className='w-full transition-all group-hover:scale-105 group-hover:rotate-2' />
            </Link>
        </div>
    )
}

export default BoxBanner
