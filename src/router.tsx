import { Routes, Route } from "react-router";

import { Layout, Header } from "./components";
import { Feed, FeedProfile, Users } from "./pages";

export const Router = () => {
  return (
    <Routes>
      <Route element={<Layout header={<Header />} />}>
        <Route path="/" element={<Feed />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile/:id" element={<FeedProfile />} />
      </Route>
    </Routes>
  );
};
