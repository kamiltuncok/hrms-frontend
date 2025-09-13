import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Route,Routes } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { Button, Dropdown } from 'semantic-ui-react'
import { logout } from '../store/actions/authActions'
import JobAdvertisementDetail from '../pages/JobAdvertisementDetail'

export default function AdminDashboard() {

    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const dispatch=useDispatch()
    const history=useNavigate()
    
    const logoutClick=()=>{
        dispatch(logout())
        history.push("/auth/login")
    }
    return (
        <div>
            
                <div className='m-3'>
                    <img className="profile-btn" width="60" height="60" src="https://jobick.dexignlab.com/xhtml/images/profile/pic1.jpg" onClick={() => setIsProfileOpen(!isProfileOpen)} />
                    <Dropdown direction="left" open={isProfileOpen} onClick={() => setIsProfileOpen(!isProfileOpen)}>
                        <Dropdown.Menu>
                            <Dropdown.Item icon="setting" text="Ayarlar"/>
                            <Dropdown.Item icon="sign-out" text="Çıkış Yap" onClick={()=>logoutClick()} className="text-danger" />
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            
                <Button icon="home" content="Dashboard" className="sidebar_btn" as={NavLink} to="/admin-dashboard/home" />
                <Button icon="briefcase" content="İş İlanları" className="sidebar_btn" as={NavLink} to="/admin-dashboard/jobadvertisements" />
                <Button icon="search plus" content="İş Pozisyonu" className="sidebar_btn" as={NavLink} to="/admin-dashboard/job-position-list" />
                <Button icon="settings" content="Sektörler" className="sidebar_btn" as={NavLink} to="/admin-dashboard/company-sector-list" />
                <Button icon="star" content="Yetenek" className="sidebar_btn" as={NavLink} to="/admin-dashboard/skill-list" />
                <Button icon="university" content="Okul" className="sidebar_btn" as={NavLink} to="/admin-dashboard/school-list" />
                <Button icon="language" content="Diller" className="sidebar_btn" as={NavLink} to="/admin-dashboard/language-list" />
                <Button icon="building" content="Şehirler" className="sidebar_btn" as={NavLink} to="/admin-dashboard/city-list" />
            
            <main className="dashboard_main ">
                <div>
                    
                </div>
                <div className="w-75 m-auto">
                <Routes>
                 <Route exact path='/jobadvertisements/:jobAdvertisementId' element={<JobAdvertisementDetail/>}/>
                </Routes>
                    
                </div>

            </main>
        </div>
    )
}