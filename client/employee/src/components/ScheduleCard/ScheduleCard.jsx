// import React from 'react'
// import './ScheduleCard.css'
// import locationImg from '../../assets/Vector10.png'

// const ScheduleCard = () => {
//   return (
//     <div className='schedule-card'>
//         <div className="referral-date">
//             <div className="referral">
//                 <p>Referral</p>
//                 <p>949-365-6533</p>
//             </div>
//             <div className="date">
//                 <p>Date</p>
//                 <p>10/04/25</p>
//             </div>
//         </div>
//         <div className="call-username">
//             <div className="call">
//                 <img src={locationImg} alt="" />
//                 <p>Call</p>
//             </div>
//             <div className="user-name">
//                 <i className="fa-solid fa-user fa-sm"></i>
//                 <p>Brooklyn Williamson</p>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default ScheduleCard

import React from 'react';
import './ScheduleCard.css';
import locationImg from '../../assets/Vector11.png';

const ScheduleCard = ({ schedule }) => {
  const {
    scheduleType,
    scheduleTime,
    date,
    leadPhone,
    leadName,
  } = schedule;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB'); // 10/04/25
  };

  return (
    <div className='schedule-card'>
      <div className="referral-date">
        <div className="referral">
          <p>{scheduleType.charAt(0).toUpperCase() + scheduleType.slice(1)}</p>
          <p>{leadPhone}</p>
        </div>
        <div className="date">
          <p>Date</p>
          <p>{formatDate(date)}</p>
        </div>
      </div>
      <div className="call-username">
        <div className="call">
          <img src={locationImg} alt="call" />
          <p>Call</p>
        </div>
        <div className="user-name">
          <i className="fa-solid fa-user fa-sm"></i>
          <p>{leadName}</p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
