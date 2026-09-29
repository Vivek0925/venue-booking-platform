import ApplicationsTable from "@/components/admin/VendorApplicationTable";
import {
  getVendorApplications,
  reviewVendorApplication,
} from "@/api/admin.api";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VendorApplicationsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get("status") || "pending";

  const handleViewProfile = (row) => {
    navigate(`/admin/vendor/profile/application/${row.id}`);
  };

  return (
    <ApplicationsTable
      status={status}
      fetchApplications={getVendorApplications}
      reviewApplication={reviewVendorApplication}
      onViewProfile={status === "approved" ? handleViewProfile : undefined}
    />
  );
}
