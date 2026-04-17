"use client";

import { useLoginMutation, useProfileQuery } from "@/gql/graphql";
import { useAuth } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { setCookie, getCookie } from "cookies-next";
import toast from "react-hot-toast";

export default function Page() {
	const router = useRouter();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [login] = useLoginMutation({
		onError(error, clientOptions) {
			toast.error(
				<div className=" flex flex-col gap-2">
					<p className=" text-sm font-medium text-foreground-700">
						Lỗi đăng nhập
					</p>
					<p className=" font-semibold text-foreground-900">
						Tên đăng nhập hoặc mật khẩu không đúng
					</p>
				</div>
			);
		},
	});
	const { authData, isLogin, authLogin } = useAuth();
	const { data, loading } = useProfileQuery({ fetchPolicy: "network-only" });

	const handleSignIn = useCallback(async () => {
		const res = await login({ variables: { username, password } });
		if (res.data?.login) {
			authLogin(res.data.login);
			router.push("/");
		}
	}, [login, username, password, authLogin, router]);

	// useEffect(() => {
	// 	if (!!getCookie("isLogin") == true) {
	// 		router.replace("/");
	// 	}
	// }, [isLogin, router]);

	useEffect(() => {
		if (loading === false && data) {
			router.replace("/");
		}
	}, [data, loading, router]);

	return (
		<>
	return (
		<div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC]">
			{/* Left side: branding/welcome */}
			<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-dark to-primary p-12 flex-col justify-between relative overflow-hidden">
				<div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
				
				<div className="relative z-10 flex items-center gap-4">
					<div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl">
						<span className="text-primary-dark font-black text-2xl">A</span>
					</div>
					<h1 className="text-white font-bold text-2xl tracking-tight font-display">AQA Portal</h1>
				</div>

				<div className="relative z-10 max-w-lg">
					<h2 className="text-5xl font-black text-white font-display leading-[1.1] mb-6">
						Hệ thống Đảm bảo Chất lượng Học thuật.
					</h2>
					<p className="text-white/80 text-lg font-medium leading-relaxed">
						Nền tảng quản lý và phân tích dữ liệu hiệu suất giảng dạy chuyên sâu, giúp nâng cao chất lượng giáo dục và trải nghiệm học tập.
					</p>
				</div>

				<div className="relative z-10 text-white/60 text-sm font-bold uppercase tracking-widest">
					&copy; 2026 Academic Quality Assurance Unit
				</div>
			</div>

			{/* Right side: login form */}
			<div className="flex-1 flex items-center justify-center p-8 lg:p-20">
				<div className="w-full max-w-md">
					<div className="mb-10 lg:hidden flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
							<span className="text-white font-black text-lg">A</span>
						</div>
						<h1 className="text-primary-dark font-bold text-xl tracking-tight font-display">AQA Portal</h1>
					</div>

					<div className="mb-10 text-center lg:text-left">
						<h3 className="text-3xl font-black text-slate-900 font-display mb-3">Đăng nhập</h3>
						<p className="text-slate-500 font-medium">Vui lòng nhập thông tin tài khoản của bạn để tiếp tục.</p>
					</div>

					<form
						className="flex flex-col gap-6"
						onSubmit={(e) => {
							e.preventDefault();
							handleSignIn();
						}}
						autoComplete="on"
					>
						<div className="flex flex-col gap-2">
							<label
								className="text-xs font-bold uppercase tracking-widest text-slate-500"
								htmlFor="username"
							>
								Tên đăng nhập
							</label>
							<input
								className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
								id="username"
								type="text"
								name="username"
								placeholder="Nhập tên đăng nhập"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								autoFocus
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label
								className="text-xs font-bold uppercase tracking-widest text-slate-500"
								htmlFor="password"
							>
								Mật khẩu
							</label>
							<input
								className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
								id="password"
								type="password"
								name="password"
								placeholder="Nhập mật khẩu"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						
						<div className="flex items-center justify-between py-2">
							<label className="flex items-center gap-2 cursor-pointer group">
								<input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary transition-all cursor-pointer" />
								<span className="text-sm font-semibold text-slate-600 group-hover:text-primary transition-colors">Ghi nhớ đăng nhập</span>
							</label>
							<a href="#" className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">Quên mật khẩu?</a>
						</div>

						<button
							type="submit"
							className="mt-2 w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transform active:scale-[0.98] transition-all duration-200"
						>
							Đăng nhập vào hệ thống
						</button>
					</form>
					
					<div className="mt-12 text-center border-t border-slate-100 pt-8">
						<p className="text-sm font-medium text-slate-500 mb-4">Hoặc đăng nhập bằng</p>
						<div className="flex justify-center gap-4">
							<button className="flex items-center justify-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm">
								<svg className="w-5 h-5" viewBox="0 0 24 24">
									<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
									<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
									<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
									<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
								</svg>
								Google
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
		</>
	);
}
