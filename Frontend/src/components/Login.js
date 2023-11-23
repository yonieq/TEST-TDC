import React, { Component } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      rememberMe: false,
      errorMessage: null,
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleCheckboxChange = () => {
    this.setState({ rememberMe: !this.state.rememberMe });
  };

  // Fungsi untuk memperbarui token setiap 5 menit
  updateToken = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/refresh-token"
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
    } catch (error) {
      console.error("Token refresh error", error.response.data);
      this.setState({ errorMessage: error.response.data.message });

      // Hapus token dari localStorage dan arahkan ke halaman login jika refresh token gagal
      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 5000);
    }
  };

  // Fungsi untuk login
  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/login",
        {
          email: this.state.email,
          password: this.state.password,
        }
      );

      // Periksa apakah response tidak undefined dan memiliki properti data
      if (response && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);

        // Alihkan ke halaman /users setelah berhasil login
        // const navigate = useNavigate();
        window.location.href = "/users";
      }
    } catch (error) {
      // Tangkap kesalahan dan tampilkan pesan kesalahan
      console.error(
        "Login error",
        error.response ? error.response.data : error.message
      );
      this.setState({
        errorMessage: error.response
          ? error.response.data.message
          : error.message,
      });

      // Sembunyikan pesan kesalahan setelah 5 detik
      setTimeout(() => {
        this.setState({ errorMessage: null });
      }, 5000);
    }
  };

  render() {
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={this.handleSubmit}>
            <h3>Sign In</h3>
            {this.state.errorMessage && (
              <div className="alert alert-danger" role="alert">
                {this.state.errorMessage}
              </div>
            )}
            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                  name="rememberMe"
                  checked={this.state.rememberMe}
                  onChange={this.handleCheckboxChange}
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Remember me
                </label>
              </div>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="forgot-password text-right">
              Forgot <a href="#">password?</a>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
