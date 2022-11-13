import axios from 'axios';
import moment from 'moment';

const API_URL = process.env.REACT_APP_WEB_ADMIN_URL + '/'

var users_cache = {
  ALL: {
    label: 'All Types',
    user_types: ['CUSTOMER', 'THERAPIST', 'PROVIDER', 'DRIVER'],
    actual_user_types: ['client', 'provider', 'driver'],
    user_sub_types: null,
    external_affiliation_name: 'NONE',
  },
  CUSTOMER: {
    label: 'Customers',
    user_types: ['CUSTOMER'],
    actual_user_types: ['client'],
    user_sub_types: null,
    external_affiliation_name: 'NONE',
  },
  PARTNERS_ALL: {
    label: 'zennya Partners',
    user_types: ['THERAPIST', 'PROVIDER', 'DRIVER'],
    actual_user_types: ['provider', 'driver'],
    user_sub_types: null,
    external_affiliation_name: 'NONE',
  },
  PROVIDER_ALL: {
    label: 'Providers',
    user_types: ['THERAPIST', 'PROVIDER'],
    actual_user_types: ['provider'],
    user_sub_types: null,
    external_affiliation_name: 'NONE',
  },
  PROVIDER_MT: {
    label: 'Massage Therapists',
    user_types: ['THERAPIST', 'PROVIDER'],
    actual_user_types: ['provider'],
    user_sub_types: ['MASSAGE_THERAPIST'],
    external_affiliation_name: 'NONE',
  },
  PROVIDER_RN: {
    label: 'Nurses',
    user_types: ['THERAPIST', 'PROVIDER'],
    actual_user_types: ['provider'],
    user_sub_types: ['NURSE'],
    external_affiliation_name: 'NONE',
  },
  DRIVER_ALL: {
    label: 'Drivers',
    user_types: ['DRIVER'],
    actual_user_types: ['driver'],
    user_sub_types: null,
    external_affiliation_name: 'NONE',
  },
  RELIANCE_ALL: {
    label: 'Reliance Partners',
    user_types: ['THERAPIST', 'PROVIDER', 'DRIVER'],
    actual_user_types: ['provider', 'driver'],
    user_sub_types: null,
    external_affiliation_name: 'RELIANCE',
  },
};
var users_partners = [];
// $.each(Object.keys(users_cache), function(index, key) {
//   if (
//     !users_cache[key].user_types.find(function(type) {
//       return type == 'CUSTOMER';
//     })
//   ) {
//     users_partners.push(key);
//   }
// });

var folders_cache = {
  INBOX: { label: 'Inbox' },
  PENDING: { label: 'Pending' },
  ARCHIVED: { label: 'Done' },
  SPAM: { label: 'Spam' },
};

var has_training_cache = [
  {
    label: 'No Filter',
    user_has_training_preference: null,
    user_has_training_schedule: null,
  },
  {
    label: 'No Preference',
    user_has_training_preference: false,
    user_has_training_schedule: null,
  },
  {
    label: 'Has Preference',
    user_has_training_preference: true,
    user_has_training_schedule: null,
  },
  {
    label: 'Preference w/o Schedule',
    user_has_training_preference: true,
    user_has_training_schedule: false,
  },
  {
    label: 'Preference w/ Schedule',
    user_has_training_preference: true,
    user_has_training_schedule: true,
  },
];

