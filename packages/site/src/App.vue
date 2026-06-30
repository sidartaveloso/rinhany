<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Features from './components/Features.vue'
import HowItWorks from './components/HowItWorks.vue'
import PackagesSection from './components/PackagesSection.vue'
import CodeSection from './components/CodeSection.vue'
import GetStarted from './components/GetStarted.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="min-h-screen bg-[#05070d] text-white">
    <Navbar />
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <PackagesSection />
      <CodeSection />
      <GetStarted />
    </main>
    <Footer />
  </div>
</template>
