import open from "open";
import { Flow } from "./lib/flow";

// The events are the custom events that you define in the flow.on() method.
const events = ["search"] as const;
type Events = typeof events[number];

const flow = new Flow<Events>("assets/npm.png");

flow.on("query", params => {
  const qp = new URLSearchParams({
    q: params[0].toString(),
  });

  const url = `https://www.npmjs.com/search?${qp}`;

  flow.showResult({
    title: `Search NPM hello3 package: ${params}`,
    subtitle: url,
    method: "search",
    params: [url],
    iconPath: "assets/npm.png",
  });
});

flow.on("search", params => {
  const url = params[0].toString();

  flow.logger.info(params);

  open(url);
});

flow.run();
