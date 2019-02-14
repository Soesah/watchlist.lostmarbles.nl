<template>
  <span class="version" v-text="version"></span>
</template>
<script>
import versionInfo from "@/version.json";
import { Version } from "@/models/VersionModel";

export default {
  name: "Version",
  data() {
    return {
      v: new Version(versionInfo)
    };
  },
  computed: {
    version() {
      return `Version ${this.v.version}`;
    }
  }
};
</script>
