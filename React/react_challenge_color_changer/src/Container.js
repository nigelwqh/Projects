const Container = ({ bgColor, bgHex, isDarkText }) => {
    return (
        <div
            className="container"
            style={{ backgroundColor: bgColor, color: isDarkText ? "#000" : "#FFFF" }}
        >
            <p>{bgColor ? bgColor : "Empty value"}</p>
            <p>{bgHex ? bgHex : null}</p>
        </div>
    )
}

Container.defaultProps = {
    bgColor: "Empty background color value",
}

export default Container
