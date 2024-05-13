/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';

import { SharedLegendItemProps } from './legend_item';
import { LegendTableBody } from './legend_table_body';
import { LegendTableHeader } from './legend_table_header';
import { LegendItem } from '../../../common/legend';
import { LegendListStyle } from '../style_utils';

/** @internal */
export interface LegendTableProps extends SharedLegendItemProps {
  items: LegendItem[];
  listStyle: LegendListStyle;
}

/**
 * Manually synced with `colorDotCheckWidth` const in [`_legend.scss`](packages/charts/src/components/legend/components/_legend.scss)
 */
const COLOR_DOT_CHECK_WIDTH = '12px';

/** @internal */
export function LegendTable({ items, listStyle, ...itemProps }: LegendTableProps) {
  const gridRowLength = (itemProps.action ? 1 : 0) + (items?.[0]?.values.length ?? 0);
  return (
    <div className="echLegendTable__container">
      <div
        className="echLegendTable"
        role="table"
        style={{
          ...listStyle,
          gridTemplateColumns: `${COLOR_DOT_CHECK_WIDTH} minmax(50%, auto) repeat(${gridRowLength}, auto)`,
        }}
      >
        <LegendTableHeader hasAction={!!itemProps.action} legendValues={itemProps.legendValues} />
        <LegendTableBody items={items} {...itemProps} />
      </div>
    </div>
  );
}
