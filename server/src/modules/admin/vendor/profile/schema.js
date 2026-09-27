import { z } from 'zod';

export const applicationId = z.object({
  applicationId: z.string().trim().uuid({ message: 'Invalid application id' }),
});
