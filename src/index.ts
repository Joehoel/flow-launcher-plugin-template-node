import open from "open";
import { Flow } from "flow-launcher-helper";

// The events are the custom events that you define in the flow.on() method.
const events = ["search"] as const;
type Events = typeof events[number];

// @ts-ignore
const flow = new Flow<Events>("assets/npm.png");

// @ts-ignore
flow.on("query", (params: any) => {
  const qp = new URLSearchParams({
    query: params[0].toString(),
  });

  const url = `https://deno.land/x?${qp}`;

  flow.showResult({
    title: `Search Deno package: ${params}`,
    subtitle: url,
    method: "search",
    params: [url],
    iconPath: "assets/deno.png",
  });
});

// @ts-ignore
flow.on("search", params => {
  const url = params[0].toString();

  open(url);
});

flow.run();
