import React, { Fragment } from 'react';
import Sidebar from './Sidebar';
import NavbarAdmin from './NavbarAdmin'

const CmsTemplate = ({ children }) => {
    return (
        <Fragment>
            <NavbarAdmin />
            <div className='grid grid-cols-12'>
                <div className='col-span-2 pt-5 border-r-2'>
                    <Sidebar />
                </div>
                <div className='col-span-10'>
                    <div className='p-5'>
                        {children}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default CmsTemplate;

