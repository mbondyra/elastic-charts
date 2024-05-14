/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';

import { LegendItemValue } from '../../../common/legend';

/** @internal */
export const LegendValueComponent = ({ label }: LegendItemValue) => {
  return (
    <div className="echLegend__legendValue" title={`${label}`}>
      {label}
    </div>
  );
};
