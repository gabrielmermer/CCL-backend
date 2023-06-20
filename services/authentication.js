const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.DB_PASSWORD;

function authenticateUser(req, users, res){
	console.log(users);
	console.log(req.body);

	const {username, password} = req.body;
	console.log(username, password);

	console.log("users:", users);
	const user = users.find(u => {
		return u.username === username && u.password === password
	});
	console.log("user ", user);

	if (user) {
		console.log("USER FOUND ", user)
		const accessToken = jwt.sign({ id: user.id, name: user.name }, ACCESS_TOKEN_SECRET);
		res.cookie('accessToken', accessToken);
		res.redirect("http://localhost:5173/rss")
	} else {
		res.send('Username or password incorrect');
	}

}


function authenticateJWT(req, res, next) {
	const token = req.cookies['accessToken'];
	console.log(token);
	if (token) {
		jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) {
				return res.sendStatus(403);
			}
			console.log(user);
			req.user = user;
			next();
		});
		} else {
			res.sendStatus(401);
		}
}




module.exports = {
	authenticateUser,
	authenticateJWT
};
