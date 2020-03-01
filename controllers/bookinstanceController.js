const BookInstance = require('../models/bookinstance');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var Book = require('../models/book');

// 显示完整的藏书副本列表
// exports.bookinstance_list = (req, res) => {
//   res.send('未实现：藏书副本列表');
// };
// 
// The method uses the model's find() function to return all BookInstance objects. 
// It then daisy-chains a call to populate() with the book field—this will replace the book id stored 
// for each BookInstance with a full Book document.
// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {

  BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstances) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
    });
    
};

// 为藏书的每一本副本显示详细信息的页面
// exports.bookinstance_detail = (req, res) => {
//   res.send('未实现：藏书副本详细信息：' + req.params.id);
// };
// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {

    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) { return next(err); }
      if (bookinstance==null) { // No results.
          var err = new Error('Book copy not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('bookinstance_detail', { title: 'Copy: '+bookinstance.book.title, bookinstance:  bookinstance});
    })
 
};
// 由 GET 显示创建藏书副本的表单
// exports.bookinstance_create_get = (req, res) => {
//   res.send('未实现：藏书副本创建表单的 GET');
// };
// Display BookInstance create form on GET.
// 控制器取得所有书本的列表 (book_list) 并将它传送到视图 bookinstance_form.pug (里面附加上 title)。
exports.bookinstance_create_get = function(req, res, next) {       

    Book.find({},'title')
    .exec(function (err, books) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('bookinstance_form', {title: 'Create BookInstance', book_list:books});
    });
    
};

// 由 POST 处理藏书副本创建操作
// exports.bookinstance_create_post = (req, res) => {
//   res.send('未实现：创建藏书副本的 POST');
// };
// Handle BookInstance create on POST.
// 首先，我们验证数据，并為数据做無害化處理。
// 如果数据无效，我们会重新显示表單，以及用户最初输入的数据，還有错误消息列表。
// 如果数据有效，我们保存新的BookInstance记录，并将用户重定向到详细信息页面。
exports.bookinstance_create_post = [

    // Validate fields.
    body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
    // Sanitize fields.
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance(
          { book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({},'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('bookinstance_form', { title: 'Create BookInstance', book_list : books, selected_book : bookinstance.book._id , errors: errors.array(), bookinstance:bookinstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            bookinstance.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(bookinstance.url);
                });
        }
    }
];
// 由 GET 显示删除藏书副本的表单
exports.bookinstance_delete_get = (req, res) => {
  res.send('未实现：藏书副本删除表单的 GET');
};

// 由 POST 处理藏书副本删除操作
exports.bookinstance_delete_post = (req, res) => {
  res.send('未实现：删除藏书副本的 POST');
};

// 由 GET 显示更新藏书副本的表单
exports.bookinstance_update_get = (req, res) => {
  res.send('未实现：藏书副本更新表单的 GET');
};

// 由 POST 处理藏书副本更新操作
exports.bookinstance_update_post = (req, res) => {
  res.send('未实现：更新藏书副本的 POST');
};