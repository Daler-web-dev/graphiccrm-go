function submit(event) {
	event.preventDefault();

	const user = {}

	const fm = new FormData(event.target)

	fm.forEach((key, value) => user[key] = value )

	console.log(user);
}