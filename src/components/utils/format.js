import moment from "moment"
import voca from "voca"

const preposition = "at"
moment.locale("en", {
  calendar: {
    lastDay: "[Yesterday] LL [" + preposition + "] h:mm a",
    sameDay: "[Today] LL [" + preposition + "] h:mm a",
    nextDay: "[Tomorrow], LL [" + preposition + "] h:mm a",
    lastWeek: "LL [" + preposition + "] h:mm a",
    nextWeek: "LL [" + preposition + "] h:mm a",
    sameElse: "LL [" + preposition + "] h:mm a",
  },
})

export function fuzzyDate(date) {
  return date ? moment(date).calendar() : "-"
}

export function personNameFormal(person) {
  return voca.titleCase(
    `${person?.last_name ?? ""}, ${person?.first_name ?? ""} ${person?.middle_name ?? ""
    }`
  )
}

export function personNameFull(person) {
  return voca.titleCase(
    `${person?.first_name ?? ""} ${person?.middle_name ?? ""} ${person?.last_name ?? ""
    }`
  )
}

export function personNameShort(person) {
  return voca.titleCase(
    `${person?.first_name ?? ""} ${person?.middle_name ?? ""} ${person?.last_name ?? ""
    }`
  )
}

export function personNameInitial(person) {
  return voca.upperCase(
    `${person?.first_name?.[0] ?? ""}${person?.middle_name?.[0] ?? ""}${person?.last_name?.[0] ?? ""
    }`
  )
}
export function unslugify(slug) {
  const result = slug.replace(/\_/g, " ")
  return result.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  });
}

export function formatAddressObject(location) {
  let locfmtArray = []
  switch (location?.type?.name) {
    case 'home':
      locfmtArray = [location?.number, location?.street_name, location?.address]
      break;
    case 'condo':
    case 'office':
      locfmtArray = [location?.name, location?.tower_name, location?.number, location?.street_name, location?.address]
      break;
    case 'hotel':
      locfmtArray = [location?.name, location?.number, location?.guest_name, location?.street_name, location?.address]
      break;
    default:
      locfmtArray = [
        location?.tower_name,
        location?.number,
        location?.address,
        location?.street_name,
        location?.city?.name,
        location?.area?.name,
      ]
      break;
  }
  return locfmtArray.filter((x) => x).join(", ")
}

export function filterNonNull(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => !(v === null || v === undefined)));
};

export function formatRoleNames(role) {
  const roleMap = [
    { value: 'ROLE_WHITE_LABEL_STAFF', label: "Staff" },
    { value: 'ROLE_WHITE_LABEL_STAFF_MEDICAL', label: "Medical" },
    { value: 'ROLE_WHITE_LABEL_STAFF_AGENT', label: "Agent" },
    { value: 'ROLE_WHITE_LABEL_STAFF_ADMIN', label: "Admin" },
  ]

  return roleMap.find((x) => x.value === role)?.label ?? "-"
}

export function formatRoles(roles) {
  const roleFmt = roles?.filter(f => f !== 'ROLE_WHITE_LABEL_STAFF')?.map((x) => formatRoleNames(x)).join(", ")
  if (voca.isEmpty(roleFmt)) {
    return "-"
  }
  return roleFmt
}

export function localizeCurrency(value, currency = 'PHP') {
  if (value === null || value === undefined) {
    return ''
  }
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
  }).format(value);
}

export function localizePercent(value) {
  if (value === null || value === undefined) {
    return ''
  }
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
  }).format(value);
}


export function localizeNumber(value, frac = false) {
  if (value === null || value === undefined) {
    return ''
  }
  return new Intl.NumberFormat('en-US', {
    useGrouping: 'always',
    maximumFractionDigits: frac ? 2 : 0,
  }).format(value);
}