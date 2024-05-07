/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { EuiFlexGroup } from '@elastic/eui';
import classNames from 'classnames';
import React, { Component, CSSProperties } from 'react';

import { Label as ItemLabel } from './label';
import { LegendColorPicker as LegendColorPickerComponent } from './legend_color_picker';
import { getExtra } from './utils';
import { nonNullable } from '../../chart_types/xy_chart/state/utils/get_legend_values';
import { LegendItem, LegendItemExtraValues, LegendValue } from '../../common/legend';
import { SeriesIdentifier } from '../../common/series_id';
import {
  LegendItemListener,
  BasicListener,
  LegendAction,
  LegendPositionConfig,
  LegendColorPicker,
} from '../../specs/settings';
import {
  clearTemporaryColors as clearTemporaryColorsAction,
  setTemporaryColor as setTemporaryColorAction,
  setPersistedColor as setPersistedColorAction,
} from '../../state/actions/colors';
import {
  onLegendItemOutAction,
  onLegendItemOverAction,
  onToggleDeselectSeriesAction,
} from '../../state/actions/legend';
import { LayoutDirection } from '../../utils/common';
import { deepEqual } from '../../utils/fast_deep_equal';
import { LegendLabelOptions } from '../../utils/themes/theme';

/** @internal */
export const LEGEND_HIERARCHY_MARGIN = 10;

/** @internal */
export interface LegendItemProps {
  item: LegendItem;
  flatLegend: boolean;
  totalItems: number;
  positionConfig: LegendPositionConfig;
  extraValues: Map<string, LegendItemExtraValues>;
  legendValues: Array<LegendValue>;
  isMostlyRTL: boolean;
  labelOptions: LegendLabelOptions;
  colorPicker?: LegendColorPicker;
  action?: LegendAction;
  onClick?: LegendItemListener;
  onMouseOut?: BasicListener;
  onMouseOver?: LegendItemListener;
  mouseOutAction: typeof onLegendItemOutAction;
  mouseOverAction: typeof onLegendItemOverAction;
  clearTemporaryColorsAction: typeof clearTemporaryColorsAction;
  setTemporaryColorAction: typeof setTemporaryColorAction;
  setPersistedColorAction: typeof setPersistedColorAction;
  toggleDeselectSeriesAction: typeof onToggleDeselectSeriesAction;
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

    const legendValueItems = legendValues
      .map((v, i) => {
        return v === LegendValue.CurrentAndLastValue ? getExtra(extraValues, item, totalItems) : item.values[i];
      })
      .filter(nonNullable);

    const style: CSSProperties = flatLegend
      ? {}
      : {
          [isMostlyRTL ? 'marginRight' : 'marginLeft']: LEGEND_HIERARCHY_MARGIN * (item.depth ?? 0),
        };

    console.log(legendValueItems, legendValues);
    return (
      <div
        role="row"
        className={itemClassNames}
        onMouseEnter={this.onLegendItemMouseOver}
        onMouseLeave={this.onLegendItemMouseOut}
        // style={style}
        dir={isMostlyRTL ? 'rtl' : 'ltr'}
        data-ech-series-name={label}
      >
        <LegendTableCell>
          <div className="newClassname">
            <LegendColorPickerComponent {...this.props} />
            <ItemLabel
              label={label}
              options={labelOptions}
              isToggleable={totalItems > 1 && item.isToggleable}
              onToggle={this.onLabelToggle(seriesIdentifiers)}
              isSeriesHidden={isSeriesHidden}
            />
          </div>
        </LegendTableCell>

        {legendValueItems?.map((l) => (
          <LegendTableCell>
            <LegendValueComponent key={l.type} {...l} />
          </LegendTableCell>
        ))}
        <ActionComponent Action={Action} series={seriesIdentifiers} color={color} label={label} />

        {/* <div className="echLegendBackground" /> */}
      </div>
    );
  }
}

const LegendTableCell = ({ children, className = '' }: { children: React.ReactNode; className: string }) => {
  return (
    <div role="gridcell" className={className}>
      {children}
    </div>
  );
};

const LegendValueComponent = ({ label }: LegendItemValue) => {
  return (
    <div className="echLegendItem__legendValue" title={`${label}`}>
      {label}
    </div>
  );
};

const ActionComponent = ({
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
    <LegendTableCell>
      <div className="echLegendItem__action">
        <Action series={series} color={color} label={label} />
      </div>
    </LegendTableCell>
  );
};
