import type { LocationKeyArray } from '@config-resume/i18n';
import { createAddressFormatter } from '@config-resume/i18n';
import type { Location } from '@config-resume/types';

export const myAddressFormatter = (
  lang: string,
  location: Location,
  addressForLocaleArray?: LocationKeyArray
) => {
  const addressFormatter = createAddressFormatter(
    addressForLocaleArray ?? [
      ['address', 'city', 'region', 'postalCode', 'countryCode']
    ]
  );
  const addressArr = addressFormatter(location);
  const connector = ['en', 'en-us'].includes(lang)
    ? ', '
    : ['zh', 'zh-cn'].includes(lang)
      ? ''
      : ' ';
  return addressArr
    .map(addresses =>
      addresses
        .map(({ value }) => value)
        .filter(Boolean)
        .join(connector)
    )
    .join(connector);
};
