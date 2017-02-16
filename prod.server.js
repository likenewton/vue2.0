/**
 * Created by Newton on 2017/2/16.
 */

const express = require('express');
const config = require('./config/index');
const port = process.env.PORT || config.build.port;

let app = express();

let router = express.Router();

router.get('/', function (req, res, next) {
  req.url = './index.html';
  next();
});


app.use(router);

var dataJson = require('./data.json');
var seller = dataJson.seller;
var goods = dataJson.goods;
var ratings = dataJson.ratings;
var apiRouter = express.Router();

apiRouter.get('/seller', function (req,res) {
  res.json({
    errno: 0,
    data: seller
  });
});

apiRouter.get('/goods', function (req,res) {
  res.json({
    errno: 0,
    data: goods
  });
});

apiRouter.get('/ratings', function (req,res) {
  res.json({
    errno: 0,
    data: ratings
  })
})

app.use('/api',apiRouter);

app.use(express.static('./dist'));

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  // if (process.env.NODE_ENV !== 'testing') {
  //   open(uri)
  // }
})
