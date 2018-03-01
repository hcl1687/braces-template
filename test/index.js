const testsContext = require.context('./', true, /\.spec\.js$/)
testsContext.keys().forEach(testsContext)

const srcContext = require.context('../src/', true, /\.js$/)
srcContext.keys().forEach(srcContext)

// // shim process
global.process = {
  env: {
    NODE_ENV: 'development'
  }
}
