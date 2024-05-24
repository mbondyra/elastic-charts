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

const COLOR_DOT_CHECK_WIDTH = '10px';

/** @internal */
export function LegendTable({ items, ...itemProps }: LegendTableProps) {
  const gridRowLength = (itemProps.action ? 1 : 0) + (items?.[0]?.values.length ?? 0);
  const gridTemplateColumns = {
    vertical: `${COLOR_DOT_CHECK_WIDTH} minmax(auto, 50%) repeat(${gridRowLength}, auto)`,
    horizontal: `${COLOR_DOT_CHECK_WIDTH} minmax(auto, 75%) repeat(${gridRowLength}, auto)`,
  };
  return (
    <div className="echLegendTable__container">
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
    </div>
  );
}
