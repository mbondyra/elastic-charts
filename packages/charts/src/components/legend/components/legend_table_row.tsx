/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

type LegendTableRowProps = PropsWithChildren<{
  id?: string;
  className?: string;
  isHighlighted?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}>;

/** @public */
export const LegendTableRow = ({
  id,
  isHighlighted = false,
  isSelected = false,
  children,
  onSelect,
  className,
}: LegendTableRowProps) => {
  const classes = classNames('echLegend__tableRow', className, {
    'echLegend__tableRow--highlighted': isHighlighted,
    'echLegend__tableRow--selected': isSelected,
    'echLegend__tableRow--selectable': isSelectable,
  });

  return (
    // cannot focus row using display: contents to structure grid
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div role="row" id={id} className={classes}>
      {children}
    </div>
  );
};
