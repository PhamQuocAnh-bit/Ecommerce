import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminDashboard from './features/admin/AdminDashboard';
import { Routes, Route } from 'react-router-dom';

function App() {


  return (
    <Routes>
      {/* admin */}
      <Route path="/admin/*" element={<AdminDashboard />} />

      <Route path="/" element={
        <>
          <Header />
          <Footer />
        </>
      } />

    </Routes>
  );
}

export default App;
