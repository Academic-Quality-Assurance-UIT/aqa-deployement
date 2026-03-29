interface PropTypes {
	searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ searchParams }: PropTypes) {
	const reason = searchParams.reason;

	return (
		<div className=" w-screen h-screen grid place-items-center">
			<div className=" flex flex-col items-center gap-2">
				<h1 className=" text-3xl font-bold">
					Đăng nhập không thành công
				</h1>
				{reason && <p>{reason}</p>}
			</div>
		</div>
	);
}
