# Frontend

The frontend is written in [AngularJS](https://angularjs.org/) (1.4.8).

The single file `app.js` contains all the application logic.

## Serve application the simple way

The simplest way to serve the frontend is by using the Python
[SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html).

```console
$ cd frontend
$ python -m SimpleHTTPServer
```

Then open the application on port `8000` in the browser:
`http://localhost:8000/index.html`

## Serve application the awesome way

In order to get auto-reloading on file save, you can serve the frontend with browser-sync.

First install the extra dev tools with `npm`.

```console
$ npm install
```

This will pull down browser-sync, and also eslint to keep your code clean. Then run that server.


```console
$ npm run serve
```

This will open a browser window to port 3000.
