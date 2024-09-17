// // // import React from 'react';
// // // import { FaHome, FaClipboardList, FaCalendarAlt, FaBook, FaUserCheck, FaCalendar } from 'react-icons/fa';
// // // import image from '../../../assets/UserImage';

// // // const Sidebar = ({ isSidebarOpen }) => {
// // //   return (
// // //     <div
// // //       className={`fixed lg:static transform lg:translate-x-0 transition-transform duration-300 ease-in-out 
// // //         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:w-60 bg-default shadow-lg lg:shadow-none flex-shrink-0 z-50`}
// // //     >
// // //       <div className="flex flex-col h-full p-4">
// // //         {/* Logo */}
// // //         <div className="flex flex-col items-center mb-8">
// // //           <img src={image.smansa} alt="Logo" className="h-24 mb-4" /> {/* Logo lebih besar */}
// // //         </div>

// // //         {/* Sidebar Menu */}
// // //         <nav className="flex-grow">
// // //           <ul className="space-y-4">
// // //             <li className="flex items-center space-x-2 text-sm font-semibold bg-blue-500 text-white rounded-lg p-2">
// // //               <FaHome />
// // //               <span>Dashboard</span>
// // //             </li>
// // //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-gray-200 rounded-lg">
// // //               <FaClipboardList />
// // //               <span>Kuis</span>
// // //             </li>
// // //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-gray-200 rounded-lg">
// // //               <FaClipboardList />
// // //               <span>Ulangan Harian</span>
// // //             </li>
// // //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-gray-200 rounded-lg">
// // //               <FaCalendarAlt />
// // //               <span>Ujian Tengah Semester</span>
// // //             </li>
// // //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-gray-200 rounded-lg">
// // //               <FaCalendarAlt />
// // //               <span>Ujian Akhir Semester</span>
// // //             </li>
// // //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-gray-200 rounded-lg">
// // //               <FaUserCheck />
// // //               <span>Absensi</span>
// // //             </li>
// // //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-gray-200 rounded-lg">
// // //               <FaCalendar />
// // //               <span>Jadwal Ujian</span>
// // //             </li>
// // //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-gray-200 rounded-lg">
// // //               <FaBook />
// // //               <span>Bank Soal</span>
// // //             </li>
// // //           </ul>
// // //         </nav>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Sidebar;

// // import React from 'react';
// // import { FaHome, FaClipboardList, FaCalendarAlt, FaBook, FaUserCheck, FaCalendar } from 'react-icons/fa';
// // import image from '../../../assets/UserImage';

// // const Sidebar = ({ isSidebarOpen }) => {
// //   return (
// //     <div
// //       className={`fixed lg:static transform lg:translate-x-0 transition-transform duration-300 ease-in-out 
// //         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:w-60 h-screen bg-default shadow-lg lg:shadow-none flex-shrink-0 z-50`}
// //     >
// //       <div className="flex flex-col h-full p-4">
// //         {/* Logo */}
// //         <div className="flex flex-col items-center mb-8">
// //           <img 
// //             src={image.smansa} 
// //             alt="Logo" 
// //             className="h-16 lg:h-24 mb-4" 
// //           /> {/* Ukuran logo dikurangi di mobile view */}
// //         </div>

// //         {/* Sidebar Menu */}
// //         <nav className="flex-grow">
// //           <ul className="space-y-4">
// //             <li className="flex items-center space-x-2 text-sm font-semibold bg-blue-500 text-white rounded-lg p-2 hover:bg-active">
// //               <FaHome />
// //               <span>Dashboard</span>
// //             </li>
// //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
// //               <FaClipboardList />
// //               <span>Kuis</span>
// //             </li>
// //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
// //               <FaClipboardList />
// //               <span>Ulangan Harian</span>
// //             </li>
// //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
// //               <FaCalendarAlt />
// //               <span>Ujian Tengah Semester</span>
// //             </li>
// //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
// //               <FaCalendarAlt />
// //               <span>Ujian Akhir Semester</span>
// //             </li>
// //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
// //               <FaUserCheck />
// //               <span>Absensi</span>
// //             </li>
// //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
// //               <FaCalendar />
// //               <span>Jadwal Ujian</span>
// //             </li>
// //             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
// //               <FaBook />
// //               <span>Bank Soal</span>
// //             </li>
// //           </ul>
// //         </nav>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Sidebar;

