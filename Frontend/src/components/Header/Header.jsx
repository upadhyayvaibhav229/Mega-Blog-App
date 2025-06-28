import React, { useState } from 'react';
import { Container, Logo, LogoutBtn } from '../index';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { assets } from '../../assets/QuickBlog-Assets/assets';
import { Menu, X } from 'lucide-react'; // You can use any icon set or SVG

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'Login', slug: '/login', active: !authStatus },
    { name: 'Signup', slug: '/signup', active: !authStatus },
    { name: 'All Posts', slug: '/all-posts', active: authStatus },
    { name: 'Add Post', slug: '/add-post', active: authStatus },
  ];

  return (
    <header className='py-3 shadow-md bg-white'>
      <Container>
        <nav className='flex items-center justify-between'>
          {/* Logo */}
          <Link to='/'>
            <img src={assets.logo} className='w-32' alt='Logo' />
          </Link>

          {/* Hamburger Menu Button */}
          <div className='md:hidden'>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Nav Items */}
          <ul
            className={`flex flex-col md:flex-row absolute md:static bg-white w-full left-0 px-6 md:px-0 md:w-auto top-20 md:top-auto transition-all duration-300 z-10 shadow-md md:shadow-none ${
              menuOpen ? 'block' : 'hidden md:flex'
            }`}
          >
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name} className='py-2 md:py-0'>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate(item.slug);
                      }}
                      className='block px-4 py-2 md:px-6 md:py-2 duration-200 hover:bg-blue-100 rounded-full'
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}

            {authStatus && (
              <li className='py-2 md:py-0'>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
