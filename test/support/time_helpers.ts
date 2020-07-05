const now = new Date();

export function secondsAgo(seconds: number) {
  let millis = now.getTime() - seconds * 1000;
  return new Date(millis);
}
