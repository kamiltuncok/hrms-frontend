import React from 'react';
import { Container, Menu } from 'semantic-ui-react';
import SignedOut from './SignedOut';
import SignedIn from './SignedIn';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../store/contexts/authContext";

export default function Navi() {
  const { isAuthenticated, logout } = useAuth(); // Auth bağlamını kullan
  const navigate = useNavigate();

  function handleSignOut() {
    logout(); // AuthContext'ten logout fonksiyonunu çağır
    navigate('/'); // Çıkış yapıldığında anasayfaya yönlendir
  }

  function handleRegisterJobSeeker() {
    navigate('/auth/registerjobseeker');
  }

  function handleSignInPage() {
    navigate('/auth/login');
  }

  function handleHomeClick() {
    navigate('/'); // Home sayfasına yönlendirme
  }

   function handleJobListClick() {
    navigate('/jobadvertisements'); // Home sayfasına yönlendirme
  }

  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item name="Ana Sayfa" onClick={handleHomeClick} />
       <Menu.Item onClick={handleJobListClick}>
        İş Ara
       </Menu.Item>
        <Menu.Menu position="right">
          {isAuthenticated ? (
            <SignedIn signOut={handleSignOut} />
          ) : (
            <SignedOut
              registerJobSeeker={handleRegisterJobSeeker}
              signInPage={handleSignInPage}
            />
          )}
        </Menu.Menu>
      </Container>
    </Menu>
  );
}
