import { SetMetadata } from '@nestjs/common';

export const SKIP_THROTTLE_KEY = process.env.THROTTLE_SKIP_KEY;
export const SkipThrottle = (skip = true) => SetMetadata(SKIP_THROTTLE_KEY, skip);
