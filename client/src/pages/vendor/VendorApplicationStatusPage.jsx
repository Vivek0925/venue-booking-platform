import { useLoaderData } from "react-router-dom";
import ApplicationStatusCard from "@/components/vendor/ApplicationStatusCard";

export default function VendorApplicationStatusPage() {
  const { applicationStatus, application } = useLoaderData();

  return (
    <ApplicationStatusCard
      status={applicationStatus}
      reason={application?.rejectionReason}
    />
  );
}
