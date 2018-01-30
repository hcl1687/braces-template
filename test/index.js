import chai from 'chai'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

global.chai = chai
global.assert = chai.assert
global.expect = chai.expect
global.should = chai.should()

const testsContext = require.context('./', true, /\.spec\.js$/)
testsContext.keys().forEach(testsContext)

const srcContext = require.context('../src/', true, /\.js$/)
srcContext.keys().forEach(srcContext)

// var _ = require('src/util')
// var __ = require('src/util/debug')

// const _spy = sinon.spy()
// _['warn'] = _spy
// __['warn'] = _spy

// global['_spy'] = _spy

// // shim process
// global.process = {
//   env: {
//     NODE_ENV: 'development'
//   }
// }
