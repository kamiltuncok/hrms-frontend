
import { Container } from 'semantic-ui-react';
import './App.css';
import Dashboard from './layouts/Dashboard.jsx';
import 'semantic-ui-css/semantic.min.css'
import Navi from './layouts/Navi';
import { AuthProvider } from "./store/contexts/authContext";


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navi />
        <Container className="main">
          <Dashboard />
        </Container>
      </div>
    </AuthProvider>
  );
}

export default App;
