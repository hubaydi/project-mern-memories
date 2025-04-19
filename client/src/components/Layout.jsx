import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
      <>
        <div className="max-w-7xl mx-auto px-5 md:px-8"> 
          <Navbar />
          <main className="App">
            <Outlet />
          </main>
        </div>
      </>
    )
}

export default Layout