/**
 * Auth Page - Backend removed
 * Now just navigates to home without actual authentication
 */
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/innovator/ui/button";
import { Input } from "@/components/innovator/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/innovator/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/innovator/ui/tabs";
import { Fish } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No authentication - just navigate to home
    navigate("/innovator");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Fish className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Welcome to Fishtank</CardTitle>
          <CardDescription>Sign in or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email">Email</label>
                  <Input type="email" id="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password">Password</label>
                  <Input type="password" id="password" placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full">Sign In</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signup-name">Full Name</label>
                  <Input type="text" id="signup-name" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-email">Email</label>
                  <Input type="email" id="signup-email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-password">Password</label>
                  <Input type="password" id="signup-password" placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full">Sign Up</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
