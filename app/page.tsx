'use client';

import AuthenticatedLayout from "./(authenticated)/layout";
import HomePage from "./(authenticated)/page";

export default function RootPage() {
  return (
    <AuthenticatedLayout>
      <HomePage />
    </AuthenticatedLayout>
  );
}
