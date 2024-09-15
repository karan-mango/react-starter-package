import React, { useContext, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MyContext } from "@/contextapi/ContextApi";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters").max(50),
  password: z.string().min(5, "Password must be at least 5 characters").max(50),
});

export default function Login() {
  const { isAuth, setIsAuth } = useContext(MyContext);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Send login request
      const response = await axios.post("http://localhost:3002/login", values);
      const { token, complaints } = response.data;

      // Save the token and unit to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("unit", complaints[0]?.unit || ""); // Save user unit
      
      // Update context or auth state
      setIsAuth(true);
      
      // Navigate to the home page
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-500">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      className="border border-gray-300 rounded-md p-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500">
                    {form.formState.errors.username?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="border border-gray-300 rounded-md p-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500">
                    {form.formState.errors.password?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
