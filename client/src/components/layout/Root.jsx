import { Outlet } from "react-router";
import CartDrawer from '../CartDrawer';
import Footer from '../Footer/Footer';
import Navbar from '../Header/Navbar';
import ScrollToTop from '../ScrollToTop';

const Root = () => {
    return (    
        <div className="min-h-screen flex flex-col relative">
            <ScrollToTop />
            <Navbar className="flex-1 bg-gray-50" />
            <CartDrawer />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Root;