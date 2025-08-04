import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center justify-between py-5 px-10 font-medium relative">
      {/* Logo */}
      <Link to='/' ><img src={assets.logo} alt="Logo" className="w-36" /></Link>

      {/* Menu Items (Desktop) */}
      <div className="hidden sm:flex gap-8 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
        </NavLink>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        <img src={assets.search_icon} className="w-5 cursor-pointer" alt="Search" />

        <div className="group relative">
          <img src={assets.profile_icon} className="w-5 cursor-pointer" alt="Profile" />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-10">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg text-sm">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black">Orders</p>
              <p className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            0
          </p>
        </Link>

        {/* Menu icon for small screens */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Sidebar Menu for Small Screens */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-20 transition-all duration-300 ease-in-out ${
          visible ? 'w-[80%] shadow-lg' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col gap-5 p-5 text-gray-700">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 cursor-pointer">
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="Back" />
            <p className="font-medium">Back</p>
          </div>

          <NavLink to="/" className="hover:text-black" onClick={() => setVisible(false)}>
            HOME
          </NavLink>
          <NavLink to="/collection" className="hover:text-black" onClick={() => setVisible(false)}>
            COLLECTION
          </NavLink>
          <NavLink to="/about" className="hover:text-black" onClick={() => setVisible(false)}>
            ABOUT
          </NavLink>
          <NavLink to="/contact" className="hover:text-black" onClick={() => setVisible(false)}>
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
