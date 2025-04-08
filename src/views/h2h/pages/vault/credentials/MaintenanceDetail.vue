<template>
  <div class="animated fadeIn">
    <b-card no-body>
        <timeline>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <b-button variant="link" @click="userDetailPage(session)" class="profile-button">
                <p-profile-avatar
                  profileUsername="sakbal"
                  username="user two"
                  :size="35"
                  :imageWidth="'35px'"
                  :imageHeight="'auto'"
                />
              </b-button>
            </div>
            <div>
              <strong>
                ubuntu
              </strong>
            </div>
          </div>
          <timeline-title> Details</timeline-title>
          <VuePerfectScrollbar class="scrollperfect">
            <timeline-item
              :key="index"
              v-for="(item, index) in actions"
              bg-color="#9dd8e0"
            >
              <div
                class="d-flex justify-content-between align-items-center"
              >
                <div>
                  <div class="text-danger mb-2">
                    <strong>
                      here will come the error reason
                    </strong>
                  </div>
                </div>
                <div style="margin-left: 15px">
                  <p
                    class="text-info"
                    v-b-tooltip.bottom
                    :title="
                            [item.sessionEntity.start_time, item.id.action_time]
                              | moment('duration', false)
                          "
                  >
                    {{
                      [item.sessionEntity.start_time, item.id.action_time]
                        | moment("duration")
                    }}
                  </p>
                </div>
              </div>
            </timeline-item>
          </VuePerfectScrollbar>
        </timeline>
    </b-card>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

