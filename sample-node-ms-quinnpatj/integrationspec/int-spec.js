/* eslint-env mocha */
'use strict'

const request = require('supertest')
const async = require('async')
const exec = require('child_process').exec // eslint-disable-line
const diff = require('deep-diff').diff
const diffReport = require('nmlvhub-node-integrationtests-diffreport')

const environment = process.env.environment || 'int'

const apikey = process.env.apikey

let url = ''

// ****************************************************************************
// NOTE: Suppliment the health and doc route tests with your other routes
//       using the sample "test3xxxxx" variables below as an example
// ****************************************************************************

let test1Path = ''
let test2Path = ''
// Let test3Path
// let test3Header1
// let test3Header2
// let test3Cookie

switch (environment) {
  case 'int':
    url = 'https://api-int.nmlv.nml.com/v1'

    test1Path = '/ms/app/health'
    test2Path = '/ms/app/doc'
    //     Test3Path = '/ms/app/client/YSNW0YNC8Z'
    //     test3Header1 = 'W67GLXNLTG'
    //     test3Header2 = 'A'
    //     test3Cookie = 'X_NM_CLIENT_CONTEXT={"clientNmUniqueId":"YSNW0YNC8Z"}'
    break
  case 'prod':
    url = 'https://api.nmlv.nml.com/v1'

    test1Path = '/ms/app/health'
    test2Path = '/ms/app/doc'
    //     Test3Path = '/ms/app/client/R9JRL7V6B2'
    //     test3Header1 = 'KK1XVEM9TM'
    //     test3Header2 = 'A'
    //     test3Cookie = 'X_NM_CLIENT_CONTEXT={"clientNmUniqueId":"R9JRL7V6B2"}'
    break
  default:
    if (process.env.KUBERNETES_SERVICE_HOST) {
      url = 'http://localhost/api/v1'
    } else {
      url = 'http://localhost:8080/api/v1'
    }

    test1Path = '/ms/app/health'
    test2Path = '/ms/app/doc'
    //     Test3Path = '/ms/app/client/YSNW0YNC8Z'
    //     test3Header1 = 'W67GLXNLTG'
    //     test3Header2 = 'A'
    //     test3Cookie = 'X_NM_CLIENT_CONTEXT={"clientNmUniqueId":"YSNW0YNC8Z"}'
    break
}

