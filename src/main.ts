import open from "open";
import { Flow } from "./lib/flow";
import { z } from "zod";

// The events are the custom events that you define in the flow.on() method.
const events = ["search"] as const;
type Events = (typeof events)[number];

const flow = new Flow<Events>("assets/npm.png");

flow.on("query", (params) => {
	const [query] = z.array(z.string()).parse(params);

	const qp = new URLSearchParams({
		q: query,
	});

	const url = `https://www.npmjs.com/search?${qp}`;

	flow.showResult({
		title: `Search NPM package: ${query}`,
		subtitle: url,
		method: "search",
		parameters: [url, "hello"],
		dontHideAfterAction: true,
	});
});

flow.on("search", (params) => {
	const [url] = z.array(z.string().url()).parse(params);

	open(url);
});

flow.run();
