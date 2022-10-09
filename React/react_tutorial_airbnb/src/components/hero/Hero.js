import React from "react"
import photo_grid from "../../images/photo_grid.png"
import "./Hero.css"

export default function Hero() {
    return (
        <section className="hero">
            <img className="heroImage" src={photo_grid} alt="A collection of photos" />
            <h1 className="heroHeader">Online Experiences</h1>
            <p className="heroParagraph">
                Join unique interactive activities led by one-of-a-kind hosts--all without leaving
                home.
            </p>
        </section>
    )
}
