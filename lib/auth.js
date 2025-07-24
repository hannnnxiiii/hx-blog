import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const getServerAuth = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  let isAuthenticated = false

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      isAuthenticated = !!decoded?.userId
    } catch (e) {
      // token 失效或伪造
    }
  }
  return isAuthenticated
}

export default getServerAuth
