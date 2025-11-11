import { IOAuthProfile } from '../../../../common/interfaces';

export function getEmailFromProfile(profile: IOAuthProfile): string | null {
    const email = profile?.emails?.[0]?.value || null;
    return email;
}

export function getDisplayNameFromProfile(profile: IOAuthProfile): string {
    return profile?.displayName || profile?.name?.givenName || 'User';
}
