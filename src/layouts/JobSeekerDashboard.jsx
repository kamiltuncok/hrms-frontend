import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Dropdown } from 'semantic-ui-react'
import { Route,Routes } from 'react-router'
import AuthService from '../services/authService'
import { useDispatch } from 'react-redux'
import { logout } from '../store/actions/authActions.js'
import { useNavigate } from 'react-router-dom'
import JobAdvertisementDetail from '../pages/JobAdvertisementDetail'

export default function JobSeekerDashboard() {

    const url = "/dashboard"

    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const dispatch=useDispatch()
    const history=useNavigate()
    
    const logoutClick=()=>{
        dispatch(logout())
        history.push("/auth/login")
    }

    return (
        <>
            
                <div className='m-3'>
                    <img className="profile-btn" width="60" height="60" src="https://jobick.dexignlab.com/xhtml/images/profile/pic1.jpg" onClick={() => setIsProfileOpen(!isProfileOpen)} />
                    <Dropdown direction="left" open={isProfileOpen} onClick={() => setIsProfileOpen(!isProfileOpen)}>
                        <Dropdown.Menu>
                            <Dropdown.Item icon="user" text="Profilim" />
                            <Dropdown.Item icon="sign-out" text="Çıkış Yap" className="text-danger" onClick={()=>logoutClick()}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            
            
                <Button icon="home" content="Dashboard" className="sidebar_btn" as={NavLink} to={url + "/home"} />
                <Button icon="briefcase" content="İş İlanları" className="sidebar_btn" as={NavLink} to={url + "/jobadvertisements"} />
                <Button icon="heart outline" content="Favorilerim" className="sidebar_btn" as={NavLink} to={url + "/favorite-jobadverts"} />
                <Button icon="file alternate outline" content="Özgeçmişim" className="sidebar_btn" as={NavLink} to={url + "/resume"} />
                <Button icon="file alternate outline" content="Başvurularım" className="sidebar_btn" as={NavLink} to={url + "/all-job-application"} />

           
            <main className="dashboard_main ">
                <div className="m-auto">

                <Routes>
            <Route exact path='/jobadvertisements/:jobAdvertisementId' element={<JobAdvertisementDetail/>}/>
            
            </Routes>
                </div>
                <div>
                   
                </div>

            </main>
        </>
    )
}