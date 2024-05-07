/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import classNames from 'classnames';
import React, { CSSProperties } from 'react';

import { useLegendContext } from './legend_provider';
import { LegendTableBody } from './legend_table_body';
import { LegendTableHeader } from './legend_table_header';
import { LegendTableColumn } from './types';
import { SeriesIdentifier } from '../../../common/series_id';
import { BaseDatum, LegendValue } from '../../../specs';
import { Datum } from '../../../utils/common';
import { PropsOrChildrenWithProps, ToggleSelectedLegendItemCallback } from '../types';

/**
 * Manually synced with `$colorStripCheckWidth` scss var in [`_legend.scss`](packages/charts/src/components/legend/_legend.scss)
 */
const COLOR_STRIP_CHECK_WIDTH = 11;

type LegendTableProps<
  D extends BaseDatum = Datum,
  SI extends SeriesIdentifier = SeriesIdentifier,
> = PropsOrChildrenWithProps<
  {
    columns: LegendTableColumn<D, SI>[];
    items: LegendValue<D, SI>[];
    pinned?: boolean;
    onSelect?: ToggleSelectedLegendItemCallback;
    selected?: LegendValue<D, SI>[];
  },
  {
    /**
     * Used to define the column widths, otherwise auto-generated
     */
    gridTemplateColumns: CSSProperties['gridTemplateColumns'];
  },
  {
    className?: string;
    maxHeight?: CSSProperties['maxHeight'];
  }
>;

/** @public */
export const LegendTable = <D extends BaseDatum = Datum, SI extends SeriesIdentifier = SeriesIdentifier>({
  className,
  ...props
}: LegendTableProps<D, SI>) => {
  const legendContext = useLegendContext<D, SI>();
  const pinned = props.pinned ?? legendContext.pinned;
  const wrapperClasses = classNames('echLegend__tableWrapper', { 'echLegend__tableWrapper--pinned': pinned });
  if ('children' in props) {
    const { gridTemplateColumns, maxHeight } = props;
    const classes = classNames('echLegend__table', className, {
      'echLegend__table--noGrid': !gridTemplateColumns,
    });
    return (
      <div className={wrapperClasses} style={{ maxHeight }}>
        <div role="table" className={classes} style={{ gridTemplateColumns }}>
          {props.children}
        </div>
      </div>
    );
  }
  const { items, onSelect, selected = [] } = { selected: legendContext.selected, ...props };
  const columns = props.columns.filter(({ hidden }) => {
    return !(typeof hidden === 'boolean' ? hidden : hidden?.(props.items) ?? false);
  });

  const gridTemplateColumns = columns
    .map(({ type, width }) => width ?? (type === 'color' ? COLOR_STRIP_CHECK_WIDTH : 'auto'))
    .map((width) => (typeof width === 'number' ? `${width}px` : width))
    .join(' ');

  return (
    <div className={wrapperClasses} style={{ maxHeight: props.maxHeight }}>
      <div role="table" className={classNames('echLegend__table', className)} style={{ gridTemplateColumns }}>
        <LegendTableHeader columns={columns} items={props.items} />
        <LegendTableBody columns={columns} items={items} pinned={pinned} onSelect={onSelect} selected={selected} />
      </div>
    </div>
  );
};
