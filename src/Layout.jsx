import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"

function Layout({ user, logout }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar user={user} logout={logout} />

      {/* Page Content */}
      <div className="pt-[20px] px-4 md:px-0">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
