import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: ""
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const [message, setMessage] = useState("");

  const fetchProfile = async () => {
    try {
        
      const res = await API.get("/auth/profile");
      setProfile(res.data.user);
    } catch (error) {
      setMessage("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (e) => {
  e.preventDefault();

  try {
    const res = await API.put(
      "/auth/profile",
      profileForm
    );

    toast.success(
      res.data.message ||
        "Profile updated successfully"
    );

    fetchProfile();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to update profile"
    );
  }
};

  const changePassword = async (e) => {
  e.preventDefault();

  try {
    const res = await API.put(
      "/auth/change-password",
      passwordForm
    );

    toast.success(
      res.data.message ||
        "Password changed successfully"
    );

    setPasswordForm({
      currentPassword: "",
      newPassword: ""
    });
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to change password"
    );
  }
};

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      {message && <p className="status-text">{message}</p>}

      <div className="profile-layout">
        <form className="profile-card" onSubmit={updateProfile}>
          <h2>Profile Details</h2>

          <input
            type="text"
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
            placeholder="Name"
            required
          />

          <input
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
            placeholder="Email"
            required
          />

          <input type="text" value={profile.role} disabled />

          <button type="submit">Update Profile</button>
        </form>

        <form className="profile-card" onSubmit={changePassword}>
          <h2>Change Password</h2>

          <input
            type="password"
            placeholder="Old Password"
            value={passwords.oldPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, oldPassword: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            required
          />

          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;