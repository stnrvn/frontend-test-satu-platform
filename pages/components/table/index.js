const Table = ({
  data,
  tableHead,
  tableData
}) => {
  return (
    <table className="table table-dark table-hover table-stripped">
      <thead>
        <tr>
          {tableHead?.map((data, i) => (data.row(i)))}
        </tr>
      </thead>
      <tbody>
        {data?.map((result, index) => (
          <tr key={result._id}>
            {tableData?.map((item, i) => (item.row(result, i)))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table