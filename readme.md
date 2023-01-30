# About WhispersJS
## What is WhispersJS?
WhispersJS is a pub/sub program written in vanilla JavaScript, designed to maximise the probability that messages get processed by subscribers. It consists of two key parts:
1. A very small script that is less than 1kb in size designed to be loaded on a web page inline. This script guarentees that any other scripts that are loaded on the page can both push messages and subscribe to topics. Only the most essential features are in this script.
1. A larger script with extra useful functionality which can load async and be deferred. This script deals with things that can wait until the web page has completed essential tasks for loading the page.

## What problem does it aim to solve?
WhispersJS addresses a number of problems in communicating data between independent scripts on a modern web page.

1. **What if an event is triggered before all the listening scripts have loaded?** These days, pages have a lot of indepentent scripts normally from different teams and third parties all loading in a web page. While at one time it was considered fine to load all these scripts synchrinously one after the other, now it is preferred to load them asynchinously. This poses a problem if they need to communicate with each other, especially if they depend on events from each other to establish what they can/should do, such as establishing user consent on tracking. 
	1. One existing way to overcome is to use a data structure like an array which is set at the start of the page, and that events are written to. This is how things are typically done with Google Analytics and other analytics software with the "DataLayer". But this poses three problems; Firstly it's not simple or efficient to scan the array for the an event that is relevant to you. Secondly the data cannot be safely removed from the list as you do not know who else will need it, this causes bloat, thirdly there is no visibility on who is consuming the data, or of any problems occuring.
	1. WhispersJS uses a pub/sub model where subscribers can subscribe only to topics that are of interest and use to them. Any message that is published to the topic is distributed to all the subscribers using an event object that contains the message plus extra metadata that may be of use (such as the events timestamp). When a subscriber subscribes to a topic, they submit the `topic name`, their own `subscriber name`, and a `callback function` for consuming the events that takes an event as an input, and returns `true` if the message was processed successfully, or `false` if the message could not be processed for any reason. With this model the subscriber only needs to care about it's own needs, and WhispersJS manages the rest. Once all subscribers have successfully processed the event, it is deleted.
1. **Are events being triggered and consumed how you expect?** It's one thing testing how your application behaves, but you can't realistically test fall all the possible states that might occur in the wild. Because many different scripts load asynchriniously, all with their own set of possible states, and in all possible orders, on a huge number of different kinds of devices, with different browsers, different pluggins, over different networks, in different geographical regions, and with all these entities changing all the time... With WhispersJS you can monitor many aspects about when and how your events are triggered and consumed. It's possible to monitor the time who is subscribed to topics, when they subscribe, how long they take to process messages, errors encountered in processing messages, etc. This allows quick detection of a range of issues that otherwise might not ever become known.
1. **Are you losing data because of temporary and unexpected outages, network problems, etc?** It's now quite common for system architectures to include queue systems on the backend so that when a service goes down for any reason, messages are stored until the service comes back up. However, what about the frontend? WhispersJS allows the browser to hang onto any messages that cannot be delivered, until an outage has ended. While it cannot guarentee delivery of the messages, it does make a best effort. This includes storing the messages in the browser if possible, so that evene if a user closes the browser, the next time they come to the site, the messages can be delivered then. Of course the user may delete the data stored in their browser, or the browser may not support the required features, but that is why we said best effort, and it is an improvement on no effort.

## Why vanilla JavaScript?
I know right! JavaScipt is an aweful language. Sorry if you like it, but it just is objectively terrible. So why? The reason is to keep the initial script as small as possible, and to not depend on other libraries outside of what comes natively in the browser. Virtually all browsers support JavaScript well enough to do things in the browser... So that's why.
### "compiling"
WhispersJS uses a build process to shrink the code as much as possible to minimise it's impact on performance when the code is loaded inline on the page. This is how we have got it down to **under 1kb**.

To keep the code readable for development the build/development process goes through several steps:
1. The source code is written with very verbose names, this makes the code readable and easier to work with.
2. The code is then run through a python program that replaces key variable and function names with shorthand alternatives.
3. The shorthand code is then run through uglifiy to reduce the size further.

Each step has the same tests that can be run, to detect issues that may be introduced in one of the build steps.

# QuickStart
## To Note!
WhispersJS is in early development. The persist feature for subscribers is not yet active but is coming soon.
## Interactive Demo
You can play with an [interactive demo here](demo/demo.html).
## Add Initial Tag
It's recommended to add the tag [found here](whispersjs_tag.html) at the top of your web pages inline. This will guarentee that all scripts can successfully publish messages to topics no matter when they load.

Once it's on the page you can start publishing events to topics:
```js
// publish to a topic
wspr.P(
	// topic name
	"my_topic_name",
	// message 
	{"Hello": "World"}
)
```
And you can subscribe to topics:
```js
wspr.S(
	// topic name
	"my_topic_name",
	// subscriber name
	"my_subscriber_name",
	// callback function
	// recieves an event object as a parameter, which containse "message"
	// returns true if the event is processed successfully
	// returns false if the event is not processed successfully
	function (event) {
		// print message to console
		console.log(event.m);
		return true
	},
	// boolean on whether to attempt to persist the message 
	// and re-send it if the browser is closed before it can 
	// be processed
	false
)
```
Once all subscribers you expect to subscribe to topics have subscribed. You can tell WhispersJS that the subscribers are *Ready* and so that it does not need to hang onto processed messages in case another subscriber subscribes.
```js
wspr.R();
```
## Add Whispers Plus (optional)
Whispers Plus contains unessential code that can help working with the core WhispersJS code easier, for example it provides functionality for a status report, and can also convert events into more readable formats than the size optimised ones in the WhispersJS core code.
[found here](whispers_plus.js)
