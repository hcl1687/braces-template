var assign = require('object-assign')
var base = require('./karma.base.conf.js')

/**
 * Having too many tests running concurrently on saucelabs
 * causes timeouts and errors, so we have to run them in
 * smaller batches.
 */

var batches = {
  // the cool kids
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox'
  },
  sl_mac_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.10'
  },
  sl_ie_8: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '8'
  },
  sl_ie_9: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '9'
  },
  sl_ie_10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8',
    version: '10'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  },
  sl_ios_safari: {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.9',
    version: '7.1'
  },
  sl_android: {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '4.2'
  }
}

batches = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox'
  },
  sl_mac_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.10'
  },
  sl_ie_8: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '8'
  }
}

module.exports = function (config) {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    // eslint-disable-next-line
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
    process.exit(1)
  }

  const bid = process.env.TRAVIS_JOB_NUMBER || 'build-' + Date.now()
  config.set(assign({}, base, {
    browsers: Object.keys(batches),
    customLaunchers: batches,
    reporters: ['progress', 'saucelabs'],
    sauceLabs: {
      testName: 'braces-template unit tests',
      // 是否在测试过程记录虚拟机的运行录像
      recordVideo: false,
      // 是否在测试过程记录虚拟机的图像
      recordScreenshots: false,
      // 测试的记录号，可以为任意字符，如果希望生成矩阵图，build 不能为空
      build: bid,
      startConnect: false,
      tunnelIdentifier: bid,
      public: 'public'
    },
    // mobile emulators are really slow
    captureTimeout: 120000,
    browserNoActivityTimeout: 120000
  }))
}
