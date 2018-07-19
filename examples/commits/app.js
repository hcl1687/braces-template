/**
 * Test mocks
 */

var mocks = {
  master: [
    {
      'sha': '8a575e48e4ae74886cd2dafd4c9968ed84e31aa4',
      'commit': {
        'author': {
          'name': '何春霖',
          'email': 'hcl1687@gmail.com',
          'date': '2018-05-30T10:53:03Z'
        },
        'message': 'update sauce config'
      },
      'html_url': 'https://github.com/hcl1687/braces-template/commit/8a575e48e4ae74886cd2dafd4c9968ed84e31aa4'
    },
    {
      'sha': '44a4816a4201d03bee9ba8d538fd247ecf48f548',
      'commit': {
        'author': {
          'name': '何春霖',
          'email': 'hcl1687@gmail.com',
          'date': '2018-05-30T10:16:18Z'
        },
        'message': 'update config'
      },
      'html_url': 'https://github.com/hcl1687/braces-template/commit/44a4816a4201d03bee9ba8d538fd247ecf48f548'
    },
    {
      'sha': '949d0ae5bf41f630c9e1aff8a2f861d10caf5e11',
      'commit': {
        'author': {
          'name': '何春霖',
          'email': 'hcl1687@gmail.com',
          'date': '2018-05-30T10:12:04Z'
        },
        'message': 'update karma config'
      },
      'html_url': 'https://github.com/hcl1687/braces-template/commit/949d0ae5bf41f630c9e1aff8a2f861d10caf5e11'
    }
  ]
}

/**
 * Actual demo
 */
new Braces({
  el: '#demo',
  data: {
    branches: ['master', 'develop'],
    commits: mocks.master
  },
  methods: {
    handleChange: function (e) {
      var branch = e.target.id
      var cSpan = document.getElementById('current-branch')
      cSpan.innerText = branch
    }
  }
})
