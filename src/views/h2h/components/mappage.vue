<template>
  <div id="map_div">
    <l-map ref="map" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution" :options="options"></l-tile-layer>
     <l-marker :draggable="draggable" riseOnHover="true" :lat-lng="marker" :lat-lng.sync="marker" :icon="icon" @moveend="fireDragEnd"></l-marker>
    </l-map>
  </div>

</template>

<script>
import { LMap, LTileLayer, LMarker, LTooltip } from 'vue2-leaflet';

let redIcon = new L.Icon({
  iconUrl: require('@/assets/marker/marker-icon-2x-red.png'),
  shadowUrl: require('@/assets/marker/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

let greenIcon = new L.Icon({
  iconUrl: require('@/assets/marker/marker-icon-2x-green.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default {
  name: 'mappage',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip
  },
  props: {
   x: {
     type: Number,
     default: 41.108900
   },
   y: {
     type: Number,
     default: 29.017422
   },
   draggable: {
     type: Boolean,
     default: true
   }
 },
 computed: {

},

  data () {
    return {
      geocodes: [],
      zoom:13,
      center: L.latLng(this.x, this.y),
      options: {
	      // subdomains: ['vec01', 'vec02', 'vec03', 'vec04']
      },
      //url: 'https://{s}.maps.yandex.net/tiles?l=map&v=2.31.1&x={x}&s=&y={y}&z={z}&lang=tr_TR',
      url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(this.x, this.y),
      icon: redIcon,

    }
  },
  watch: {

     },
  methods: {
    fireDragEnd() {
      let that=this;
      this.center =  L.latLng(that.marker.lat, that.marker.lng);
      let xy= {
        x: that.marker.lat,
        y: that.marker.lng
      }

      this.$emit('marked', xy);

    }
  }
}
</script>
<style>
@import "~leaflet/dist/leaflet.css";
#map_div {
  position: absolute;
  overflow-x: auto;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  padding-left: 0;
  border-left: 0;
}
#map_div ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
#map_div li {
  font: 200 15px/1.5 Helvetica, Verdana, sans-serif;
  border-bottom: 1px solid #ccc;
}
#map_div li:last-child {
  border: none;
}
#map_div li a {
  font-size: 15px;
  padding-left: 8px;
  text-decoration: none;
  color: #000;
  display: block;
  -webkit-transition: font-size 0.3s ease, background-color 0.3s ease;
  -moz-transition: font-size 0.3s ease, background-color 0.3s ease;
  -o-transition: font-size 0.3s ease, background-color 0.3s ease;
  -ms-transition: font-size 0.3s ease, background-color 0.3s ease;
  transition: font-size 0.3s ease, background-color 0.3s ease;
}
#map_div li a:hover {
  font-size: 20px;
  background: #f6f6f6;
}

</style>
