<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import type { LoginTypeZodSchema } from "#shared/zod/login.schema";
import { loginZodSchema } from "#shared/zod/login.schema";
// import type { NuxtError } from "#app";
import type { FetchError } from "ofetch";

const errorMessage = ref("");
const toast = useToast();

const { fetch } = useUserSession();

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
    defaultValue: "frbacsa@gmail.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
    defaultValue: "jacobo1!",
  },
];

async function onSubmit(payload: FormSubmitEvent<LoginTypeZodSchema>) {
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: payload.data,
    });
    await fetch(); // Refresca la sesión del usuario después de iniciar sesión
    await navigateTo("/dashboard");
    toast.add({
      title: "Login Successful",
      description: "You have successfully logged in.",
      color: "success",
    });
  } catch (error) {
    const fetchError = error as FetchError;
    // Ahora puedes acceder a las propiedades específicas de FetchError
    errorMessage.value =
      fetchError.data?.message || "An error occurred during login.";
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 h-screen">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="loginZodSchema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      >
        <template #description>
          Don't have an account?
          <ULink
            to="/register"
            class="text-primary font-medium"
          >Sign up</ULink>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
