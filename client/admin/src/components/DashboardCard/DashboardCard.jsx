import React from 'react'
import './DashboardCard.css'

const DashboardCard = ({img, text, number}) => {
  return (
    <div className='dashboard-card'>
        <img src={img} alt="" />
        <div className="card-info">
            <p className='text'>{text}</p>
            <p className='number'>{number}</p>
        </div>
    </div>
  )
}

export default DashboardCard