import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import AdminLayout from './components/layout/AdminLayout'

// Public Pages
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import ProductDetails from '@/pages/ProductDetails'
import Recipes from '@/pages/Recipes'
import RecipeDetails from '@/pages/RecipeDetails'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import OrderSuccess from '@/pages/OrderSuccess'
import CustomerAuth from '@/pages/Auth/CustomerAuth'
import Login from '@/pages/Auth/Login'

// Protected Pages
import Profile from '@/pages/Profile'
import OrderHistory from '@/pages/OrderHistory'

// Admin Pages
import AdminDashboard from '@/pages/Dashboard/AdminDashboard'
import AdminOrders from '@/pages/Dashboard/AdminOrders'
import AdminUsers from '@/pages/Dashboard/AdminUsers'
import AdminRecipes from '@/pages/Dashboard/AdminRecipes'
import AdminUserDetails from '@/pages/Dashboard/AdminUserDetails'
import AdminCategories from '@/pages/Dashboard/AdminCategories'
import ProductManager from '@/components/admin/ProductManager'
import ProductForm from '@/components/admin/ProductManager/ProductForm'

function App() {
    return (
        <Routes>
            {/* Public Storefront Routes */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="products" element={<Shop />} />
                <Route path="product/:slug" element={<ProductDetails />} />
                <Route path="recipes" element={<Recipes />} />
                <Route path="recipes/:slug" element={<RecipeDetails />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-success" element={<OrderSuccess />} />
                <Route path="login" element={<CustomerAuth />} />
                <Route path="orders" element={<OrderHistory />} />
                <Route path="profile" element={<Profile />} />
            </Route>

            {/* Admin Portal */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:id" element={<AdminUserDetails />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="recipes" element={<AdminRecipes />} />
                <Route path="categories" element={<AdminCategories />} />
            </Route>
        </Routes>
    )
}

export default App
