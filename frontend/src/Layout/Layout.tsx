import { Outlet } from 'react-router';
import MenubarDemo from './Header/menu';
function Layout() {
  return (
    <div>
        <MenubarDemo/>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;