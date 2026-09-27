```js
router.get(
  "/venue/applications",
  validateSchema(schema.status, "query"),
  controller.getApplications,
);
```

```js
export const status = z.object({
  status: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.enum(["pending", "approved", "rejected"]))
    .optional(),
});
```

```js
export async function getApplications(req, res) {
  const data = await service.getApplications(req.query.status);
  res.status(200).json({ success: true, data });
}
```

```js
export async function getApplications(status) {
  const applications = await repository.fetchApplications(status);
  return Promise.all(
    applications.map(async (application) => {
      const [coverImage] = await getPrivateUrl([application.coverImageKey]);

      return {
        id: application.id,
        venueGroupId: application.venueGroupId,
        name: application.name,
        category: application.category,
        coverImage,
        district: application.district,
        state: application.state,
        status: application.status,
        submittedAt: application.submittedAt,
        reviewedAt: application.reviewedAt,
        rejectionReason: application.rejectionReason,
        vendor: {
          id: application.vendorId,
          name: application.vendorName,
        },
        reviewedBy: {
          id: application.reviewerId,
          email: application.reviewerEmail,
        },
      };
    }),
  );
}
```

```js
export async function fetchApplications(status) {
  const result = await pool.query(
    `
  SELECT * FROM (
  SELECT DISTINCT ON (va.venue_application_group_id)
    va.id, va.venue_application_group_id, va.name, va.category,
    va.district, va.state, va.status, va.cover_image_key, va.submitted_at, va.reviewed_at, va.rejection_reason,
    vp.id AS vendor_id, vp.vendor_name,
    a.id AS reviewer_id, a.email AS reviewer_email
  FROM venue_applications va
  JOIN vendor_profiles vp ON vp.id = va.vendor_id
  LEFT JOIN admins a ON a.id = va.reviewed_by
  ORDER BY va.venue_application_group_id, va.submitted_at DESC
  ) AS latest_per_group
  WHERE status = $1
  ORDER BY submitted_at ASC`,
    [status],
  );
  return result.rows.map((row) => toCamelCase(row));
}
```

#

```js

```

#

```js

```
