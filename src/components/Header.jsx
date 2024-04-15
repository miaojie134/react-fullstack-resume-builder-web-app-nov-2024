import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Logo } from "../assets";
import { AnimatePresence, motion } from "framer-motion";
import useUser from "../hooks/useUser";
import { PuffLoader } from "react-spinners";
import { HiLogout } from "react-icons/hi";
import { slideUpDownMenu, FadeInOutWithOpacity } from "../animations";
import { auth } from "../config/firebase.config";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
const Header = () => {
  const { data, isLoading, isError } = useUser();
  const [isMenu, setIsMenu] = useState(false);
  const queryClient = useQueryClient();
  const signOutUser = async () => {
    await auth
      .signOut()
      .then(() => {
        queryClient.setQueryData("user", null);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <header
      className="w-full flex items-center justify-between px-4 py-3 
    lg:px-8 border-b bg-bgPrimary border-gray-300 border-1 z-50 gap-12 sticky top-0"
    >
      {/* logo */}
      <Link to={"/"}>
        <img className="w-12 h-auto object-contain" src={Logo} alt="" />
      </Link>

      {/* input */}
      <div
        className="flex-1 border border-gray-300 px-4 py-1 rounded-md flex
      items-center justify-between bg-gray-200"
      >
        <input
          className="flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none"
          type="text"
          placeholder="Search here..."
        />
      </div>

      {/* profile section */}
      <AnimatePresence>
        {isLoading ? (
          <PuffLoader color="#498FCD" size={40} />
        ) : (
          <React.Fragment>
            {data ? (
              <motion.div
                {...FadeInOutWithOpacity}
                className="relative"
                onClick={() => setIsMenu(!isMenu)}
              >
                {data?.photoURL ? (
                  <div className="w-12 h-12 rounded-md relative flex items-center justify-center">
                    <img
                      className="w-full h-full object-contain rounded-md"
                      referrerPolicy="no-referrer"
                      src={data?.photoURL}
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-700 shadow-md cursor-pointer">
                    <p className="text-lg text-white">{data?.displayName[0]}</p>
                  </div>
                )}

                {/* dropdown menu */}
                <AnimatePresence>
                  {isMenu && (
                    <motion.div
                      {...slideUpDownMenu}
                      className="w-64 absolute bg-white px-4 py-3 right-0 top-14 flex flex-col items-center justify-center pt-12 gap-3 rounded-md"
                      onMouseLeave={() => {
                        setIsMenu(!isMenu);
                      }}
                    >
                      {data?.photoURL ? (
                        <div className="w-20 h-20 rounded-md relative flex flex-col items-center justify-center">
                          <img
                            className="w-full h-full object-contain rounded-full"
                            referrerPolicy="no-referrer"
                            src={data?.photoURL}
                            alt=""
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-700 shadow-md cursor-pointer">
                          <p className="text-lg text-white">
                            {data?.displayName[0]}
                          </p>
                        </div>
                      )}
                      {data?.displayName && (
                        <p className="text-lg text-txtDark">
                          {data?.displayName}
                        </p>
                      )}

                      {/* menu */}
                      <div className="w-full flex flex-col items-start gap-3 pt-3">
                        <Link
                          className="text-txtLight hover:text-txtDark text-base whitespace-nowrap"
                          to={"/profile"}
                        >
                          My Account
                        </Link>
                        <Link
                          className="text-txtLight hover:text-txtDark text-base whitespace-nowrap"
                          to={"/template/create"}
                        >
                          Add New Template
                        </Link>
                        <div
                          className="flex items-center gap-2 w-full px-2 py-2 border-t border-gray-300 justify-between group"
                          onClick={() => {
                            signOutUser();
                          }}
                        >
                          <p className="text-txtLight group-hover:text-txtDark">
                            Sign Out
                          </p>
                          <HiLogout className="group-hover:text-txtDark text-txtLight" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link to={"/auth"}>
                <motion.button
                  {...FadeInOutWithOpacity}
                  className="px-4 py-2 border-gray-300 border rounded-md hover:shadow-md active:scale-95 duration-150"
                  type="button"
                >
                  Login
                </motion.button>
              </Link>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
