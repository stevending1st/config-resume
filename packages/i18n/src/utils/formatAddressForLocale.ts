import type { Location, LocationKey } from '@config-resume/types';

import type { LocationArrayItem, LocationKeyArray } from '../type';

export function createAddressFormatter(
  defaultAddressForLocaleArray: LocationKeyArray
) {
  return (location: Location, userAddressForLocaleArray?: LocationKeyArray) =>
    (userAddressForLocaleArray && userAddressForLocaleArray?.length > 0
      ? userAddressForLocaleArray
      : defaultAddressForLocaleArray
    ).map((addressForLocaleItem: Array<LocationKey>) =>
      addressForLocaleItem.map(
        (item: LocationKey) =>
          ({
            key: item,
            value: location[item as LocationKey] ?? ''
          }) as LocationArrayItem
      )
    );
}
