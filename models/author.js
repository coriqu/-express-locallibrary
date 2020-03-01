const mongoose = require('mongoose');
var moment = require('moment');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// 虚拟属性'name'：表示作者全名
AuthorSchema
  .virtual('name')
  .get(function () {
    return this.family_name + ', ' + this.first_name;
  });

// 虚拟属性'lifespan'：作者寿命
AuthorSchema
  .virtual('lifespan')
  .get(function () {
    // return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
    // return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
    console.log(moment(this.date_of_birth).format('MMMM Do, YYYY'));
    return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD')+' - '+ moment(this.date_of_death).format('YYYY-MM-DD') : '';
   // return this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY'): '';
  });

// 虚拟属性'url'：作者 URL
AuthorSchema
  .virtual('url')
  .get(function () {
    return '/catalog/author/' + this._id;
    
  });

// 导出 Author 模型
module.exports = mongoose.model('Author', AuthorSchema);