import DashboardHome from "@/client/components/dashboard/DashboardHome";
import { RouteProvider } from "@/client/contexts";

export default function Page() {
  return (
    <RouteProvider>
      <div>
        <DashboardHome />
      </div>
    </RouteProvider>
  );
}
