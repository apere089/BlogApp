const bodyParser = require('body-parser'),
methodOverride   = require('method-override'),
mongoose   		   = require('mongoose'),
express 				 = require('express'),
app        			 = express();

//App Config
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

//Mongoose Config
mongoose.connect('mongodb://localhost:27017/blog_app', {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

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

//ROUTES
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
//EDIT route
app.get('/blogs/:id/edit', (req, res) => {
	Blog.findById(req.params.id, (err, blog) => {
		if(err)
			res.redirect('/blogs');
		else
			res.render('edit', {blog: blog});
	});
});
//UPDATE route
app.put('/blogs/:id', (req, res) => {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog) => {
		if(err)
			res.redirect('/blogs');
		else
			res.redirect('/blogs/' + req.params.id);
	});
});
//DELETE route
app.delete('/blogs/:id', (req, res) => {
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if(err)
			res.redirect('/blogs');
		else
			res.redirect('/blogs');	//For now. Todo later
	});
});

app.listen(3000, () => {
	console.log('Blog Server Started - Listening on Port 3000');
})
