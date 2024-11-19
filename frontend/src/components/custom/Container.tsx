import React from "react";
import { cn } from "@/lib/utils";

interface Props {
	className?: string;
	children: React.ReactNode;
}

export const Container: React.FC<Props> = ({ className, children }) => {
	return (
		<div
			className={cn(
				"w-full h-full max-w-[1440px] px-5 mx-auto text-center",
				className
			)}
		>
			{children}
		</div>
	);
};
