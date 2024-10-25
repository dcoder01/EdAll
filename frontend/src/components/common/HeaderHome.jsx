import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // using ShadCN button
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import Spinner from "./Spinner";
import CreateClassForm from "../home-view/CreateClassForm";
import JoinClassForm from "../home-view/JoinClassForm";

const HeaderHome = () => {
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showJoinClass, setShowJoinClass] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-white shadow-lg">
        <div className="flex items-center gap-4">
          <img
            alt="Education icon"
            className="h-8 w-8 sm:h-12 sm:w-12"
            src="https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/60/000000/external-online-class-online-learning-vitaliy-gorbachev-lineal-color-vitaly-gorbachev.png"
          />
          <p className="text-lg font-bold tracking-tight sm:text-2xl">
            EdAll
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={() => setShowCreateClass(true)}>
            Create Class
          </Button>
          <Button  onClick={() => setShowJoinClass(true)}>
            Join Class
          </Button>
          {loading ? (
            <Spinner />
          ) : (
            <Button variant="destructive" onClick={logoutHandler}>
              Logout
            </Button>
          )}
        </div>
      </header>

  
      <CreateClassForm
        showCreateClass={showCreateClass}
        setShowCreateClass={setShowCreateClass}
      />
      <JoinClassForm
        showJoinClass={showJoinClass}
        setShowJoinClass={setShowJoinClass}
      />
    </>
  );
};

export default HeaderHome;
