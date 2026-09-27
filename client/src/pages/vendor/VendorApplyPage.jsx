import { useLoaderData } from "react-router-dom";
import VendorApplicationForm from "@/components/vendor/VendorApplicationForm";
import ApplicationStatusCard from "@/components/vendor/ApplicationStatusCard";

export default function VendorApplyPage() {
  const loaderData = useLoaderData();
  const { applicationStatus } = loaderData;

  if (applicationStatus === "pending") {
    return (
      <ApplicationStatusCard
        status={applicationStatus}
      />
    );
  }

  if (applicationStatus === "rejected") {
    return (
      <VendorApplicationForm
        previousApplication={loaderData.application}
      />
    );
  }

  return <VendorApplicationForm />;
}
