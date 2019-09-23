const express    = require('express'),
			app        = express(),
			bodyParser = require('body-parser'),
			mongoose   = require('mongoose');

//App Config
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/blog_app', {useUnifiedTopology: true, useNewUrlParser: true});

//MongoDb Config
const blogSchema = mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {
		type: Date,
		default: Date.now
	}
});
var Blog = mongoose.model('Blog', blogSchema);
//Routes
app.get('/', (req, res) => {
	res.redirect('/blogs');
});
//INDEX route
app.get('/blogs', (req, res) => {
	Blog.find({}, (err, blogs) => {
		if(err)
			console.error(err);
		else
			res.render('index', {blogs: blogs});
	});
});
//NEW route
app.get('/blogs/new', (req, res) => {
	res.render('new');
});
//CREATE route
app.post('/blogs', (req, res) => {
	Blog.create(req.body.blog, (err, blog) => {
		if(err)
			res.render('new');
		else
			res.redirect('/blogs');
	});
});
//SHOW route
app.get('/blogs/:id', (req, res) => {
	Blog.findById(req.params.id, (err, blog) => {
		if(err)
			res.redirect('/blogs');
		else
			res.render('show', {blog: blog});
	});
});

app.listen(3000, () => {
	console.log('Blog Server Started - Listening on Port 3000');
})
