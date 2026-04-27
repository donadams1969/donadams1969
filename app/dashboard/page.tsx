import { redirect } from 'next/navigation';

export default function DashboardAlias() {
  // Acts as the root projection alias, redirecting to the latest production dashboard view
  redirect("/production-dashboard");
}
