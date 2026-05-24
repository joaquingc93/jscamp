import { lazy, Suspense } from "react";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";

import { Route, Routes } from "react-router";

const HomePage = lazy(() => import("./pages/Home.jsx"));
const SearchPage = lazy(() => import("./pages/Search.jsx"));
const NotFoundPage = lazy(() => import("./pages/404.jsx"));
const JobDetail = lazy(() => import("./pages/Detail.jsx"));

export function App() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}
          >
            Cargando...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <Footer />
    </>
  );
}

export default App;
