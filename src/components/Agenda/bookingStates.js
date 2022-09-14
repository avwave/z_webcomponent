import { grey, red, yellow } from "@material-ui/core/colors";

const ACTIVE = "active";
const TIMED_OUT = "timed out";
const ABORTED = "cancelled";
const ACCEPTED = "accepted";
const CLIENT_CANCELLED = "timed out";
const SCHEDULED = "scheduled";

const WHITE = "#FFF"
const TEXTWHITE = grey['900']
const YELLOW = yellow[100]
const TEXTYELLOW = yellow['900']
const RED = red[100]
const GREEN = "rgba(70, 206, 31, 0.12)"
const GREY = "rgba(241, 241, 241, 1)"
const TEXTRED = red[900]
const TEXTGREEN = "rgba(70, 206, 31, 1)"
const TEXTGREY = grey['700']


const TERMINAL_STATUS = ["client aborted", "provider aborted", "finished"];

const canCancel = (booking) => {
  if (["waiting"].includes(booking?.appointment?.status)) {
    return true;
  }
  if (TERMINAL_STATUS.includes(booking?.appointment?.status)) {
    return false;
  }
  if ([ACTIVE, SCHEDULED, ACCEPTED].includes(booking?.status_v2)) {
    return true;
  }
  return false;
};

const canReschedule = (booking) => {
  if (TERMINAL_STATUS.includes(booking?.appointment?.status)) {
    return false;
  }
  return (
    [SCHEDULED, ACCEPTED].includes(booking?.status_v2) && !booking?.is_confirmed
  );
};

const canProceed = (booking) => {
  return false;
  // return [ACTIVE, SCHEDULED,ACCEPTED].includes(booking?.status_v2)
};

const canConfirm = (booking) => {
  return [SCHEDULED].includes(booking?.status_v2) && !booking?.is_confirmed;
};

const isCompleted = (booking) => {
  if (TERMINAL_STATUS.includes(booking?.appointment?.status)) {
    return true;
  }
  return false;
};

const canShowTransaction = (booking) => {
  return !!booking?.appointment
}

const hasArrived = (booking) => {
  return booking?.appointment?.status === "arrived";
};

const canMessage = (booking, state) => {
  return !!state
}

const bookingStatusConstants = [
  {
    value: 'SCHEDULED - UNCONFIRMED',
    label: 'Unconfirmed booking request',
    bgColor: YELLOW,
    textColor: TEXTYELLOW,
    variant: 'contained'

  },
  {
    value: 'SCHEDULED - CONFIRMED',
    label: 'Confirmed booking request',
    bgColor: GREEN,
    textColor: TEXTGREEN,
    variant: 'contained'
  },
  {
    value: 'SCHEDULED - UNMATCHED',
    label: 'Finding a provider',
    bgColor: YELLOW,
    textColor: TEXTYELLOW,
    variant: 'contained'
  },
  {
    value: 'SCHEDULED - MATCHED',
    label: 'Confirmed, Matched with provider',
    bgColor: GREEN,
    textColor: TEXTGREEN,
    variant: 'contained'
  },
  {
    value: 'SCHEDULED - STAFF/SYSTEM/PARTNER CANCELLED',
    label: 'System cancelled',
    bgColor: RED,
    textColor: TEXTRED,
    variant: 'contained'
  },
  {
    value: 'LIVE - CLIENT CANCELLED',
    label: 'Live, Client cancelled',
    bgColor: RED,
    textColor: TEXTRED,
    variant: 'outlined',
  },
  {
    value: 'LIVE - PROVIDER/SYSTEM CANCELLED',
    label: 'Live, System cancelled',
    bgColor: RED,
    textColor: TEXTRED,
    variant: 'outlined',
  },
  {
    value: 'LIVE - STAND BY',
    label: 'Live, Stand by',
    bgColor: WHITE,
    textColor: TEXTWHITE,
    variant: 'outlined',
  },
  {
    value: 'LIVE - PREPPING',
    label: 'Your provider is prepping',
    bgColor: WHITE,
    textColor: TEXTWHITE,
    variant: 'outlined',
  },
  {
    value: 'LIVE - EN ROUTE',
    label: 'Your provider is en route',
    bgColor: WHITE,
    textColor: TEXTWHITE,
    variant: 'outlined',
  },
  {
    value: 'LIVE - ARRIVED',
    label: 'Your provider has arrived',
    bgColor: WHITE,
    textColor: TEXTWHITE,
    variant: 'outlined',
  },
  {
    value: 'LIVE - ONGOING',
    label: 'Live, Ongoing',
    bgColor: WHITE,
    textColor: TEXTWHITE,
    variant: 'outlined',
  },
  {
    value: 'LIVE - RATING',
    label: 'Rate your provider',
    bgColor: WHITE,
    textColor: TEXTWHITE,
    variant: 'outlined',
  },
  {
    value: 'LIVE - FINISHED',
    label: 'Live, Finished',
    bgColor: WHITE,
    textColor: TEXTWHITE,
    variant: 'outlined',
  },
  {
    value: 'SCHEDULED - TIMED OUT',
    label: 'Booking request timed out',
    bgColor: GREY,
    textColor: TEXTGREY,
    variant: 'contained'
  },
]

