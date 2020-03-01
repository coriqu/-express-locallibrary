const Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
//在控制器中使用 express-validator 验证器，
//須导入我们想要从 'express-validator/check' 和 'express-validator/filter' 模块中使用的函数。
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// 显示完整的藏书种类列表
// exports.genre_list = (req, res) => {
//   res.send('未实现：藏书种类列表');
// };
exports.genre_list = function(req, res, next) {

  Genre.find()
    // .populate('book')
    .exec(function (err, list_genre) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('genre_list', { title: 'Genre List', genre_list: list_genre });
    });
    
};

// 为每一类藏书显示详细信息的页面
// exports.genre_detail = (req, res) => {
//   res.send('未实现：藏书种类详细信息：' + req.params.id);
// };
// Display detail page for a specific Genre.
// 该方法使用async.parallel()，并行查询类型名称及其相关联的书本，并在（如果）两个请求成功完成时，回调呈现页面。
// 所需种类记录的 ID ，在 URL 的末尾编码，并根据路由定义（/genre/:id）自动提取。
// 通过请求参数（req.params.id）在控制器内访问 ID。它在Genre.findById()中用于获取当前种类。
// 还用于获取符合当前种类的所有Book对象，就是在种类字段中具有种类ID的那些 Book.find({ 'genre': req.params.id })。
exports.genre_detail = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
    });

};




// 由 GET 显示创建藏书种类的表单
// exports.genre_create_get = (req, res) => {
//   res.send('未实现：藏书种类创建表单的 GET');
// };
// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next) {       
    res.render('genre_form', { title: 'Create Genre' });
    // res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
};
// 由 POST 处理藏书种类创建操作
// exports.genre_create_post = (req, res) => {
//   res.send('未实现：创建藏书种类的 POST');
// };
// Handle Genre create on POST.
exports.genre_create_post =  [
   
    // Validate that the name field is not empty.
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre(
          { name: req.body.name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({ 'name': req.body.name })
                .exec( function(err, found_genre) {
                     if (err) { return next(err); }

                     if (found_genre) {
                         // Genre exists, redirect to its detail page.
                         res.redirect(found_genre.url);
                     }
                     else {

                         genre.save(function (err) {
                           if (err) { return next(err); }
                           // Genre saved. Redirect to genre detail page.
                           res.redirect(genre.url);
                         });

                     }

                 });
        }
    }
];

// 由 GET 显示删除藏书种类的表单
exports.genre_delete_get = (req, res) => {
  res.send('未实现：藏书种类删除表单的 GET');
};

// 由 POST 处理藏书种类删除操作
exports.genre_delete_post = (req, res) => {
  res.send('未实现：删除藏书种类的 POST');
};

// 由 GET 显示更新藏书种类的表单
exports.genre_update_get = (req, res) => {
  res.send('未实现：藏书种类更新表单的 GET');
};

// 由 POST 处理藏书种类更新操作
exports.genre_update_post = (req, res) => {
  res.send('未实现：更新藏书种类的 POST');
};