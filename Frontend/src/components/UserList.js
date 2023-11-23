import React, { Component } from "react";
import axios from "axios";

export default class UserList extends Component {
  constructor() {
    super();
    this.state = {
      showAddForm: false,
      isEditing: false, // New state to track editing mode
      newUser: {
        name: "",
        email: "",
        password: "",
      },
      userList: [],
      validationErrors: {},
      errorAlert: null,
      successAlert: null,
      selectedUserId: null, // New state to store the ID of the user being edited
    };
  }

  componentDidMount() {
    this.fetchUserList();
  }

  fetchUserList = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        this.setState({ userList: response.data.data });
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/sign-in";
      }
      console.error("Error fetching user list:", error);
    }
  };

  deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const token = localStorage.getItem("token");

      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch updated user list after deletion
        await this.fetchUserList();

        // Display success alert
        this.setState({
          successAlert: (
            <div className="alert alert-success" role="alert">
              User deleted successfully!
            </div>
          ),
        });
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  toggleAddForm = () => {
    // Clear previous timeout if exists
    if (this.state.successAlertTimeoutId) {
      clearTimeout(this.state.successAlertTimeoutId);
    }

    this.setState((prevState) => ({
      showAddForm: !prevState.showAddForm,
      successAlert: null, // Clear any previous success alerts
      isEditing: false, // Clear editing mode
      selectedUserId: null, // Clear selected user ID
    }));

    // Clear success alert after 3000 milliseconds (adjust as needed)
    const timeoutId = setTimeout(() => {
      this.setState({ successAlert: null });
    }, 3000);

    // Store the timeout ID in the state
    this.setState({ successAlertTimeoutId: timeoutId });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newUser: {
        ...prevState.newUser,
        [name]: value,
      },
      validationErrors: {
        ...prevState.validationErrors,
        [name]: null, // Clear previous validation errors for the field
      },
    }));
  };

  addUser = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users`,
        this.state.newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await this.fetchUserList();

      this.setState((prevState) => ({
        // userList: [...prevState.userList, response.data],
        showAddForm: false,
        newUser: { name: "", email: "", password: "" },
        validationErrors: {},
        errorAlert: null, // Clear any previous error alerts
        successAlert: (
          <div className="alert alert-success" role="alert">
            User added successfully!
          </div>
        ),
      }));
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Validation error from the backend
        const validationErrors = error.response.data.errors;
        this.setState({ validationErrors });

        // Display an alert with the validation error message
        const errorMessage = Object.values(validationErrors).flat()[0];
        this.setState({
          errorAlert: (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          ),
        });
      } else {
        // Other errors (e.g., network error)
        console.error("Error adding user:", error);
      }
    }
  };

  // Updated function to handle editing
  editUser = (userId) => {
    const selectedUser = this.state.userList.find((user) => user.id === userId);
    if (selectedUser) {
      this.setState({
        newUser: {
          name: selectedUser.name,
          email: selectedUser.email,
          password: "", // You may want to adjust this based on your use case
        },
        showAddForm: true,
        isEditing: true,
        selectedUserId: userId,
      });
    }
  };

  // Updated function to handle updating
  updateUser = async () => {
    const token = localStorage.getItem("token");
    const userIdToUpdate = this.state.selectedUserId;

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${userIdToUpdate}`,
        this.state.newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch updated user list after update
      await this.fetchUserList();

      // Display success alert
      this.setState({
        successAlert: (
          <div className="alert alert-success" role="alert">
            User updated successfully!
          </div>
        ),
        showAddForm: false,
        newUser: { name: "", email: "", password: "" },
        isEditing: false, // Clear editing mode
        selectedUserId: null, // Clear selected user ID
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Validation error from the backend
        const validationErrors = error.response.data.errors;
        this.setState({ validationErrors });

        // Display an alert with the validation error message
        const errorMessage = Object.values(validationErrors).flat()[0];
        this.setState({
          errorAlert: (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          ),
        });
      } else {
        // Other errors (e.g., network error)
        console.error("Error updating user:", error);
      }
    }
  };

  render() {
    return (
      <div className="container">
        <br />
        <br />
        <br />

        <h3>User List</h3>
        <div className="mb-3">
          <button className="btn btn-success" onClick={this.toggleAddForm}>
            Add User
          </button>
        </div>
        {this.state.successAlert}

        {this.state.showAddForm && (
          <div className="container my-6">
            <form>
              {this.state.errorAlert}
              <div className="mb-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className={`form-control ${
                    this.state.validationErrors.name ? "is-invalid" : ""
                  }`}
                  id="name"
                  placeholder="Enter name"
                  name="name"
                  value={this.state.newUser.name}
                  onChange={this.handleInputChange}
                />
                {this.state.validationErrors.name && (
                  <div className="invalid-feedback">
                    {this.state.validationErrors.name}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className={`form-control ${
                    this.state.validationErrors.email ? "is-invalid" : ""
                  }`}
                  id="email"
                  placeholder="Enter email"
                  name="email"
                  value={this.state.newUser.email}
                  onChange={this.handleInputChange}
                />
                {this.state.validationErrors.email && (
                  <div className="invalid-feedback">
                    {this.state.validationErrors.email}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    this.state.validationErrors.password ? "is-invalid" : ""
                  }`}
                  id="password"
                  placeholder="Enter password"
                  name="password"
                  value={this.state.newUser.password}
                  onChange={this.handleInputChange}
                />
                {this.state.validationErrors.password && (
                  <div className="invalid-feedback">
                    {this.state.validationErrors.password}
                  </div>
                )}
              </div>
              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={
                    this.state.isEditing ? this.updateUser : this.addUser
                  }
                >
                  {this.state.isEditing ? "Update User" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        )}

        <br />

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.userList.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm mr-2"
                    onClick={() => this.editUser(user.id)}
                  >
                    {this.state.isEditing ? "Cancel" : "Edit"}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
