/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { first } from 'lodash';
import React from 'react';

import { LegendItem, LegendItemExtraValues, LegendValue } from '../../common/legend';
import { LegendPositionConfig } from '../../specs/settings';
import { LegendLabelOptions } from '../../utils/themes/theme';

/** @internal */
export interface LegendHeaderProps {
  items: LegendItem[];
  flatLegend: boolean;
  totalItems: number;
  positionConfig: LegendPositionConfig;
  extraValues: Map<string, LegendItemExtraValues>;
  legendValues: Array<LegendValue>;
  isMostlyRTL: boolean;
  labelOptions: LegendLabelOptions;
}

/** @internal */
export const LegendListHeader = ({ items }: LegendHeaderProps) => {
  if (items.length === 0) {
    return null;
  }
  const item = items.at(0);
  if (!item) {
    return null;
  }
  // we should only title series if there's an extra value that is not currentorlastvalue
  const hasStatValues = item?.values?.find((v) => v.type !== LegendValue.CurrentAndLastValue);
  if (!hasStatValues) {
    return null;
  }

  return (
    <li className="echLegendItem echLegendItem--vertical">
      <div className="echLegendItem__label echLegendItem__label echLegendItem__label--clickable echLegendItem__label--singleline">
        TITLE
      </div>
      {item.values.map((l, i) => (
        <div className="echLegendItem__legendValue" key={`${l.value}-${i}`}>
          {l.title}
        </div>
      ))}
    </li>
  );
};
