import { Link } from "react-router-dom"
import SignUp from "../components/SignUp"

const RegisterPage = () => {
  return (
    <div>
      <h2>Register</h2>
      <SignUp />
      <Link to='/login'>Login</Link>
    </div>
  )
}

export default RegisterPage