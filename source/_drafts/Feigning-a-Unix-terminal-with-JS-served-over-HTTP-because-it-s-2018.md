---
title: 'Feigning a Unix terminal with JS served over HTTPS, because it''s 2018'
date: 2017-12-28 12:13:18
tags: [programming, javascript, terminal, web-development]
use_excerpt: true
---

> GIF OF WORKING TERMINAL

I recently found the time to rewrite my personal site, [lukeify.com](https://lukeify.com). This was a good window of opportunity to rethink my above the fold content — which previously amounted to a bandwidth-heavy image and an overly chatty auto-typing keyboard effect. Bleh. I opted to replace this and develop a simple reproduction of an interactive UNIX Command Line Interface, where users can enter BSD commands and navigate about a mock filesystem as a mechanism for learning about my portfolio. 

The terminal state on the frontend is managed via an Angular component, with user input being sent over HTTP to a server for processing. 

<!-- more -->

# Design

I began by taking a simple screenshot of my own macOS terminal and dropping it into my site beneath the header to get a feel for the placement of the window within the page. This approach however was shortlived, as I soon discovered having an image of my own terminal within the page would often cause me to do a slight double take as it danced in the corner of my vision. Eliminating this distraction became a mission critical priority, and the image was replaced, almost immediately, by a lightweight DOM re-creation feigning a macOS-like interface.

The replacement itself was a fairly trivial task, as modern CSS features such as flexbox and advanced filters make reproducing effects previously reserved for native-only environments simple. For example, the effect of blurring the contents behind the terminal window is handled by `backdrop-filter` and `-webkit-backdrop-filter`, which as of January 2018, [caniuse.com](https://caniuse.com/#feat=css-backdrop-filter) reports as having 12.3% support (users with browsers missing this feature will remain none the wiser). The drop shadow present in macOS application-specific screenshots via ⌘+Shift+4 was reproduced fairly faithfully with `box-shadow:0 2em 3.125em 0.625em rgba(black, 0.4)` . 

Minor attention to the accents on the window elements, i.e. the borders on the main window and the mild bevelling in the traffic light window options allows for a lickable design, while simultaneously avoiding the exact UI traits and gradients used in macOS, especially in the menu bar (which I deliberately chose a flat color for), contributes to avoiding an exact one to one reproduction of the actual interface and instead ensures the window remains merely an abstract concept.

With presentation out of the way, we can turn to the structure of the terminal window body that is needed to hold our input & output. Internally, the terminal window container is set to `display:flex; flex-wrap:wrap;` with three child elements:

* `<span #terminalHistory id=“terminal-history”></span>` 

    Holds all previous terminal commands and responses as a string. Width set to 100%.
    
* `<span #terminalContext id="terminal-context"></span>` 

    Contains the current terminal context as formatted for a terminal, i.e. the user currently accessing the terminal session, the current working directory, and the user identifier (`$` for a non-root user, `#` for root). The width of this element is set dynamically when the text within it — the context — is updated, and needs to be the width of the text string it contains. This is done via:
    
    ```TypeScript
    this.terminalContext.nativeElement.style.width = this.terminalContext.nativeElement.width
    ```
    
* `<input #terminalEntry id="terminal-entry" type="text">`

    Handles and allows for user input. We decompose angular's `[(ngModel)]` sugaring into two separate bindings to implement custom functionality, `(ngModelChange)` to listen for events, and `[ngModel]` to reflect changes made in the component onto the view. The input is styled to be invisible, excepting the text itself. We take advantage of `flex-grow:1;` to ensure it fills the remaining horizontal space.
    
> IMAGE OF INTERNAL COMPONENTS
    
Each element is referenced in the containing Angular component, with getters and setters manipulating the `ElementRef.nativeElement.innerHTML` property for each.

# Mocking a filesystem

Considering users will be able to `cd` and `ls` their way around, we need to provide a shim "filesystem" to have some fun in. I opted to store this in a JSON file on my server. Each `FileSystemEntry` in `fs.json` is notated likewise:

```JSON
{
    "type": "dir"|"file",
    "aliases": string[],
    "name": string,
    "data": FileSystemEntry[]|string
}
```

As you can see, this is the basis for a tree structure, with child entries of a "directory" node appearing as a new `FileSystemEntry` in the `"data"` property. I define the name of the node in the `"name"` property. This is what the user will enter in the terminal when they're looking to change the working directory or open a file.

The root of the file system is handled by an entry with the name of `/`, much like most *nix systems. This leaves the one remaining wildcard of this scenario: the user's "home" directory, which in Unix is aliased as `~`. A visitor to the site must be able to type `~/foo/bar`, and our mock system must successfully be able to lookup and know what is meant by the tilde character, even if the name of the directory itself is not a tilde. 

To manage this, I added an additional property to the `FileSystemEntry` interface called `"aliases"`, which is an array of alternate names associated with a particular node. In our scenario, `/home/visitor` is our home directory, so this has the `"aliases"` value set to `["~"]`. Later, we'll write the logic to ensure a node can be retrieved by either the authoritative name or one/many aliases it may have. 

# Defining our DSL and interfaces

We have a lot to cover here! To ensure this joke can be scaled to levels beyond what it ought to be, we'll define some types and a domain specific language to keep complexity to a manageable level. The problem of specifying our contracts can be decomposed into three main areas:

* The client, where the terminal and user output is displayed. 
* HTTP, communication between the client and the server.
* The server, where commands are processed and results are returned.

## Client

The client makes an initial request to `GET:/api/initialterminalconfiguration` when the user visits the site to get the current state of the terminal. This includes the welcome message; plus the user and current working directory, which we bundle together into a type of `TerminalContext`.

```TypeScript
export interface TerminalContext {
    user: string;
    pwd: string;
    alias: string|null;
}
```

```JSON
    {
        "response": "Welcome to lukeify.com.<br/><br/>* My GitHub:&nbsp;https://github.com/lukeify<br/>* Blog:&nbsp;&nbsp;&nbsp;&nbsp;https://blog.lukeify.com<br/>* Email me:&nbsp;&nbsp;lukedavia@icloud.com<br/><br/>",
        "context": {
             "user": "visitor@lukeify.com",
             "pwd": "/home/visitor",
             "alias": "~"
     }
```

User data is stored in the `userEntry` property of our Angular component. When the input changes, the variable in our component is adjusted, passing through our function `onKeyUp($event)`. Likewise, updates to the model when made programmatically will be reflected in the view via the Angular bindings discussed earlier.

Because we have opted to dismiss Angular's out-of-the-box two-way sugaring, we need to make a few small alterations. `onKeyUp($event)` checks to ensure if the key entered was Enter, and if it was, initiates an HTTP request to grab the outcome of executing the command the user entered. Otherwise, the character is appended to the `userEntry` property. Simple.

If an HTTP request was made, when a response is received, the outcome from the terminal command execution is pushed onto the array of past responses, and if necessary, the terminal context is also updated. From here, the cycle repeats! Let's go deeper...

## HTTP

As terminal commands are _stateless_, by-and-large not relying on past commands to determine the outcome of present ones, all the server needs to know is the command currently being executed and the context of the request, not the entire terminal history. A request is made to `POST:/api/commands` with the following structure:

```TypeScript
export interface TerminalCommandRequest {
    context: TerminalContextData;
    command: string;
}
```

Meanwhile, the response from the server contains:

```TypeScript
export interface TerminalCommandResponse {
    beforeResponseHistoryAppendHook: string[];
    afterResponseHistoryAppendHook: string[];
    response: string|null;
    context: TerminalContextData;
}
```

The last two properties of the HTTP response are simple: `response` is the plaintext outcome as a result of evaluating the `command` sent by the user in the request. 

And in both the request and the response, the `context` is an object of the form `TerminalContextData`. As mentioned in the "Client" section above, the client formats the terminal context in an appropriate manner for display.

What I skipped over were the two other properties in the server response: `beforeResponseHistoryAppendHook` & `afterResponseHistoryAppendHook`. There are certain scenarios where actions need to take place on the client in response to the server's response. For most commands, these two properties will be empty arrays, as the response is simply appended to the current response history, and no action is needed. But commands like `clear` and `reset` are special. `clear(1)` states "clears your screen if this is possible". This means we need to erase the terminal history, and since the server does not have access to the full terminal history to erase, this must be done on the client, with the server prompting the client when to do so. We can specify arbitrary actions for the client to action in these two fields. 

For the case of `clear`, the server response will look something like this:

```JSON
{
    "beforeResponseHistoryAppendHook": [],
    "afterResponseHistoryAppendHook": ["eraseHistory"],
    "response": null,
    "context": // ...
}
```

`eraseHistory` is one of several magic keywords which when attached to the after hook, tells the client "after you've appended the response to the terminal's history, run a function with this name". Which in this case will erase the terminal's history. The `reset` command prompts a similar response:

```JSON
{
    "beforeResponseHistoryAppendHook": ["eraseHistory"],
    "afterResponseHistoryAppendHook": [],
    "response": "Welcome to lukeify.com.<br/><br/>",
    "context": {
        "user": "visitor@lukeify.com",
        "pwd": "/home/visitor",
        "alias": "~"
    }
}
```

The client will interpret this as follows:

1. Before I append the response property to the terminal history, run any commands specified in `beforeResponseHistoryAppendHook`.
2. Run any function associated with the "eraseHistory" identifier.
3. Append the response property to the terminal history.
4. Run any commands specified in `afterResponseEraseHistoryHook`.
5. Update the context to match that specified in the response body, preferentially displaying the alias, if it exists, over a segment of the pwd.

## Server

The client's request, once on the server, is routed to `CommandService.execute(req)`, being passed the standard Express.js `Request` object. From here, the user's input gets parsed by `CommandService.parseCommand(command)`. We'll cover how this method works in more detail later, but let's for now assume it's a black box. If all is well and good, after this function's execution, we will have a variable of type `TerminalCommandData`:

```TypeScript
export interface TerminalOption {
    key: string;
    argument: string;
}

export interface TerminalCommandData {
    command: string;
    options: TerminalOption[];
    operands: string[];
}
```

Now we check if the `command` if available in the property `commands`, and if so, dynamically call the function with the responsibility of handling that command (if the command does not exist, we return the generic bash-like response). This data is then returned to the client. 

```TypeScript
const terminalCommandData = this.helpers.parseCommand(req.body.entry);

if (this.commands.includes(terminalCommandData.command)) {
    
    const result = this.commands[terminalCommandData.command](req, context, terminalCommandData);
    
    return {
        beforeResponseHistoryAppendHook: result.beforeHooks,
        afterResponseHistoryAppendHook: result.afterHooks,
        response: result.response,
        context: result.newContext
    };
} else {
    // return a bash-like response here, i.e. "foo: command not found"
}
```

# Parsing user input with a recursive descent parser

Calling it a “mistake” to wire up the user input to a live terminal instance through the server would be putting it lightly. We ensure this trainwreck stays in our rear view mirror by sandboxing all user input into the `CommandService` class on the server. User input never touches a database, a real shell, or an actual filesystem.

This means we must parse user input manually. We can use a bit of knowledge about command structure to decompose input into a **command**, **options**, and **operands**. This isn't meant to be a foolproof parsing engine, but should do a good enough job that we can extract common flags and extra details included with a user command with reasonable precision. We'll follow [POSIX.1-2008 12.1 "Utility Argument Syntax"](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html) as a guide for this subroutine.

* For the purposes of this exercise, a **command** is always a single phrase with no spaces, and precedes all other user input. This includes `man`, `cd`, `git` and so on. 

* Historically, UNIX **options** were usually a single lowercase letter — as the Shift key on terminals required significant effort to keep depressed<sup>1</sup>, and preceded with a `-` (again, using the plus operator would have required use of the Shift key). Many of these options can be "ganged" together with a single hyphen for further efficiency. 

    GNU opted for a longer double-hyphen style with a more verbose flag name, although often a shortened option with a single hyphen is available as a substitute. We'll take into account all of this. Options can have **arguments** attached, either UNIX style with a space between the option and the argument, or an equality sign in GNU style.
    
* **Operands** are strings of characters that can be arbitrarily specified to the right of a command, and may be associated as the value for an option key, either by a space, or in GNU-style listing of options, an equality sign. When spaces are needed in an argument, the argument should be wrapped in quotation marks.

// TODO: rewrite below

Let's manage this functionality in `helpers.parseCommand()` (which will actually just dispatch to an entirely separate class). Based off of our definition of a command, we can firstly extract this by splitting the user input on whitespace and `unshift`ing to return the command proper. Then we introduce a short-circuit in our logic that will return early if the command forms the entirety of the user input (i.e. no remaining elements in the array of split user input portions).

To grab options, arguments, and operands out of the complex primordial soup that the user potentially passed in, `parseCommand` needs to have knowledge over what variations are available for the command being executed. Again, we'll refer to POSIX.1-2008 and define our own subset of synopses for commands as see fit. You could go wild here, but short of a simple flag or two, it's better from a user experience perspective to target more commands that are implemented in a less detailed fashion than focus in on single commands that operate genuinely with respect to their real world counterparts.

```TypeScript
// An example of some of the command synopses we've implemented.
private commandSynoposes = {
    cat: ["file ..."],
    ls: ["[dir]"],
    node: ["[-v | --version]"],
    rm: ["[-rf] [--no-preserve-root] file ..."],
}
```

```TypeScript

```

## Paths

When dealing with paths, the server will also have to support most types of absolute and relative navigation to ensure it's easy to use, including the use of `..`, `/`, `~` and `.`.

# Adding commands

# Implementing a history stack 

One of the nice features of modern terminal applications is the ability to navigate through the history of previous commands via use of the up and down arrows, allowing one to execute or edit a command previously issued to the system recently or even in from a previous session. We can emulate this, or at least the principles of this by implementing a history stack (although squandering a user's disk space via cookies or localStorage for what is essentially a joke is too far, so let's not do that).

There's a couple of points of interest about the history stack that is worth noting:

* One unexecuted entry is always included at the top of the stack. 
* Editing a command (either the unexecuted one, or a previously executed one) but not executing it, navigating vertically through the stack, and then returning to it, will display the edited command. 
* Editing a previously issued command and then executing it will add the executed command to the stack (as expected), but return the previous command to its original state.

These nuances are demonstrated in the GIF below.

> GIF of stack

To satisfy these nuances, we need the 

# Small Details

There's a number of UI inconsistencies that remove some of the magic that would otherwise ensure a seamless experience when interacting with the terminal. These are all quick fixes:

1. Clicking anywhere within the terminal window should place focus onto the input element.
2. Clicking anywhere outside the terminal window should ensure the window itself gains an inactive appearance.

## Input element focus

Number one is a quick fix. We bind a `onclick` EventListener to the terminal container:

```HTML
<div (click)="terminalContainerClicked($event)" id="terminal-container">
</div>
```

Then we set the terminal input element to have focus:

```TypeScript
    /**
     * Function to be called when the terminal container is clicked.
     *
     * @param {MouseEvent} $event - The event that triggered this function call.
     */
    public terminalContainerClicked($event: MouseEvent) : void {
        this._terminalEntry.nativeElement.focus();
    }
```

## Inactive window styling

Point two is just as simple. We create a class `terminal-not-focused` and add some styles that adjusts the properties of the terminal window buttons. We then apply that class whenever the variable `terminalHasFocus` is false. Now we just need a method to control the state of this toggle. Binding direclty to the document constantly isn't very performant, so we can handle this with an rxjs Observable which is registered when the terminal container is initially clicked, and unsubscribes after a single click elsewhere on the document. To do this, we adjust our `terminalContainerClicked()` method like so:

```TypeScript
    public terminalContainerClicked($event: MouseEvent) : void {
        this._terminalEntry.nativeElement.focus();
        this.terminalHasFocus = true;
        $event.stopPropagation();

        Observable.fromEvent(document, 'click').pipe(
            first()
        ).subscribe(event => {
            this.terminalHasFocus = false;
        });
    }
```

# Work-life balance

Command Line Interfaces, especially ones written in Javascript and served over HTTP, lend themselves well to a certain air of mysticism and undiscoverability that is ripe for jokes and Easter eggs. It's very easy to get carried away with the aspiration of integrating dozens of quirky 

# ls | grep "Viola!"

As demonstrated this is an acutely simplistic reproduction of the genuine article. Thankfully for my own sanity, it needn’t be more than this. There are a few areas for improvement that I've identified:

* Terminal entry spillover. 

# References

1. Raymond, Eric S. The Art of UNIX Programming. Page 242.