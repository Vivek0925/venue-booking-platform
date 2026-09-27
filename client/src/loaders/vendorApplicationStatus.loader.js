import { redirect } from "react-router-dom";
import { getApplicationStatus } from "@/api/user.api";

export async function vendorApplicationStatusLoader() {
  const data = await getApplicationStatus();
  const { applicationStatus } = data;

  if (applicationStatus === "approved") {
    return redirect("/vendor/overview");
  }

  if (applicationStatus === "rejected") {
    return redirect("/vendor/apply");
  }

  return data;
}
