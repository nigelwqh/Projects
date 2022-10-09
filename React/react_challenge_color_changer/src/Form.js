import colorNames from "colornames"

const Form = ({ bgColor, setBgColor, setBgHex, isDarkText, setIsDarkText }) => {
    return (
        <form className="inputColor" onSubmit={(e) => e.preventDefault()}>
            <input
                autoFocus
                placeholder="Add color name"
                type="text"
                value={bgColor}
                onChange={(e) => {
                    setBgColor(e.target.value)
                    setBgHex(colorNames(e.target.value))
                }}
            ></input>
            <button onClick={() => setIsDarkText(!isDarkText)}>Toggle text color</button>
        </form>
    )
}

export default Form
