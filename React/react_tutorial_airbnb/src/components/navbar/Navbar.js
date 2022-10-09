import React from "react"
import airbnb_logo from "../../images/airbnb_logo.png"
import "./Navbar.css"

export default function NavBar() {
    return (
        <nav>
            <img className="navLogo" src={airbnb_logo} alt="Airbnb logo" />
        </nav>
    )
}
