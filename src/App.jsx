import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignUpPage from "./components/auth/SignUp";
import VerifyCode from "./components/auth/Verify";
import LoginPage from "./components/auth/Login";
import { Toaster } from "sonner";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/pages/Dashboard";
import DashboardWrap from "./components/DashboardWrap";


function App() {
	return (
		<>
			<Routes>
				<Route element={<PublicRoute />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/sign-up" element={<SignUpPage />} />
					<Route path="/verify-code/:email" element={<VerifyCode />} />
					<Route path="/sign-in" element={<LoginPage />} />
				</Route>

				<Route 
					path="/dashboard" 
					element={
						<PrivateRoute>
							<DashboardWrap />
						</PrivateRoute>
					}
				>
					<Route index element={<Dashboard />} />
					{/* <Route path="createTask" element={<CreateTask />} />
					<Route path="categories" element={<Categories />} />
					<Route path="profile" element={<Profile />} /> */}

				</Route>
			</Routes>
			<Toaster richColors position="top-right" />
		</>
	)
}

export default App;
