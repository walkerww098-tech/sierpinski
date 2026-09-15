<template>
    <v-app>
        <v-app-bar color="indigo-darken-4" height="32" dense>
            <v-app-bar-title>{{ route.meta.title }}</v-app-bar-title>
        </v-app-bar>
        <v-system-bar height="48">
            <v-tabs>
                <v-tab to="/">カーペット</v-tab>
                <v-tab to="/gasket">ガスケット</v-tab>
            </v-tabs>
            <v-spacer></v-spacer>
        </v-system-bar>
        <v-main class="bg-grey-lighten-3">
            <router-view />
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useApplicationStore } from '@/stores/applicationStore';
import { useRoute } from 'vue-router';

const app = useApplicationStore();
const route = useRoute();
</script>
