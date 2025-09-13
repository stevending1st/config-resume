import type { LocationKeyArray } from '@config-resume/i18n';
import { createAddressFormatter } from '@config-resume/i18n';
import type { Location } from '@config-resume/types';

export const myAddressFormatter = (
  lang: string,
  location?: Location,
  addressForLocaleArray?: LocationKeyArray
) => {
  const addressFormatter = createAddressFormatter(
    addressForLocaleArray ?? [
      ['countryCode', 'region', 'city', 'address', 'postalCode']
    ]
  );
  const addressArr = addressFormatter(location);
  const connector = ['en', 'en-us'].includes(lang)
    ? ', '
    : ['zh', 'zh-cn'].includes(lang)
      ? ' '
      : ' ';
  return addressArr
    .map(addresses =>
      addresses
        .map(({ value }) => value)
        .filter(Boolean)
        .join(connector)
    )
    .filter(Boolean)
    .join(connector);
};
