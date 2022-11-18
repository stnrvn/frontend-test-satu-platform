import axios from "axios"

const baseUrl = "https://satu-platform-serice.herokuapp.com"

export const getAllUser = async() => {
  try {
    const response = await axios.get(`${baseUrl}/users`)

    if (response.status === 200) {
      return response
    }
    return response
  } catch (error) {
    return error
  }
}