describe('ms/app functional tests', function () {
  // Default is 2 seconds, so we bump up to 60 to allow tests to run
  this.timeout(60000)

  before(function (done) {
    if (environment !== 'development') {
      let currentSHA = ''
      let counter = 0
      const counterMax = 10

      // This code is an artificial "wait" for the new api to be deployed and
      // fully active in Kubernetes.  So we loop up to 10 times waiting for a
      // successful response from the api health check to ensure it's deployed
      // if the returned SHA is the one we passed in and want, or we've hit
      // 10 call attempts, then just fail the tests
      async.whilst(
        function (callback) {
          callback(null, currentSHA !== process.env.GIT_COMMIT && counter < counterMax)
        },
        function (next) {
          request(url)
            .get('/ms/app/health')
            .set('apikey', apikey)
            .set('x-nm-deployment', 'pre-release')
            .end(function (err, res) {
              if (err) {
                console.log('err.message: ', err.message)
                console.log('err.status:  ', err.status)
                if (err.status === 502) {
                  // Swallow the 502 error and keep trying
                  console.log(
                    '>>>>> loop #' +
                      counter +
                      ' got 502 error...trying again after 3 seconds'
                  )
                } else {
                  return done(err)
                }
              } else {
                currentSHA = res.body['Git SHA']
              }

              console.log('Expected Git SHA: ', process.env.GIT_COMMIT)
              console.log('Actual Git SHA:   ', res.body['Git SHA'])

              counter++

              console.log('counter: ', counter)

              setTimeout(function () {
                next()
              }, 3000)
            })
        },
        function (err) {
          if (err) {
            console.log('err.message: ', err.message)
            console.log('err.status:  ', err.status)
            return done(err)
          }
          // If we still haven't gotten the right SHA back,
          // then return error and fail the deploy
          if (currentSHA !== process.env.GIT_COMMIT) {
            return done(
              new Error(
                'Error - too many attempts to get correct pods for integration tests'
              )
            )
          }
          return done()
        }
      )
    } else {
      return done()
    }
  })

  // ****************************************************************************
  // NOTE: Comment in and customize the integration tests below to test all the
  //       routes in your micro-service.  They are commented out to allow the
  //       tests to work during the first deploy...but make sure to come back
  //       in and code these up properly.
  // ****************************************************************************

  // run integration test(s) against STABLE and PRE-RELEASE versions of microservice,
  // then compare the results.  if there is a difference, a report is printed
  // of the differences, and the test is failed.  The developer must determine
  // if the differences are expected or not, and take the appropriate actiion
  // to resolve the differences before promoting the pre-release version to stable.

  it('integration1 test case - health route', function (done) {
    async.parallel(
      [
        function (callback) {
          request(url)
            .get(test1Path)
            .set('apikey', apikey)
            .end(function (err, res) {
              if (res.statusCode === 200) {
                return callback(null, res.body)
              }
              // If it can't find the STABLE route, a 404 will be returned.  We override
              // this error with something we can handle async ending function to identify it
              if (res.statusCode === 404 || res.statusCode === 500) {
                return callback(new Error('STABLE route not found'))
              }
              return callback(err)
            })
        },
        function (callback) {
          request(url)
            .get(test1Path)
            .set('apikey', apikey)
            .set('x-nm-deployment', 'pre-release')
            .expect(200)
            .end(function (err, res2) {
              if (err) {
                return callback(err)
              }
              return callback(null, res2.body)
            })
        }
      ],
      function (err, results) {
        if (err) {
          // If we get back our STABE not found error, assume this is the first time the microservice
          // is being deployed to Kubernetes, and just bypass the test so it doesn't fail and prevent deploy
          if (err.message === 'STABLE route not found') {
            console.log(
              'STABLE route not found - assume first deploy and bypass test'
            )
            return done()
          }
          console.log('err: ', err)
          return done(err)
        }

        // For the Health Route, we know that the values coming back from the pre-release and
        // Stable legs will have a different node host, maybe a different mysql host (due to
        // clustering), and will have a different GIT SHA value.  So we're changing the values
        // so they match.  ICK!
        results[0]['Node Host'] = 'Node Host' || undefined
        results[1]['Node Host'] = 'Node Host' || undefined
        results[0]['Git SHA'] = 'Git SHA' || undefined
        results[1]['Git SHA'] = 'Git SHA' || undefined

        const differences = diff(results[0], results[1])

        if (differences) {
          diffReport.printDiffReport(
            'Integration Test 1',
            differences,
            function () {
              console.log(
                '\n\nRaw Differences:\n' + JSON.stringify(differences)
              )
              done(
                new Error(
                  'Unexpected differences found for pre-release vs. stable response. See details above...'
                )
              )
            }
          )
        } else {
          done()
        }
      }
    )
  })

  it('integration2 test case - doc route', function (done) {
    async.parallel(
      [
        function (callback) {
          request(url)
            .get(test2Path)
            .set('apikey', apikey)
            .end(function (err, res) {
              if (res.statusCode === 200) {
                return callback(null, res.body)
              }
              // If it can't find the STABLE route, a 404 will be returned.  We override
              // this error with something we can handle async ending function to identify it
              if (res.statusCode === 404 || res.statusCode === 500) {
                return callback(new Error('STABLE route not found'))
              }
              return callback(err)
            })
        },
        function (callback) {
          request(url)
            .get(test2Path)
            .set('apikey', apikey)
            .set('x-nm-deployment', 'pre-release')
            .expect(200)
            .end(function (err, res2) {
              if (err) {
                return callback(err)
              }

              return callback(null, res2.body)
            })
        }
      ],
      function (err, results) {
        if (err) {
          // If we get back our STABE not found error, assume this is the first time the microservice
          // is being deployed to Kubernetes, and just bypass the test so it doesn't fail and prevent deploy
          if (err.message === 'STABLE route not found') {
            console.log(
              'STABLE route not found - assume first deploy and bypass test'
            )
            return done()
          }
          console.log('err: ', err)
          return done(err)
        }

        const differences = diff(results[0], results[1])

        if (differences) {
          diffReport.printDiffReport(
            'Integration Test 2',
            differences,
            function () {
              console.log(
                '\n\nRaw Differences:\n' + JSON.stringify(differences)
              )
              done(
                new Error(
                  'Unexpected differences found for pre-release vs. stable response. See details above...'
                )
              )
            }
          )
        } else {
          done()
        }
      }
    )
  })

  // It('integration3 test case - <YOUR ROUTE(S)>', function (done) {
  //   // ****************************************************************************
  //   // NOTE: remove this done when running real tests
  //   // ****************************************************************************
  //   done()
  //   async.parallel([
  //     function (callback) {
  //       request(url)
  //         .get(test3Path)
  //         .set('apikey', apikey)
  //         .set('X-NM-NM_UID', test3Header1)
  //         .set('x-nm-user-type', test3Header2)
  //         .set('Cookie', test3Cookie)
  //         .end(function (err, res) {
  //           if (res.statusCode === 200) {
  //             return callback(null, res.body)
  //           } else {
  //             // if it can't find the STABLE route, a 404 will be returned.  We override
  //             // this error with something we can handle async ending function to identify it
  //             if (res.statusCode === 404) {
  //               return callback(new Error('STABLE route not found'))
  //             } else {
  //               return callback(err)
  //             }
  //           }
  //         })
  //     },
  //     function (callback) {
  //       request(url)
  //         .get(test3Path)
  //         .set('apikey', apikey)
  //         .set('X-NM-NM_UID', test3Header1)
  //         .set('x-nm-user-type', test3Header2)
  //         .set('Cookie', test3Cookie)
  //         .set('x-nm-deployment', 'pre-release')
  //         .expect(200)
  //         .end(function (err, res2) {
  //           if (err) {
  //             return callback(err)
  //           }

  //           return callback(null, res2.body)
  //         })
  //     }
  //   ],
  //   function (err, results) {
  //     if (err) {
  //       // if we get back our STABE not found error, assume this is the first time the microservice
  //       // is being deployed to Kubernetes, and just bypass the test so it doesn't fail and prevent deploy
  //       if (err.message === 'STABLE route not found') {
  //         console.log('STABLE route not found - assume first deploy and bypass test')
  //         return done()
  //       } else {
  //         console.log('err: ', err)
  //         return done(err)
  //       }
  //     }

  //     let differences = diff(results[0], results[1])

  //     if (differences) {
  //       diffReport.printDiffReport('Integration Test 3', differences, function () {
  //         console.log('\n\nRaw Differences:\n' + JSON.stringify(differences))
  //         done(new Error('Unexpected differences found for pre-release vs. stable response. See details above...'))
  //       })
  //     } else {
  //       done()
  //     }
  //   })
  // })
})

