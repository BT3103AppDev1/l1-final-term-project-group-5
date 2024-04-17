<template>
  <div class="container">
    <div class="scroller" data-direction="left" data-speed="medium">
      <div class="text-container">
        <h1>Our Partners With EcoGrade 1</h1>
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
  data() {
    return {
      items: [],
      duplicatedItems: [],
    };
  },

  mounted() {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.addAnimation();
    }
  },

  methods: {
    addAnimation() {
      const scroller = this.$el.querySelector(".scroller");
      scroller.setAttribute("data-animated", true);

      const scrollerInner = scroller.querySelector(".scroller__inner");
      const scrollerContent = Array.from(scrollerInner.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        duplicatedItem.setAttribute("aria-hidden", true);
        scrollerInner.appendChild(duplicatedItem);
      });

      const targetLength = 50; // Replace with your target length
      const times = Math.ceil(targetLength / this.items.length);

      this.duplicatedItems = [];
      for (let i = 0; i < times; i++) {
        this.duplicatedItems = [...this.duplicatedItems, ...this.items];
      }
    },
  },

  setup() {
    const store = useStore();
    store.dispatch("fetchProfilePictures");
    const items = computed(() => store.getters.profilePictures);
    // const items = [
    //   "https://firebasestorage.googleapis.com/v0/b/greenharbor-cd03b.appspot.com/o/profilePictures%2FqYcmdc4udiN4butJN7F9m6CTPvs2.png?alt=media&token=7b65eae6-a923-416b-9405-1fdd8a7e9f5d",
    //   "https://firebasestorage.googleapis.com/v0/b/greenharbor-cd03b.appspot.com/o/profilePictures%2FqYcmdc4udiN4butJN7F9m6CTPvs2.png?alt=media&token=7b65eae6-a923-416b-9405-1fdd8a7e9f5d",
    //   "https://firebasestorage.googleapis.com/v0/b/greenharbor-cd03b.appspot.com/o/profilePictures%2FqYcmdc4udiN4butJN7F9m6CTPvs2.png?alt=media&token=7b65eae6-a923-416b-9405-1fdd8a7e9f5d",
    //   "https://firebasestorage.googleapis.com/v0/b/greenharbor-cd03b.appspot.com/o/profilePictures%2FqYcmdc4udiN4butJN7F9m6CTPvs2.png?alt=media&token=7b65eae6-a923-416b-9405-1fdd8a7e9f5d",
    //   "https://firebasestorage.googleapis.com/v0/b/greenharbor-cd03b.appspot.com/o/profilePictures%2FqYcmdc4udiN4butJN7F9m6CTPvs2.png?alt=media&token=7b65eae6-a923-416b-9405-1fdd8a7e9f5d",
    //   "https://firebasestorage.googleapis.com/v0/b/greenharbor-cd03b.appspot.com/o/profilePictures%2FqYcmdc4udiN4butJN7F9m6CTPvs2.png?alt=media&token=7b65eae6-a923-416b-9405-1fdd8a7e9f5d",
    //   "https://firebasestorage.googleapis.com/v0/b/greenharbor-cd03b.appspot.com/o/profilePictures%2FqYcmdc4udiN4butJN7F9m6CTPvs2.png?alt=media&token=7b65eae6-a923-416b-9405-1fdd8a7e9f5d",
    //   "https://firebasestorage.googleapis.com/v0/b/greenharbor-cd03b.appspot.com/o/profilePictures%2FqYcmdc4udiN4butJN7F9m6CTPvs2.png?alt=media&token=7b65eae6-a923-416b-9405-1fdd8a7e9f5d",
    //   "https://firebasestorage.googleapis.com/v0/b/greenharbor-cd03b.appspot.com/o/profilePictures%2FqYcmdc4udiN4butJN7F9m6CTPvs2.png?alt=media&token=7b65eae6-a923-416b-9405-1fdd8a7e9f5d",
    // ];
    // console.log(items);
    return { items };
  },
};
</script>

<style scoped>
.scroller {
  max-width: 100%;
  background-color: #7c8e76;
}

.scroller__inner {
  padding-block: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
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
  width: 100px; /* Replace with your desired width */
  height: 100px; /* Replace with your desired height */
}

.text-container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
