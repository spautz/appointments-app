appointments-app
================

This is a demo app only. It's for Medfusion's "Simple Appointments Dashboard" challenge.


Setup and Launch
----------------

(This assumes NodeJS is already set up, with Bower installed globally.)

1. `npm install`
2. `node server/server.js`


Notes
-----

This uses CanJS at present; if time permits I plan to create one version using plain jQuery, and one using Angular.

All relevant code is under public/appointments-app/ (except for index.html). The minimal Express server is only there to catch non-root URLs if you refresh the page after navigating somewhere (since it uses pushstate).

The overall structure of this is loosely indicative of how things would scale if the project were to grow to a larger size: it's a bit overkill to break this example into into multiple components, but I think it's far easier to start with AMD modules and a build system than to try to introduce them after the project has grown to a significant size.


Brief Overview of Components
----------------------------

`appointments-app.js` is the top-level controller. In a sizable app, the stuff here would be split into at least three files (a Component for handling data, a dedicated place for routes, and this Controller as just the route-through point between major wings of the UI.)


`appointment-list/appointment-list.js` demonstrates a small, non-interactive Component. It just applies a local template and some helpers for rendering.

`appointment-create-form/appointment-create-form.js` demonstrates a small interactive Component. It encapsulates a view, like <appointment-list>, and also handles the form events that come from inside it.

The `.mustache` files are client-side templates for use by one -- and always exactly one -- control or component. Components, not templates, are the parts that get shared and reused.

The classes under `models/` are rough and unfinished, but they'd become abstractions of the (hopefully) REST API where the app retrieves and pushes data. If I had more time to play around, each one would get a fixtures file as well, for mocking out the actual API responses and behavior -- and then the fake Appointment and Doctor data would be hidden within those fixtures, behind promises, instead of being hardcoded as array literals in the app itself.
