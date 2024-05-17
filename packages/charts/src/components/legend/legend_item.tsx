/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import classNames from 'classnames';
import React, { Component, CSSProperties } from 'react';

import { Label as ItemLabel } from './label';
import { LegendActionComponent } from './legend_action';
import { SharedLegendItemProps } from './types';
import { useLegendColorPicker } from './use_legend_color_picker';
import { getExtra } from './utils';
import { LegendItem, LegendItemExtraValues, LegendValue } from '../../common/legend';
import { SeriesIdentifier } from '../../common/series_id';
import { LayoutDirection } from '../../utils/common';
import { deepEqual } from '../../utils/fast_deep_equal';

/** @internal */
export const LEGEND_HIERARCHY_MARGIN = 10;

/** @internal */
export interface LegendItemProps extends SharedLegendItemProps {
  item: LegendItem;
}

const prepareLegendValue = (
  item: LegendItem,
  legendValues: LegendValue[],
  totalItems: number,
  extraValues: Map<string, LegendItemExtraValues>,
) => {
  if (legendValues.length === 0) {
    return undefined;
  }
  if (legendValues[0] === LegendValue.CurrentAndLastValue) {
    return getExtra(extraValues, item, totalItems);
  }
  return item.values[0];
};

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
   * Returns click function only if toggleable or click listern is provided
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
      legendValues,
      totalItems,
      action: Action,
      positionConfig,
      labelOptions,
      isMostlyRTL,
      flatLegend,
    } = this.props;
    const { color, isSeriesHidden, isItemHidden, seriesIdentifiers, label } = item;

    if (isItemHidden) return null;

    const itemClassNames = classNames('echLegendItem', {
      'echLegendItem--hidden': isSeriesHidden,
      'echLegendItem--vertical': positionConfig.direction === LayoutDirection.Vertical,
    });

    // only the first for now until https://github.com/elastic/elastic-charts/issues/2096
    const legendValue = prepareLegendValue(item, legendValues, totalItems, extraValues);

    const style: CSSProperties = flatLegend
      ? {}
      : {
          [isMostlyRTL ? 'marginRight' : 'marginLeft']: LEGEND_HIERARCHY_MARGIN * (item.depth ?? 0),
        };

    const { ColorPickerTrigger, renderColorPicker } = useLegendColorPicker(this.props);

    return (
      <>
        <li
          className={itemClassNames}
          onMouseEnter={this.onLegendItemMouseOver}
          onMouseLeave={this.onLegendItemMouseOut}
          style={style}
          dir={isMostlyRTL ? 'rtl' : 'ltr'}
          data-ech-series-name={label}
        >
          <div className="background" />
          <div className="echLegend__colorWrapper">
            <ColorPickerTrigger />
          </div>
          <ItemLabel
            label={label}
            options={labelOptions}
            isToggleable={totalItems > 1 && item.isToggleable}
            onToggle={this.onLabelToggle(seriesIdentifiers)}
            isSeriesHidden={isSeriesHidden}
          />
          {legendValue && legendValue.label !== '' && !isSeriesHidden && (
            <div className="echLegendItem__legendValue" title={`${legendValue.label}`}>
              {legendValue.label}
            </div>
          )}
          {Action && <LegendActionComponent Action={Action} series={seriesIdentifiers} color={color} label={label} />}
        </li>
        {renderColorPicker()}
      </>
    );
  }
}
