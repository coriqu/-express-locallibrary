const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: {type: String, required: true}
  // ,
  // url: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
  // summary: {type: String, required: true},
  // isbn: {type: String, required: true},
  // genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}]
});

// 虚拟属性'url'：genre's URL
GenreSchema
  .virtual('url')
  .get(function () {
    return '/catalog/genre/' + this._id;
  });

// 导出 Genre 模块
module.exports = mongoose.model('Genre', GenreSchema);