import React from "react";
import { toast } from "@/hooks/use-toast";
import { Container } from "@/components/custom/Container";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { postRequest } from "@/lib/apiHandlers";
import Cookies from "js-cookie";

interface SigninProps { }

type Inputs = {
	username: string;
	password: string;
};

const Signin: React.FC<SigninProps> = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = React.useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		setLoading(true);
		const res = await postRequest({
			url: "/login",
			data,
		});

		if (res.status === 200 || res.status === 201) {
			Cookies.set("accessToken", res.data.token);
			toast({
				title: "Успешная авторизация",
				description: "Вы успешно авторизовались",
			})
			setLoading(false);
			navigate("/");
		} else {
			toast({
				title: "Ошибка при авторизации",
				description: "Проверьте введенные данные",
				variant: "destructive",
			});
		}
	};

	return (
		<Container className="flex justify-center items-center min-h-screen">
			<div className="flex flex-col justify-center items-center gap-20">
				<div className="text-8xl font-normal bg-cGradientBg1 bg-clip-text text-transparent">
					С возвращением
				</div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full max-w-[400px] flex flex-col justify-center items-center gap-2"
				>
					<div className="w-full flex flex-col justify-center items-start gap-1">
						<label
							htmlFor="login"
							className="font-normal text-sm text-[#1C1B1F] cursor-pointer"
						>
							Логин
						</label>
						<input
							id="login"
							{...register("username", { required: true })}
							className="w-full border border-[#79747E] rounded-xl py-2 px-4 text-base font-normal placeholder:text-sm"
							placeholder="Логин"
							autoComplete="off"
						/>
						{errors.username && (
							<span className="font-normal text-sm text-red-500">
								Поле обязательно для заполнения
							</span>
						)}
					</div>
					<div className="w-full flex flex-col justify-center items-start gap-1">
						<label
							htmlFor="password"
							className="font-normal text-sm text-[#1C1B1F] cursor-pointer"
						>
							Пароль
						</label>
						<input
							id="password"
							type="password"
							{...register("password", { required: true })}
							className="w-full border border-[#79747E] rounded-xl py-2 px-4 text-base font-normal placeholder:text-sm"
							placeholder="Пароль"
							autoComplete="off"
						/>
						{errors.password && (
							<span className="font-normal text-sm text-red-500">
								Поле обязательно для заполнения
							</span>
						)}
					</div>
					<input
						disabled={loading}
						type="submit"
						className="w-full transition duration-300 bg-cGradientBg rounded-xl py-3 text-sm font-semibold text-white hover:text-white/80 mt-3 cursor-pointer"
					/>
				</form>
			</div>
		</Container>
	);
};

export default Signin;
