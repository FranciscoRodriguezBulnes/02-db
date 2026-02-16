<script setup lang="ts">
interface Props {
  open: boolean;
  previewUrl: string | null;
  name: string | undefined;
  loading: boolean;
}

const props = defineProps<Props>();

const internalOpen = ref<boolean>(props.open);

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

function onCancel() {
  emit("cancel");
  internalOpen.value = false;
}

function onConfirm() {
  emit("confirm");
  internalOpen.value = false;
}

watch(
  () => props.open,
  (v) => {
    internalOpen.value = !!v;
  },
);

watch(internalOpen, (v) => {
  emit("update:open", v);
});
</script>

<template>
  <UModal
    v-model:open="internalOpen"
    title="Confirmar reemplazo de avatar"
    description="Revisa la previsualización y confirma para reemplazar tu avatar."
  >
    <template #body>
      <div class="flex flex-col items-center gap-4">
        <section
          class="w-48 h-48 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"
        >
          <img
            v-if="previewUrl"
            :src="previewUrl"
            :alt="name || 'Avatar preview'"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="text-sm text-gray-500"
          >
            No preview available
          </div>
        </section>
        <div class="text-center text-sm text-gray-600">
          <div class="font-medium">
            {{ name }}
          </div>
          <div>¿Deseas reemplazar tu avatar actual?</div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          label="Cancelar"
          color="neutral"
          variant="subtle"
          :disabled="loading"
          @click="onCancel"
        />
        <UButton
          label="Reemplazar"
          color="primary"
          variant="solid"
          :loading="loading"
          @click="onConfirm"
        />
      </div>
    </template>
  </UModal>
</template>
