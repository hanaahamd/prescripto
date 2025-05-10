import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
    const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

    useEffect(() => {
        if (aToken) {
            getAllDoctors()
        }
    }, [aToken])

    const handleCheckboxChange = async (docId, currentAvailability) => {
        await changeAvailability(docId)  // Call API
        getAllDoctors();  // Refresh doctors list after updating
    }

    return (
        <div className="m-5 max-h-[90vh] overflow-y-scroll flex flex-wrap">
            <h1 className="text-2xl font-bold text-gray-800">All Doctors</h1>
            <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
                
                {doctors.map((item, index) => (
                    <div className="border border-gray-300 shadow-md rounded-xl w-64 overflow-hidden group hover:shadow-lg transition duration-300" key={index}>
                        <img className="w-full h-60 object-cover bg-gray-300 group-hover:bg-primary transition-all duration-500" src={item.image} alt={item.name} />
                        <div className="p-4">
                            <p className="text-xl font-semibold text-gray-900">{item.name}</p>
                            <p className="text-gray-600 text-sm">{item.speciality}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={!!item.available} 
                                    onChange={() => handleCheckboxChange(item._id, item.available)} 
                                    className="cursor-pointer"
                                />
                                <p className="text-gray-800">Available</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DoctorsList
