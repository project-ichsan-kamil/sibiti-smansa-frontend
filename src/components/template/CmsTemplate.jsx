import React, { Fragment } from 'react';
import Sidebar from './Sidebar';
import NavbarAdmin from './NavbarAdmin';

const CmsTemplate = ({ children }) => {
    return (
        <Fragment>
            {/* Navbar Tetap di Posisi Teratas */}
            <div className="fixed top-0 left-0 w-full z-20">
                <NavbarAdmin />
            </div>

            {/* Layout dengan Sidebar dan Konten Utama */}
            <div className="flex pt-16">
                {/* Sidebar lebih kecil */}
                <div className="w-1/6 fixed h-full bg-white border-r-2 z-10">
                    <Sidebar />
                </div>

                {/* Konten Utama */}
                <div className="w-5/6 ml-auto p-5">
                    {children}
                </div>
            </div>
        </Fragment>
    );
}

export default CmsTemplate;
