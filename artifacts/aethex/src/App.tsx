import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import AiAssistant from "@/pages/AiAssistant";
import OrderTracking from "@/pages/OrderTracking";
import Orders from "@/pages/Orders";
import MyReviews from "@/pages/MyReviews";
import AdminReviews from "@/pages/AdminReviews";
import AdminSellers from "@/pages/AdminSellers";
import SellerStorefront from "@/pages/SellerStorefront";
import StudyHub from "@/pages/StudyHub";
import Checkout from "@/pages/Checkout";
import Account from "@/pages/Account";
import Admin from "@/pages/Admin";

import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import MedicalNews from "@/pages/News";
import AdminBlog from "@/pages/AdminBlog";
import ClinicalTools from "@/pages/ClinicalTools";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Onboarding from "@/pages/Onboarding";
import SettingsPage from "@/pages/Settings";

import SellerRegister from "@/pages/seller/Register";
import SellerLogin from "@/pages/seller/Login";
import SellerDashboard from "@/pages/seller/Dashboard";
import SellerProducts from "@/pages/seller/Products";
import SellerOrders from "@/pages/seller/Orders";
import SellerPayouts from "@/pages/seller/Payouts";
import SellerAnalytics from "@/pages/seller/Analytics";
import SellerSettings from "@/pages/seller/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: true, staleTime: 1000 * 30 },
  },
});

function Router() {
  const [sellerSession, setSellerSession] = useState<any | null>(() => {
    try {
      const raw = localStorage.getItem("aethex_seller_info");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const handleSellerLogin = (seller: any) => setSellerSession(seller);
  const handleSellerLogout = () => {
    localStorage.removeItem("aethex_seller_code");
    localStorage.removeItem("aethex_seller_info");
    setSellerSession(null);
    window.location.href = "/seller/login";
  };

  const sellerProps = { seller: sellerSession, onLogout: handleSellerLogout };

  return (
    <Switch>
      {/* Full-screen pages (no Navbar/Footer) */}
      <Route path="/ai-assistant" component={AiAssistant} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/seller/register" component={SellerRegister} />
      <Route path="/seller/login">{() => <SellerLogin onLogin={handleSellerLogin} />}</Route>

      {/* Seller Dashboard pages (no Navbar/Footer) */}
      <Route path="/seller/dashboard">{() => sellerSession ? <SellerDashboard {...sellerProps} /> : <SellerLogin onLogin={handleSellerLogin} />}</Route>
      <Route path="/seller/products">{() => sellerSession ? <SellerProducts {...sellerProps} /> : <SellerLogin onLogin={handleSellerLogin} />}</Route>
      <Route path="/seller/orders">{() => sellerSession ? <SellerOrders {...sellerProps} /> : <SellerLogin onLogin={handleSellerLogin} />}</Route>
      <Route path="/seller/payouts">{() => sellerSession ? <SellerPayouts {...sellerProps} /> : <SellerLogin onLogin={handleSellerLogin} />}</Route>
      <Route path="/seller/analytics">{() => sellerSession ? <SellerAnalytics {...sellerProps} /> : <SellerLogin onLogin={handleSellerLogin} />}</Route>
      <Route path="/seller/settings">{() => sellerSession ? <SellerSettings {...sellerProps} /> : <SellerLogin onLogin={handleSellerLogin} />}</Route>

      {/* Pages with Navbar + Footer */}
      <Route>
        {() => (
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={Home} />

                {/* Shop routes (also alias /products) */}
                <Route path="/shop" component={Products} />
                <Route path="/shop/:id" component={ProductDetail} />
                <Route path="/products" component={Products} />
                <Route path="/products/:id" component={ProductDetail} />
                <Route path="/category/:slug" component={Products} />

                {/* Cart & Checkout */}
                <Route path="/cart" component={Cart} />
                <Route path="/checkout" component={Checkout} />

                {/* Orders */}
                <Route path="/orders" component={Orders} />
                <Route path="/orders/track" component={OrderTracking} />

                {/* Account */}
                <Route path="/account" component={Account} />

                {/* Clinical Tools */}
                <Route path="/tools" component={ClinicalTools} />

                {/* Study Hub */}
                <Route path="/study-hub" component={StudyHub} />

                {/* Reviews */}
                <Route path="/my-reviews" component={MyReviews} />

                {/* Admin */}
                <Route path="/admin" component={Admin} />
                <Route path="/admin/reviews" component={AdminReviews} />
                <Route path="/admin/sellers" component={AdminSellers} />
                <Route path="/admin/blog" component={AdminBlog} />

                {/* Seller storefronts */}
                <Route path="/seller/:code/store" component={SellerStorefront} />

                {/* Contact */}
                <Route path="/contact" component={Contact} />

                {/* Blog & News */}
                <Route path="/blog/:slug" component={BlogPost} />
                <Route path="/blog" component={Blog} />
                <Route path="/news" component={MedicalNews} />

                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
