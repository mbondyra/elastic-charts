/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';

import { SeriesIdentifier } from '../../../common/series_id';
import { LegendAction } from '../../../specs/settings';

/** @internal */
export const LegendActionComponent = ({
  Action,
  series,
  color,
  label,
}: {
  Action?: LegendAction;
  series: SeriesIdentifier[];
  color: string;
  label: string;
}) => {
  if (!Action) {
    return null;
  }
  return (
    <div className="echLegendTableItem__action">
      <Action series={series} color={color} label={label} />
    </div>
  );
};
