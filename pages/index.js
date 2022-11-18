import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { Table } from './components'
import { getAllUser, updateUser } from './helper'

const Home = () => {
  const [data, setData] = useState([])
  const [showModalEdit, setShowModalEdit] = useState(false)
  const [userData, setUserData] = useState({})
  const [emailError, setEmailError] = useState(null);

  const [tableHead, _setTableHead] = useState([
    {
      row: (i) => {
        return (
          <th key={i} scope="col">Name</th>
        )
      }
    },
    {
      row: (i) => {
        return (
          <th key={i} scope="col">Email</th>
        )
      }
    },
    {
      row: (i) => {
        return (
          <th key={i} scope="col">Gender</th>
        )
      }
    },
    {
      row: (i) => {
        return (
          <th key={i} scope="col">Address</th>
        )
      }
    },
    {
      row: (i) => {
        return (
          <th key={i} scope="col">Action</th>
        )
      }
    }
  ])

  const [tableData, _setTableData] = useState([
    {
      row: (item, i) => {
        return (
          <th key={i}>{`${item.firstName} ${item.lastName}`}</th>
        )
      }
    },
    {
      row: (item, i) => {
        return (
          <th key={i}>{item.email}</th>
        )
      }
    },
    {
      row: (item, i) => {
        return (
          <th key={i}>{item.gender}</th>
        )
      }
    },
    {
      row: (item, i) => {
        let address = [];
        item.address.forEach((result, i) => {
          address.push(`${i + 1}. ${result.street} ${result.house} ${result.city} ${result.country}`)
        })
        return (
          <th key={i}>{address.join(', ')}</th>
        )
      }
    },
    {
      row: (item, i) => {
        return (
          <th key={i}><button type="button" className="btn btn-success" onClick={() => {setShowModalEdit(true), setUserData(item)}}>Edit</button></th>
        )
      }
    }
  ])

  const [sort, setSort] = useState({})

  const fetchUser = async() => {
    const result = await getAllUser(sort)

    if (result) {
      if (result.status === 200) {
        setData(result.data)
      }
    }
  }

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleChangeFormEmail = (e) => {
    const { value, name } = e.target

    if (!isValidEmail(value)) {
      setEmailError('Email is invalid')
    } else {
      setEmailError(null)
      setUserData(prevState => ({...prevState, email: value}))
    }
  }

  const handleSortChange = (e) => {
    const { value, name } = e.target
    let sortResult = {...sort}
    if (value === "default" && sortResult[name]) {
      delete sortResult[name]
    } else {
      sortResult[name] = value
    }
    setSort(sortResult)
    fetchUser()
  }

  const handleUpdate = async() => {
    const result = await updateUser(userData)

    if (result.status === 201) {
      setShowModalEdit(false)
      fetchUser()
    }
  }

  useEffect(() => {
    fetchUser()
  },[sort])

  return (
    <div className={styles.container}>
      <div className="container-fluid mt-5">
        <div className="row mb-3">
          <div className="col-md-1 px-0 me-3">
            <span style={{ fontSize: "14px" }}>Sort by name</span>
            <select className="form-select form-select-sm" name="name" onChange={(e) => handleSortChange(e)}>
              <option selected value="default">Default</option>
              <option value="ASC">(a - z)</option>
              <option value="DESC">(z - a)</option>
            </select>
          </div>
          <div className="col-md-1 px-0 me-3">
            <span style={{ fontSize: "14px" }}>Sort by gender</span>
            <select className="form-select form-select-sm" name="gender" onChange={(e) => handleSortChange(e)}>
              <option selected value="default">Default</option>
              <option value="ASC">(a - z)</option>
              <option value="DESC">(z - a)</option>
            </select>
          </div>
          <div className="col-md-1 px-0 me-3">
            <span style={{ fontSize: "14px" }}>Sort by most addresses</span>
            <select className="form-select form-select-sm" name="address" onChange={(e) => handleSortChange(e)}>
              <option selected value="default">Default</option>
              <option value="ASC">(least - most)</option>
              <option value="DESC">(most - least)</option>
            </select>
          </div>
        </div>
        <div className="row">
          <Table
            data={data}
            tableHead={tableHead}
            tableData={tableData}
          />
        </div>
      </div>

      {/* modal edit */}
      <div style={{ display: showModalEdit ? 'block' : 'none' }} className="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Update Email</h1>
              <button type="button" className="btn-close" onClick={() => setShowModalEdit(false)}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label for="exampleInputEmail1" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    name="email"
                    defaultValue={userData.email}
                    onChange={(e) => handleChangeFormEmail(e)}
                  />
                  { emailError &&  <div id="emailHelp" className="form-text text-danger">{emailError}</div> }
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModalEdit(false)}>Close</button>
              <button type="button" className={`btn btn-success ${emailError && "disabled"}`} onClick={() => handleUpdate()}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home