import { Timeline, TimelineItem, TimelineTitle } from "vue-cute-timeline";
export default {
  name: "MaintenanceDetail",
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle,
    VuePerfectScrollbar,
  },
  data() {
    return {
      actions: [{
        "id": 4474, "sessionId": 4104, "actionTime": 1629294546000, "sessionEntity": {
          "sessionId": 4104,
          "inventoryId": "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
          "startTime": 1629294540000,
          "endTime": null,
          "externalSessionId": "$4758916a-320b-47b2-ba0c-b4ce0fcde328",
          "sessionType": "T",
          "username": "hekemen",
          "userEntity": {
            "createdAt": 1517428702000,
            "updatedAt": 1598882632000,
            "deletedAt": null,
            "userId": "8db8d9dd-5429-4213-8ee0-f967701bc3e3",
            "email": "info@pdaccess.com",
            "phone": "5303339195",
            "tenantId": "1902a1e1-4053-3f3e-b919-dae186266336",
            "tenantEntity": {
              "createdAt": 1525712033000,
              "updatedAt": 1598908131000,
              "deletedAt": null,
              "tenantId": "1902a1e1-4053-3f3e-b919-dae186266336",
              "companyName": "H2H Secure",
              "country": "Turkey"
            },
            "username": "hekemen",
            "urole": "Admin",
            "external": false,
            "blocked": null,
            "status": "POC time😆",
            "twofactorauth": true,
            "notification": 1,
            "ldapDn": null,
            "first_name": "info",
            "last_name": "ekemen",
            "remember_token": null
          },
          "serviceEntity": {
            "createdAt": 1618390182000,
            "updatedAt": 1619385271000,
            "deletedAt": null,
            "name": "aws4",
            "userEntity": {
              "createdAt": 1517428702000,
              "updatedAt": 1598882632000,
              "deletedAt": null,
              "userId": "8db8d9dd-5429-4213-8ee0-f967701bc3e3",
              "email": "info@pdaccess.com",
              "phone": "5303339195",
              "tenantId": "1902a1e1-4053-3f3e-b919-dae186266336",
              "tenantEntity": {
                "createdAt": 1525712033000,
                "updatedAt": 1598908131000,
                "deletedAt": null,
                "tenantId": "1902a1e1-4053-3f3e-b919-dae186266336",
                "companyName": "H2H Secure",
                "country": "Turkey"
              },
              "username": "hekemen",
              "urole": "Admin",
              "external": false,
              "blocked": null,
              "status": "POC time😆",
              "twofactorauth": true,
              "notification": 1,
              "ldapDn": null,
              "first_name": "info",
              "last_name": "ekemen",
              "remember_token": null
            },
            "lastAccessTime": null,
            "originId": null,
            "ipAddress": "aws4.pdaccess.com",
            "port": 22,
            "dbName": "",
            "path": null,
            "ldapDn": null,
            "description": "aws4.pdaccess.com",
            "mapx": null,
            "mapy": null,
            "credantial": "vault",
            "inventory_id": "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
            "operating_system_id": 1,
            "service_type_id": 5,
            "who_create": "8db8d9dd-5429-4213-8ee0-f967701bc3e3",
            "video_record": null,
            "who_update": "8db8d9dd-5429-4213-8ee0-f967701bc3e3"
          },
          "ipAddress": "95.2.35.79"
        }, "proxy_action": "ps aux"
      }, {
        "id": 4475, "sessionId": 4104, "actionTime": 1629294549000, "sessionEntity": {
          "sessionId": 4104,
          "inventoryId": "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
          "startTime": 1629294540000,
          "endTime": null,
          "externalSessionId": "$4758916a-320b-47b2-ba0c-b4ce0fcde328",
          "sessionType": "T",
          "username": "hekemen",
          "userEntity": {
            "createdAt": 1517428702000,
            "updatedAt": 1598882632000,
            "deletedAt": null,
            "userId": "8db8d9dd-5429-4213-8ee0-f967701bc3e3",
            "email": "info@pdaccess.com",
            "phone": "5303339195",
            "tenantId": "1902a1e1-4053-3f3e-b919-dae186266336",
            "tenantEntity": {
              "createdAt": 1525712033000,
              "updatedAt": 1598908131000,
              "deletedAt": null,
              "tenantId": "1902a1e1-4053-3f3e-b919-dae186266336",
              "companyName": "H2H Secure",
              "country": "Turkey"
            },
            "username": "hekemen",
            "urole": "Admin",
            "external": false,
            "blocked": null,
            "status": "POC time😆",
            "twofactorauth": true,
            "notification": 1,
            "ldapDn": null,
            "first_name": "info",
            "last_name": "ekemen",
            "remember_token": null
          },
          "serviceEntity": {
            "createdAt": 1618390182000,
            "updatedAt": 1619385271000,
            "deletedAt": null,
            "name": "aws4",
            "userEntity": {
              "createdAt": 1517428702000,
              "updatedAt": 1598882632000,
              "deletedAt": null,
              "userId": "8db8d9dd-5429-4213-8ee0-f967701bc3e3",
              "email": "info@pdaccess.com",
              "phone": "5303339195",
              "tenantId": "1902a1e1-4053-3f3e-b919-dae186266336",
              "tenantEntity": {
                "createdAt": 1525712033000,
                "updatedAt": 1598908131000,
                "deletedAt": null,
                "tenantId": "1902a1e1-4053-3f3e-b919-dae186266336",
                "companyName": "H2H Secure",
                "country": "Turkey"
              },
              "username": "hekemen",
              "urole": "Admin",
              "external": false,
              "blocked": null,
              "status": "POC time😆",
              "twofactorauth": true,
              "notification": 1,
              "ldapDn": null,
              "first_name": "info",
              "last_name": "ekemen",
              "remember_token": null
            },
            "lastAccessTime": null,
            "originId": null,
            "ipAddress": "aws4.pdaccess.com",
            "port": 22,
            "dbName": "",
            "path": null,
            "ldapDn": null,
            "description": "aws4.pdaccess.com",
            "mapx": null,
            "mapy": null,
            "credantial": "vault",
            "inventory_id": "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
            "operating_system_id": 1,
            "service_type_id": 5,
            "who_create": "8db8d9dd-5429-4213-8ee0-f967701bc3e3",
            "video_record": null,
            "who_update": "8db8d9dd-5429-4213-8ee0-f967701bc3e3"
          },
          "ipAddress": "95.2.35.79"
        }, "proxy_action": "clear"
      }, {
        "id": 4476, "sessionId": 4104, "actionTime": 1629294552000, "sessionEntity": {
          "sessionId": 4104,
          "inventoryId": "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
          "startTime": 1629294540000,
          "endTime": null,
          "externalSessionId": "$4758916a-320b-47b2-ba0c-b4ce0fcde328",
          "sessionType": "T",
          "username": "hekemen",
          "userEntity": {
            "createdAt": 1517428702000,
            "updatedAt": 1598882632000,
            "deletedAt": null,
            "userId": "8db8d9dd-5429-4213-8ee0-f967701bc3e3",
            "email": "info@pdaccess.com",
            "phone": "5303339195",
            "tenantId": "1902a1e1-4053-3f3e-b919-dae186266336",
            "tenantEntity": {
              "createdAt": 1525712033000,
              "updatedAt": 1598908131000,
              "deletedAt": null,
              "tenantId": "1902a1e1-4053-3f3e-b919-dae186266336",
              "companyName": "H2H Secure",
              "country": "Turkey"
            },
            "username": "hekemen",
            "urole": "Admin",
            "external": false,
            "blocked": null,
            "status": "POC time😆",
            "twofactorauth": true,
            "notification": 1,
            "ldapDn": null,
            "first_name": "info",
            "last_name": "ekemen",
            "remember_token": null
          },
          "serviceEntity": {
            "createdAt": 1618390182000,
            "updatedAt": 1619385271000,
            "deletedAt": null,
            "name": "aws4",
            "userEntity": {
              "createdAt": 1517428702000,
              "updatedAt": 1598882632000,
              "deletedAt": null,
              "userId": "8db8d9dd-5429-4213-8ee0-f967701bc3e3",
              "email": "info@pdaccess.com",
              "phone": "5303339195",
              "tenantId": "1902a1e1-4053-3f3e-b919-dae186266336",
              "tenantEntity": {
                "createdAt": 1525712033000,
                "updatedAt": 1598908131000,
                "deletedAt": null,
                "tenantId": "1902a1e1-4053-3f3e-b919-dae186266336",
                "companyName": "H2H Secure",
                "country": "Turkey"
              },
              "username": "hekemen",
              "urole": "Admin",
              "external": false,
              "blocked": null,
              "status": "POC time😆",
              "twofactorauth": true,
              "notification": 1,
              "ldapDn": null,
              "first_name": "info",
              "last_name": "ekemen",
              "remember_token": null
            },
            "lastAccessTime": null,
            "originId": null,
            "ipAddress": "aws4.pdaccess.com",
            "port": 22,
            "dbName": "",
            "path": null,
            "ldapDn": null,
            "description": "aws4.pdaccess.com",
            "mapx": null,
            "mapy": null,
            "credantial": "vault",
            "inventory_id": "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
            "operating_system_id": 1,
            "service_type_id": 5,
            "who_create": "8db8d9dd-5429-4213-8ee0-f967701bc3e3",
            "video_record": null,
            "who_update": "8db8d9dd-5429-4213-8ee0-f967701bc3e3"
          },
          "ipAddress": "95.2.35.79"
        }, "proxy_action": "top -d 1"
      }],
    };
  }
}
</script>
