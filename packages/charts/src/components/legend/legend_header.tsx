/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';

import { LegendItem, LegendItemExtraValues, LegendValue } from '../../common/legend';
import { LegendAction, LegendPositionConfig } from '../../specs/settings';
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
  action?: LegendAction;
}

/** @internal */
export const LegendTableHeader = ({ items, action }: LegendHeaderProps) => {
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
    <div role="rowgroup">
      <div role="row" className="echLegendItem echLegendItem__header echLegendItem--vertical">
        <div
          role="gridcell"
          className="echLegendItem__label echLegendItem__label echLegendItem__label--clickable echLegendItem__label--singleline"
        >
          {/* TITLE */}
        </div>
        {item.values.map((l, i) => (
          <div role="gridcell" className="echLegendItem__legendValue" key={`${l.value}-${i}`}>
            {l.title}
          </div>
        ))}
        {action && <div role="gridcell" />}
      </div>
    </div>
  );
};
