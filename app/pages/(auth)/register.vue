<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import type { RegisterTypeZodSchema } from "#shared/zod/register.schema";
import { registerZodSchema } from "#shared/zod/register.schema";
import type { NuxtError } from "#app";
// import type { FetchError } from "ofetch";

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
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Enter your username",
    required: true,
    defaultValue: "Francisco",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
    defaultValue: "jacobo1!",
  },
  {
    name: "confirmPassword",
    label: "Confirm your Password",
    type: "password",
    placeholder: "Confirm your password",
    required: true,
  },
];

async function onSubmit(payload: FormSubmitEvent<RegisterTypeZodSchema>) {
  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: payload.data,
    });
    // await fetch(); // Refresca la sesión del usuario después de registrar, no es necesario al registrar
    await navigateTo("/login");
    toast.add({
      title: "Registration Successful",
      description:
        "You have successfully registered. Your account is now ready to use.",
      color: "success",
    });
  } catch (error) {
    // const fetchError = error as FetchError;
    // // Ahora puedes acceder a las propiedades específicas de FetchError
    // errorMessage.value =
    //   fetchError.data?.message || "An error occurred during login.";
    const err = error as NuxtError;
    toast.add({
      title: "Registration Error",
      description:
        err.statusMessage || "An error occurred during registration.",
      color: "error",
    });
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 h-screen">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="registerZodSchema"
        title="Register"
        description="Enter your credentials to register a new account."
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      >
        <template #description>
          Already have an account?
          <ULink
            to="/login"
            class="text-primary font-medium"
            >Sign in</ULink
          >
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
