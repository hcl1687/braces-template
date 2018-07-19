casper.test.begin('commits', function (test) {
  casper.start('examples/commits/index.html')
    .then(function () {
      test.assertElementCount('input', 2)
      test.assertElementCount('label', 2)
      test.assertSelectorHasText('label[for="master"]', 'master')
      test.assertSelectorHasText('label[for="develop"]', 'develop')

      test.assertElementCount('li', 3)
      test.assertSelectorHasText('li:first-child a.commit', '8a575e4')
      test.assertSelectorHasText('li:first-child span.message', 'update sauce config')
      test.assertSelectorHasText('li:first-child span.author', '何春霖')
      test.assertSelectorHasText('li:first-child span.date', '2018-05-30T10:53:03Z')
    }).thenClick('input[value="master"]', function () {
      test.assertSelectorHasText('#current-branch', 'master')
    }).thenClick('input[value="develop"]', function () {
      test.assertSelectorHasText('#current-branch', 'develop')
    }).run(function () {
      test.done()
    })
})
