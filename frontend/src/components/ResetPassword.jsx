import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/Axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("/reset_password", {
        token,
        password: newPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.error);
        navigate("/login");
      }
    } catch (er) {
      toast.error("An error occurred while resetting your password.");
    }
  };

  const validateToken = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/validate_token", { token });
      setValid(res.data.success);
    } catch (er) {
      toast.error("Token validation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p className="text-lg font-medium text-gray-600">Validating token...</p>
        </div>
      ) : valid ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter new password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <h1 className="text-2xl font-bold text-red-500">Invalid or expired token</h1>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
