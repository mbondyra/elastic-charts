/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';

import { SharedLegendItemProps, LegendListItem } from './legend_item';
import { LegendItem } from '../../../common/legend';

/** @internal */
export const LegendTableBody: React.FC<SharedLegendItemProps & { items: LegendItem[] }> = ({ items, ...itemProps }) => {
  return (
    <div role="rowgroup" className="echLegendTable__rowgroup">
      {items.map((item) => (
        <LegendListItem key={`${item.childId}`} item={item} {...itemProps} />
      ))}
    </div>
  );
};
