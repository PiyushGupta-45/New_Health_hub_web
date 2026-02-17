import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import HealthChatbot from "./components/HealthChatbot"

function Layout({ user, logout }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar user={user} logout={logout} />

      {/* Page Content */}
      <div className="pt-[76px] px-4 md:px-0">
        <Outlet />
      </div>

      <HealthChatbot />
    </div>
  )
}

export default Layout