// ****************************************************************************
// NOTE: The health route below is just an example performance test.  You'll
//       want to replace or suppliment it with your own routes that are
//       appropriate for your microservice.  Probably routes that do the most
//       activity (i.e. db read(s), maybe soap call(s) as well) in your
//       micro-service.  See the commented out performance test below as a
//       template to use for your other routes.
// ****************************************************************************

// run the performance tests.  Make sure you have like 10,000
// valid test cases in the cases-int.csv and cases-prod.csv files
// to get a good coverage of test cases and to prevent any db
// caching of sql results.  Artillery will randomly select cases
// from the CSV files, based on the number of duration and
// arrivalRate defined in your config.yml file (i.e. duration: 60
// and arrivalRate: 50 will run 3,000 cases thru in 1 minute)

describe('ms/app performance tests', function () {
  it('performance1 test case - health route', function (done) {
    this.timeout(65000)
    exec(
      'artillery run -e "' + environment + '" ./integrationspec/config1.yml',
      function (error, stdout, stderr) {
        console.log(stdout)
        console.log(stderr)
        done(error)
      }
    )
  })

  it('performance2 test case - <YOUR ROUTE(S)>', function (done) {
    // ****************************************************************************
    // NOTE: remove this done when running real tests
    // ****************************************************************************
    done()
    //     This.timeout(65000)
    //     let pathToTestFile = './integrationspec/cases-int.csv'
    //     if (environment === 'prod') {
    //       pathToTestFile = './integrationspec/cases-prod.csv'
    //     }
    //     exec('artillery run -e "' + environment + '" -p "' + pathToTestFile + '" ./integrationspec/config2.yml', function (error, stdout, stderr) {
    //       console.log(stdout)
    //       console.log(stderr)
    //       done(error)
    //     })
  })
})
