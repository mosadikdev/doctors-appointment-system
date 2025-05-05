import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Registration successful");
      localStorage.setItem("token", data.token);
    } else {
      alert(data.message || "An error occurred.");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register a new account</h2>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="password_confirmation" type="password" placeholder="Password confirmation" onChange={handleChange} />
      <button type="submit">سجل</button>
    </form>
  );
}
