import { AdRefs } from "./AdRefs";

export default {
  title: "Chat/AdRefs",
  component: AdRefs,
};


export const Default = (args) => {
  return <AdRefs {...args} />;
};

Default.args = {
  title: "AdRefs",
  adrefsList : {
    "list": [
      {
        "id": 2,
        "ad_id": "6317625676780",
        "post_id": "5555709841141889",
        "ad_title": "1- square blue",
        "date": "2022-09-09T05:56:48Z"
      },
      {
        "id": 3,
        "ad_id": "6317625676780",
        "post_id": "5555709841141889",
        "ad_title": "1- square blue",
        "date": "2022-09-09T05:56:48Z"
      },
      {
        "id": 4,
        "ad_id": "6317625676780",
        "post_id": "5555709841141889",
        "ad_title": "1- square blue",
        "date": "2022-09-09T05:56:48Z"
      },
      {
        "id": 5,
        "ad_id": "6317625676780",
        "post_id": "5555709841141889",
        "ad_title": "1- square blue",
        "date": "2022-09-09T05:56:48Z"
      },
      {
        "id": 1,
        "ad_id": "6150665890980",
        "post_id": "2225783704134536",
        "ad_title": "Green Text 1 - Copy 2",
        "date": "2022-05-10T09:07:17Z"
      }
    ],
    "count": 5
  },
};
