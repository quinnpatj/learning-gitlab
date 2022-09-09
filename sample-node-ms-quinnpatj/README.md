# sample-node-ms-qui8039

## Description

lab-6-generators

## Running locally

If you haven't already done so, complete the [Local Development](https://git.nmlv.nml.com/lvhub/docs/blob/master/getting-started/local-development.md) getting started guide.

Run `npm install` followed by `npm run dev-int` from the root project directory. To verify your environment is working, load the [health endpoint](http://localhost:8080/api/v1/ms/app/health) to ensure you are receiving a successful response.

#### Unit testing

Run `npm test` from the root project directory.

#### Live changes

Locally your node service is run by [nodemon](http://nodemon.io/) so that changes are reflected immediately.  Simply make your changes and the service will automatically recycle in a matter of seconds to show you your change.

#### Ports

<table>
    <tr>
        <td>:8080</td>
        <td>http</td>
    </tr>
    <tr>
        <td>:8443</td>
        <td>https</td>
    </tr>
    <tr>
        <td>:8081</td>
        <td>node-inspector</td>
    </tr>
</table>

#### Debugging

To debug with chrome developer tools load the [node-inspector](http://localhost:8081/?ws=localhost:8081&port=5858).

## Documentation

_(Coming Soon)_

## API

### [Swagger Schema](swagger.json)

_* For more information on [Swagger](http://swagger.io/) schema format see their [specification documentation](http://swagger.io/specification/)._
