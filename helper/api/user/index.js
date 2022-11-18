import axios from "axios"

const baseUrl = "https://satu-platform-serice.herokuapp.com"

export const getAllUser = async (sortResult) => {
  try {
    let url = `${baseUrl}/users`

    if (Object.keys(sortResult).length > 0) {
      let index = 0
      let urlParam = ""
      for (const key in sortResult) {
        let paramSymbol
        
        index === 0 && (paramSymbol = "?")
        index > 0 && (paramSymbol = "&")
        urlParam += paramSymbol + `${key}=${sortResult[key]}`
      }
      url = url + urlParam
    }

    const result = await axios.get(url)
    return result
  } catch (error) {
    return error
  }
}

export const updateUser = async (payload) => {
  try {
    let url = `${baseUrl}/users/${payload._id}`
    
    const result = await axios.put(url, payload)
    return result
  } catch (error) {
    return error
  }
}