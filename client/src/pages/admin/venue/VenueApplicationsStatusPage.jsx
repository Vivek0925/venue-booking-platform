import { useEffect, useState, useMemo } from "react";
import { AlertTriangle, Filter, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  VenueGridCardSkeleton,
  default as VenueGridCard,
} from "@/components/venue/VenueGridCard";
import { getVenueApplications } from "@/api/admin.api";
import { useNavigate, useSearchParams } from "react-router-dom";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-500/90 text-white backdrop-blur-md",
    countBadgeClass: "bg-amber-50 text-amber-700",
    countBadgeHoverClass: "hover:bg-amber-100",
  },
  approved: {
    label: "Approved",
    badgeClass: "bg-emerald-500/90 text-white backdrop-blur-md",
    countBadgeClass: "bg-emerald-50 text-emerald-700",
    countBadgeHoverClass: "hover:bg-emerald-100",
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-rose-500/90 text-white backdrop-blur-md",
    countBadgeClass: "bg-rose-50 text-rose-700",
    countBadgeHoverClass: "hover:bg-rose-100",
  },
};

// --- MAIN PAGE COMPONENT ---

export default function VenueApplicationsStatusPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "pending";
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const data = await getVenueApplications(status);
        const payload = Array.isArray(data) ? data : (data?.data ?? []);
        if (isMounted) setApplications(payload);
      } catch {
        if (isMounted) setError("Failed to fetch applications");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [status]);

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = app.status === status;
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [applications, status, searchQuery]);

  const handleActionClick = (id) => {
    navigate(`/admin/venue/applications/${id}`);
  };

  return (
    <div className="w-full space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Venue Applications
            </h1>
            <Badge
              className={`border-0 text-xs font-semibold ${STATUS_CONFIG[status]?.countBadgeHoverClass || "hover:bg-slate-200"} ${STATUS_CONFIG[status]?.countBadgeClass || "bg-slate-100 text-slate-600"}`}
            >
              {loading ? "..." : applications.length}{" "}
              {STATUS_CONFIG[status]?.label || "Applications"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Review and manage property listings submitted by vendors.
          </p>
        </div>

        <div className="flex w-full sm:w-72 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid Content (5 Columns on XL screens) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:gap-8">
        {loading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <VenueGridCardSkeleton key={i} />
            ))}
          </>
        ) : filteredApps.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xs border border-slate-100">
              <Filter className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="mt-5 text-base font-bold text-slate-900">
              No matching applications
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              There are currently no "{status}" applications that match your
              criteria.
            </p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <VenueGridCard
              key={app.id}
              venue={app}
              onClick={() => handleActionClick(app.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
