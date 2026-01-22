<script setup lang="ts">
import { onMounted, ref } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const mapContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!mapContainer.value) return;
  const center: [number, number] = [-1.66438, -78.6484];
  const map = L.map(mapContainer.value, {
    center: center,
    zoom: 16,
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: false,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    className: 'map-tiles',
  }).addTo(map);

  const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  L.marker(center)
    .addTo(map)
    .bindPopup(
      `
      <div class="text-left font-sans min-w-[140px]">
        <strong class="text-primary text-sm">Hotel Ventura</strong><br/>
        <a
          href="https://www.google.com/maps/search/?api=1&query=-1.66438,-78.6484"
          target="_blank"
          class="text-primary hover:underline text-[10px] font-bold uppercase tracking-wider mt-2 block"
        >
          Click para ver cómo llegar
        </a>
      </div>
      `,
    );
});
</script>

<template>
  <footer id="contacto" class="border-t border-primary/20 bg-[#02060b] pb-10 pt-20 text-white">
    <div class="mx-auto max-w-7xl px-6 lg:px-16">
      <div class="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div class="flex flex-col gap-6 text-left">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[32px] text-primary">diamond</span>
            <span class="font-serif text-2xl font-bold tracking-tight">Hotel Ventura</span>
          </div>
          <p class="text-sm font-light leading-relaxed text-gray-400">
            Redefiniendo el lujo moderno en Riobamba. Su destino preferido para negocios y placer.
          </p>
          <div class="mt-2 flex gap-4">
            <a
              href="#"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all duration-300 hover:border-primary hover:text-primary"
            >
              <span class="text-xs font-bold">FB</span>
            </a>
            <a
              href="#"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all duration-300 hover:border-primary hover:text-primary"
            >
              <span class="text-xs font-bold">IG</span>
            </a>
            <a
              href="#"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all duration-300 hover:border-primary hover:text-primary"
            >
              <span class="text-xs font-bold">TW</span>
            </a>
          </div>
        </div>

        <div class="flex flex-col gap-6 text-left">
          <h4
            class="inline-block w-max border-b border-gray-800 pb-2 text-xs font-bold uppercase tracking-widest text-primary"
          >
            Contacto
          </h4>
          <div class="flex flex-col gap-4 text-sm font-light text-gray-400">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined mt-0.5 text-[20px] text-primary/70"
                >location_on</span
              >
              <span>Av. Daniel León Borja,<br />Riobamba, Ecuador</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[20px] text-primary/70">call</span>
              +593 99 123 4567
            </div>
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[20px] text-primary/70">mail</span>
              reservas@hotelventura.com
            </div>

            <div class="mt-2">
              <h5 class="font-bold text-white/90 text-xs uppercase tracking-wide mb-1">Horario</h5>
              <p>Lunes - Domingo: 24 Horas</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6 text-left">
          <h4
            class="inline-block w-max border-b border-gray-800 pb-2 text-xs font-bold uppercase tracking-widest text-primary"
          >
            Ubicación
          </h4>
          <div
            ref="mapContainer"
            class="h-64 w-full overflow-hidden rounded-lg border border-primary/30 shadow-[0_0_20px_rgba(212,175,55,0.05)] transition-all hover:border-primary hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]"
          ></div>
        </div>
      </div>

      <div
        class="flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row"
      >
        <p class="text-xs font-light text-gray-600">
          © {{ new Date().getFullYear() }} Hotel Ventura. Todos los derechos reservados.
        </p>
        <div class="flex gap-6 text-xs font-light text-gray-600">
          <a href="#" class="transition-colors hover:text-primary">Privacidad</a>
          <a href="#" class="transition-colors hover:text-primary">Términos</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
.map-tiles {
  filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
}

.leaflet-popup-content-wrapper {
  background: rgba(17, 34, 64, 0.95);
  border: 1px solid #d4af37;
  border-radius: 4px;
  color: #fff;
  padding: 0;
}
.leaflet-popup-content {
  margin: 12px 16px;
  line-height: 1.5;
}
.leaflet-container a.leaflet-popup-close-button {
  color: #d4af37;
  font:
    16px/14px Tahoma,
    Verdana,
    sans-serif;
}
</style>
