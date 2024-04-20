<template>
  <div class="container">
    <div class="scroller" data-direction="left" data-speed="slow">
      <div class="text-container">
        <h1 style="font-weight: 500">Our Partners With EcoGrade 1!</h1>
      </div>
      <div class="scroller__inner">
        <v-img
          v-for="(item, index) in duplicatedItems"
          :key="index"
          class="profile-picture"
          :src="item"
          alt="Profile picture"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "HomePartnerDisplay",

  data() {
    return {
      items: [],
      duplicatedItems: [],
    };
  },

  async mounted() {
    await this.fetchProfilePictures();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.addAnimation();
    }
  },

  methods: {
    async fetchProfilePictures() {
      const store = useStore();
      await store.dispatch("fetchProfilePictures");
      this.items = store.getters.profilePictures;
    },

    addAnimation() {
      // this.animated = true;
      const scroller = this.$el.querySelector(".scroller");
      scroller.setAttribute("data-animated", true);

      const targetLength = 50; // Replace with your target length

      if (this.items.length > 0) {
        const times = Math.ceil(targetLength / this.items.length);

        this.duplicatedItems = [];
        for (let i = 0; i < times; i++) {
          this.duplicatedItems = [...this.duplicatedItems, ...this.items];
        }
      } else {
        console.warn("items is empty");
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
}

.scroller {
  max-width: 100%;
  background-color: #4B644C;
  height: 250px;
}

.scroller__inner {
  padding-block: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
}

.scroller[data-animated="true"] {
  overflow: hidden;
  -webkit-mask: linear-gradient(
    90deg,
    transparent,
    white 20%,
    white 80%,
    transparent
  );
  mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
}

.scroller[data-animated="true"] .scroller__inner {
  width: max-content;
  flex-wrap: nowrap;
  animation: scroll var(--_animation-duration, 40s)
    var(--_animation-direction, forwards) linear infinite;
}

.scroller[data-direction="right"] {
  --_animation-direction: reverse;
}

.scroller[data-direction="left"] {
  --_animation-direction: forwards;
}

.scroller[data-speed="fast"] {
  --_animation-duration: 20s;
}

.scroller[data-speed="slow"] {
  --_animation-duration: 60s;
}

@keyframes scroll {
  to {
    transform: translate(calc(-50% - 0.5rem));
  }
}

.profile-picture {
  width: 100px;
  height: 100px; 
}

.text-container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  color: white;
}
</style>
