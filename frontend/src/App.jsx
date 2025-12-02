import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/components/AuthProvider';
import { ProtectedRoute, AdminRoute, TeacherRoute } from '@/components/ProtectedRoute';

// Pages
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { EventsPage } from '@/pages/EventsPage';
import { RatingPage } from '@/pages/RatingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AdminPage } from '@/pages/AdminPage';
import { LoginPage } from '@/pages/LoginPage';
import { HomeworkPage } from '@/pages/HomeworkPage';
import { BlogPage } from '@/pages/BlogPage';
import { ArticlePage } from '@/pages/ArticlePage';
import { MaterialsPage } from '@/pages/MaterialsPage';
import { TeacherHomeworkPage } from '@/pages/TeacherHomeworkPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-vh-100 d-flex flex-column">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-grow-1">
            <Container className="py-4">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/rating" element={<RatingPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<ArticlePage />} />
                <Route
                  path="/materials"
                  element={
                    <TeacherRoute>
                      <MaterialsPage />
                    </TeacherRoute>
                  }
                />
                <Route
                  path="/homework/manage"
                  element={
                    <TeacherRoute>
                      <TeacherHomeworkPage />
                    </TeacherRoute>
                  }
                />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Student Routes */}
                <Route
                  path="/homework"
                  element={
                    <ProtectedRoute>
                      <HomeworkPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />

                {/* 404 */}
                <Route
                  path="*"
                  element={
                    <div className="text-center py-5">
                      <h1 className="display-1 fw-bold mb-3">404</h1>
                      <p className="text-secondary">Страница не найдена</p>
                    </div>
                  }
                />
              </Routes>
            </Container>
          </main>

          {/* Footer */}
          <Footer />

          {/* Toast Notifications */}
          <Toaster />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
