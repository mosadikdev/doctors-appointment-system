import { useState } from 'react';
import axios from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/register', form);
      alert('The registration was successfully ✅');
      console.log(res.data);
    } catch (err) {
      alert('Registration failure ❌');
      console.error(err.response.data);
    }
  };

  return (
    <div>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="password" onChange={handleChange} required />
        <input type="password" name="password_confirmation" placeholder="password confirmation" onChange={handleChange} required />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
