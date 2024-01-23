function timeAgo(date: Date): string {
  const now = new Date();
  const elapsedMilliseconds = now.getTime() - date.getTime();

  const seconds = Math.floor(elapsedMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) {
    return seconds <= 0 ? '1 sec ago' : seconds + " sec ago";
  } else if (minutes < 60) {
    return minutes <= 1 ? '1 min ago' : minutes + ' min ago';
  } else if (hours < 24) {
    return hours <= 1 ? '1 hr ago' : hours + ' hrs ago';
  } else {
    // You can customize this part based on your needs
    const days = Math.floor(hours / 24);
    return days <= 1 ? '1 day ago' : days + ' days ago';
  }
}
export default timeAgo;
