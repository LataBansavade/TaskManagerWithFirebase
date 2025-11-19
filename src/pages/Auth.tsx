import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";

function Auth() {
  const { login, signup, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // ----- FORM STATE -----
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // -----------------------------
  // LOGIN HANDLER
  // -----------------------------

//   When to Use React.FormEvent?
// Use React.FormEvent when handling form-related events, such as:

// onSubmit
// onChange
// onReset

// const handleLogin = (e) => {
//   e.preventDefault(); // Works, but no type checking
// };
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login({ email, password });
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error(error);
    }
  };

  // -----------------------------
  // SIGNUP HANDLER
  // -----------------------------
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const ok = await signup({ email, password, name });
      if (ok) {
        toast.success("Signup successful!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      console.error(error);
    }
  };

  // -----------------------------
  // FORGOT PASSWORD HANDLER
  // -----------------------------
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await forgotPassword(email);
      if (res.success) {
        toast.success("Password reset email sent!");
      } else {
        toast.error(res.message || "Could not send email.");
      }
    } catch (error) {
      toast.error("An error occurred.");
      console.error(error);
    }
  };

  // Which submit function to use?
  
// If isForgotPassword is true, onSubmit is set to handleForgotPassword.
// If isForgotPassword is false but isLogin is true, onSubmit is set to handleLogin.
// If both isForgotPassword and isLogin are false, onSubmit is set to handleSignup.

  const onSubmit = isForgotPassword
    ? handleForgotPassword
    : isLogin
    ? handleLogin
    : handleSignup;

  return (
    <div className="flex items-center justify-center h-dvh bg-linear-to-r from-purple-400 to-blue-300">
      <div className="w-full flex items-center justify-center ">
        <Card className="w-full max-w-sm  bg-white/70 backdrop-blur-3xl">
          <CardHeader>
            <CardTitle>
              {isForgotPassword
                ? "Reset your password"
                : isLogin
                ? "Login to your account"
                : "Create a new account"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-6">

                {/* Name (Signup only) */}
                {!isLogin && !isForgotPassword && (
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="abc@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                {!isForgotPassword && (
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="abc@123"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Confirm Password (Signup only) */}
                {!isLogin && !isForgotPassword && (
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="abc@123"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      required
                    />
                  </div>
                )}
              </div>

              <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full mt-5">
                  {isForgotPassword
                    ? "Send Reset Email"
                    : isLogin
                    ? "Login"
                    : "Signup"}
                </Button>

                {isForgotPassword ? (
                  <Button
                    variant="link"
                    className="w-full mt-2"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setIsLogin(true);
                    }}
                  >
                    Back to Login
                  </Button>
                ) : (
                  <>
                    {isLogin && (
                      <p className="text-sm text-gray-600">
                        Forgot your password?{" "}
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setIsForgotPassword(true)}
                          className="p-0 h-auto text-blue-600 underline"
                        >
                          Reset it here
                        </Button>
                      </p>
                    )}

                    <Button
                      variant="link"
                      className="w-full mt-2"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      {isLogin
                        ? "Don't have an account? Signup"
                        : "Already have an account? Login"}
                    </Button>
                  </>
                )}
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Auth;
