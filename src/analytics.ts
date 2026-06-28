import Plausible from "plausible-tracker";

export const plausible = Plausible({
  domain: "localhost",
  trackLocalhost: true,
});

plausible.enableAutoPageviews();