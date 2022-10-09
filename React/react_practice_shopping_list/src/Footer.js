const Footer = ({ length }) => {
    return (
        <footer>
            <p>
                {length} {length === 1 ? "item" : "items"} in list
            </p>
        </footer>
    )
}

export default Footer
