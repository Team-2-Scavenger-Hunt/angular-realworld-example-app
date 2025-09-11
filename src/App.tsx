import { Routes, Route } from "react-router-dom";
import Header from "./core/layout/Header";
import Footer from "./core/layout/Footer";
import Home from "./features/article/pages/Home";
import Auth from "./core/auth/Auth";
import Settings from "./features/settings/Settings";
import Profile from "./features/profile/pages/Profile";
import Editor from "./features/article/pages/Editor";
import Article from "./features/article/pages/Article";
import { ProtectedRoute } from "./core/auth/ProtectedRoute";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/profile/:username/favorites" element={<Profile />} />
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:slug"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
        <Route path="/article/:slug" element={<Article />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
