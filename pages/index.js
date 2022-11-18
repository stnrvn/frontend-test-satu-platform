import { useEffect, useState } from 'react'
import Table from './components/table'
import { getAllUser, updateUser } from '../helper'
import { Formik, Form, Field, ErrorMessage } from 'formik'

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

  const handleChangeFormEmail = (e) => {
    const { value, name } = e.target
    setUserData(prevState => ({...prevState, email: value}))
  }
  console.log('render')
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
    console.log("321312")
    fetchUser()
  },[sort])

  useEffect(() => {}, [data])

  return (
      <div className="container-fluid mt-5 pe-5 ps-5">
        <div className="row mb-3">
          <div className="col-md-1 px-0 me-3">
            <span style={{ fontSize: "14px" }}>Sort by name</span>
            <select className="form-select form-select-sm" name="name" onChange={(e) => handleSortChange(e)}>
              <option selected value="default">Default</option>
              <option value="ASC">(a - z)</option>
              <option value="DESC">(z - a)</option>
            </select>
          </div>
          <div className="col-md-1 me-3">
            <span style={{ fontSize: "14px" }}>Sort by gender</span>
            <select className="form-select form-select-sm" name="gender" onChange={(e) => handleSortChange(e)}>
              <option selected value="default">Default</option>
              <option value="ASC">(a - z)</option>
              <option value="DESC">(z - a)</option>
            </select>
          </div>
          <div className="col-md-1 me-3">
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

        {/* modal edit */}
      <div style={{ display: showModalEdit ? 'block' : 'none' }} className="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Update Email</h1>
              <button type="button" className="btn-close" onClick={() => setShowModalEdit(false)}></button>
            </div>
            <div className="modal-body">
              <Formik
                enableReinitialize
                initialValues={userData}
                validate={values => {
                  const errors = {};
                  if (!values.email) {
                    errors.email = 'Required'
                  } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                  ) {
                    errors.email = 'Invalid email address'
                  }
                  return errors
                }}
                onSubmit={() => handleUpdate()}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Field
                      type="email"
                      name="email"
                      className="form-control mb-3"
                      onChange={(e) => handleChangeFormEmail(e)}
                    />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowModalEdit(false)}>Close</button>
                      <button type="submit" className={`btn btn-success ${emailError && "disabled"}`} onClick={() => handleUpdate()} disabled={isSubmitting}>Save changes</button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            
          </div>
        </div>
      </div>
      </div>
  )
}

export default Home