const parseBookingStatus = (booking) => {
  if (booking?.status_v2 === 'scheduled' && !booking?.is_confirmed && booking?.scheduled_status === 'UNMATCHED') {
    return {
      value: 'SCHEDULED - UNCONFIRMED',
      label: 'Unconfirmed booking request',
      bgColor: YELLOW,
      textColor: TEXTYELLOW,
      variant: 'default',
      eventVariant: 'warning',
      cancellable: true,
      reschedulable: true,
      rebookable: false
    }
  }
  else if (booking?.status_v2 === 'scheduled' && booking?.is_confirmed && booking?.scheduled_status === 'UNMATCHED') {
    return {
      value: 'SCHEDULED - CONFIRMED',
      label: 'Confirmed booking request',
      bgColor: GREEN,
      textColor: TEXTGREEN,
      variant: 'default',
      eventVariant: 'success',
      cancellable: true,
      reschedulable: false,
      rebookable: true
    }
  }

  else if (booking?.status_v2 === 'scheduled' && booking?.is_confirmed && booking?.scheduled_status === 'UNMATCHED') {
    //&& curentDate within 5 working days of scheduled date (todo:  all booking dates are within 5 days)
    return {
      value: 'SCHEDULED - UNMATCHED',
      label: 'Finding a provider',
      bgColor: YELLOW,
      textColor: TEXTYELLOW,
      variant: 'default',
      eventVariant: 'warning',
      cancellable: true,
      reschedulable: true,
      rebookable: false
    }
  }
  else if (booking?.status_v2 === 'scheduled' && booking?.is_confirmed && booking?.scheduled_status === 'MATCHED') {
    return {
      value: 'SCHEDULED - MATCHED',
      label: 'Confirmed, Matched with provider',
      bgColor: GREEN,
      textColor: TEXTGREEN,
      variant: 'default',
      eventVariant: 'success',
      cancellable: true,
      reschedulable: false,
      rebookable: true
    }
  }
  else if (booking?.status_v2 === 'client cancelled') {
    return {
      value: 'SCHEDULED - CLIENT CANCELLED',
      label: 'Client cancelled',
      bgColor: RED,
      textColor: TEXTRED,
      variant: 'default',
      eventVariant: 'error',
      cancellable: false,
      reschedulable: false,
      rebookable: false
    }
  }
  else if (booking?.status_v2 === 'cancelled') {
    return {
      value: 'SCHEDULED - SYSTEM CANCELLED',
      label: 'System cancelled',
      bgColor: RED,
      textColor: TEXTRED,
      variant: 'default',
      eventVariant: 'error',
      cancellable: false,
      reschedulable: false,
      rebookable: false
    }
  }
  else if (booking?.appointment?.status === 'client aborted') {
    return {
      value: 'LIVE - CLIENT CANCELLED',
      label: 'Live, Client cancelled',
      bgColor: RED,
      textColor: TEXTRED,
      variant: 'contained',
      eventVariant: 'error',
      cancellable: false,
      reschedulable: false,
      rebookable: false
    }
  }
  else if (booking?.appointment?.status === 'provider aborted') {
    return {
      value: 'LIVE - PROVIDER/SYSTEM CANCELLED',
      label: 'Live, System cancelled',
      bgColor: RED,
      textColor: TEXTRED,
      variant: 'contained',
      eventVariant: 'error',
      cancellable: false,
      reschedulable: false,
      rebookable: false
    }
  }
  else if (booking?.status_v2 === 'accepted'
    && booking?.appointment?.status === 'waiting'
    && booking?.appointment?.standby
  ) {
    return {
      value: 'LIVE - STAND BY',
      label: 'Live, Stand by',
      bgColor: WHITE,
      textColor: TEXTWHITE,
      variant: 'contained',
      eventVariant: 'info',
      cancellable: false,
      reschedulable: false,
      rebookable: false
    }
  }
  else if (booking?.status_v2 === 'accepted'
    && booking?.appointment?.status === 'waiting'
    && !booking?.appointment?.standby
    && booking?.appointment?.preparing
  ) {
    return {
      value: 'LIVE - PREPPING',
      label: 'Your provider is prepping',
      bgColor: WHITE,
      textColor: TEXTWHITE,
      variant: 'contained',
      eventVariant: 'info',
      cancellable: false,
      reschedulable: false,
      rebookable: false
    }
  }
  else if (booking?.status_v2 === 'accepted'
    && booking?.appointment?.status === 'waiting'
    && !booking?.appointment?.standby
    && !booking?.appointment?.preparing
  ) {
    return {
      value: 'LIVE - EN ROUTE',
      label: 'Your provider is en route',
      bgColor: WHITE,
      textColor: TEXTWHITE,
      variant: 'contained',
      eventVariant: 'info',
      cancellable: false,
      reschedulable: false,
      rebookable: false
    }
  }
  else if (booking?.status_v2 === 'accepted'
    && booking?.appointment?.status === 'arrived'
  ) {
    return {
      value: 'LIVE - ARRIVED',
      label: 'Your provider has arrived',
      bgColor: WHITE,
      textColor: TEXTWHITE,
      variant: 'contained',
      eventVariant: 'info',
      cancellable: false,
      reschedulable: false,
      rebookable: false
    }
  }
  else if (booking?.status_v2 === 'accepted'
    && booking?.appointment?.status === 'started'
  ) {
    return {
      value: 'LIVE - ONGOING',
      label: 'Live, Ongoing',
      bgColor: WHITE,
      textColor: TEXTWHITE,
      variant: 'contained',
      eventVariant: 'info',
      cancellable: false,
      reschedulable: false,
      rebookable: false
    }
  }
  else if (booking?.status_v2 === 'accepted'
    && booking?.appointment?.status === 'rating'
  ) {
    return {
      value: 'LIVE - RATING',
      label: 'Rate your provider',
      bgColor: WHITE,
      textColor: TEXTWHITE,
      variant: 'contained',
      eventVariant: 'info',
      cancellable: false,
      reschedulable: false,
      rebookable: false
    }
  }
  else if (booking?.status_v2 === 'accepted'
    && booking?.appointment?.status === 'finished'
  ) {
    return {
      value: 'LIVE - FINISHED',
      label: 'Live, Finished',
      bgColor: WHITE,
      textColor: TEXTWHITE,
      variant: 'contained',
      eventVariant: 'info',
      cancellable: false,
      reschedulable: false,
      rebookable: false
    }
  }
  else if (booking?.status_v2 === 'accepted'
    && booking?.appointment?.status === 'finished'
  ) {
    return {
      value: 'LIVE - FINISHED',
      label: 'Live, Finished',
      bgColor: WHITE,
      textColor: TEXTWHITE,
      variant: 'contained',
      eventVariant: 'info',
      cancellable: false,
      reschedulable: false,
      rebookable: false
    }
  }

  else if (booking?.status_v2 === 'timed out') {
    if (booking?.scheduled_status === 'UNMATCHED') {
      return {
        value: 'SCHEDULED - TIMED OUT',
        label: 'Booking request timed out',
        bgColor: GREY,
        textColor: TEXTGREY,
        variant: 'default',
        eventVariant: 'grey',
        cancellable: false,
        reschedulable: false,
        rebookable: true
      }
    } else {
      return {
        value: 'SCHEDULED - TIMED OUT',
        label: 'Booking request timed out',
        bgColor: GREY,
        textColor: TEXTGREY,
        variant: 'default',
        eventVariant: 'grey',
        cancellable: false,
        reschedulable: false,
        rebookable: true
      }
    }
  }

  else if (booking?.status_v2 === 'active') {
    return {
      value: 'LIVE - PENDING',
      label: 'Live, Pending',
      bgColor: WHITE,
      textColor: TEXTWHITE,
      variant: 'outlined',
      eventVariant: 'info',
      cancellable: true,
      reschedulable: true,
      rebookable: false
    }
  } else {
    return {
      value: `${booking?.status_v2} - ${booking?.scheduled_status}`,
      label: `${booking?.status_v2} - ${booking?.scheduled_status}`,
      bgColor: YELLOW,
      textColor: TEXTYELLOW,
      variant: 'outlined',
      eventVariant: 'warning',
      cancellable: true,
      reschedulable: true,
      rebookable: false
    }
  }
}

export {
  canShowTransaction,
  isCompleted,
  hasArrived,
  canProceed,
  canCancel,
  canReschedule,
  canConfirm,
  canMessage,
  parseBookingStatus,
  bookingStatusConstants
};
