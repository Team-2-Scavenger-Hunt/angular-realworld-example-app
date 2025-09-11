import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { Errors } from "../../types";
import ListErrors from "../../shared/components/ListErrors";

const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const isLogin = location.pathname === "/login";
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({ errors: {} });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({ errors: {} });

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      }
      navigate("/");
    } catch (error: unknown) {
      setErrors(
        (error as Errors) || { errors: { "": ["Something went wrong"] } },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">
              {isLogin ? "Sign in" : "Sign up"}
            </h1>
            <p className="text-xs-center">
              {isLogin ? (
                <Link to="/register">Need an account?</Link>
              ) : (
                <Link to="/login">Have an account?</Link>
              )}
            </p>

            <ListErrors errors={errors} />

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="username"
                    placeholder="Your Name"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>
              )}
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </fieldset>
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                type="submit"
                disabled={isSubmitting}
              >
                {isLogin ? "Sign in" : "Sign up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
