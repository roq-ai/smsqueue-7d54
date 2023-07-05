const mapping: Record<string, string> = {
  companies: 'company',
  'email-accounts': 'email_account',
  'email-filters': 'email_filter',
  'phone-numbers': 'phone_number',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
