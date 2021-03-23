export function getStatusColor(status) {
  var statusColor = "warning";
  switch (status) {
    case "Not_Vaccinated":
      statusColor = "warning";
    case "Vaccinated":
      statusColor = "success";
      break;
    default:
      break;
  }
  return statusColor;
}

export default getStatusColor;
