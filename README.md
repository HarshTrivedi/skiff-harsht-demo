# skiff-template

Ahoy! Welcome to your new [skiff](https://github.com/allenai/skiff) template
application that includes:

* A Python based, [Flask](http://flask.pocoo.org/) HTTP server responsible for
  serving static assets and dynamic API endpoints.
* A [TypeScript](https://www.typescriptlang.org/), [ReactJS](https://reactjs.org/)
  and [Varnish](http://github.com/allenai/varnish) based user interface.
* Automatic deploys to shared infrastructure and other functionality provided by
  [skiff](https://github.com/allenai/skiff).

## Getting Started

Start by making sure that you've installed the latest version of [Docker 🐳](https://www.docker.com/get-started).

After downloading [the latest version of the template](https://github.com/allenai/skiff-template/releases/latest)
and unpacking it, you'll need to make one small change before it's ready
to be deployed:

Open `.skiff/config.json` in the text editor of your choice and update the
`appName` and `contact` fields:

* The `appName` field should be a short, unique and url-safe identifier for
  your application — keep in mind that your application will be accessed by
  end users by going to `${appName}.apps.allenai.org` in a browser.
* The `contact` field should be the `@allenai.org` email address that is
  responsible for the demo. Don't include the `@allenai.org` portion,
  just the prefix (i.e. don't change it to `sams@allenai.org`, just use `sams`).

After doing so, start a local webserver like so:

```bash
docker-compose up
```

You'll see logs from two processes:

* `server`: Your Python application server, where you can define API
  endpoints.
* `ui`: The UI portion of your application.

Things might take a moment to startup at first, but once they do open
[http://localhost:3000](http://localhost:3000) in the browser of your choice.

The running application will update as you make changes to the code. Keep an
eye on the terminal for build errors if they occur.

If at any point one of the processes dies due to an error, you can bring things
back up by killing the process and re-executing `docker-compose up`.

Sometimes `docker-compose` itself fails to cleanup the running processes when
you kill the parent process. When this happens use `docker-compose down` to
gracefully shut things down.

Your application won't be deployed [until you've been fully onboarded](https://github.com/allenai/skiff/issues/new?assignees=&labels=new%2C+onboarding&template=request-access-to-skiff.md&title=Ahoy%2C+I%27d+like+to+come+onboard%21).
You'll hear from us once that's the case.

That said you can go ahead and start pushing code. Once the onboarding is
complete your remote environments will deploy based upon the code stored in
the repository.

## Installing Third Party Packages

You'll likely want to install third party packages at some point. To do so
follow the steps described below for the target environment.

### Python Dependencies

To add new dependencies to the Python portion of the project, follow these steps:

1. Make sure your local environment is running (i.e. you've ran `docker-compose up`).
2. Start a shell session in the server container:
    ```
    ./bin/sh server
    ```
3. Install the dependency in question:
    ```
    pip install <dependency>
    ```
4. Update the dependency manifest:
    ```
    pip freeze > requirements.txt
    ```
5. Exit the container:
    ```
    exit
    ```

At this point the `requirements.txt` file should've been updated. Commit and
push the file as you would otherwise to persist the changes.

### UI Dependencies

To add new dependencies to the UI, follow these steps:

1. Make sure your local environment is running (i.e. you've ran `docker-compose up`).
2. Start a shell session in the ui container:
    ```
    ./bin/sh ui
    ```
3. Install the dependency in question:
    ```
    yarn add <dependency>
    ```
4. Exit the container:
    ```
    exit
    ```
At this point the `package.json` and `yarn.lock` files should've been updated.

## Deploying

Your application is automatically deployed as you push changes to Github:

* Updating the `master` branch updates the staging environment, which is
  accessible at `<your-repo-name>.staging.apps.allenai.org`. This environment
  should be used to verify changes before releasing them to a wide audience.
* Updating the `release` branch updates the production environment, which is
  accessible at `<your-repo-name>.apps.allenai.org`. This environment should
  be updated more selectively, and is the url you can share with external users
  once you're ready to do so.

Remember, *all* environments are public. The staging environments are only
hidden from the outside world in that their urls are slightly less discoverable.

Don't publish anything that isn't appropriate for a public audience. If you
require finer grained access control, ask the [reviz team](mailto:reviz@allenai.org)
for help in setting this up.

## Helpful Links

Here's a list of resources that might be helpful as you get started:

* [TypeScript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
* [ReactJS Tutorial](https://reactjs.org/tutorial/tutorial.html)
* [Flask Documentation](http://flask.pocoo.org/docs/1.0/)
* [Material UI](https://material-ui.com/getting-started/usage/)

## Getting Help

If you're stuck don't hesitate to reach out:

* Sending an email to [reviz@allenai.org](mailto:reviz@allenai.org)
* Joining the `#skiff-users` slack channel
* Opening a [Github Issue](https://github.com/allenai/skiff/issues/new/choose)

We're eager to improve `skiff` and need your feedback to do so!

Smooth sailing ⛵️!
