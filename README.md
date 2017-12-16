# Grove II

The Grove II is a complete, self-contained development
environment for *imperative* and [*Faux-O*](https://www.youtube.com/watch?v=yTkzNHF6rMs) programming
in JavaScript.

In plain English: you can write and run code in the browser,
and it's more or less like programming on a state-of-the-art
computer from 1986 or so. Except it's better, because you
get to write JavaScript instead of BASIC or C or FORTRAN.

It currently supports:

- A friendly (okay, actually, it's pretty grumpy) system
  shell.
- Efficient, native emulation of synchronous operations,
  like `sleep()` and blocking I/O.
- Persistence of both code and program state in
  `localStorage`.

Planned features:

- Exporting code and data to files so programs can be
  shared or moved between browsers.
- A graphical mode using HTML5 Canvas.

## Synchronous Programming

Perhaps the most surprising thing about programming on the
Grove II is the synchronous, imperative idioms it supports.
In the past, these idioms were alien to JavaScript
programming, but with ES6, they have become technically
feasible.

Here's an example of a Grove II program. And yes, it
does what you'd expect.

```javascript
program.main = function *() {
  while (true) {
    log('HELLO, WORLD')
    yield sleep(1)
  }
}
```

Not only does the `sleep()` call actually cause a delay
in the execution of the loop, the user can break out of
the loop during the program's execution by pressing the
`escape` key.

## The Imperative Imperative

The initial version of the Grove had a strictly functional
API. Why does the Grove II favor imperative programming?

Perhaps the most compelling reason is that it's easy to
write functional programs in an imperative environment, but
difficult to write imperative programs in a functional
environment. If you really like functional programming and
want nothing to do with this imperative nonsense, you're
free to write programs on the Grove II in a functional
style.

The second reason is that imperative programs are far easier
to construct for simple tasks. For applications as diverse
as text adventures, financial calculators, and
[wizard name generators](https://gist.github.com/benchristel/b447bfcdae6a02a1802319a69a0606f2),
imperative programming (perhaps with a [functional core](https://www.youtube.com/watch?v=yTkzNHF6rMs)) is
the most obvious solution.

The idea that functional programs would be easier to test
didn't really pan out. The easiest way to test simple Grove
programs was still through the UI, and at that boundary it
doesn't matter for testing purposes whether the program is
written in a functional or imperative style.

One of my design goals for the original Grove was to reduce
the barrier to starting a new project, but many aspects of
the Grove's design, including the forced functional
paradigm, got in the way of that goal. I've since realized
that the functional-only approach was the wrong design
decision.
