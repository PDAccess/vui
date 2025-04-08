<template>
  <div style="height: 70vh" id="xterm">
    <b-row>
      <b-col>
        <b-form-fieldset :horizontal="true">
          <b-form-input
            type="range"
            :min="minTime"
            :max="maxTime"
            :value="time"
            :disabled="isPlaying"
            @input="onInputTime"
          ></b-form-input>
        </b-form-fieldset>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="d-flex justify-content-center">
        <b-button
          @click="onClickFastBackward"
          :disabled="!isPlaying"
          class="mr-2"
          :variant="isFastBackward ? 'primary' : 'outline-primary'"
        >
          {{ "x" + speed[selectedBackwardSpeed]
          }}<em class="fa fa-fast-backward ml-1" />
        </b-button>
        <b-button
          :disabled="isPlaying"
          @click="onClickBackward"
          class="mr-2"
          variant="primary"
        >
          <em class="fa fa-backward mr-1" />
        </b-button>
        <b-button @click="changePlay" class="mr-2" variant="primary">
          <em v-if="isPlaying" class="fa fa-pause" />
          <em v-else class="fa fa-play" />
        </b-button>
        <b-button
          :disabled="isPlaying"
          @click="onClickForward"
          class="mr-2"
          variant="primary"
        >
          <em class="fa fa-forward" />
        </b-button>
        <b-button
          :disabled="!isPlaying"
          @click="onClickFastForward"
          :variant="isFastBackward ? 'outline-primary' : 'primary'"
        >
          <em class="fa fa-fast-forward mr-1" />{{
            "x" + speed[selectedForwardSpeed]
          }}
        </b-button>
      </b-col>
    </b-row>
    <hr />
  </div>
</template>

<script>
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";
import { SerializeAddon } from "xterm-addon-serialize";

export default {
  props: ["logs"],
  data() {
    return {
      xterm: null,
      fitAddon: null,
      serializeAddon: null,
      time: 0,
      minTime: 0,
      maxTime: 100,
      isPlaying: true,
      lastIndex: 0,
      isFastBackward: false,
      speed: [1, 2, 4, 8],
      selectedForwardSpeed: 0,
      selectedBackwardSpeed: 0,
    };
  },
  methods: {
    async update() {
      if (this.xterm) {
        var previousLog = this.logs[this.lastIndex];
        const timer = (ms) => new Promise((res) => setTimeout(res, ms));
        while (this.lastIndex < this.logs.length && this.lastIndex >= 0) {
          let log = this.logs[this.lastIndex];
          let diff = Math.abs(
            log.execTime / 1000000 - previousLog.execTime / 1000000
          );

          await timer(diff / this.speed[this.selectedForwardSpeed]);

          if (!this.isPlaying) {
            return;
          }

          previousLog = log;

          if (this.isFastBackward) {
            this.xterm.write("\x1b\x4d");
            this.xterm.write("\x1b[2K\r");
            this.time--;
            this.lastIndex--;
          } else {
            this.xterm.writeln(log.stdOut);
            this.time++;
            this.lastIndex++;
          }
        }

        if (this.lastIndex < 0) {
          this.isFastBackward = false;
        }

        this.isPlaying = false;
      }
    },
    clear() {
      this.time = 0;
      this.lastIndex = 0;
      if (this.xterm) {
        this.xterm.clear();
      }
    },
    updateDimensions() {
      if (this.fitAddon) {
        this.fitAddon.fit();
      }
    },
    changePlay() {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
        if (this.lastIndex >= this.logs.length - 1 || this.lastIndex < 0) {
          this.clear();
        }
        this.update();
      }
    },
    onClickForward() {
      if (this.lastIndex < this.logs.length) {
        let log = this.logs[this.lastIndex];
        this.xterm.writeln(log.stdOut);
        this.time++;
        this.lastIndex++;
      }
    },
    onClickBackward() {
      if (this.lastIndex > 0) {
        if (this.xterm) {
          this.xterm.write("\x1b\x4d");
          this.xterm.write("\x1b[2K\r");
          this.updateDimensions();
        }

        this.time--;
        this.lastIndex--;
      }
    },
    onClickFastForward() {
      if (!this.isFastBackward) {
        if (this.selectedForwardSpeed + 1 >= this.speed.length) {
          this.selectedForwardSpeed = 0;
        } else {
          this.selectedForwardSpeed++;
        }
      }
      this.isFastBackward = false;
    },
    onClickFastBackward() {
      if (this.isFastBackward) {
        if (this.selectedBackwardSpeed + 1 >= this.speed.length) {
          this.selectedBackwardSpeed = 0;
        } else {
          this.selectedBackwardSpeed++;
        }
      }
      this.isFastBackward = true;
    },
    onInputTime(newValue) {
      console.log("on input time");
      let diff = newValue - this.time;
      this.time = newValue;
      if (diff > 0) {
        for (let i = 0; i < diff && this.lastIndex < this.logs.length; i++) {
          this.xterm.writeln(this.logs[this.lastIndex].stdOut);
          this.lastIndex++;
        }
      }

      if (diff < 0) {
        diff = -diff;
        for (let i = 0; i < diff && this.lastIndex > 0; i++) {
          this.xterm.write("\x1b\x4d");
          this.xterm.write("\x1b[2K\r");
          this.lastIndex--;
        }
      }
    },
  },
  mounted() {
    this.xterm = new Terminal({ allowProposedApi: true, disableStdin: true, convertEol: true });
    this.xterm.open(this.$el);
    this.fitAddon = new FitAddon();
    this.serializeAddon = new SerializeAddon();

    this.xterm.loadAddon(this.fitAddon);
    this.xterm.loadAddon(this.serializeAddon);

    this.fitAddon.fit();

    this.xterm.loadAddon(this.serializeAddon);

    this.clear();
    this.update();

    this.minTime = 0;
    this.maxTime = this.logs.length;

    window.addEventListener("resize", this.updateDimensions);
  },
  unmounted() {
    window.removeEventListener("resize", this.updateDimensions);
  },
};
</script>

<style>
</style>