import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "../components";
import { MainSpinner } from "../components";
import { HomeContainer } from "../containers";
import { CreateTemplate, UserProfile, TemplateDesignPinDetail, CreateResume } from "../pages";

const HomeScreen = () => {
  return (
    <div>
      <Header />
      <main>
        <Suspense fallback={<MainSpinner />}>
          <Routes>
            <Route path="/" element={<HomeContainer />} />
            <Route path="/template/create" element={<CreateTemplate />} />
            <Route path="/profile/:uid" element={<UserProfile />}/>
            <Route path="/resume/*" element={<CreateResume />}/>
            <Route path="/resumeDetail/:templateId" element={<TemplateDesignPinDetail />}/>
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default HomeScreen;
