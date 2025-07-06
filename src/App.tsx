import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Hero } from "./components/Hero";
import { CoursesCatalog } from "./components/CoursesCatalog";
import { Dashboard } from "./components/Dashboard";
import { InstructorProfiles } from "./components/InstructorProfiles";
import { AboutUs } from "./components/AboutUs";
import { Footer } from "./components/Footer";
import { PaymentInfo } from "./components/PaymentInfo";
import { useState } from "react";
import { AdminDashboard } from "./components/AdminDashboard";

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'courses' | 'dashboard' | 'instructors' | 'about' | 'payment' | 'admin'>('home');
  const isAdmin = useQuery(api.courses.isAdmin);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/logo.png" 
                alt="شعار أكاديمية المرتقى" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to text if image doesn't exist
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) nextElement.style.display = 'block';
                }}
              />
              <span className="text-white font-bold text-lg hidden">أ</span>
            </div>
            <h1 className="text-xl font-bold text-blue-900">أكاديمية المرتقى</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setCurrentView('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentView === 'home' ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:text-blue-900'}`}
            >
              الرئيسية
            </button>
            <button 
              onClick={() => setCurrentView('courses')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentView === 'courses' ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:text-blue-900'}`}
            >
              الدورات
            </button>
            <Authenticated>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:text-blue-900'}`}
              >
                لوحة التحكم
              </button>
              {isAdmin && (
                <button 
                  onClick={() => setCurrentView('admin')}
                  className={`px-3 py-2 rounded-lg transition-colors ${currentView === 'admin' ? 'bg-red-100 text-red-900' : 'text-red-600 hover:text-red-900'}`}
                >
                  الإدارة
                </button>
              )}
            </Authenticated>
            <button 
              onClick={() => setCurrentView('instructors')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentView === 'instructors' ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:text-blue-900'}`}
            >
              المدرسون
            </button>
            <button 
              onClick={() => setCurrentView('about')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentView === 'about' ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:text-blue-900'}`}
            >
              من نحن
            </button>
            <button 
              onClick={() => setCurrentView('payment')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentView === 'payment' ? 'bg-blue-100 text-blue-900' : 'text-gray-600 hover:text-blue-900'}`}
            >
              معلومات الدفع
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Authenticated>
              <SignOutButton />
            </Authenticated>
            <Unauthenticated>
              <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
                تسجيل الدخول
              </button>
            </Unauthenticated>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Content currentView={currentView} setCurrentView={setCurrentView} />
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

function Content({ currentView, setCurrentView }: { 
  currentView: string; 
  setCurrentView: (view: 'home' | 'courses' | 'dashboard' | 'instructors' | 'about' | 'payment' | 'admin') => void;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div>
      <Unauthenticated>
        {currentView === 'home' && (
          <div>
            <Hero onViewCourses={() => setCurrentView('courses')} />
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">تسجيل الدخول</h2>
                <SignInForm />
              </div>
            </div>
          </div>
        )}
        {currentView === 'courses' && <CoursesCatalog />}
        {currentView === 'instructors' && <InstructorProfiles />}
        {currentView === 'about' && <AboutUs />}
        {currentView === 'payment' && <PaymentInfo />}
      </Unauthenticated>

      <Authenticated>
        {currentView === 'home' && <Hero onViewCourses={() => setCurrentView('courses')} />}
        {currentView === 'courses' && <CoursesCatalog />}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'instructors' && <InstructorProfiles />}
        {currentView === 'about' && <AboutUs />}
        {currentView === 'payment' && <PaymentInfo />}
        {currentView === 'admin' && <AdminDashboard />}
      </Authenticated>
    </div>
  );
}