var source_cache = {
  FACEBOOK_MESSENGER_PARTNER_SUPPORT: { label: 'Messenger', color: '#2978EE', icon: '' },
  FACEBOOK_MESSENGER_CUSTOMER_SUPPORT: { label: 'Messenger', color: '#2978EE', icon: '' },

  FORTYTWO_VIBER_PARTNER_SUPPORT: {
    label: 'Viber',
    color: '#7D3DAF',
    icon: 'assets/images/icon_chat_fortytwo_partner.png',
  }, // Deprecated, Remove later
  FORTYTWO_VIBER_CUSTOMER_SUPPORT: {
    label: 'Viber',
    color: '#7D3DAF',
    icon: 'assets/images/icon_chat_fortytwo_customer.png',
  }, // Deprecated, Remove later
  FORTYTWO_SMS_PARTNER_SUPPORT: {
    label: 'FT SMS',
    color: '#3EC358',
    icon: 'assets/images/icon_chat_fortytwo_partner.png',
  }, // Deprecated, Remove later
  FORTYTWO_SMS_CUSTOMER_SUPPORT: {
    label: 'FT SMS',
    color: '#3EC358',
    icon: 'assets/images/icon_chat_fortytwo_customer.png',
  }, // Deprecated, Remove later

  FORTYTWO_VIBER_SUPPORT: { label: 'Viber', color: '#7D3DAF', icon: 'assets/images/icon_chat_fortytwo_customer.png' },
  FORTYTWO_SMS_SUPPORT: { label: 'FT SMS', color: '#3EC358', icon: 'assets/images/icon_chat_fortytwo_customer.png' },

  ENGAGE_SPARK_PARTNER_SUPPORT: { label: 'SMS', color: '#2d8a88', icon: 'assets/images/icon_chat_sms.png' }, // Deprecated, Remove later
  ENGAGE_SPARK_CUSTOMER_SUPPORT: { label: 'SMS', color: '#2d8a88', icon: 'assets/images/icon_chat_sms.png' }, // Deprecated, Remove later

  SMS_SUPPORT: { label: 'SMS', color: '#2d8a88', icon: 'assets/images/icon_chat_sms.png' },
  IN_APP_CUSTOMER_SUPPORT: { label: 'In-App', color: '#86CAC7', icon: 'assets/images/icon_chat_in_app_customer.png' },
  IN_APP_PARTNER_SUPPORT: { label: 'In-App', color: '#7F8AAC', icon: 'assets/images/icon_chat_in_app_partner.png' },
  IN_APP_MEDICAL_CUSTOMER_SUPPORT: {
    label: 'Medical',
    color: '#CCE4E9',
    icon: 'assets/images/icon_chat_in_app_medical_customer.png',
  },
  IN_APP_MEDICAL_PARTNER_SUPPORT: {
    label: 'Medical',
    color: '#CCE4E9',
    icon: 'assets/images/icon_chat_in_app_medical_partner.png',
  },
};

var bot_type_cache = {
  SUPPORT: {
    label: 'Partner Support',
  },
  CUSTOMER: {
    label: 'Customer Support',
  },
  MEDICAL: {
    label: 'Medical Support',
  },
  RECRUITMENT: {
    label: 'Recruitment',
  },
};

var isGrammarCheckingDisabled = true;

