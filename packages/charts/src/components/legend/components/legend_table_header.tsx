/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import classNames from 'classnames';
import React from 'react';

import { LegendTableCell } from './legend_table_cell';
import { LegendTableColorCell } from './legend_table_color_cell';
import { LegendTableRow } from './legend_table_row';
import { LegendTableColumn } from './types';
import { SeriesIdentifier } from '../../../common/series_id';
import { BaseDatum, LegendValue } from '../../../specs';
import { Datum } from '../../../utils/common';
import { PropsOrChildrenWithProps } from '../types';

type LegendTableHeaderProps<
  D extends BaseDatum = Datum,
  SI extends SeriesIdentifier = SeriesIdentifier,
> = PropsOrChildrenWithProps<
  {
    columns: LegendTableColumn<D, SI>[];
    items: LegendValue<D, SI>[];
  },
  {},
  {
    className?: string;
  }
>;

/** @public */
export const LegendTableHeader = <D extends BaseDatum = Datum, SI extends SeriesIdentifier = SeriesIdentifier>({
  className,
  ...props
}: LegendTableHeaderProps<D, SI>) => {
  const classes = classNames('echLegend__tableHeader', className);
  if ('children' in props) {
    return (
      <div role="rowgroup" className={classes}>
        {props.children}
      </div>
    );
  }

  if (props.columns.every((c) => !c.header)) return null;

  return (
    <div role="rowgroup" className={classes}>
      <LegendTableRow>
        {props.columns.map(({ header, style, id, className: cn, type }, i) => {
          const key = id ?? `${type}-${i}`;
          if (type === 'color') return <LegendTableColorCell className={cn} style={style} key={key} />;
          return (
            <LegendTableCell className={cn} style={style} key={key}>
              {header ? (typeof header === 'string' ? header : header(props.items)) : undefined}
            </LegendTableCell>
          );
        })}
      </LegendTableRow>
    </div>
  );
};
