import { Routes, Route } from "react-router";

import { Layout, Header } from "./components";
import {
  Feed,
  FeedProfile,
  Users,
  Follows,
  MySubscriptions,
  Income,
} from "./pages";

export const Router = () => {
  return (
    <Routes>
      <Route element={<Layout header={<Header />} />}>
        <Route path="/" element={<Feed />} />
        <Route path="/users" element={<Users />} />
        <Route path="/income" element={<Income />} />
        <Route path="/follows" element={<Follows />} />
        <Route path="/subscriptions" element={<MySubscriptions />} />
        <Route path="/profile/:id" element={<FeedProfile />} />
      </Route>
    </Routes>
  );
};