const ChatService = {
  updateChatActivity: async function(assignee_id) {
    var url = 'api/1/chat/conversations/assignees/' + assignee_id + '/checkIn';
    var p = {};
    return await axios.put(API_URL + url, p, { cache: false, suppressError: true });
  },
  loadActiveAssignees: async function() {
    var url = 'api/1/chat/conversations/assignees/active';
    var p = {};
    return await axios.get(API_URL + url, { params: p, cache: false, suppressError: true });
  },

  getChatUserTypeList: async function() {
    return Object.keys(users_cache);
  },
  getChatPartnerUserTypeList: async function() {
    return [...users_partners];
  },
  getChatUserTypeLabel: async function(type) {
    return users_cache[type] ? users_cache[type].label : type;
  },
  getChatUserType: async function(type) {
    return users_cache[type];
  },

  getFolderList: async function() {
    return Object.keys(folders_cache);
  },
  getFolderLabel: async function(folder) {
    return folders_cache[folder] ? folders_cache[folder].label : folder;
  },
  getFolder: async function(folder) {
    return folders_cache[folder];
  },

  getHasTrainingOptions: async function() {
    return has_training_cache;
  },

  getSource: async function(source) {
    return source_cache[source];
  },
  getSourceLabel: async function(source) {
    return source_cache[source] ? source_cache[source].label : source;
  },
  getSourceColor: async function(source) {
    return source_cache[source] ? source_cache[source].color : null;
  },

  isConvoFiltered: async function(convo, user_type, folder, statuses, sub_statuses, is_unassigned, assignee) {
    if (user_type && user_type !== 'ALL' && users_cache[user_type] && convo.linked_user) {
      var type = users_cache[user_type];
      if (type.user_types && type.actual_user_types.indexOf(convo.linked_user.type) < 0) {
        return true;
      }
      if (type.user_sub_types && type.user_sub_types.indexOf(convo.linked_user.sub_type) < 0) {
        return true;
      }
    }

    if (folder && convo.status !== folder) {
      return true;
    }

    if (is_unassigned && convo.assignee) {
      return true;
    }
    if (assignee) {
      if (!convo.assignee || convo.assignee.id !== assignee.id) {
        return true;
      }
    }

    if (statuses && statuses.length > 0) {
      if (!convo.linked_user) {
        if (
          statuses.indexOf('recruiting') >= 0 &&
          (!sub_statuses || sub_statuses.length === 0 || sub_statuses.indexOf('XXX') >= 0)
        ) {
          return false;
        }
        return true;
      }

      if (
        statuses.indexOf(convo.linked_user.status) < 0 ||
        (sub_statuses && sub_statuses.length > 0 && sub_statuses.indexOf(convo.linked_user.sub_status) < 0)
      ) {
        return true;
      }
    }

    return false;
  },

  loadSources: async function() {
    var url = 'api/1/chat/sources';
    var p = {};
    const results = await axios.get(API_URL + url, { params: p, cache: false, suppressError: true })
    results?.data?.list??[].map((item, index) => {
      if (item.variant.type === 'FACEBOOK_MESSENGER') {
        item.icon_url = 'https://graph.facebook.com/' + item.variant.page_id + '/picture?type=square';
      } else {
        item.icon_url = source_cache[item.code] ? source_cache[item.code].icon : null;
      }

      var can_send_doc = false;
      var can_send_image = false;
      if (item.capabilities && item.capabilities.length > 0) {
        can_send_doc = item.capabilities.indexOf('CAN_SEND_DOCUMENT_ATTACHMENTS') >= 0;
        can_send_image = can_send_doc || item.capabilities.indexOf('CAN_SEND_IMAGE_ATTACHMENTS') >= 0;
      }
      item.can_send_doc = can_send_doc;
      item.can_send_image = can_send_image;
      if (item.attachment_mime_types && item.attachment_mime_types.length > 0) {
        item.attach_types = item.attachment_mime_types.join(',');
      }
      return item
    })
    return results
  },

  loadFilterCounts: async function(show_as_medicals, user_types, user_sub_types, external_affiliation_name, items) {
    var url = 'api/1/chat/conversations/filterCounts';
    var p = {
      show_as_medicals: show_as_medicals === true,
      user_types: user_types,
      user_sub_types: user_sub_types,
      external_affiliation_name: external_affiliation_name,
      requests: items,
    };
    return await axios.post(API_URL + url, p, { cache: false, suppressError: true });
  },

  loadConversations: async function(
    user_types,
    user_sub_types,
    external_affiliation_name,
    is_unassigned,
    assignee_id,
    is_count_unassigned,
    count_assignee_id,
    show_as_medicals,
    status,
    user_statuses,
    user_sub_statuses,
    user_has_training_schedule,
    user_has_training_preference,
    exclude_unlinked,
    search_text,
    priority,
    page_size,
    date_since,
    date_until,
    timeout,
  ) {
    var url = 'api/1/chat/conversations';
    var p = {
      user_types: user_types,
      user_sub_types: user_sub_types,
      external_affiliation_name: external_affiliation_name,
      is_unassigned: is_unassigned === true,
      assignee: assignee_id,
      is_count_unassigned: is_count_unassigned === true,
      count_assignee: count_assignee_id,
      show_as_medicals: show_as_medicals === true,
      user_statuses: user_statuses,
      user_sub_statuses: user_sub_statuses,
      user_has_training_schedule: user_has_training_schedule,
      user_has_training_preference: user_has_training_preference,
      exclude_unlinked: exclude_unlinked === true,
      search_text: search_text,
      priority: priority ? priority.name : null,
      page_size: page_size || 0,
      date_since: date_since,
      date_until: date_until,
    };
    if (status) p.status = status;
    return await axios.get(API_URL + url, { params: p, cache: false, timeout: timeout, suppressError: true });
  },
  loadUserConversations: async function(user_id, page_size) {
    var url = 'api/1/users/' + user_id + '/chat/conversations';
    var p = {
      page_size: page_size || 0,
    };
    return await axios.get(API_URL + url, { params: p, cache: false, suppressError: true });
  },
  loadConversation: async function(conversation_id, timeout) {
    var url = 'api/1/chat/conversations/' + conversation_id;
    return await axios.get(API_URL + url, { cache: false, timeout: timeout, suppressError: true });
  },

  getConversationHistoryStatus: async function(conversation_id, page_offset, page_size) {
    var url = 'api/1/chat/conversations/' + conversation_id + '/history/status';
    var p = {
      page_offset: page_offset,
      page_size: page_size,
    };
    return await axios.get(API_URL + url, { params: p, cache: false, clearCache: url });
  },
  moveConversation: async function(conversation_id, status) {
    var url = 'api/1/chat/conversations/' + conversation_id + '/status';
    var p = {
      status: status,
    };
    return await axios.put(API_URL + url, p, { cache: false, clearCache: url });
  },
  assignConversation: async function(conversation_id, staff_id) {
    var url = 'api/1/chat/conversations/' + conversation_id + '/assign';
    var p = {
      assignee: staff_id,
    };
    return await axios.put(API_URL + url, p, { cache: false, clearCache: url });
  },

  loadConversationLinkedUserSearch: async function(conversation_id, search, timeout) {
    var url = 'api/1/chat/conversations/' + conversation_id + '/linkedUser/search';
    var p = {
      search: search,
      page_size: 20,
    };
    return await axios.get(API_URL + url, { params: p, cache: false, timeout: timeout, suppressError: true });
  },
  updateConversationLinkedUser: async function(conversation_id, user_id) {
    var url = 'api/1/chat/conversations/' + conversation_id + '/linkedUser';
    var p = {
      user: user_id,
    };
    return await axios.put(API_URL + url, p, { cache: false, clearCache: url });
  },

  loadConversationUserAttributes: async function(conversation_id) {
    var url = 'api/1/chat/conversations/' + conversation_id + '/userAttributes';
    return await axios.get(API_URL + url, { cache: false, clearCache: url, suppressError: true });
  },

  markSeenCoversation: async function(convo, source) {
    var fbApi = 'https://graph.facebook.com/';
    var url = 'v2.10/me/messages?pretty=0';
    var p = {
      pretty: 0,
      access_token: source.variant.access_token,
    };
    var pp = {
      recipient: {
        id: convo.source_variant.page_scope_id,
      },
      sender_action: 'mark_seen',
    };
    return await axios.post(fbApi + url, pp, { params: p, cache: false });
  },
  markReadCoversation: async function(conversation_id) {
    var url = 'api/1/chat/conversations/' + conversation_id + '/newMessageCount';
    return await axios.delete(API_URL + url, {}, { cache: false, clearCache: url });
  },
  loadMessages: async function(
    conversation_id,
    page_size,
    date_since,
    date_until,
    is_descending_order,
    exclude_internal,
    exclude_transfer_link,
    exclude_transfer_parent,
    variant_types,
  ) {
    var url = 'api/2/chat/conversations/' + conversation_id + '/messages';
    var p = {
      page_size: page_size,
      date_since: date_since,
      date_until: date_until,
      is_descending_order: is_descending_order === false ? false : true,
      exclude_internal: exclude_internal === true,
      exclude_transfer_link: exclude_transfer_link === true,
      exclude_transfer_parent: exclude_transfer_parent === true,
      variant_types: variant_types,
    };
    return await axios.get(API_URL + url, { params: p, cache: false, suppressError: true });
  },
  transferMessages: async function(conversation_id, destination_conversation_id, message_ids, internal_message) {
    var url = 'api/1/chat/conversations/' + conversation_id + '/messages/transfer';
    var p = {
      destination_conversation: destination_conversation_id,
      messages: message_ids,
      internal_message: internal_message,
    };
    return await axios.post(API_URL + url, p, { cache: false, suppressError: true });
  },
  messageTimestampToLocal: async function(messageTimestamp) {
    return messageTimestamp ? new Date(messageTimestamp).getTime() : null;
  },
  messageTimestampFromLocal: async function(localTimestamp) {
    if (Number.parseInt(localTimestamp)) {
      var format = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';
      return moment(new Date(Number.parseInt(localTimestamp)))
        .utc()
        .format(format);
    }
    return null;
  },
  sendMessage: async function(conversation_id, message, image_url, attachment_file, is_internal) {
    var url = 'api/1/chat/conversations/' + conversation_id + '/messages';

    if (attachment_file) {
      var p = {
        is_internal: is_internal === true,
        attachment_file: attachment_file,
      };
      if (message) p.text = message;
      //todo: upload component?
      // return Upload.upload({ url: API_URL + url, data: p });
    }

    var p = {
      text: message || '',
      image_attachment_url: image_url,
      is_internal: is_internal === true,
    };
    return await axios.post(API_URL + url, p, { cache: false, clearCache: url });
  },

  sendUserMessage: async function(user_id, params) {
    var url = 'api/1/chat/users/' + user_id + '/messages';
    var allowed = ['text', 'image_attachment_url', 'ticket_subject', 'ticket_description', 'ticket_tag'];
    const {
      text, image_attachment_url, ticket_subject, ticket_description, ticket_tag
    } = params

    var p = {text, image_attachment_url, ticket_subject, ticket_description, ticket_tag}
    return await axios.post(API_URL + url, p, { cache: false, clearCache: url });
  },

  loadSupportContext: async function(message_id, cache) {
    var url = 'api/1/chat/messages/' + message_id + '/support_context';
    var p = {};
    return await axios.get(API_URL + url, { params: p, cache: false, suppressError: true });
  },

  getRecruitmentSavedReplies: async function() {
    return this.getSavedReplies(['RECRUITMENT']);
  },
  getPartnerSavedReplies: async function() {
    return this.getSavedReplies(['PARTNER_SUPPORT']);
  },
  getCustomerSavedReplies: async function() {
    return this.getSavedReplies(['CUSTOMER_SUPPORT']);
  },
  getMedicalSavedReplies: async function() {
    return this.getSavedReplies(['MEDICAL_SUPPORT']);
  },
  getSavedReplies: async function(categories) {
    var url = 'api/1/chat/saved_replies';
    var p = {
      categories: categories,
    };
    return await axios.get(API_URL + url, { params: p, cache: false, clearCache: url });
  },
  processSavedReplyMessage: async function(message, params) {
    var replaces = {
      user_first_name: '',
      user_last_name: '',
      user_full_name: '',
      admin_first_name: '',
      admin_last_name: '',
      ...params
    };
    return !message
      ? ''
      : message.replace(
          // Get all {{ ... }}
          // Greedy and does not work with nested braces
          /\{\{[^\{]*\}/g,
          function(item) {
            // Remove {} and spaces
            item = item.replace(/(^\{+)|(^\s+)|(\}+$)|(\s+$)/gm, '');
            return replaces[item] || '';
          },
        );
  },

  loadGeneratedUserLink: async function(user) {
    var id = user.id;
    var url = 'api/1/providers/getLoginCode';
    var p = {
      id: id,
    };
    return await axios.get(API_URL + url, { params: p, cache: false }).then(function(result) {
      var link = 'https://partner.zennya.com/#/provider/' + id + '?code=';
      if (process.env.NODE_ENV === 'development') {
        link = 'http://dev.partner.zennya.com/#/provider/' + id + '?code=';
      }
      link += result.data.code || '';
      result.data.link = link;
      return result;
    });
  },

  getJobInfo: async function(user_id) {
    var url = 'api/1/employees/' + user_id + '/jobInfo';
    return await axios.get(API_URL + url, { cache: false, suppressError: true });
  },

  
  getClinicsInfo: async function(user_id) {
    var url = 'api/1/clinics/users/' + user_id;
    return await axios.get(API_URL + url, { cache: false, suppressError: true });
  },

  getConversationNotes: async function(conversation_id) {
    var url = 'api/1/chat/conversations/' + conversation_id + '/notes';
    return await axios.get(API_URL + url, { cache: false, suppressError: true });
  },
  getConversationNotesByUserId: async function(user_id) {
    var url = 'api/1/chat/user/' + user_id + '/notes';
    return await axios.get(API_URL + url, { cache: false, suppressError: true });
  },
  addConversationNote: async function(conversation_id, content) {
    var url = 'api/1/chat/conversations/' + conversation_id + '/notes';
    var p = {
      content: content,
    };
    return await axios.post(API_URL + url, p, { cache: false });
  },
  updateConversationNote: async function(note_id, content) {
    var url = 'api/1/chat/conversations/notes/' + note_id;
    var p = {
      content: content,
    };
    return await axios.put(API_URL + url, p, { cache: false });
  },
  deleteConversationNote: async function(note_id) {
    var url = 'api/1/chat/conversations/notes/' + note_id;
    return await axios.delete(API_URL + url, {}, { cache: false });
  },

  getConversationTags: async function(convo) {
    var url = 'api/1/chat/conversations/' + convo.id + '/tags';
    return await axios.get(API_URL + url, { cache: false, suppressError: true });
  },
  updateConversationTags: async function(convo, tag_model, set) {
    var url = 'api/1/chat/conversations/' + convo.id + '/tags/' + (set ? 'add' : 'remove');
    var p = {
      tag: tag_model,
    };
    return await axios.post(API_URL + url, p, { cache: false });
  },

  loadBotUserStatus: async function(convo, source) {
    var url = 'api/1/webhooks/messengerBot/' + source.variant.page_id + '/users/' + convo.source_variant.page_scope_id;
    return await axios.get(API_URL + url, { cache: false, suppressError: true });
  },
  initiateBotWelcome: async function(convo, source) {
    var url =
      'api/1/webhooks/messengerBot/' +
      source.variant.page_id +
      '/users/' +
      convo.source_variant.page_scope_id +
      '/initiateApplicationWelcome';
    return await axios.post(API_URL + url, {}, { cache: false, suppressError: true });
  },
  startBotUserStory: async function(convo, source) {
    var url =
      'api/1/webhooks/messengerBot/' +
      source.variant.page_id +
      '/users/' +
      convo.source_variant.page_scope_id +
      '/startProviderApplication';
    return await axios.post(API_URL + url, {}, { cache: false, suppressError: true });
  },
  continueBotUserStory: async function(convo, source) {
    var url =
      'api/1/webhooks/messengerBot/' +
      source.variant.page_id +
      '/users/' +
      convo.source_variant.page_scope_id +
      '/continueInitialStory';
    return await axios.post(API_URL + url, {}, { cache: false, suppressError: true });
  },
  stopBotUserStory: async function(convo, source) {
    var url =
      'api/1/webhooks/messengerBot/' +
      source.variant.page_id +
      '/users/' +
      convo.source_variant.page_scope_id +
      '/stopInitialStory';
    return await axios.post(API_URL + url, {}, { cache: false, suppressError: true });
  },
  showBotUserInterviewSchedules: async function(convo, source) {
    var url =
      'api/1/webhooks/messengerBot/' +
      source.variant.page_id +
      '/users/' +
      convo.source_variant.page_scope_id +
      '/showInterviewSchedules';
    return await axios.post(API_URL + url, {}, { cache: false, suppressError: true });
  },
  showBotUserOfficeSelections: async function(convo, source) {
    var url =
      'api/1/webhooks/messengerBot/' +
      source.variant.page_id +
      '/users/' +
      convo.source_variant.page_scope_id +
      '/showOfficeSelections';
    return await axios.post(API_URL + url, {}, { cache: false, suppressError: true });
  },
  showBotUserOfficeDirections: async function(convo, source) {
    var url =
      'api/1/webhooks/messengerBot/' +
      source.variant.page_id +
      '/users/' +
      convo.source_variant.page_scope_id +
      '/showOfficeDirections';
    return await axios.post(API_URL + url, {}, { cache: false, suppressError: true });
  },

  loadBotEvaluations: async function(type, params) {
    var url = 'api/1/chat/conversations/messages/bot_evaluations';
    var p = {
      type: type,
      ...params
    };
    return await axios.get(API_URL + url, { params: p, cache: false });
  },
  loadBotEvaluation: async function(message_id) {
    var url = 'api/1/chat/conversations/messages/' + message_id + '/bot_evaluation';
    return await axios.get(API_URL + url, { cache: false });
  },
  updateBotEvaluation: async function(message_id, notes, resolved) {
    var url = 'api/1/chat/conversations/messages/' + message_id + '/bot_evaluation';
    var p = {
      notes: notes || '',
      resolved: resolved === true,
    };
    return await axios.post(API_URL + url, p, { cache: false });
  },
  updateBotEvaluationSuggestion: async function(message_id, suggestion) {
    var url = 'api/1/chat/conversations/messages/' + message_id + '/bot_evaluation';
    var p = {
      suggestion: suggestion || [],
    };
    return await axios.post(API_URL + url, p, { cache: false });
  },

  getBotTypes: async function() {
    return Object.keys(bot_type_cache);
  },
  getBotType: async function(type) {
    return bot_type_cache[type];
  },
  getBotTypeLabel: async function(type) {
    return bot_type_cache[type] ? bot_type_cache[type].label : type;
  },

  loadBotMetaSyncState: async function(type) {
    var url = 'api/1/chat_bot/sync_meta';
    var p = {
      type: type,
    };
    return await axios.get(API_URL + url, { params: p, cache: false });
  },
  updateBotMetaSyncState: async function(type) {
    var url = 'api/1/chat_bot/sync_meta';
    var p = {
      type: type,
    };
    return await axios.post(API_URL + url, p, { cache: false });
  },
  loadPhrases: async function(type, params) {
    var url = 'api/1/chat_bot/phrases';
    var p = {
      type: type,
      ...params
    };
    return await axios.get(API_URL + url, { params: p, cache: false });
  },
  createPhrase: async function(type, text, event_ids) {
    var url = 'api/1/chat_bot/phrases';
    var p = {
      type: type,
      text: text,
      events: event_ids,
    };
    return await axios.post(API_URL + url, p, { cache: false });
  },
  updatePhrase: async function(phrase_id, text, event_ids, phrase_entities) {
    var url = 'api/1/chat_bot/phrases/' + phrase_id;
    var p = {
      text: text,
      events: event_ids,
      phrase_entities: phrase_entities,
    };
    return await axios.put(API_URL + url, p, { cache: false });
  },
  deletePhrase: async function(phrase_id) {
    var url = 'api/1/chat_bot/phrases/' + phrase_id;
    var p = {};
    return await axios.delete(API_URL + url, p, { cache: false });
  },
  loadNlpEventsSummary: async function(type, params) {
    var url = 'api/1/chat_bot/nlp_events/summary';
    var p = {
      type: type,
      ...params
    };
    return await axios.get(API_URL + url, { params: p, cache: false });
  },
  loadNlpEvents: async function(type, params) {
    console.log('load nlp events');
    console.log(params);
    var url = 'api/1/chat_bot/nlp_events';
    var p = {
      type: type,
      ...params
    };
    return await axios.get(API_URL + url, { params: p, cache: false });
  },
  //  Entity CRUD
  listEntitiesSummary: async function(params) {
    var url = 'api/1/chat_bot/entities/summary';
    var p = {
      search: params.search,
      page_offset: params.page_offset,
      page_size: params.page_size,
      only_from_values: params.only_from_values,
      same_word: params.same_word,
      types: params.type,
    };

    return await axios.get(API_URL + url, { params: params, cache: false });
  },
  listEntities: async function(params) {
    var url = 'api/1/chat_bot/entities';
    var p = {
      page_offset: 0,
      page_size: 50,
      type: ['DEFAULT'],
      ...params
    };
    return await axios.get(API_URL + url, { params: p, cache: false });
  },
  createEntity: async function(params) {
    var url = 'api/1/chat_bot/entities';

    return await axios.post(API_URL + url, params, { cache: false });
  },
  getEntity: async function(params) {
    var url = 'api/1/chat_bot/entities/' + params.id;

    return await axios.get(API_URL + url, { cache: false });
  },
  updateEntity: async function(params) {
    var url = 'api/1/chat_bot/entities/' + params.id;
    return await axios.put(API_URL + url, params, { cache: false });
  },
  deleteEntity: async function(id) {
    var url = 'api/1/chat_bot/entities/' + id;

    return await axios.delete(API_URL + url, { cache: false });
  },
  //  NLP Events
  listNLPEvents: async function(type, params) {
    var url = 'api/1/chat_bot/nlp_events';
    var p = {
      type: type,
      page_size: params.page_size,
      page_offset: params.page_offset,
      search: params.search,
      entities: params.entities,
    };
    return await axios.get(API_URL + url, { params: p, cache: false });
  },
  listNLPEventsSummary: async function(type, params) {
    var url = 'api/1/chat_bot/nlp_events/summary';
    var p = {
      type: type,
      page_size: params.page_size,
      page_offset: params.page_offset,
      ...params
    };
    return await axios.get(API_URL + url, { params: p, cache: false });
  },
  createNLPEvent: async function(params) {
    var url = 'api/1/chat_bot/nlp_events';
    return await axios.post(API_URL + url, params, { cache: false });
  },
  updateNLPEvent: async function(params) {
    var url = 'api/1/chat_bot/nlp_events/' + params.id;

    return await axios.put(API_URL + url, params, { cache: false });
  },
  getNLPEvent: async function(intent_id) {
    var url = 'api/1/chat_bot/nlp_events/' + intent_id;
    return await axios.get(API_URL + url, { cache: false });
  },
  deleteNLPEvent: async function(intent_id) {
    var url = 'api/1/chat_bot/nlp_events/' + intent_id;
    return await axios.delete(API_URL + url, { cache: false });
  },
  updateUserInfo: async function(params) {
    var url = 'api/1/chat/conversations/' + params.cid + '/userAttributes';
    return await axios.put(API_URL + url, params.payload, { cache: false });
  },
  resetUserInfo: async function(cid) {
    var url = 'api/1/chat/conversations/' + cid + '/userAttributes';
    return await axios.delete(API_URL + url, { cache: false });
  },
  checkGrammar: async function(params) {
    if (isGrammarCheckingDisabled) {
      return null;
    }

    var url = 'api/1/chat/grammar';

    return await axios.post(API_URL + url, params, { cache: false });
  },
  isGrammarCheckingDisabled: async function() {
    return isGrammarCheckingDisabled;
  },
  getIssueTypes: async function() {
    var url = 'api/1/chat/conversations/tickets/getIssueTypes';
    return await axios.get(API_URL + url, {}, { cache: false });
  },
  getPriorityLevels: async function() {
    var url = 'api/1/chat/conversations/tickets/getPriorityLevels';
    return await axios.get(API_URL + url, {}, { cache: false });
  },
  getStatuses: async function() {
    var url = 'api/1/chat/conversations/tickets/getStatuses';
    return await axios.get(API_URL + url, {}, { cache: false });
  },
  createTicket: async function(params, cid) {
    var url = 'api/1/chat/conversation/' + cid + '/tickets/createIssueTicket';
    return await axios.post(API_URL + url, params, { cache: false });
  },
  createDefaultTicket: async function(defaults, cid) {
    var params = {
      title: defaults.title,
      priority: 'MODERATE',
      description: 'Newly created ticket',
      reporter_id: defaults.reporter_id,
      handler_id: defaults.reporter_id,
      conversation_id: defaults.convoId,
      message_id: defaults.msgId,
    };
    var url = 'api/1/chat/conversation/' + cid + '/tickets/createIssueTicket';
    return await axios.post(API_URL + url, params, { cache: false });
  },
  updateTicket: async function(params, cid, citid) {
    var url = 'api/1/chat/conversation/' + cid + '/tickets/' + citid + '/update';
    return await axios.post(API_URL + url, params, { cache: false });
  },
  hasMessageHadTicket: async function(params, mid) {
    var url = 'api/1/chat/messages/' + mid + '/tickets/hasHadTicket';
    return await axios.get(API_URL + url, params, { cache: false });
  },
  getTickets: async function(params, cid) {
    var url = 'api/1/chat/conversation/' + cid + '/tickets/getTickets';
    var p = {
      params: params,
      cache: false,
    };
    return await axios.get(API_URL + url, p);
  },
  getConversationTicketOverviews: async function(params) {
    var url = 'api/1/conversation/getTicketOverviews';
    var p = {
      params: params,
      cache: false,
    };
    return await axios.get(API_URL + url, p);
  },
  getCachedConversationPriorities: async function(params) {
    var url = 'api/1/chat/conversations/cachedPriorities';
    var p = {
      params: params,
      cache: false,
    };
    return await axios.get(API_URL + url, p);
  },
  getStaffPerformanceByList: async function(params) {
    var url = 'api/1/chat/tickets/getStaffTicketStats';
    var p = {
      params: params,
      cache: false,
    };
    return await axios.get(API_URL + url, p);
  },
  getCommonTags: async function(params) {
    var url = 'api/1/chat/messages/tickets/getCommonTags';
    var p = {
      params: params,
      cache: false,
    };
    return await axios.get(API_URL + url, p);
  },
  mergeTickets: async function(params, citid) {
    var url = 'api/1/chat/ticket/' + citid + '/mergeTickets';
    return await axios.post(API_URL + url, params);
  },
  getActiveTickets: async function(cid) {
    var url = 'api/1/chat/conversation/' + cid + '/tickets/getActiveTickets';
    return await axios.get(API_URL + url, { cache: false });
  },
  getFocusedTicket: async function(cid) {
    var url = 'api/1/chat/conversation/' + cid + '/tickets/getFocus';
    return await axios.get(API_URL + url, { cache: false });
  },
  updateFocusedTicket: async function(params, cid) {
    var url = 'api/1/chat/conversation/' + cid + '/tickets/updateFocus';
    return await axios.post(API_URL + url, params, { cache: false });
  },
  transferChatIssueMessages: async function(params, cid) {
    var url = 'api/1/chat/conversation/' + cid + '/tickets/transferMessages';
    return await axios.post(API_URL + url, params, { cache: false });
  },
};

export { ChatService };
