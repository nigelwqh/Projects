import TableRow from "./TableRow"

const Table = ({ items, errMsg }) => {
    return !errMsg ? (
        <table>
            <tbody>
                {items.map((item) => (
                    <TableRow key={item.id} item={item} />
                ))}
            </tbody>
        </table>
    ) : (
        <p className="errorOutput">Error: {errMsg}</p>
    )
}

export default Table
