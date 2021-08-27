// CMS Page Routes
import FaqPage from "../Pages/Faq";
import cmsPage from "../Pages/Cms";
import ContactUs from "../Pages/ContactUs";
import NotFoundPage from "../Pages/NotFound";

// Auth Page Routes
import LoginPage from "../Pages/Authentication/SignIn";
import ForgotPasswordPage from "../Pages/Authentication/ForgotPassword";
import ResetPasswordPage from "../Pages/Authentication/RestPassword";

// After login Page Routes
import DashboardPage from "../Pages/Dashboard";
import ProfilePage from "../Pages/Profile";
import ChangePasswordPage from "../Pages/ChangePassword";
import Notification from "../Pages/Notification";
import AuditRequest from "../Pages/auditRequest";
import DocumentUpload from "../Pages/AuditDocument";
import CompanyDocument from "../Pages/companyDocuments";
import Chat from "../Pages/Chat";

export const RoutesPage = [
  { path: "/faq", component: FaqPage, title: "FAQ's" },
  { path: "/about-us", component: cmsPage, title: "About Us" },
  {
    path: "/terms-and-conditions",
    component: cmsPage,
    title: "Terms & Conditions",
  },
  { path: "/contact-us", component: ContactUs, title: "Contact Us" },
  { path: "/404", component: NotFoundPage, title: "404" },
];

export const RoutesAuth = [
  { path: "/", component: LoginPage, title: "Login" },
  {
    path: "/forgot-password",
    component: ForgotPasswordPage,
    title: "Forgot Password",
  },
  {
    path: "/reset-password",
    component: ResetPasswordPage,
    title: "Reset Password",
  },
];

export const RoutesUser = [
  { path: "/user/dashboard", component: DashboardPage, title: "Dashboard" },
  { path: "/user/profile", component: ProfilePage, title: "Update profile" },
  {
    path: "/user/change-password",
    component: ChangePasswordPage,
    title: "Change Password",
  },
  {
    path: "/audit-request",
    component: AuditRequest,
    title: "Audit Details",
  },
  {
    path: "/audit-request/document-update/:slug",
    component: DocumentUpload,
    title: "Document's Upload",
  },
  {
    path: "/audit-request/company-document/:slug/:company/:auditId",
    component: CompanyDocument,
    title: "Documents",
  },
  {
    path: "/user/notification",
    component: Notification,
    title: "Notification",
  },
  {
    path: "/audit-request/chat/:slug/:audit_number",
    component: Chat,
    title: "Chat",
  },
];
