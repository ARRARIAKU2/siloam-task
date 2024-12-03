<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" class="">
      <div class="flex flex-col justify-between h-full p-4">
        <div>
          <ul class="flex flex-col gap-y-6 pt-20">
            <li v-for="item in sidebar">
              <a :href="item.url">
                <span class="text-black font-semibold">{{ item.name }}</span>
              </a>
            </li>
          </ul>
        </div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Logout
        </button>
      </div>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Dashboard</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(null);

const sidebar = [
  {
    name: "Vendors",
    url: "/",
    icon: "vendor",
  },
  {
    name: "Users",
    url: "/user",
    icon: "users",
  },
];
</script>

<script>
export default {
  data: () => ({ drawer: null }),
};
</script>
