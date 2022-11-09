import { Appointments } from "./Appointments";

export default {
  title: "Chat/Appointments",
  component: Appointments,
};

export const Default = (args) => {
  return <Appointments {...args} />;
};



Default.args = {
  title: "Appointments",
  "API_URL": "http://dev.admin.zennya.com",
  appointmentsList:{
    "count": 1105,
    "list": [
      {
        "id": 11040,
        "status": "provider aborted",
        "request_profile": null,
        "request": {
          "id": "629ec3245a20f6cc0c96e4e2",
          "status": "accepted",
          "status_v1": "accepted",
          "status_v2": "accepted",
          "gender": "any",
          "duration": 60,
          "type": {
            "id": 1,
            "name": "massage.swedish",
            "label": "Swedish Aromatherapy",
            "sublabel": " ",
            "category": "WELLNESS",
            "category_visibility": ["WELLNESS"],
            "pricing": "duration",
            "pricing_sub": null,
            "ordering": 0,
            "tips_enabled": true
          },
          "longitude": 124.71119599999997,
          "latitude": 8.474663999999999,
          "address": null,
          "notes": null,
          "amount": 0.0,
          "original_amount": 0.0,
          "discount_amount": 0,
          "total_amount": 0,
          "base_amount": 0,
          "booking_fee_amount": 0,
          "hazard_fee_amount": 0,
          "transport_fee_amount": 0,
          "credits_used": 0.0,
          "user_location": {
            "id": 779,
            "type": { "id": 3, "name": "hotel" },
            "type_name": "hotel",
            "longitude": 124.71119599999997,
            "latitude": 8.474663999999999,
            "label": "Cocobay",
            "name": "Coconut Bay",
            "address": "Butuan - Cagayan de Oro - Iligan Rd, Cagayan de Oro, Misamis Oriental, Philippines",
            "tower_name": null,
            "number": "123",
            "street_name": "Butuan - Cagayan de Oro - Iligan Road",
            "guest_name": "Shane",
            "notes": null,
            "delivery_notes": null,
            "city": {
              "id": 17,
              "name": "Cagayan de Oro",
              "tz_offset": 28800,
              "tz_id": "Asia/Manila",
              "enabled": true,
              "regional_office": {
                "id": 2,
                "identifier": "METRO_CEBU",
                "name": "Metro Cebu"
              }
            },
            "area": {
              "id": 7,
              "name": "Cagayan de Oro",
              "timezone_offset_in_seconds": 28800,
              "priority": 0,
              "last_updated": "2021-10-07T12:07:08Z",
              "status_last_updated": "2019-06-12T03:36:08Z",
              "enabled": true,
              "regional_office": {
                "id": 1,
                "identifier": "METRO_MANILA",
                "name": "Metro Manila"
              }
            }
          },
          "area": {
            "id": 7,
            "name": "Cagayan de Oro",
            "timezone_offset_in_seconds": 28800,
            "priority": 0,
            "last_updated": "2021-10-07T12:07:08Z",
            "status_last_updated": "2019-06-12T03:36:08Z",
            "enabled": true,
            "regional_office": {
              "id": 1,
              "identifier": "METRO_MANILA",
              "name": "Metro Manila"
            }
          },
          "booking_option": 2,
          "request_profile": null,
          "session_type": "single",
          "group_index": -1,
          "group_request_id": 0,
          "is_primary": true,
          "cancel_reason": null,
          "loa": null,
          "hmo_partner": {
            "id": 1,
            "name": "MAXICARE",
            "label": "Maxicare",
            "banner_url": "https://dnjqko642wsuu.cloudfront.net/public/hmo/logo_small_maxicare.png"
          },
          "created_by": 1419,
          "creation_type": null,
          "clinic": null,
          "regional_office": {
            "id": 1,
            "identifier": "METRO_MANILA",
            "name": "Metro Manila"
          },
          "promo": null,
          "is_whitelabel": true,
          "white_label_partner": {
            "id": 1,
            "name": "MAXICARE",
            "label": "Maxicare",
            "logo_url": "https://dnjqko642wsuu.cloudfront.net/public/hmo/logo_small_maxicare.png",
            "app_logo_small_url": "https://dnjqko642wsuu.cloudfront.net/public/hmo/app_logo_small_maxicare.png"
          },
          "white_label_customer": {
            "id": 23,
            "first_name": "Brenda",
            "middle_name": "M",
            "last_name": "Jackson",
            "email": "Brenda.Jackson@zennya.com",
            "mobile_number": "+639000000000",
            "gender": "M",
            "birth_date": "1984-11-22T16:00:00Z",
            "address": "Address address",
            "latitude": 8.47,
            "longitude": 124.71,
            "card_number": null,
            "client": null,
            "verified_email": null,
            "verified_mobile_number": null,
            "customer_info": null,
            "status": null
          },
          "white_label_reference_id": null,
          "booking_notes": null,
          "media_file_ids": [],
          "requires_payment": false,
          "requires_location_confirmation": true,
          "requires_ppe": true,
          "service_addon_order": [
            { "service_addon_id": 1, "type": "service", "priority": 1 }
          ],
          "package_ids": [],
          "packages": [],
          "extended_packages": [],
          "extended_package_items": [],
          "booking_options": [
            {
              "id": 1,
              "label": "PPE",
              "description": "Your provider will wear full PPE during the service",
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/booking_option/booking_option_ppe.png",
              "default_value": true,
              "amount": 50.0
            }
          ],
          "manually_assigned_appointment_conversation_expired": false
        },
        "type": {
          "id": 1,
          "name": "massage.swedish",
          "label": "Swedish Aromatherapy",
          "sublabel": " ",
          "category": "WELLNESS",
          "category_visibility": ["WELLNESS"],
          "pricing": "duration",
          "pricing_sub": null,
          "ordering": 0,
          "tips_enabled": true,
          "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/swedish5.png",
          "icon_url_male": "http://dnjqko642wsuu.cloudfront.net/public/swedish5.png",
          "description": "Medium pressure massage using long gliding strokes with organic essential oil aromatherapy to reduce anxiety and induce sleep.",
          "description_male": "Medium pressure massage using long gliding strokes with organic essential oil aromatherapy to reduce anxiety and induce sleep.",
          "description_slides": [],
          "preparation": "?    Take a warm shower before your massage\n?    You can wear undergarments or naked under towel\n?    Get comfortable with dim lights\n?    Prepare 2 towels for the massage",
          "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/swedish/v1/bg.jpg",
          "tags": "stress relief,improve mood,relaxation",
          "tag_icons": [],
          "tag_icons_male": [],
          "overlay_html_url": "http://dnjqko642wsuu.cloudfront.net/public/swedish_overlay_content6.html",
          "overlay_html_url_male": "http://dnjqko642wsuu.cloudfront.net/public/swedish_overlay_content6.html",
          "color": "86CAC7",
          "color_male": "86CAC7",
          "is_new_service": false,
          "is_intro_price": false,
          "is_personal_info_required": false,
          "pairings": ["zennya calm", "zennya pure", "zennya soothe"],
          "extras": [
            {
              "id": 1,
              "name": "addon.swedish.footscrub",
              "label": "Foot Scrub",
              "ordering": 1,
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/icon_foot_scrub.png",
              "description": "Spa foot scrub experience at home? Believe it. Our foot scrub uses the finest blend of sea salt and zennya’s special therapeutic grade coconut oil, infused with tea and peppermint to remove dead skin and make your feet look and feel like new.",
              "description2": "<big><b>Benefits<\u002fb><\u002fbig>\n<br />\n• Removes dead skin for a healthier look<br />\n• Our scrub and balm products include anti-fungal tea tree essential oils to treat and prevent fungal growth<br />\n• Improves range of motion for toes<br />\n• Treats aching tired feed and arches<br />",
              "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/footscrub/v1/bg.jpg",
              "personal_info_required": false,
              "category": "WELLNESS",
              "detail_sections": [],
              "options": [
                {
                  "id": 1,
                  "label": "Duration",
                  "choices": [
                    {
                      "id": 2,
                      "label": "60 mins",
                      "cost": 450.0,
                      "duration": 60
                    },
                    { "id": 1, "label": "30 mins", "cost": 250.0, "duration": 30 }
                  ]
                }
              ]
            },
            {
              "id": 7,
              "name": "addon.swedish.thaifoot",
              "label": "Thai Foot Massage",
              "ordering": 0,
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/thaifoot_addon.png",
              "description": "Thai Foot Massage is a massage of the lower legs and feet that originated in Thailand over 2000 years ago with elements of Shiatsu, Reflexology, Chinese Massage, and Yoga, and still taught today by Buddhist monks in the temples of Thailand. This therapy produces a feeling of balance, relaxation and well being, involving stretching, massage, use of a stick to stimulate reflex points.",
              "description2": "<big><b>Benefits<\u002fb><\u002fbig>\n<br />\n• Improves circulation of the hands and feet.<br />\n• Enhanced flexibility and reduced stiffness of legs? and feet.<br />\n• Improves sleep.<br />\n• Reduces edema in pregnant women during third trimester.<br />",
              "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/thai_foot/v1/bg.jpg",
              "personal_info_required": false,
              "category": "WELLNESS",
              "detail_sections": [],
              "options": [
                {
                  "id": 7,
                  "label": "Duration",
                  "choices": [
                    {
                      "id": 14,
                      "label": "60 mins",
                      "cost": 450.0,
                      "duration": 60
                    },
                    {
                      "id": 13,
                      "label": "30 mins",
                      "cost": 250.0,
                      "duration": 30
                    }
                  ]
                }
              ]
            }
          ]
        },
        "start_date": "2022-06-07T03:18:38Z",
        "end_date": "2022-06-13T05:02:20Z",
        "extras_requested": [],
        "sessions": [
          {
            "id": 13672,
            "type": "service",
            "status": "current",
            "priority": 1,
            "start_date": null,
            "end_date": "2022-06-13T05:02:20Z",
            "duration": 60,
            "amount": 625.0,
            "discounted_amount": 625.0,
            "provider_profit": 0.0,
            "company_profit": 0.0,
            "tip": null,
            "has_ongoing_steps": false,
            "has_ongoing_pending_steps": false,
            "type_id": 1,
            "label": "Swedish Aromatherapy"
          }
        ],
        "directions": null,
        "transactions": [
          {
            "id": 39149,
            "timestamp": "2022-06-07T03:16:52Z",
            "transaction_id": null,
            "charge_type": "pay",
            "status": "complete",
            "amount": 0.0,
            "credits": 0.0,
            "refunded_transaction_id": null,
            "gateway_type": null,
            "processing_type": {
              "enumType": "com.remedy.payment.Transaction$ProcessingType",
              "name": "PARTNER"
            }
          }
        ],
        "cancel_reason": null,
        "end_reason": null,
        "feedback": null,
        "client_feedback": null,
        "promo": null,
        "travel_method": "driving",
        "transportation": "Other",
        "oil_type": null,
        "preparing": true,
        "date_preparing_start": "2022-06-07T03:18:38Z",
        "date_preparing_done": null,
        "date_arrived": null,
        "date_arriving": null,
        "addons": [],
        "is_forced_assigned": false,
        "session_type": "single",
        "group_appointment_id": null,
        "group_index": -1,
        "tip_disabled": false,
        "last_payment_method_used_token": null,
        "packages": [],
        "extended_packages": [],
        "extended_package_items": [],
        "booking_options": [
          {
            "id": 1,
            "label": "PPE",
            "description": "Your provider will wear full PPE during the service",
            "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/booking_option/booking_option_ppe.png",
            "default_value": true,
            "amount": 50.0
          }
        ],
        "booking_type": null,
        "is_scheduled": false,
        "date_scheduled": null,
        "standby": false,
        "date_standby_start": "2022-06-07T03:18:38Z",
        "booking_fee_amount": 0.0,
        "hazard_fee_amount": 0,
        "transport_fee_amount": 0,
        "kit_fee_amount": 0,
        "product_fee_amount": 25.0,
        "ppe_fee_amount": 100.0,
        "admin_fee_amount": 100.0,
        "clinic": null,
        "regional_office": {
          "id": 1,
          "identifier": "METRO_MANILA",
          "name": "Metro Manila"
        },
        "provider": {
          "id": 203,
          "first_name": "Shaneeee Olivierrrr",
          "last_name": "Jaducana",
          "display_name": "Shaneeee Olivierrrr Jaducana",
          "type": "provider",
          "sub_type": "MASSAGE_THERAPIST",
          "provider_type": "MASSAGE_THERAPIST"
        },
        "discount_amount": 0,
        "sub_total_amount": 0,
        "total_amount": 0,
        "cancel_charge": 0,
        "favorite_count": 0,
        "cancelled_by": {
          "id": 438,
          "first_name": "jan pasco",
          "last_name": "ops",
          "display_name": "jan pasco ops",
          "type": "staff",
          "sub_type": "CORPORATE"
        }
      },
      {
        "id": 11036,
        "status": "client aborted",
        "request_profile": null,
        "request": {
          "id": "6299d1685a2088d5c4d4af0b",
          "status": "accepted",
          "status_v1": "accepted",
          "status_v2": "accepted",
          "gender": "any",
          "duration": 60,
          "type": {
            "id": 1,
            "name": "massage.swedish",
            "label": "Swedish Aromatherapy",
            "sublabel": " ",
            "category": "WELLNESS",
            "category_visibility": ["WELLNESS"],
            "pricing": "duration",
            "pricing_sub": null,
            "ordering": 0,
            "tips_enabled": true
          },
          "longitude": 124.7158386,
          "latitude": 8.4719824,
          "address": null,
          "notes": null,
          "amount": 625.0,
          "original_amount": 625.0,
          "discount_amount": 0,
          "total_amount": 625.0,
          "base_amount": 625.0,
          "booking_fee_amount": 0,
          "hazard_fee_amount": 0,
          "transport_fee_amount": 0,
          "credits_used": 0.0,
          "user_location": {
            "id": 827,
            "type": { "id": 3, "name": "hotel" },
            "type_name": "hotel",
            "longitude": 124.71484199999998,
            "latitude": 8.472042999999998,
            "label": "Meter King",
            "name": "Meter King Incorporated",
            "address": "Butuan - Cagayan de Oro - Iligan Rd, Cagayan de Oro, Misamis Oriental, Philippines",
            "tower_name": null,
            "number": "123",
            "street_name": "Butuan - Cagayan de Oro - Iligan Road",
            "guest_name": "King",
            "notes": null,
            "delivery_notes": null,
            "city": {
              "id": 17,
              "name": "Cagayan de Oro",
              "tz_offset": 28800,
              "tz_id": "Asia/Manila",
              "enabled": true,
              "regional_office": {
                "id": 2,
                "identifier": "METRO_CEBU",
                "name": "Metro Cebu"
              }
            },
            "area": {
              "id": 7,
              "name": "Cagayan de Oro",
              "timezone_offset_in_seconds": 28800,
              "priority": 0,
              "last_updated": "2021-10-07T12:07:08Z",
              "status_last_updated": "2019-06-12T03:36:08Z",
              "enabled": true,
              "regional_office": {
                "id": 1,
                "identifier": "METRO_MANILA",
                "name": "Metro Manila"
              }
            }
          },
          "area": {
            "id": 7,
            "name": "Cagayan de Oro",
            "timezone_offset_in_seconds": 28800,
            "priority": 0,
            "last_updated": "2021-10-07T12:07:08Z",
            "status_last_updated": "2019-06-12T03:36:08Z",
            "enabled": true,
            "regional_office": {
              "id": 1,
              "identifier": "METRO_MANILA",
              "name": "Metro Manila"
            }
          },
          "booking_option": 2,
          "request_profile": null,
          "session_type": "single",
          "group_index": -1,
          "group_request_id": 0,
          "is_primary": true,
          "cancel_reason": null,
          "loa": null,
          "hmo_partner": null,
          "created_by": 237,
          "creation_type": null,
          "clinic": null,
          "regional_office": {
            "id": 1,
            "identifier": "METRO_MANILA",
            "name": "Metro Manila"
          },
          "promo": null,
          "is_whitelabel": false,
          "white_label_partner": null,
          "white_label_customer": null,
          "white_label_reference_id": null,
          "booking_notes": null,
          "media_file_ids": [],
          "requires_payment": true,
          "requires_location_confirmation": false,
          "requires_ppe": true,
          "service_addon_order": [
            { "service_addon_id": 1, "type": "service", "priority": 1 }
          ],
          "package_ids": [],
          "packages": [],
          "extended_packages": [],
          "extended_package_items": [],
          "booking_options": [
            {
              "id": 1,
              "label": "PPE",
              "description": "Your provider will wear full PPE during the service",
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/booking_option/booking_option_ppe.png",
              "default_value": true,
              "amount": 50.0
            }
          ],
          "manually_assigned_appointment_conversation_expired": false
        },
        "type": {
          "id": 1,
          "name": "massage.swedish",
          "label": "Swedish Aromatherapy",
          "sublabel": " ",
          "category": "WELLNESS",
          "category_visibility": ["WELLNESS"],
          "pricing": "duration",
          "pricing_sub": null,
          "ordering": 0,
          "tips_enabled": true,
          "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/swedish5.png",
          "icon_url_male": "http://dnjqko642wsuu.cloudfront.net/public/swedish5.png",
          "description": "Medium pressure massage using long gliding strokes with organic essential oil aromatherapy to reduce anxiety and induce sleep.",
          "description_male": "Medium pressure massage using long gliding strokes with organic essential oil aromatherapy to reduce anxiety and induce sleep.",
          "description_slides": [],
          "preparation": "?    Take a warm shower before your massage\n?    You can wear undergarments or naked under towel\n?    Get comfortable with dim lights\n?    Prepare 2 towels for the massage",
          "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/swedish/v1/bg.jpg",
          "tags": "stress relief,improve mood,relaxation",
          "tag_icons": [],
          "tag_icons_male": [],
          "overlay_html_url": "http://dnjqko642wsuu.cloudfront.net/public/swedish_overlay_content6.html",
          "overlay_html_url_male": "http://dnjqko642wsuu.cloudfront.net/public/swedish_overlay_content6.html",
          "color": "86CAC7",
          "color_male": "86CAC7",
          "is_new_service": false,
          "is_intro_price": false,
          "is_personal_info_required": false,
          "pairings": ["zennya calm", "zennya pure", "zennya soothe"],
          "extras": [
            {
              "id": 1,
              "name": "addon.swedish.footscrub",
              "label": "Foot Scrub",
              "ordering": 1,
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/icon_foot_scrub.png",
              "description": "Spa foot scrub experience at home? Believe it. Our foot scrub uses the finest blend of sea salt and zennya’s special therapeutic grade coconut oil, infused with tea and peppermint to remove dead skin and make your feet look and feel like new.",
              "description2": "<big><b>Benefits<\u002fb><\u002fbig>\n<br />\n• Removes dead skin for a healthier look<br />\n• Our scrub and balm products include anti-fungal tea tree essential oils to treat and prevent fungal growth<br />\n• Improves range of motion for toes<br />\n• Treats aching tired feed and arches<br />",
              "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/footscrub/v1/bg.jpg",
              "personal_info_required": false,
              "category": "WELLNESS",
              "detail_sections": [],
              "options": [
                {
                  "id": 1,
                  "label": "Duration",
                  "choices": [
                    {
                      "id": 2,
                      "label": "60 mins",
                      "cost": 450.0,
                      "duration": 60
                    },
                    { "id": 1, "label": "30 mins", "cost": 250.0, "duration": 30 }
                  ]
                }
              ]
            },
            {
              "id": 7,
              "name": "addon.swedish.thaifoot",
              "label": "Thai Foot Massage",
              "ordering": 0,
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/thaifoot_addon.png",
              "description": "Thai Foot Massage is a massage of the lower legs and feet that originated in Thailand over 2000 years ago with elements of Shiatsu, Reflexology, Chinese Massage, and Yoga, and still taught today by Buddhist monks in the temples of Thailand. This therapy produces a feeling of balance, relaxation and well being, involving stretching, massage, use of a stick to stimulate reflex points.",
              "description2": "<big><b>Benefits<\u002fb><\u002fbig>\n<br />\n• Improves circulation of the hands and feet.<br />\n• Enhanced flexibility and reduced stiffness of legs? and feet.<br />\n• Improves sleep.<br />\n• Reduces edema in pregnant women during third trimester.<br />",
              "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/thai_foot/v1/bg.jpg",
              "personal_info_required": false,
              "category": "WELLNESS",
              "detail_sections": [],
              "options": [
                {
                  "id": 7,
                  "label": "Duration",
                  "choices": [
                    {
                      "id": 14,
                      "label": "60 mins",
                      "cost": 450.0,
                      "duration": 60
                    },
                    {
                      "id": 13,
                      "label": "30 mins",
                      "cost": 250.0,
                      "duration": 30
                    }
                  ]
                }
              ]
            }
          ]
        },
        "start_date": "2022-06-03T09:19:19Z",
        "end_date": "2022-06-03T09:20:28Z",
        "extras_requested": [],
        "sessions": [
          {
            "id": 13668,
            "type": "service",
            "status": "current",
            "priority": 1,
            "start_date": null,
            "end_date": "2022-06-03T09:20:28Z",
            "duration": 60,
            "amount": 625.0,
            "discounted_amount": 625.0,
            "provider_profit": 0.0,
            "company_profit": 0.0,
            "tip": null,
            "has_ongoing_steps": false,
            "has_ongoing_pending_steps": false,
            "type_id": 1,
            "label": "Swedish Aromatherapy"
          }
        ],
        "directions": null,
        "transactions": [
          {
            "id": 39120,
            "timestamp": "2022-06-03T09:16:24Z",
            "transaction_id": "XFDBFN3FFGNG5S82",
            "charge_type": "pay",
            "status": "aborted",
            "amount": 625.0,
            "credits": 0.0,
            "refunded_transaction_id": null,
            "gateway_type": "ADYEN",
            "processing_type": {
              "enumType": "com.remedy.payment.Transaction$ProcessingType",
              "name": "CREDIT"
            }
          }
        ],
        "cancel_reason": null,
        "end_reason": null,
        "feedback": null,
        "client_feedback": null,
        "promo": null,
        "travel_method": "driving",
        "transportation": "Other",
        "oil_type": null,
        "preparing": true,
        "date_preparing_start": "2022-06-03T09:19:19Z",
        "date_preparing_done": null,
        "date_arrived": null,
        "date_arriving": null,
        "addons": [],
        "is_forced_assigned": false,
        "session_type": "single",
        "group_appointment_id": null,
        "group_index": -1,
        "tip_disabled": false,
        "last_payment_method_used_token": "0of7863s",
        "packages": [],
        "extended_packages": [],
        "extended_package_items": [],
        "booking_options": [
          {
            "id": 1,
            "label": "PPE",
            "description": "Your provider will wear full PPE during the service",
            "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/booking_option/booking_option_ppe.png",
            "default_value": true,
            "amount": 50.0
          }
        ],
        "booking_type": null,
        "is_scheduled": false,
        "date_scheduled": null,
        "standby": false,
        "date_standby_start": "2022-06-03T09:19:19Z",
        "booking_fee_amount": 0.0,
        "hazard_fee_amount": 0,
        "transport_fee_amount": 0,
        "kit_fee_amount": 0,
        "product_fee_amount": 25.0,
        "ppe_fee_amount": 100.0,
        "admin_fee_amount": 100.0,
        "clinic": null,
        "regional_office": {
          "id": 1,
          "identifier": "METRO_MANILA",
          "name": "Metro Manila"
        },
        "provider": {
          "id": 203,
          "first_name": "Shaneeee Olivierrrr",
          "last_name": "Jaducana",
          "display_name": "Shaneeee Olivierrrr Jaducana",
          "type": "provider",
          "sub_type": "MASSAGE_THERAPIST",
          "provider_type": "MASSAGE_THERAPIST"
        },
        "discount_amount": 0,
        "sub_total_amount": 0,
        "total_amount": 0,
        "cancel_charge": 0,
        "favorite_count": 0,
        "cancelled_by": {
          "id": 237,
          "first_name": "Shane",
          "last_name": "Oliver",
          "display_name": "Shane Oliver",
          "type": "client",
          "sub_type": null
        }
      },
      {
        "id": 11035,
        "status": "client aborted",
        "request_profile": null,
        "request": {
          "id": "6299c9c55a2088d5c4d4aee9",
          "status": "accepted",
          "status_v1": "accepted",
          "status_v2": "accepted",
          "gender": "any",
          "duration": 60,
          "type": {
            "id": 1,
            "name": "massage.swedish",
            "label": "Swedish Aromatherapy",
            "sublabel": " ",
            "category": "WELLNESS",
            "category_visibility": ["WELLNESS"],
            "pricing": "duration",
            "pricing_sub": null,
            "ordering": 0,
            "tips_enabled": true
          },
          "longitude": 124.715839,
          "latitude": 8.4719817,
          "address": null,
          "notes": null,
          "amount": 625.0,
          "original_amount": 625.0,
          "discount_amount": 0,
          "total_amount": 625.0,
          "base_amount": 625.0,
          "booking_fee_amount": 0,
          "hazard_fee_amount": 0,
          "transport_fee_amount": 0,
          "credits_used": 0.0,
          "user_location": {
            "id": 827,
            "type": { "id": 3, "name": "hotel" },
            "type_name": "hotel",
            "longitude": 124.71484199999998,
            "latitude": 8.472042999999998,
            "label": "Meter King",
            "name": "Meter King Incorporated",
            "address": "Butuan - Cagayan de Oro - Iligan Rd, Cagayan de Oro, Misamis Oriental, Philippines",
            "tower_name": null,
            "number": "123",
            "street_name": "Butuan - Cagayan de Oro - Iligan Road",
            "guest_name": "King",
            "notes": null,
            "delivery_notes": null,
            "city": {
              "id": 17,
              "name": "Cagayan de Oro",
              "tz_offset": 28800,
              "tz_id": "Asia/Manila",
              "enabled": true,
              "regional_office": {
                "id": 2,
                "identifier": "METRO_CEBU",
                "name": "Metro Cebu"
              }
            },
            "area": {
              "id": 7,
              "name": "Cagayan de Oro",
              "timezone_offset_in_seconds": 28800,
              "priority": 0,
              "last_updated": "2021-10-07T12:07:08Z",
              "status_last_updated": "2019-06-12T03:36:08Z",
              "enabled": true,
              "regional_office": {
                "id": 1,
                "identifier": "METRO_MANILA",
                "name": "Metro Manila"
              }
            }
          },
          "area": {
            "id": 7,
            "name": "Cagayan de Oro",
            "timezone_offset_in_seconds": 28800,
            "priority": 0,
            "last_updated": "2021-10-07T12:07:08Z",
            "status_last_updated": "2019-06-12T03:36:08Z",
            "enabled": true,
            "regional_office": {
              "id": 1,
              "identifier": "METRO_MANILA",
              "name": "Metro Manila"
            }
          },
          "booking_option": 2,
          "request_profile": null,
          "session_type": "single",
          "group_index": -1,
          "group_request_id": 0,
          "is_primary": true,
          "cancel_reason": null,
          "loa": null,
          "hmo_partner": null,
          "created_by": 237,
          "creation_type": null,
          "clinic": null,
          "regional_office": {
            "id": 1,
            "identifier": "METRO_MANILA",
            "name": "Metro Manila"
          },
          "promo": null,
          "is_whitelabel": false,
          "white_label_partner": null,
          "white_label_customer": null,
          "white_label_reference_id": null,
          "booking_notes": null,
          "media_file_ids": [],
          "requires_payment": true,
          "requires_location_confirmation": false,
          "requires_ppe": true,
          "service_addon_order": [
            { "service_addon_id": 1, "type": "service", "priority": 1 }
          ],
          "package_ids": [],
          "packages": [],
          "extended_packages": [],
          "extended_package_items": [],
          "booking_options": [
            {
              "id": 1,
              "label": "PPE",
              "description": "Your provider will wear full PPE during the service",
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/booking_option/booking_option_ppe.png",
              "default_value": true,
              "amount": 50.0
            }
          ],
          "manually_assigned_appointment_conversation_expired": false
        },
        "type": {
          "id": 1,
          "name": "massage.swedish",
          "label": "Swedish Aromatherapy",
          "sublabel": " ",
          "category": "WELLNESS",
          "category_visibility": ["WELLNESS"],
          "pricing": "duration",
          "pricing_sub": null,
          "ordering": 0,
          "tips_enabled": true,
          "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/swedish5.png",
          "icon_url_male": "http://dnjqko642wsuu.cloudfront.net/public/swedish5.png",
          "description": "Medium pressure massage using long gliding strokes with organic essential oil aromatherapy to reduce anxiety and induce sleep.",
          "description_male": "Medium pressure massage using long gliding strokes with organic essential oil aromatherapy to reduce anxiety and induce sleep.",
          "description_slides": [],
          "preparation": "?    Take a warm shower before your massage\n?    You can wear undergarments or naked under towel\n?    Get comfortable with dim lights\n?    Prepare 2 towels for the massage",
          "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/swedish/v1/bg.jpg",
          "tags": "stress relief,improve mood,relaxation",
          "tag_icons": [],
          "tag_icons_male": [],
          "overlay_html_url": "http://dnjqko642wsuu.cloudfront.net/public/swedish_overlay_content6.html",
          "overlay_html_url_male": "http://dnjqko642wsuu.cloudfront.net/public/swedish_overlay_content6.html",
          "color": "86CAC7",
          "color_male": "86CAC7",
          "is_new_service": false,
          "is_intro_price": false,
          "is_personal_info_required": false,
          "pairings": ["zennya calm", "zennya pure", "zennya soothe"],
          "extras": [
            {
              "id": 1,
              "name": "addon.swedish.footscrub",
              "label": "Foot Scrub",
              "ordering": 1,
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/icon_foot_scrub.png",
              "description": "Spa foot scrub experience at home? Believe it. Our foot scrub uses the finest blend of sea salt and zennya’s special therapeutic grade coconut oil, infused with tea and peppermint to remove dead skin and make your feet look and feel like new.",
              "description2": "<big><b>Benefits<\u002fb><\u002fbig>\n<br />\n• Removes dead skin for a healthier look<br />\n• Our scrub and balm products include anti-fungal tea tree essential oils to treat and prevent fungal growth<br />\n• Improves range of motion for toes<br />\n• Treats aching tired feed and arches<br />",
              "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/footscrub/v1/bg.jpg",
              "personal_info_required": false,
              "category": "WELLNESS",
              "detail_sections": [],
              "options": [
                {
                  "id": 1,
                  "label": "Duration",
                  "choices": [
                    {
                      "id": 2,
                      "label": "60 mins",
                      "cost": 450.0,
                      "duration": 60
                    },
                    { "id": 1, "label": "30 mins", "cost": 250.0, "duration": 30 }
                  ]
                }
              ]
            },
            {
              "id": 7,
              "name": "addon.swedish.thaifoot",
              "label": "Thai Foot Massage",
              "ordering": 0,
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/thaifoot_addon.png",
              "description": "Thai Foot Massage is a massage of the lower legs and feet that originated in Thailand over 2000 years ago with elements of Shiatsu, Reflexology, Chinese Massage, and Yoga, and still taught today by Buddhist monks in the temples of Thailand. This therapy produces a feeling of balance, relaxation and well being, involving stretching, massage, use of a stick to stimulate reflex points.",
              "description2": "<big><b>Benefits<\u002fb><\u002fbig>\n<br />\n• Improves circulation of the hands and feet.<br />\n• Enhanced flexibility and reduced stiffness of legs? and feet.<br />\n• Improves sleep.<br />\n• Reduces edema in pregnant women during third trimester.<br />",
              "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/thai_foot/v1/bg.jpg",
              "personal_info_required": false,
              "category": "WELLNESS",
              "detail_sections": [],
              "options": [
                {
                  "id": 7,
                  "label": "Duration",
                  "choices": [
                    {
                      "id": 14,
                      "label": "60 mins",
                      "cost": 450.0,
                      "duration": 60
                    },
                    {
                      "id": 13,
                      "label": "30 mins",
                      "cost": 250.0,
                      "duration": 30
                    }
                  ]
                }
              ]
            }
          ]
        },
        "start_date": "2022-06-03T08:46:21Z",
        "end_date": "2022-06-03T08:53:06Z",
        "extras_requested": [],
        "sessions": [
          {
            "id": 13667,
            "type": "service",
            "status": "current",
            "priority": 1,
            "start_date": null,
            "end_date": "2022-06-03T08:53:06Z",
            "duration": 60,
            "amount": 625.0,
            "discounted_amount": 625.0,
            "provider_profit": 0.0,
            "company_profit": 0.0,
            "tip": null,
            "has_ongoing_steps": false,
            "has_ongoing_pending_steps": false,
            "type_id": 1,
            "label": "Swedish Aromatherapy"
          }
        ],
        "directions": null,
        "transactions": [
          {
            "id": 39118,
            "timestamp": "2022-06-03T08:43:49Z",
            "transaction_id": "VVRTHSFMXTTFWR82",
            "charge_type": "pay",
            "status": "aborted",
            "amount": 625.0,
            "credits": 0.0,
            "refunded_transaction_id": null,
            "gateway_type": "ADYEN",
            "processing_type": {
              "enumType": "com.remedy.payment.Transaction$ProcessingType",
              "name": "CREDIT"
            }
          }
        ],
        "cancel_reason": null,
        "end_reason": null,
        "feedback": null,
        "client_feedback": null,
        "promo": null,
        "travel_method": "driving",
        "transportation": "Other",
        "oil_type": null,
        "preparing": true,
        "date_preparing_start": "2022-06-03T08:46:21Z",
        "date_preparing_done": null,
        "date_arrived": null,
        "date_arriving": null,
        "addons": [],
        "is_forced_assigned": false,
        "session_type": "single",
        "group_appointment_id": null,
        "group_index": -1,
        "tip_disabled": false,
        "last_payment_method_used_token": "0of7863s",
        "packages": [],
        "extended_packages": [],
        "extended_package_items": [],
        "booking_options": [
          {
            "id": 1,
            "label": "PPE",
            "description": "Your provider will wear full PPE during the service",
            "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/booking_option/booking_option_ppe.png",
            "default_value": true,
            "amount": 50.0
          }
        ],
        "booking_type": null,
        "is_scheduled": false,
        "date_scheduled": null,
        "standby": false,
        "date_standby_start": "2022-06-03T08:46:21Z",
        "booking_fee_amount": 0.0,
        "hazard_fee_amount": 0,
        "transport_fee_amount": 0,
        "kit_fee_amount": 0,
        "product_fee_amount": 25.0,
        "ppe_fee_amount": 100.0,
        "admin_fee_amount": 100.0,
        "clinic": null,
        "regional_office": {
          "id": 1,
          "identifier": "METRO_MANILA",
          "name": "Metro Manila"
        },
        "provider": {
          "id": 203,
          "first_name": "Shaneeee Olivierrrr",
          "last_name": "Jaducana",
          "display_name": "Shaneeee Olivierrrr Jaducana",
          "type": "provider",
          "sub_type": "MASSAGE_THERAPIST",
          "provider_type": "MASSAGE_THERAPIST"
        },
        "discount_amount": 0,
        "sub_total_amount": 0,
        "total_amount": 0,
        "cancel_charge": 0,
        "favorite_count": 0,
        "cancelled_by": {
          "id": 237,
          "first_name": "Shane",
          "last_name": "Oliver",
          "display_name": "Shane Oliver",
          "type": "client",
          "sub_type": null
        }
      },
      {
        "id": 11032,
        "status": "client aborted",
        "request_profile": null,
        "request": {
          "id": "6297269d5a2006249d22c65a",
          "status": "accepted",
          "status_v1": "accepted",
          "status_v2": "accepted",
          "gender": "any",
          "duration": 60,
          "type": {
            "id": 1,
            "name": "massage.swedish",
            "label": "Swedish Aromatherapy",
            "sublabel": " ",
            "category": "WELLNESS",
            "category_visibility": ["WELLNESS"],
            "pricing": "duration",
            "pricing_sub": null,
            "ordering": 0,
            "tips_enabled": true
          },
          "longitude": 124.71119599999997,
          "latitude": 8.474663999999999,
          "address": null,
          "notes": null,
          "amount": 0.0,
          "original_amount": 0.0,
          "discount_amount": 0,
          "total_amount": 0,
          "base_amount": 0,
          "booking_fee_amount": 0,
          "hazard_fee_amount": 0,
          "transport_fee_amount": 0,
          "credits_used": 0.0,
          "user_location": {
            "id": 779,
            "type": { "id": 3, "name": "hotel" },
            "type_name": "hotel",
            "longitude": 124.71119599999997,
            "latitude": 8.474663999999999,
            "label": "Cocobay",
            "name": "Coconut Bay",
            "address": "Butuan - Cagayan de Oro - Iligan Rd, Cagayan de Oro, Misamis Oriental, Philippines",
            "tower_name": null,
            "number": "123",
            "street_name": "Butuan - Cagayan de Oro - Iligan Road",
            "guest_name": "Shane",
            "notes": null,
            "delivery_notes": null,
            "city": {
              "id": 17,
              "name": "Cagayan de Oro",
              "tz_offset": 28800,
              "tz_id": "Asia/Manila",
              "enabled": true,
              "regional_office": {
                "id": 2,
                "identifier": "METRO_CEBU",
                "name": "Metro Cebu"
              }
            },
            "area": {
              "id": 7,
              "name": "Cagayan de Oro",
              "timezone_offset_in_seconds": 28800,
              "priority": 0,
              "last_updated": "2021-10-07T12:07:08Z",
              "status_last_updated": "2019-06-12T03:36:08Z",
              "enabled": true,
              "regional_office": {
                "id": 1,
                "identifier": "METRO_MANILA",
                "name": "Metro Manila"
              }
            }
          },
          "area": {
            "id": 7,
            "name": "Cagayan de Oro",
            "timezone_offset_in_seconds": 28800,
            "priority": 0,
            "last_updated": "2021-10-07T12:07:08Z",
            "status_last_updated": "2019-06-12T03:36:08Z",
            "enabled": true,
            "regional_office": {
              "id": 1,
              "identifier": "METRO_MANILA",
              "name": "Metro Manila"
            }
          },
          "booking_option": 2,
          "request_profile": null,
          "session_type": "single",
          "group_index": -1,
          "group_request_id": 0,
          "is_primary": true,
          "cancel_reason": null,
          "loa": null,
          "hmo_partner": {
            "id": 1,
            "name": "MAXICARE",
            "label": "Maxicare",
            "banner_url": "https://dnjqko642wsuu.cloudfront.net/public/hmo/logo_small_maxicare.png"
          },
          "created_by": 1419,
          "creation_type": null,
          "clinic": null,
          "regional_office": {
            "id": 1,
            "identifier": "METRO_MANILA",
            "name": "Metro Manila"
          },
          "promo": null,
          "is_whitelabel": true,
          "white_label_partner": {
            "id": 1,
            "name": "MAXICARE",
            "label": "Maxicare",
            "logo_url": "https://dnjqko642wsuu.cloudfront.net/public/hmo/logo_small_maxicare.png",
            "app_logo_small_url": "https://dnjqko642wsuu.cloudfront.net/public/hmo/app_logo_small_maxicare.png"
          },
          "white_label_customer": {
            "id": 23,
            "first_name": "Brenda",
            "middle_name": "M",
            "last_name": "Jackson",
            "email": "Brenda.Jackson@zennya.com",
            "mobile_number": "+639000000000",
            "gender": "M",
            "birth_date": "1984-11-22T16:00:00Z",
            "address": "Address address",
            "latitude": 8.47,
            "longitude": 124.71,
            "card_number": null,
            "client": null,
            "verified_email": null,
            "verified_mobile_number": null,
            "customer_info": null,
            "status": null
          },
          "white_label_reference_id": null,
          "booking_notes": null,
          "media_file_ids": [],
          "requires_payment": false,
          "requires_location_confirmation": true,
          "requires_ppe": true,
          "service_addon_order": [
            { "service_addon_id": 1, "type": "service", "priority": 1 }
          ],
          "package_ids": [],
          "packages": [],
          "extended_packages": [],
          "extended_package_items": [],
          "booking_options": [
            {
              "id": 1,
              "label": "PPE",
              "description": "Your provider will wear full PPE during the service",
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/booking_option/booking_option_ppe.png",
              "default_value": true,
              "amount": 50.0
            }
          ],
          "manually_assigned_appointment_conversation_expired": false
        },
        "type": {
          "id": 1,
          "name": "massage.swedish",
          "label": "Swedish Aromatherapy",
          "sublabel": " ",
          "category": "WELLNESS",
          "category_visibility": ["WELLNESS"],
          "pricing": "duration",
          "pricing_sub": null,
          "ordering": 0,
          "tips_enabled": true,
          "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/swedish5.png",
          "icon_url_male": "http://dnjqko642wsuu.cloudfront.net/public/swedish5.png",
          "description": "Medium pressure massage using long gliding strokes with organic essential oil aromatherapy to reduce anxiety and induce sleep.",
          "description_male": "Medium pressure massage using long gliding strokes with organic essential oil aromatherapy to reduce anxiety and induce sleep.",
          "description_slides": [],
          "preparation": "?    Take a warm shower before your massage\n?    You can wear undergarments or naked under towel\n?    Get comfortable with dim lights\n?    Prepare 2 towels for the massage",
          "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/swedish/v1/bg.jpg",
          "tags": "stress relief,improve mood,relaxation",
          "tag_icons": [],
          "tag_icons_male": [],
          "overlay_html_url": "http://dnjqko642wsuu.cloudfront.net/public/swedish_overlay_content6.html",
          "overlay_html_url_male": "http://dnjqko642wsuu.cloudfront.net/public/swedish_overlay_content6.html",
          "color": "86CAC7",
          "color_male": "86CAC7",
          "is_new_service": false,
          "is_intro_price": false,
          "is_personal_info_required": false,
          "pairings": ["zennya calm", "zennya pure", "zennya soothe"],
          "extras": [
            {
              "id": 1,
              "name": "addon.swedish.footscrub",
              "label": "Foot Scrub",
              "ordering": 1,
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/icon_foot_scrub.png",
              "description": "Spa foot scrub experience at home? Believe it. Our foot scrub uses the finest blend of sea salt and zennya’s special therapeutic grade coconut oil, infused with tea and peppermint to remove dead skin and make your feet look and feel like new.",
              "description2": "<big><b>Benefits<\u002fb><\u002fbig>\n<br />\n• Removes dead skin for a healthier look<br />\n• Our scrub and balm products include anti-fungal tea tree essential oils to treat and prevent fungal growth<br />\n• Improves range of motion for toes<br />\n• Treats aching tired feed and arches<br />",
              "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/footscrub/v1/bg.jpg",
              "personal_info_required": false,
              "category": "WELLNESS",
              "detail_sections": [],
              "options": [
                {
                  "id": 1,
                  "label": "Duration",
                  "choices": [
                    {
                      "id": 2,
                      "label": "60 mins",
                      "cost": 450.0,
                      "duration": 60
                    },
                    { "id": 1, "label": "30 mins", "cost": 250.0, "duration": 30 }
                  ]
                }
              ]
            },
            {
              "id": 7,
              "name": "addon.swedish.thaifoot",
              "label": "Thai Foot Massage",
              "ordering": 0,
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/thaifoot_addon.png",
              "description": "Thai Foot Massage is a massage of the lower legs and feet that originated in Thailand over 2000 years ago with elements of Shiatsu, Reflexology, Chinese Massage, and Yoga, and still taught today by Buddhist monks in the temples of Thailand. This therapy produces a feeling of balance, relaxation and well being, involving stretching, massage, use of a stick to stimulate reflex points.",
              "description2": "<big><b>Benefits<\u002fb><\u002fbig>\n<br />\n• Improves circulation of the hands and feet.<br />\n• Enhanced flexibility and reduced stiffness of legs? and feet.<br />\n• Improves sleep.<br />\n• Reduces edema in pregnant women during third trimester.<br />",
              "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/thai_foot/v1/bg.jpg",
              "personal_info_required": false,
              "category": "WELLNESS",
              "detail_sections": [],
              "options": [
                {
                  "id": 7,
                  "label": "Duration",
                  "choices": [
                    {
                      "id": 14,
                      "label": "60 mins",
                      "cost": 450.0,
                      "duration": 60
                    },
                    {
                      "id": 13,
                      "label": "30 mins",
                      "cost": 250.0,
                      "duration": 30
                    }
                  ]
                }
              ]
            }
          ]
        },
        "start_date": "2022-06-01T08:44:24Z",
        "end_date": "2022-06-01T12:32:44Z",
        "extras_requested": [],
        "sessions": [
          {
            "id": 13664,
            "type": "service",
            "status": "current",
            "priority": 1,
            "start_date": null,
            "end_date": "2022-06-01T12:32:44Z",
            "duration": 60,
            "amount": 625.0,
            "discounted_amount": 625.0,
            "provider_profit": 0.0,
            "company_profit": 0.0,
            "tip": null,
            "has_ongoing_steps": false,
            "has_ongoing_pending_steps": false,
            "type_id": 1,
            "label": "Swedish Aromatherapy"
          }
        ],
        "directions": null,
        "transactions": [
          {
            "id": 39101,
            "timestamp": "2022-06-01T08:43:09Z",
            "transaction_id": null,
            "charge_type": "pay",
            "status": "complete",
            "amount": 0.0,
            "credits": 0.0,
            "refunded_transaction_id": null,
            "gateway_type": null,
            "processing_type": {
              "enumType": "com.remedy.payment.Transaction$ProcessingType",
              "name": "PARTNER"
            }
          }
        ],
        "cancel_reason": null,
        "end_reason": null,
        "feedback": null,
        "client_feedback": null,
        "promo": null,
        "travel_method": "driving",
        "transportation": "Other",
        "oil_type": null,
        "preparing": true,
        "date_preparing_start": "2022-06-01T08:44:24Z",
        "date_preparing_done": null,
        "date_arrived": null,
        "date_arriving": null,
        "addons": [],
        "is_forced_assigned": false,
        "session_type": "single",
        "group_appointment_id": null,
        "group_index": -1,
        "tip_disabled": false,
        "last_payment_method_used_token": null,
        "packages": [],
        "extended_packages": [],
        "extended_package_items": [],
        "booking_options": [
          {
            "id": 1,
            "label": "PPE",
            "description": "Your provider will wear full PPE during the service",
            "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/booking_option/booking_option_ppe.png",
            "default_value": true,
            "amount": 50.0
          }
        ],
        "booking_type": null,
        "is_scheduled": false,
        "date_scheduled": null,
        "standby": false,
        "date_standby_start": "2022-06-01T08:44:24Z",
        "booking_fee_amount": 0.0,
        "hazard_fee_amount": 0,
        "transport_fee_amount": 0,
        "kit_fee_amount": 0,
        "product_fee_amount": 25.0,
        "ppe_fee_amount": 100.0,
        "admin_fee_amount": 100.0,
        "clinic": null,
        "regional_office": {
          "id": 1,
          "identifier": "METRO_MANILA",
          "name": "Metro Manila"
        },
        "provider": {
          "id": 203,
          "first_name": "Shaneeee Olivierrrr",
          "last_name": "Jaducana",
          "display_name": "Shaneeee Olivierrrr Jaducana",
          "type": "provider",
          "sub_type": "MASSAGE_THERAPIST",
          "provider_type": "MASSAGE_THERAPIST"
        },
        "discount_amount": 0,
        "sub_total_amount": 0,
        "total_amount": 0,
        "cancel_charge": 0,
        "favorite_count": 0,
        "cancelled_by": {
          "id": 237,
          "first_name": "Shane",
          "last_name": "Oliver",
          "display_name": "Shane Oliver",
          "type": "client",
          "sub_type": null
        }
      },
      {
        "id": 11029,
        "status": "client aborted",
        "request_profile": null,
        "request": {
          "id": "62970b465a20f1af90c2a5c3",
          "status": "accepted",
          "status_v1": "accepted",
          "status_v2": "accepted",
          "gender": "any",
          "duration": 60,
          "type": {
            "id": 1,
            "name": "massage.swedish",
            "label": "Swedish Aromatherapy",
            "sublabel": " ",
            "category": "WELLNESS",
            "category_visibility": ["WELLNESS"],
            "pricing": "duration",
            "pricing_sub": null,
            "ordering": 0,
            "tips_enabled": true
          },
          "longitude": 124.71119599999997,
          "latitude": 8.474663999999999,
          "address": null,
          "notes": null,
          "amount": 0.0,
          "original_amount": 0.0,
          "discount_amount": 0,
          "total_amount": 0,
          "base_amount": 0,
          "booking_fee_amount": 0,
          "hazard_fee_amount": 0,
          "transport_fee_amount": 0,
          "credits_used": 0.0,
          "user_location": {
            "id": 779,
            "type": { "id": 3, "name": "hotel" },
            "type_name": "hotel",
            "longitude": 124.71119599999997,
            "latitude": 8.474663999999999,
            "label": "Cocobay",
            "name": "Coconut Bay",
            "address": "Butuan - Cagayan de Oro - Iligan Rd, Cagayan de Oro, Misamis Oriental, Philippines",
            "tower_name": null,
            "number": "123",
            "street_name": "Butuan - Cagayan de Oro - Iligan Road",
            "guest_name": "Shane",
            "notes": null,
            "delivery_notes": null,
            "city": {
              "id": 17,
              "name": "Cagayan de Oro",
              "tz_offset": 28800,
              "tz_id": "Asia/Manila",
              "enabled": true,
              "regional_office": {
                "id": 2,
                "identifier": "METRO_CEBU",
                "name": "Metro Cebu"
              }
            },
            "area": {
              "id": 7,
              "name": "Cagayan de Oro",
              "timezone_offset_in_seconds": 28800,
              "priority": 0,
              "last_updated": "2021-10-07T12:07:08Z",
              "status_last_updated": "2019-06-12T03:36:08Z",
              "enabled": true,
              "regional_office": {
                "id": 1,
                "identifier": "METRO_MANILA",
                "name": "Metro Manila"
              }
            }
          },
          "area": {
            "id": 7,
            "name": "Cagayan de Oro",
            "timezone_offset_in_seconds": 28800,
            "priority": 0,
            "last_updated": "2021-10-07T12:07:08Z",
            "status_last_updated": "2019-06-12T03:36:08Z",
            "enabled": true,
            "regional_office": {
              "id": 1,
              "identifier": "METRO_MANILA",
              "name": "Metro Manila"
            }
          },
          "booking_option": 2,
          "request_profile": null,
          "session_type": "single",
          "group_index": -1,
          "group_request_id": 0,
          "is_primary": true,
          "cancel_reason": null,
          "loa": null,
          "hmo_partner": {
            "id": 1,
            "name": "MAXICARE",
            "label": "Maxicare",
            "banner_url": "https://dnjqko642wsuu.cloudfront.net/public/hmo/logo_small_maxicare.png"
          },
          "created_by": 1419,
          "creation_type": null,
          "clinic": null,
          "regional_office": {
            "id": 1,
            "identifier": "METRO_MANILA",
            "name": "Metro Manila"
          },
          "promo": null,
          "is_whitelabel": true,
          "white_label_partner": {
            "id": 1,
            "name": "MAXICARE",
            "label": "Maxicare",
            "logo_url": "https://dnjqko642wsuu.cloudfront.net/public/hmo/logo_small_maxicare.png",
            "app_logo_small_url": "https://dnjqko642wsuu.cloudfront.net/public/hmo/app_logo_small_maxicare.png"
          },
          "white_label_customer": {
            "id": 23,
            "first_name": "Brenda",
            "middle_name": "M",
            "last_name": "Jackson",
            "email": "Brenda.Jackson@zennya.com",
            "mobile_number": "+639000000000",
            "gender": "M",
            "birth_date": "1984-11-22T16:00:00Z",
            "address": "Address address",
            "latitude": 8.47,
            "longitude": 124.71,
            "card_number": null,
            "client": null,
            "verified_email": null,
            "verified_mobile_number": null,
            "customer_info": null,
            "status": null
          },
          "white_label_reference_id": null,
          "booking_notes": null,
          "media_file_ids": [],
          "requires_payment": false,
          "requires_location_confirmation": true,
          "requires_ppe": true,
          "service_addon_order": [
            { "service_addon_id": 1, "type": "service", "priority": 1 }
          ],
          "package_ids": [],
          "packages": [],
          "extended_packages": [],
          "extended_package_items": [],
          "booking_options": [
            {
              "id": 1,
              "label": "PPE",
              "description": "Your provider will wear full PPE during the service",
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/booking_option/booking_option_ppe.png",
              "default_value": true,
              "amount": 50.0
            }
          ],
          "manually_assigned_appointment_conversation_expired": false
        },
        "type": {
          "id": 1,
          "name": "massage.swedish",
          "label": "Swedish Aromatherapy",
          "sublabel": " ",
          "category": "WELLNESS",
          "category_visibility": ["WELLNESS"],
          "pricing": "duration",
          "pricing_sub": null,
          "ordering": 0,
          "tips_enabled": true,
          "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/swedish5.png",
          "icon_url_male": "http://dnjqko642wsuu.cloudfront.net/public/swedish5.png",
          "description": "Medium pressure massage using long gliding strokes with organic essential oil aromatherapy to reduce anxiety and induce sleep.",
          "description_male": "Medium pressure massage using long gliding strokes with organic essential oil aromatherapy to reduce anxiety and induce sleep.",
          "description_slides": [],
          "preparation": "?    Take a warm shower before your massage\n?    You can wear undergarments or naked under towel\n?    Get comfortable with dim lights\n?    Prepare 2 towels for the massage",
          "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/swedish/v1/bg.jpg",
          "tags": "stress relief,improve mood,relaxation",
          "tag_icons": [],
          "tag_icons_male": [],
          "overlay_html_url": "http://dnjqko642wsuu.cloudfront.net/public/swedish_overlay_content6.html",
          "overlay_html_url_male": "http://dnjqko642wsuu.cloudfront.net/public/swedish_overlay_content6.html",
          "color": "86CAC7",
          "color_male": "86CAC7",
          "is_new_service": false,
          "is_intro_price": false,
          "is_personal_info_required": false,
          "pairings": ["zennya calm", "zennya pure", "zennya soothe"],
          "extras": [
            {
              "id": 1,
              "name": "addon.swedish.footscrub",
              "label": "Foot Scrub",
              "ordering": 1,
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/icon_foot_scrub.png",
              "description": "Spa foot scrub experience at home? Believe it. Our foot scrub uses the finest blend of sea salt and zennya’s special therapeutic grade coconut oil, infused with tea and peppermint to remove dead skin and make your feet look and feel like new.",
              "description2": "<big><b>Benefits<\u002fb><\u002fbig>\n<br />\n• Removes dead skin for a healthier look<br />\n• Our scrub and balm products include anti-fungal tea tree essential oils to treat and prevent fungal growth<br />\n• Improves range of motion for toes<br />\n• Treats aching tired feed and arches<br />",
              "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/footscrub/v1/bg.jpg",
              "personal_info_required": false,
              "category": "WELLNESS",
              "detail_sections": [],
              "options": [
                {
                  "id": 1,
                  "label": "Duration",
                  "choices": [
                    {
                      "id": 2,
                      "label": "60 mins",
                      "cost": 450.0,
                      "duration": 60
                    },
                    { "id": 1, "label": "30 mins", "cost": 250.0, "duration": 30 }
                  ]
                }
              ]
            },
            {
              "id": 7,
              "name": "addon.swedish.thaifoot",
              "label": "Thai Foot Massage",
              "ordering": 0,
              "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/thaifoot_addon.png",
              "description": "Thai Foot Massage is a massage of the lower legs and feet that originated in Thailand over 2000 years ago with elements of Shiatsu, Reflexology, Chinese Massage, and Yoga, and still taught today by Buddhist monks in the temples of Thailand. This therapy produces a feeling of balance, relaxation and well being, involving stretching, massage, use of a stick to stimulate reflex points.",
              "description2": "<big><b>Benefits<\u002fb><\u002fbig>\n<br />\n• Improves circulation of the hands and feet.<br />\n• Enhanced flexibility and reduced stiffness of legs? and feet.<br />\n• Improves sleep.<br />\n• Reduces edema in pregnant women during third trimester.<br />",
              "prepping_instructions_url": "http://dnjqko642wsuu.cloudfront.net/public/service_prepping/thai_foot/v1/bg.jpg",
              "personal_info_required": false,
              "category": "WELLNESS",
              "detail_sections": [],
              "options": [
                {
                  "id": 7,
                  "label": "Duration",
                  "choices": [
                    {
                      "id": 14,
                      "label": "60 mins",
                      "cost": 450.0,
                      "duration": 60
                    },
                    {
                      "id": 13,
                      "label": "30 mins",
                      "cost": 250.0,
                      "duration": 30
                    }
                  ]
                }
              ]
            }
          ]
        },
        "start_date": "2022-06-01T06:47:36Z",
        "end_date": "2022-06-01T07:54:33Z",
        "extras_requested": [],
        "sessions": [
          {
            "id": 13661,
            "type": "service",
            "status": "current",
            "priority": 1,
            "start_date": null,
            "end_date": "2022-06-01T07:54:33Z",
            "duration": 60,
            "amount": 625.0,
            "discounted_amount": 625.0,
            "provider_profit": 0.0,
            "company_profit": 0.0,
            "tip": null,
            "has_ongoing_steps": false,
            "has_ongoing_pending_steps": false,
            "type_id": 1,
            "label": "Swedish Aromatherapy"
          }
        ],
        "directions": null,
        "transactions": [
          {
            "id": 39095,
            "timestamp": "2022-06-01T06:46:30Z",
            "transaction_id": null,
            "charge_type": "pay",
            "status": "complete",
            "amount": 0.0,
            "credits": 0.0,
            "refunded_transaction_id": null,
            "gateway_type": null,
            "processing_type": {
              "enumType": "com.remedy.payment.Transaction$ProcessingType",
              "name": "PARTNER"
            }
          }
        ],
        "cancel_reason": null,
        "end_reason": null,
        "feedback": null,
        "client_feedback": null,
        "promo": null,
        "travel_method": "driving",
        "transportation": "Other",
        "oil_type": null,
        "preparing": true,
        "date_preparing_start": "2022-06-01T06:47:36Z",
        "date_preparing_done": null,
        "date_arrived": null,
        "date_arriving": null,
        "addons": [],
        "is_forced_assigned": false,
        "session_type": "single",
        "group_appointment_id": null,
        "group_index": -1,
        "tip_disabled": false,
        "last_payment_method_used_token": null,
        "packages": [],
        "extended_packages": [],
        "extended_package_items": [],
        "booking_options": [
          {
            "id": 1,
            "label": "PPE",
            "description": "Your provider will wear full PPE during the service",
            "icon_url": "http://dnjqko642wsuu.cloudfront.net/public/booking_option/booking_option_ppe.png",
            "default_value": true,
            "amount": 50.0
          }
        ],
        "booking_type": null,
        "is_scheduled": false,
        "date_scheduled": null,
        "standby": false,
        "date_standby_start": "2022-06-01T06:47:36Z",
        "booking_fee_amount": 0.0,
        "hazard_fee_amount": 0,
        "transport_fee_amount": 0,
        "kit_fee_amount": 0,
        "product_fee_amount": 25.0,
        "ppe_fee_amount": 100.0,
        "admin_fee_amount": 100.0,
        "clinic": null,
        "regional_office": {
          "id": 1,
          "identifier": "METRO_MANILA",
          "name": "Metro Manila"
        },
        "provider": {
          "id": 203,
          "first_name": "Shaneeee Olivierrrr",
          "last_name": "Jaducana",
          "display_name": "Shaneeee Olivierrrr Jaducana",
          "type": "provider",
          "sub_type": "MASSAGE_THERAPIST",
          "provider_type": "MASSAGE_THERAPIST"
        },
        "discount_amount": 0,
        "sub_total_amount": 0,
        "total_amount": 0,
        "cancel_charge": 0,
        "favorite_count": 0,
        "cancelled_by": {
          "id": 237,
          "first_name": "Shane",
          "last_name": "Oliver",
          "display_name": "Shane Oliver",
          "type": "client",
          "sub_type": null
        }
      }
    ]
  }
  
};
