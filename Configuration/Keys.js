if(process.env.NODE_ENV=="production"){
    module.exports = require('./Prod')

}else{
    module.exports = require('./Dev')
}