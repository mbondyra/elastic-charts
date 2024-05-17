/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import classNames from 'classnames';
import React, { CSSProperties, useRef, useState, useCallback } from 'react';

import { Color as ItemColor } from './color';
import { Label as ItemLabel } from './label';
import { LegendActionComponent } from './legend_action';
import { SharedLegendItemProps } from './types';
import { getExtra } from './utils';
import { Color } from '../../common/colors';
import { LegendItem, LegendItemExtraValues, LegendValue } from '../../common/legend';
import { SeriesIdentifier } from '../../common/series_id';
import { LayoutDirection } from '../../utils/common';

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
export const LegendListItem: React.FC<LegendItemProps> = (props) => {
  const {
    extraValues,
    item,
    legendValues,
    colorPicker,
    totalItems,
    action: Action,
    positionConfig,
    labelOptions,
    isMostlyRTL,
    flatLegend,
    onClick,
    toggleDeselectSeriesAction,
    onMouseOver,
    mouseOverAction,
    onMouseOut,
    mouseOutAction,
    setPersistedColorAction,
    clearTemporaryColorsAction,
    setTemporaryColorAction,
    colorPicker: ColorPicker,
    hiddenItems,
  } = props;
  const { color, isSeriesHidden, isItemHidden, seriesIdentifiers, label, pointStyle, depth, path, isToggleable } = item;

  const itemClassNames = classNames('echLegendItem', {
    'echLegendItem--hidden': isSeriesHidden,
    'echLegendItem--vertical': positionConfig.direction === LayoutDirection.Vertical,
  });

  // only the first for now until https://github.com/elastic/elastic-charts/issues/2096
  const legendValue = prepareLegendValue(item, legendValues, totalItems, extraValues);

  const style: CSSProperties = flatLegend
    ? {}
    : {
        [isMostlyRTL ? 'marginRight' : 'marginLeft']: LEGEND_HIERARCHY_MARGIN * (depth ?? 0),
      };

  const colorRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const shouldClearPersistedColor = useRef(false);

  const toggleIsOpen = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

  const onLegendItemMouseOver = useCallback(() => {
    // call the settings listener directly if available
    if (onMouseOver) {
      onMouseOver(seriesIdentifiers);
    }
    mouseOverAction(path);
  }, [mouseOverAction, onMouseOver, path, seriesIdentifiers]);

  const onLegendItemMouseOut = useCallback(() => {
    // call the settings listener directly if available
    if (onMouseOut) {
      onMouseOut();
    }
    mouseOutAction();
  }, [onMouseOut, mouseOutAction]);

  const onLabelToggle = useCallback(
    (legendItemId: SeriesIdentifier[]) => (negate: boolean) => {
      if (totalItems <= 1 || (!isToggleable && !onClick)) {
        return;
      }

      if (onClick) {
        onClick(legendItemId);
      }

      if (isToggleable) {
        toggleDeselectSeriesAction(legendItemId, negate);
      }
    },
    [onClick, toggleDeselectSeriesAction, isToggleable, totalItems],
  );

  const renderColorPicker = useCallback(() => {
    if (!ColorPicker || !isOpen || !colorRef.current) {
      return null;
    }

    const seriesKeys = seriesIdentifiers.map(({ key }) => key);

    return (
      <ColorPicker
        anchor={colorRef.current}
        color={color}
        onClose={() => {
          setPersistedColorAction(seriesKeys, shouldClearPersistedColor.current ? null : color);
          clearTemporaryColorsAction();
          requestAnimationFrame(() => colorRef?.current?.focus());
          toggleIsOpen();
        }}
        onChange={(c: Color | null) => {
          shouldClearPersistedColor.current = c === null;
          setTemporaryColorAction(seriesKeys, c);
        }}
        seriesIdentifiers={seriesIdentifiers}
      />
    );
  }, [
    ColorPicker,
    toggleIsOpen,
    color,
    seriesIdentifiers,
    setPersistedColorAction,
    clearTemporaryColorsAction,
    setTemporaryColorAction,
    isOpen,
  ]);

  if (isItemHidden) return null;

  return (
    <>
      <li
        className={itemClassNames}
        onMouseEnter={onLegendItemMouseOver}
        onMouseLeave={onLegendItemMouseOut}
        style={style}
        dir={isMostlyRTL ? 'rtl' : 'ltr'}
        data-ech-series-name={label}
      >
        <div className="background" />
        <div className="echLegend__colorWrapper">
          <ItemColor
            ref={colorRef}
            color={color}
            seriesName={label}
            isSeriesHidden={isSeriesHidden}
            hasColorPicker={Boolean(colorPicker)}
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              toggleIsOpen();
            }}
            pointStyle={pointStyle}
          ></ItemColor>
        </div>
        <ItemLabel
          label={label}
          options={labelOptions}
          isToggleable={totalItems > 1 && item.isToggleable}
          onToggle={onLabelToggle(seriesIdentifiers)}
          isSeriesHidden={isSeriesHidden}
          totalSeriesCount={totalItems}
          hiddenSeriesCount={hiddenItems}
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
};
