
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* This will render the child route component */}
      </main>
    </div>
  );
};

export default MainLayout;
