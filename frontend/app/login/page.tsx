"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import firebaseAuth, { db } from "@/firebaseAuth";
import FormManager from "@/app/Components/Common/FormManager";
import { TextBox } from "@/app/Components/UI";
import { Box, Button, Typography } from "@mui/material";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    email: "",
    password: "",
  });
  const yupSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const { email, password } = values;
      let userData;
      if (isLogin) {
        const { user }: any = await signInWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );
        userData = user;
      } else {
        const { user }: any = await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          uid: user.uid,
          createdAt: new Date().toISOString(),
        });
        userData = user;
        alert("Account created!");
      }
      if (!userData) return;
      localStorage.setItem("accessToken", userData.accessToken);
      localStorage.setItem("email", userData.email);
      setInitialValues({
        email: "",
        password: "",
      });
      router.replace("/");
    } catch (e: any) {
      console.error("Error:", e.message, e.code);
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <Box
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3">{isLogin ? "Login" : "Register"}</Typography>
      <FormManager
        initialValues={initialValues}
        yupSchema={yupSchema}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          submitDisable,
          touched,
          values,
        }) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 3,
              width: "400px",
            }}
          >
            <TextBox
              type="email"
              placeholder="Email"
              name="email"
              fullWidth
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email && errors.email}
            />
            <TextBox
              type="password"
              placeholder="Password"
              name="password"
              fullWidth
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
              error={touched.password && Boolean(errors.password)}
              helperText={
                touched.password && errors.password && errors.password
              }
            />
            <Button
              type="submit"
              variant="rounded"
              disabled={loading ? loading : submitDisable}
            >
              {isLogin ? "Login" : "Register"}
            </Button>
          </Box>
        )}
      </FormManager>
      <Button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: 20 }}>
        {isLogin
          ? "Need an account? Register"
          : "Already have an account? Login"}
      </Button>
    </Box>
  );
};

export default LoginPage;
