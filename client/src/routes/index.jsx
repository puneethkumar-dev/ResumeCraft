import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";

// Loading component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading ResumeCraft...</p>
    </div>
  </div>
);

// Lazy-loaded pages
const LandingPage = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const ResumeBuilderPage = lazy(() => import("../pages/ResumeBuilderPage"));
const ResumePreviewPage = lazy(() => import("../pages/ResumePreviewPage"));
const ATSAnalyzerPage = lazy(() => import("../pages/ATSAnalyzerPage"));
const TemplatesPage = lazy(() => import("../pages/TemplatesPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ForgotPasswordPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "builder",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumeBuilderPage />
          </Suspense>
        ),
      },
      {
        path: "builder/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumeBuilderPage />
          </Suspense>
        ),
      },
      {
        path: "preview/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumePreviewPage />
          </Suspense>
        ),
      },
      {
        path: "ats",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ATSAnalyzerPage />
          </Suspense>
        ),
      },
      {
        path: "templates",
        element: (
          <Suspense fallback={<PageLoader />}>
            <TemplatesPage />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "404",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
]);
