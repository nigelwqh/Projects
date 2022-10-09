import React from "react"
import katie_zaferes from "../../images/katie_zaferes.png"
import star from "../../images/star.png"
import ellipse from "../../images/ellipse.png"
import rectangle from "../../images/rectangle.png"
import "./Card.css"

export default function Card() {
    return (
        <section className="card">
            <img c lassName="cardImage" src={katie_zaferes} alt="Katie Zaferes smiling" />
            <div>
                <span className="rating">
                    <img className="star" src={star} alt="Star icon" /> 5.0{" "}
                </span>
                <span className="ratingInfo">
                    (6) <img className="ellipse" src={ellipse} alt="Ellipse" /> USA
                </span>
            </div>
            <p className="cardTitle">Life lessons with Katie Zaferes</p>
            <p className="pricing">
                <b>From $136</b> / person
            </p>
        </section>
    )
}
