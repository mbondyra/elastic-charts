/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import classNames from 'classnames';
import React, { Component, CSSProperties } from 'react';

import { LegendTableCell } from './legend_table_cell';
import { LegendTableRow } from './legend_table_row';
import { LegendValueComponent } from './legend_value';
import { nonNullable } from '../../../chart_types/xy_chart/state/utils/get_legend_values';
import { LegendItem, LegendValue } from '../../../common/legend';
import { SeriesIdentifier } from '../../../common/series_id';
import { LayoutDirection } from '../../../utils/common';
import { deepEqual } from '../../../utils/fast_deep_equal';
import { Label as ItemLabel } from '../label';
import { LegendActionComponent } from '../legend_action';
import { LegendColorPicker as LegendColorPickerComponent } from '../legend_color_picker';
import { SharedLegendItemProps } from '../types';
import { getExtra } from '../utils';

/** @internal */
export const LEGEND_HIERARCHY_MARGIN = 10;

/** @internal */
export interface LegendItemProps extends SharedLegendItemProps {
  item: LegendItem;
}

/** @internal */
export class LegendListItem extends Component<LegendItemProps> {
  static displayName = 'LegendItem';

  shouldComponentUpdate(nextProps: LegendItemProps) {
    return !deepEqual(this.props, nextProps);
  }

  onLegendItemMouseOver = () => {
    const { onMouseOver, mouseOverAction, item } = this.props;
    // call the settings listener directly if available
    if (onMouseOver) {
      onMouseOver(item.seriesIdentifiers);
    }
    mouseOverAction(item.path);
  };

  onLegendItemMouseOut = () => {
    const { onMouseOut, mouseOutAction } = this.props;
    // call the settings listener directly if available
    if (onMouseOut) {
      onMouseOut();
    }
    mouseOutAction();
  };

  /**
   * Returns click function only if toggleable or click listener is provided
   */
  onLabelToggle = (legendItemId: SeriesIdentifier[]): ((negate: boolean) => void) | undefined => {
    const { item, onClick, toggleDeselectSeriesAction, totalItems } = this.props;
    if (totalItems <= 1 || (!item.isToggleable && !onClick)) {
      return;
    }

    return (negate) => {
      if (onClick) {
        onClick(legendItemId);
      }

      if (item.isToggleable) {
        toggleDeselectSeriesAction(legendItemId, negate);
      }
    };
  };

  render() {
    const {
      extraValues,
      item,
      totalItems,
      action: Action,
      positionConfig,
      labelOptions,
      isMostlyRTL,
      flatLegend,
    } = this.props;
    const { color, isSeriesHidden, isItemHidden, seriesIdentifiers, label } = item;

    if (isItemHidden) return null;

    const itemClassNames = classNames('echLegendSingleItem', 'echLegendSingleItem--highlightable', {
      'echLegendSingleItem--hidden': isSeriesHidden,
      'echLegendSingleItem--vertical': positionConfig.direction === LayoutDirection.Vertical,
    });

    const legendValueItems = item.values
      .map((v) => {
        if (v.type === LegendValue.CurrentAndLastValue || (v && !v.type)) {
          return getExtra(extraValues, item, totalItems);
        }
        return v;
      })
      .filter(nonNullable);

    const style: CSSProperties = flatLegend
      ? {}
      : {
          [isMostlyRTL ? 'marginRight' : 'marginLeft']: LEGEND_HIERARCHY_MARGIN * (item.depth ?? 0),
        };

    return (
      <LegendTableRow
        className={itemClassNames}
        onMouseEnter={this.onLegendItemMouseOver}
        onMouseLeave={this.onLegendItemMouseOut}
        style={style}
        dir={isMostlyRTL ? 'rtl' : 'ltr'}
        data-ech-series-name={label}
      >
        <LegendTableCell className="echLegend__colorWrapper echLegendTable__colorCell">
          <LegendColorPickerComponent {...this.props} />
        </LegendTableCell>
        <LegendTableCell>
          <ItemLabel
            label={label}
            options={labelOptions}
            isToggleable={totalItems > 1 && item.isToggleable}
            onToggle={this.onLabelToggle(seriesIdentifiers)}
            isSeriesHidden={isSeriesHidden}
          />
        </LegendTableCell>

        {legendValueItems?.map((l, i) => {
          return (
            <LegendTableCell key={l?.type || i}>
              <LegendValueComponent {...l} />
            </LegendTableCell>
          );
        })}
        {Action && (
          <LegendTableCell>
            <LegendActionComponent Action={Action} series={seriesIdentifiers} color={color} label={label} />
          </LegendTableCell>
        )}
      </LegendTableRow>
    );
  }
}
