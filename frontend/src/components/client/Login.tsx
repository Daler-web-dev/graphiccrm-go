import { Container } from '../server/Container';
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
    login: string
    password: string
}

export const Login = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

    console.log(watch("login"));
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
                    <div className="w-full flex flex-col justify-center items-start">
                        <label
                            htmlFor="login"
                            className="font-normal text-sm text-[#1C1B1F] cursor-pointer"
                        >
                            Логин
                        </label>
                        <input
                            id="login"
                            {...register("login", { required: true })}
                            className="w-full border border-[#79747E] rounded-xl py-2 px-4 text-base font-normal placeholder:text-sm"
                            placeholder="Логин"
                        />
                        {errors.login && (
                            <span className="font-normal text-sm text-red-500">
                                Поле обязательно для заполнения
                            </span>
                        )}
                    </div>
                    <div className="w-full flex flex-col justify-center items-start">
                        <label
                            htmlFor="password"
                            className="font-normal text-sm text-[#1C1B1F] cursor-pointer"
                        >
                            Пароль
                        </label>
                        <input
                            id="password"
                            {...register("password", { required: true })}
                            className="w-full border border-[#79747E] rounded-xl py-2 px-4 text-base font-normal placeholder:text-sm"
                            placeholder="Пароль"
                        />
                        {errors.password && (
                            <span className="font-normal text-sm text-red-500">
                                Поле обязательно для заполнения
                            </span>
                        )}
                    </div>
                    <span className="w-full font-normal text-sm text-cLightBlue text-right cursor-pointer hover:underline">
                        Забыли пароль?
                    </span>
                    <input
                        type="submit"
                        className="w-full transition duration-300 bg-cGradientBg rounded-xl py-3 text-sm font-semibold text-white hover:text-white/80 mt-3 cursor-pointer"
                    />
                </form>
            </div>
        </Container>
    );
};
