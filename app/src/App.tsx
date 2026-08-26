import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { RequireAdmin, RequireStaff } from '@/portal/PortalGuard'
import { PortalLayout } from '@/portal/PortalLayout'
import { Inbox } from '@/portal/Inbox'
import { PageFallback } from '@/components/ui/PageFallback'

/* Public pages — code-split so the marketing site stays light. */
const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const Services = lazy(() => import('@/pages/Services'))
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'))
const Insurance = lazy(() => import('@/pages/Insurance'))
const Careers = lazy(() => import('@/pages/Careers'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))
const Contact = lazy(() => import('@/pages/Contact'))
const Referral = lazy(() => import('@/pages/Referral'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/* Portal */
const Login = lazy(() => import('@/portal/Login'))
const Join = lazy(() => import('@/portal/Join'))
const Dashboard = lazy(() => import('@/portal/Dashboard'))
const Team = lazy(() => import('@/portal/Team'))

/* Legal (named exports from one module) */
const PrivacyPolicy = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.PrivacyPolicy })))
const TermsOfService = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.TermsOfService })))

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* ---------------- Public site ---------------- */}
            <Route element={<SiteLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:slug" element={<ServiceDetail />} />
              <Route path="insurance" element={<Insurance />} />
              <Route path="careers" element={<Careers />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="contact" element={<Contact />} />
              <Route path="referral" element={<Referral />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-of-service" element={<TermsOfService />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* ---------------- Staff portal ---------------- */}
            <Route path="portal/login" element={<Login />} />
            <Route path="portal/join" element={<Join />} />

            <Route path="portal" element={<RequireStaff />}>
              <Route element={<PortalLayout />}>
                <Route index element={<Dashboard />} />

                <Route path="bookings" element={<Inbox kind="booking" />} />
                <Route path="bookings/:id" element={<Inbox kind="booking" />} />

                <Route path="contacts" element={<Inbox kind="contact" />} />
                <Route path="contacts/:id" element={<Inbox kind="contact" />} />

                <Route path="referrals" element={<Inbox kind="referral" />} />
                <Route path="referrals/:id" element={<Inbox kind="referral" />} />

                <Route path="applications" element={<Inbox kind="application" />} />
                <Route path="applications/:id" element={<Inbox kind="application" />} />

                {/* Admin only */}
                <Route element={<RequireAdmin />}>
                  <Route path="team" element={<Team />} />
                </Route>

                {/* Unknown portal path — send them to the dashboard. */}
                <Route path="*" element={<Navigate to="/portal" replace />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
