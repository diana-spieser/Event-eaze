export function calculateEventValues(event) {
  const eventTypeColor = event.isPublic === 'public' ? 'green' : 'orange';
  const singleEventUrl = `/events/${event.id}`;
  const startDate = new Date(event.startDate);
  startDate.setHours(0, 0, 0, 0);
  const startDateString = startDate.toLocaleDateString();

  let city = '';
  if (event.address) {
    const addressParts = event.address.split(',');
    if (addressParts.length >= 2) {
      city = addressParts[addressParts.length - 2].trim();
    }
  }

  return {
    eventTypeColor,
    singleEventUrl,
    startDateString,
    city,
  };
}