// import React from 'react';
// import { FaHome, FaClipboardList, FaCalendarAlt, FaBook, FaUserCheck, FaCalendar, FaTimes } from 'react-icons/fa';
// import image from '../../../assets/UserImage';

// const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
//   return (
//     <div
//       className={`fixed lg:static transform lg:translate-x-0 transition-transform duration-300 ease-in-out 
//         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:w-60 h-screen bg-default shadow-lg lg:shadow-none flex-shrink-0 z-50`}
//     >
//       <div className="flex flex-col h-full p-4">
//         {/* Tombol Close (hanya di mobile view) */}
//         <div className="flex justify-end lg:hidden mb-4">
//           <button onClick={toggleSidebar} className="text-2xl p-2">
//             <FaTimes /> {/* Ikon Close */}
//           </button>
//         </div>

//         {/* Logo */}
//         <div className="flex flex-col items-center mb-8">
//           <img 
//             src={image.smansa} 
//             alt="Logo" 
//             className="h-16 lg:h-24 mb-4" 
//           /> {/* Ukuran logo dikurangi di mobile view */}
//         </div>

//         {/* Sidebar Menu */}
//         <nav className="flex-grow">
//           <ul className="space-y-4">
//             <li className="flex items-center space-x-2 text-sm font-semibold bg-blue-500 text-white rounded-lg p-2 hover:bg-active">
//               <FaHome />
//               <span>Dashboard</span>
//             </li>
//             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
//               <FaClipboardList />
//               <span>Kuis</span>
//             </li>
//             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
//               <FaClipboardList />
//               <span>Ulangan Harian</span>
//             </li>
//             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
//               <FaCalendarAlt />
//               <span>Ujian Tengah Semester</span>
//             </li>
//             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
//               <FaCalendarAlt />
//               <span>Ujian Akhir Semester</span>
//             </li>
//             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
//               <FaUserCheck />
//               <span>Absensi</span>
//             </li>
//             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
//               <FaCalendar />
//               <span>Jadwal Ujian</span>
//             </li>
//             <li className="flex items-center space-x-2 text-sm font-semibold p-2 hover:bg-active rounded-lg">
//               <FaBook />
//               <span>Bank Soal</span>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import React from 'react';
import { FaHome, FaClipboardList, FaCalendarAlt, FaBook, FaUserCheck, FaCalendar, FaTimes } from 'react-icons/fa';
import image from '../../../assets/UserImage';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed lg:static transform lg:translate-x-0 transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:w-60 h-screen bg-default shadow-lg lg:shadow-none flex-shrink-0 z-50`}
    >
      <div className="relative flex flex-col h-full p-4">
        
        <button 
          onClick={toggleSidebar} 
          className="absolute top-2 right-2 lg:hidden text-2xl p-2 focus:outline-none"
        >
          <FaTimes /> {/* Ikon Close */}
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center lg:py-8">
          <img 
            src={image.smansa} 
            alt="Logo" 
            className="h-16 lg:h-24 mb-4" 
          />
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-grow">
          <ul className="space-y-4">
            <li className="flex items-center space-x-2 text-sm font-semibold rounded-lg p-2 px-4 hover:bg-active hover:text-white transition-colors duration-300">
              <FaHome />
              <span>Dashboard</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white rounded-lg transition-colors duration-300">
              <FaClipboardList />
              <span>Kuis</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white  rounded-lg transition-colors duration-300">
              <FaClipboardList />
              <span>Ulangan Harian</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white rounded-lg transition-colors duration-300">
              <FaCalendarAlt />
              <span>Ujian Tengah Semester</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white rounded-lg transition-colors duration-300">
              <FaCalendarAlt />
              <span>Ujian Akhir Semester</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white rounded-lg transition-colors duration-300">
              <FaUserCheck />
              <span>Absensi</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white rounded-lg transition-colors duration-300">
              <FaCalendar />
              <span>Jadwal Ujian</span>
            </li>
            <li className="flex items-center space-x-2 text-sm font-semibold p-2 px-4 hover:bg-active hover:text-white rounded-lg transition-colors duration-300">
              <FaBook />
              <span>Bank Soal</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;


