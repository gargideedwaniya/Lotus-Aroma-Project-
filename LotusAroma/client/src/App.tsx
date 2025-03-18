import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Cart from "./components/Cart";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/checkout" component={Checkout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <Router />
      </main>
      <Footer />
      <Cart />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Layout />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
