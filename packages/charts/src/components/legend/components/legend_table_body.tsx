/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import classNames from 'classnames';
import React, { ReactNode, useRef } from 'react';

import { LegendTableCell } from './legend_table_cell';
import { LegendTableColorCell } from './legend_table_color_cell';
import { LegendTableRow } from './legend_table_row';
import { LegendCellStyle, LegendTableColumn } from './types';
import { SeriesIdentifier } from '../../../common/series_id';
import { BaseDatum, LegendValue } from '../../../specs';
import { Datum } from '../../../utils/common';
import { PropsOrChildrenWithProps, ToggleSelectedLegendItemCallback } from '../types';

type LegendTableBodyProps<
  D extends BaseDatum = Datum,
  SI extends SeriesIdentifier = SeriesIdentifier,
> = PropsOrChildrenWithProps<
  {
    items: LegendValue<D, SI>[];
    columns: LegendTableColumn<D, SI>[];
    pinned?: boolean;
    onSelect?: ToggleSelectedLegendItemCallback;
    selected: LegendValue<D, SI>[];
  },
  {},
  {
    className?: string;
  }
>;

/** @public */
export const LegendTableBody = <D extends BaseDatum = Datum, SI extends SeriesIdentifier = SeriesIdentifier>({
  className,
  ...props
}: LegendTableBodyProps<D, SI>) => {
  const tableBodyRef = useRef<HTMLTableSectionElement | null>(null);

  if ('children' in props) {
    const classes = classNames('echLegend__tableBody', className);
    return (
      <div role="rowgroup" className={classes}>
        {props.children}
      </div>
    );
  }

  const { items, pinned, selected, onSelect, columns } = props;
  const classes = classNames('echLegend__tableBody');
  // TODO: find a better way determine this from the data
  const allHighlighted = items.every((i) => i.isHighlighted);

  return (
    <div role="rowgroup" className={classes} ref={tableBodyRef}>
      {items.map((item) => {
        const { isHighlighted, isVisible, displayOnly } = item;
        if (!isVisible) return null;
        return (
          <LegendTableRow
            key={`${item.seriesIdentifier.key}-${item.label}-${item.value}`}
            isHighlighted={!pinned && !allHighlighted && isHighlighted}
            isSelected={pinned && selected.includes(item)}
            onSelect={displayOnly || !onSelect ? undefined : () => onSelect(item)}
          >
            {columns.map((column, j) => {
              return renderCellContent(item, column, column.id ?? `${column.type}-${j}`);
            })}
          </LegendTableRow>
        );
      })}
    </div>
  );
};

function getCellStyles<D extends BaseDatum = Datum, SI extends SeriesIdentifier = SeriesIdentifier>({
  style,
  type,
}: LegendTableColumn<D, SI>): LegendCellStyle {
  const textAlign: LegendCellStyle['textAlign'] = type === 'number' ? 'right' : type === 'text' ? 'left' : undefined;

  return {
    textAlign,
    ...style,
  };
}

function renderCellContent<D extends BaseDatum = Datum, SI extends SeriesIdentifier = SeriesIdentifier>(
  item: LegendValue<D, SI>,
  column: LegendTableColumn<D, SI>,
  key: string,
): ReactNode {
  if (column.type === 'color') {
    return <LegendTableColorCell displayOnly={item.displayOnly} color={item.color} key={key} />;
  }

  return (
    <LegendTableCell truncate={column.truncate} style={getCellStyles(column)} key={key}>
      {column.cell(item)}
    </LegendTableCell>
  );
}
