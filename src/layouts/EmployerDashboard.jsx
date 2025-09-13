import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'
import { Route,Routes } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { Button, Dropdown } from 'semantic-ui-react'
import AuthService from '../services/authService'
import { logout } from '../store/actions/authActions'
import JobAdvertisementDetail from '../pages/JobAdvertisementDetail'

export default function EmployerDashboard() {

    const url = "/dashboard"

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
                            <Dropdown.Item icon="setting" text="Ayarlar" />
                            <Dropdown.Item icon="sign-out" text="Çıkış Yap" className="text-danger" onClick={()=>logoutClick()}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
           
            
                <Button icon="home" content="Dashboard" className="sidebar_btn" as={NavLink} to={url + "/home"} />
                <Button icon="file alternate outline" content="Başvurular" className="sidebar_btn" as={NavLink} to={url + "/get-job-application"} />
                <Button icon="user circle" content="Profil" className="sidebar_btn" as={NavLink} to={url + "/profile"} />
                <Button icon="add circle" content="İlan Ekle" className="sidebar_btn" as={NavLink} to={url + "/add-jobadvert"} />
            
            <main>
            <Routes>
            <Route exact path='/jobadvertisements/:jobAdvertisementId' element={<JobAdvertisementDetail/>}/>
            </Routes>
            </main>
        </div>
    )
}