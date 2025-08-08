import Button from '@mui/material/Button';
import { LiaAngleUpSolid } from "react-icons/lia";
import { LiaAngleDownSolid } from "react-icons/lia";
import React, { useState } from 'react'

const AddProductQuantity = () => {

    const [QuantityValue, setQuantityValue] = useState(1);

    const upQuantity = () => {
        setQuantityValue(QuantityValue + 1)
    }

    const downQuantity = () => {
        if (QuantityValue === 0) {
            setQuantityValue(0)
        } else {
            setQuantityValue(QuantityValue - 1)
        }
    }
    return (
        <div className='quantity-box flex items-center relative'>
            <input type="number" className='w-full h-[40px] p-2 text-[16px] focus:outline-none
            !border !border-[rgba(0,0,0,0.2)] rounded-md'
                value={QuantityValue}
                readOnly
            />

            <div className="flex items-center flex-col justify-between h-[40px] 
            absolute top-0 right-0 z-50 focus:outline-none rounded-md">
                <Button className='!min-w-[27px] !w-[27px] !h-[20px] !text-[#000] !rounded-md hover:!bg-[#ececec]' onClick={upQuantity}><LiaAngleUpSolid className='opacity-55' /></Button>
                <Button className='!min-w-[27px] !w-[27px] !h-[20px] !text-[#000] !rounded-md hover:!bg-[#ececec]' onClick={downQuantity}><LiaAngleDownSolid className='opacity-55' /></Button>
            </div>
        </div>
    )
}

export default AddProductQuantity;
