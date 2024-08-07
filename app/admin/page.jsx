import PageLayout from "@/components/layout/PageLayout";

export default function AdminPage() {
  return (
    <PageLayout className="flex-col gap-5 p-10">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-center">Welcome to the admin dashboard!</p>
      <p className="mt-2 text-center">
        Here, you can manage users, products, and various settings. To get
        started, please select an option from the sidebar.
      </p>
    </PageLayout>
  );
}

