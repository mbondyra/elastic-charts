/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';

import { LegendTableBody } from './legend_table_body';
import { LegendTableHeader } from './legend_table_header';
import { LegendItem } from '../../../common/legend';
import { LayoutDirection } from '../../../utils/common';
import { SharedLegendItemProps } from '../types';

/** @internal */
export interface LegendTableProps extends SharedLegendItemProps {
  items: LegendItem[];
}

/** @internal */
export const GRID_COLOR_PICKER_WIDTH = 10;
/** @internal */
export const GRID_ACTION_WIDTH = 26;
/** @internal */
export const MIN_LABEL_WIDTH = 40;

/** @internal */
export function LegendTable({ items, ...itemProps }: LegendTableProps) {
  const gridRowLength = (itemProps.action ? 1 : 0) + (items?.[0]?.values.length ?? 0);
  const gridTemplateColumns = {
    vertical: `${GRID_COLOR_PICKER_WIDTH}px minmax(50%, auto) repeat(${gridRowLength}, auto)`,
    horizontal: `${GRID_COLOR_PICKER_WIDTH}px minmax(auto, 75%) repeat(${gridRowLength}, auto)`,
  };
  return (
    <div
      className="echLegendTable"
      role="table"
      style={{
        gridTemplateColumns:
          itemProps.positionConfig.direction === LayoutDirection.Horizontal
            ? gridTemplateColumns.horizontal
            : gridTemplateColumns.vertical,
      }}
    >
      <LegendTableHeader
        isMostlyRTL={itemProps.isMostlyRTL}
        hasAction={!!itemProps.action}
        legendValues={itemProps.legendValues}
        legendTitle={itemProps.legendTitle}
        labelOptions={itemProps.labelOptions}
      />
      <LegendTableBody items={items} {...itemProps} />
    </div>
  );
}
