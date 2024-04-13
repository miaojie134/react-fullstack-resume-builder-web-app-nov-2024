import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../assets";

const Footer = () => {
  return (
    <div className="w-full flex items-center justify-between border-t border-gray-300">
      <div className="flex items-center justify-center gap-3 py-3">
        <img className="w-8 h-auto object-contain" src={Logo} alt="" />
        <p>Expressume</p>
      </div>
      <div className="flex items-center justify-center gap-6">
        <Link className="text-blue-700 text-sm" to="/">Home</Link>
        <Link className="text-blue-700 text-sm" to="/">Contact</Link>
        <Link className="text-blue-700 text-sm" to="/">Privacy Policy</Link>
      </div>
    </div>
  );
};

export default Footer;
