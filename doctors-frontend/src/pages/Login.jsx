import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', form);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert('Sign in successful ✅');
      console.log(res.data);
      navigate("/doctors");
    } catch (err) {
      alert('Incorrect data ❌');
      console.error(err.response.data);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
